import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import type { ChangeEvent } from 'react'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import classNames from '@/components/ui/utils/classNames'
import type {
    InspectionArea,
    InspectionCondition,
    ReservationInspectionType,
} from '@/@types/location'

/**
 * Optional car walk-around captured with a reservation transition: a diagram
 * to view the car from all sides, a condition + notes per area and photos
 * attached per area. Purely client-side until the dialog submits; appendTo()
 * serialises everything into the multipart activate/complete payload.
 */

export type CarInspectionHandle = {
    /** Append the captured inspection to a multipart payload (no-op when empty). */
    appendTo: (formData: FormData) => void
    /** Clear the checklist, notes and photos. */
    reset: () => void
}

type CarInspectionProps = {
    type: ReservationInspectionType
}

type AreaState = {
    condition: InspectionCondition | ''
    notes: string
}

type PhotoDraft = {
    id: string
    area: InspectionArea
    file: File
    previewUrl: string
}

const CONDITION_OPTIONS: { value: InspectionCondition; label: string }[] = [
    { value: 'ok', label: 'OK' },
    { value: 'minor', label: 'Minor wear' },
    { value: 'damage', label: 'Damage' },
]

const AREA_LABELS: Record<InspectionArea, string> = {
    front: 'Front',
    rear: 'Rear',
    left: 'Left side',
    right: 'Right side',
    interior: 'Interior',
    dashboard: 'Dashboard',
}

/** Layout mirrors the car seen from above: sides flank the interior. */
const AREA_LAYOUT: { area: InspectionArea; className: string }[] = [
    { area: 'front', className: 'col-span-2 sm:col-span-3' },
    { area: 'left', className: '' },
    { area: 'interior', className: '' },
    { area: 'right', className: '' },
    { area: 'rear', className: 'col-span-2 sm:col-span-3' },
    { area: 'dashboard', className: 'col-span-2 sm:col-span-3' },
]

const BADGE_TONE: Record<InspectionCondition, string> = {
    ok: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    minor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    damage: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}

const emptyAreasFactory = (): Record<InspectionArea, AreaState> => ({
    front: { condition: '', notes: '' },
    rear: { condition: '', notes: '' },
    left: { condition: '', notes: '' },
    right: { condition: '', notes: '' },
    interior: { condition: '', notes: '' },
    dashboard: { condition: '', notes: '' },
})

const ConditionBadge = ({
    condition,
}: {
    condition: InspectionCondition | ''
}) => {
    if (!condition) {
        return <span className="text-[11px] text-gray-400">Not checked</span>
    }

    return (
        <span
            className={classNames(
                'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                BADGE_TONE[condition],
            )}
        >
            {CONDITION_OPTIONS.find((option) => option.value === condition)
                ?.label ?? condition}
        </span>
    )
}

const CarInspection = forwardRef<CarInspectionHandle, CarInspectionProps>(
    ({ type }, ref) => {
        const [areas, setAreas] = useState(emptyAreasFactory)
        const [conditionNotes, setConditionNotes] = useState('')
        const [photos, setPhotos] = useState<PhotoDraft[]>([])
        const [activeArea, setActiveArea] = useState<InspectionArea>('front')
        const fileInputRef = useRef<HTMLInputElement>(null)
        const pendingAreaRef = useRef<InspectionArea>('front')
        const photosRef = useRef<PhotoDraft[]>([])

        photosRef.current = photos

        // Object URLs are only valid for the page lifetime — release them.
        useEffect(
            () => () => {
                photosRef.current.forEach((photo) =>
                    URL.revokeObjectURL(photo.previewUrl),
                )
            },
            [],
        )

        useImperativeHandle(ref, () => ({
            appendTo: (formData: FormData) => {
                const filledAreas = (
                    Object.keys(areas) as InspectionArea[]
                ).filter((area) => areas[area].condition !== '')

                filledAreas.forEach((area) => {
                    const state = areas[area]
                    formData.append(
                        `inspection[areas][${area}][condition]`,
                        state.condition,
                    )
                    const notes = state.notes.trim()
                    if (notes) {
                        formData.append(
                            `inspection[areas][${area}][notes]`,
                            notes,
                        )
                    }
                })

                const summary = conditionNotes.trim()
                if (summary) {
                    formData.append('inspection[condition_notes]', summary)
                }

                photos.forEach((photo, index) => {
                    formData.append(
                        `inspection[photos][${index}][area]`,
                        photo.area,
                    )
                    formData.append(
                        `inspection[photos][${index}][file]`,
                        photo.file,
                    )
                })
            },
            reset: () => {
                setAreas(emptyAreasFactory())
                setConditionNotes('')
                setPhotos((current) => {
                    current.forEach((photo) =>
                        URL.revokeObjectURL(photo.previewUrl),
                    )

                    return []
                })
                setActiveArea('front')
            },
        }))

        const setArea = (area: InspectionArea, patch: Partial<AreaState>) => {
            setAreas((current) => ({
                ...current,
                [area]: { ...current[area], ...patch },
            }))
        }

        const requestPhoto = (area: InspectionArea) => {
            pendingAreaRef.current = area
            fileInputRef.current?.click()
        }

        const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
            const list = event.target.files
            if (list) {
                const area = pendingAreaRef.current
                const drafts: PhotoDraft[] = Array.from(list).map((file) => ({
                    id: `${file.name}-${file.lastModified}-${Math.random()
                        .toString(36)
                        .slice(2, 8)}`,
                    area,
                    file,
                    previewUrl: URL.createObjectURL(file),
                }))
                setPhotos((current) => [...current, ...drafts])
            }
            event.target.value = ''
        }

        const removePhoto = (id: string) => {
            setPhotos((current) => {
                current
                    .filter((photo) => photo.id === id)
                    .forEach((photo) => URL.revokeObjectURL(photo.previewUrl))

                return current.filter((photo) => photo.id !== id)
            })
        }

        return (
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold dark:text-gray-100">
                            {type === 'pickup'
                                ? 'Handover inspection'
                                : 'Return inspection'}
                        </p>
                        <p className="text-xs text-gray-400">
                            Optional — view the car from all sides and attach
                            photos.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {AREA_LAYOUT.map(({ area, className }) => {
                        const state = areas[area]
                        return (
                            <button
                                key={area}
                                type="button"
                                onClick={() => setActiveArea(area)}
                                className={classNames(
                                    'flex flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white p-3 text-center transition dark:bg-gray-800',
                                    state.condition === ''
                                        ? 'border-gray-200 dark:border-gray-700'
                                        : conditionBorder(state.condition),
                                    activeArea === area &&
                                        'ring-2 ring-primary-500/40',
                                    className,
                                )}
                                aria-pressed={activeArea === area}
                            >
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    {AREA_LABELS[area]}
                                </span>
                                <ConditionBadge
                                    condition={areas[area].condition}
                                />
                                {photos.some(
                                    (photo) => photo.area === area,
                                ) && (
                                    <span className="text-[11px] text-gray-400">
                                        {photoCount(photos, area)}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                <div className="mt-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold dark:text-gray-100">
                            {AREA_LABELS[activeArea]}
                        </p>
                        <Select
                            size="sm"
                            className="w-[150px]"
                            isSearchable={false}
                            placeholder="Condition"
                            options={CONDITION_OPTIONS}
                            value={
                                areas[activeArea].condition
                                    ? {
                                          value: areas[activeArea].condition,
                                          label:
                                              CONDITION_OPTIONS.find(
                                                  (option) =>
                                                      option.value ===
                                                      areas[activeArea]
                                                          .condition,
                                              )?.label ?? '',
                                      }
                                    : null
                            }
                            onChange={(option) =>
                                setArea(activeArea, {
                                    condition: (option?.value ?? '') as
                                        | InspectionCondition
                                        | '',
                                })
                            }
                        />
                    </div>

                    <Input
                        size="sm"
                        placeholder="Notes for this side (optional)"
                        value={areas[activeArea].notes}
                        onChange={(e) =>
                            setArea(activeArea, { notes: e.target.value })
                        }
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                        {photos
                            .filter((photo) => photo.area === activeArea)
                            .map((photo) => (
                                <div
                                    key={photo.id}
                                    className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                                >
                                    <img
                                        src={photo.previewUrl}
                                        alt={AREA_LABELS[activeArea]}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(photo.id)}
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
                                        aria-label="Remove photo"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        <button
                            type="button"
                            onClick={() => requestPhoto(activeArea)}
                            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-[11px] text-gray-400 transition hover:border-primary-400 hover:text-primary-500 dark:border-gray-600"
                        >
                            <span className="text-lg leading-none">+</span>
                            Add photo
                        </button>
                    </div>
                </div>

                <div className="mt-3">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Overall condition notes
                    </label>
                    <Input
                        textArea
                        rows={2}
                        placeholder="Optional summary of the car's condition"
                        value={conditionNotes}
                        onChange={(e) => setConditionNotes(e.target.value)}
                    />
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFiles}
                />
            </div>
        )
    },
)

CarInspection.displayName = 'CarInspection'

/** Kept out of the JSX so the border colour reads from the condition table. */
const conditionBorder = (condition: InspectionCondition): string =>
    condition === 'ok'
        ? 'border-emerald-300 dark:border-emerald-700'
        : condition === 'minor'
          ? 'border-amber-300 dark:border-amber-700'
          : 'border-rose-300 dark:border-rose-700'

/** "1 photo" / "2 photos" caption under a diagram tile. */
const photoCount = (photos: PhotoDraft[], area: InspectionArea): string => {
    const count = photos.filter((photo) => photo.area === area).length

    return `${count} photo${count === 1 ? '' : 's'}`
}

export default CarInspection
