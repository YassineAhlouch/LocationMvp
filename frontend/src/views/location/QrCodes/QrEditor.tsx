import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Skeleton from '@/components/ui/Skeleton'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { FormItem } from '@/components/ui/Form'
import useTranslation from '@/utils/hooks/useTranslation'
import useResponsive from '@/utils/hooks/useResponsive'
import usePermissions from '@/utils/hooks/usePermissions'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'
import {
    apiCreateQrCode,
    apiGetQrCode,
    apiUpdateQrCode,
} from '@/services/LocationService'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import CarsPicker from './components/CarsPicker'
import QrPanel from './components/QrPanel'
import useFleetCars from './hooks/useFleetCars'
import { buildQrLandingUrl, slugifyName } from './utils'

/** A saved poster may advertise at most this many vehicles (public API cap). */
const MAX_QR_CARS = 24

/**
 * Create/edit page for one printed QR poster. The name typed here becomes
 * the slug the QR encodes (/r/{slug}), so renaming a poster effectively
 * publishes a new link; the advertised fleet can change freely without ever
 * touching the printed link.
 */
const QrEditor = () => {
    const { t } = useTranslation()
    const { can } = usePermissions()
    const navigate = useNavigate()
    const { larger } = useResponsive()

    const params = useParams()
    const qrId = params.id
    const isEdit = Boolean(qrId)

    const { cars, isLoading: fleetLoading } = useFleetCars()

    const { data, isLoading, mutate } = useSWR(
        isEdit && qrId ? ['qr-codes', qrId] : null,
        () => apiGetQrCode(Number(qrId)),
        { revalidateOnFocus: false },
    )

    const [name, setName] = useState('')
    const [nameTouched, setNameTouched] = useState(false)
    const [selected, setSelected] = useState<number[]>([])
    const [hydrated, setHydrated] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)

    // Re-hydrate per fetched poster (fresh navigation after creation).
    useEffect(() => {
        if (data && hydrated !== data.id) {
            setName(data.name)
            setSelected(data.cars.map((car) => car.id))
            setHydrated(data.id)
        }
    }, [data, hydrated])

    const handleToggle = useCallback((carId: number) => {
        setSelected((current) =>
            current.includes(carId)
                ? current.filter((id) => id !== carId)
                : [...current, carId],
        )
    }, [])

    const nameInvalid = nameTouched && name.trim().length === 0

    /** Read-only in edit mode — the stored slug is the printed link. */
    const slug = isEdit && data ? data.slug : slugifyName(name)

    const qrUrl = slug.length > 0 ? buildQrLandingUrl(slug) : null

    const valid =
        name.trim().length > 0 &&
        selected.length > 0 &&
        selected.length <= MAX_QR_CARS

    const canWrite = isEdit ? can('fleet.update') : can('fleet.create')

    const goToList = useCallback(
        () => navigate(`${APPS_PREFIX_PATH}/qr`),
        [navigate],
    )

    const handleSave = async () => {
        if (!valid || saving || !canWrite) {
            return
        }

        setSaving(true)
        try {
            if (isEdit && data) {
                await apiUpdateQrCode(data.id, {
                    name: name.trim(),
                    car_ids: selected,
                })
                toast.push(
                    <Notification
                        type="success"
                        title={t('qrCodes.editor.toast.updated', 'QR code updated')}
                    />,
                )
                mutate()
            } else {
                const created = await apiCreateQrCode({
                    name: name.trim(),
                    car_ids: selected,
                })
                toast.push(
                    <Notification
                        type="success"
                        title={t('qrCodes.editor.toast.created', 'QR code created')}
                    />,
                )
                navigate(`${APPS_PREFIX_PATH}/qr/${created.id}/modifier`, {
                    replace: true,
                })
            }
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t('qrCodes.editor.toast.error', 'Something went wrong')}
                />,
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            {isEdit
                                ? t('qrCodes.editor.title.edit', 'Edit QR code')
                                : t('qrCodes.editor.title.create', 'Create a QR code')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t(
                                'qrCodes.editor.subtitle',
                                'The name becomes the public /r/{slug} link — the slug is the poster identity',
                            )}
                        </p>
                    </div>
                    {isEdit && isLoading ? (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                            <Card className="p-4">
                                <Skeleton className="!h-10 rounded-lg" />
                                <Skeleton className="mt-4 !h-64 rounded-xl" />
                            </Card>
                            <Card className="p-4">
                                <Skeleton className="!h-64 rounded-lg" />
                            </Card>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                            <Card className="p-4">
                                {larger.xl ? null : (
                                    <Card className="mb-4 p-4">
                                        <QrPanel
                                            value={qrUrl}
                                            title={t('qrCodes.qr.title', 'QR code')}
                                            subtitle={t(
                                                'qrCodes.qr.carsCount',
                                                '{{count}} vehicle(s)',
                                                { count: selected.length },
                                            )}
                                            preview={!isEdit}
                                            fileName={slug || 'qr-poster'}
                                            emptyText={t(
                                                'qrCodes.editor.empty',
                                                'Enter a name to generate the landing link',
                                            )}
                                        />
                                    </Card>
                                )}
                                <FormItem
                                    label={t('qrCodes.editor.name', 'Poster name')}
                                    invalid={nameInvalid}
                                    errorMessage={t(
                                        'qrCodes.editor.nameRequired',
                                        'The name is required',
                                    )}
                                >
                                    <Input
                                        value={name}
                                        placeholder={t(
                                            'qrCodes.editor.namePlaceholder',
                                            'e.g. Showroom — Casablanca',
                                        )}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                            setNameTouched(true)
                                        }}
                                    />
                                </FormItem>
                                {slug.length > 0 && (
                                    <p className="break-all text-xs text-gray-500 dark:text-gray-400">
                                        {t(
                                            'qrCodes.editor.slugHint',
                                            'Landing link encoded in the QR: /r/{slug}',
                                            { slug },
                                        )}
                                    </p>
                                )}
                                <div className="mt-4">
                                    <CarsPicker
                                        cars={cars}
                                        selected={selected}
                                        isLoading={fleetLoading}
                                        max={MAX_QR_CARS}
                                        onToggle={handleToggle}
                                    />
                                </div>
                                {canWrite && (
                                    <div className="mt-5 flex items-center justify-end gap-2">
                                        <Button
                                            variant="subtle"
                                            size="sm"
                                            onClick={goToList}
                                        >
                                            {t('qrCodes.editor.cancel', 'Cancel')}
                                        </Button>
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            loading={saving}
                                            disabled={!valid}
                                            onClick={handleSave}
                                        >
                                            {isEdit
                                                ? t('qrCodes.editor.save', 'Save changes')
                                                : t('qrCodes.editor.create', 'Create QR code')}
                                        </Button>
                                    </div>
                                )}
                            </Card>
                            {larger.xl && (
                                <Card className="p-4">
                                    <QrPanel
                                        value={qrUrl}
                                        title={t('qrCodes.qr.title', 'QR code')}
                                        subtitle={t(
                                            'qrCodes.qr.carsCount',
                                            '{{count}} vehicle(s)',
                                            { count: selected.length },
                                        )}
                                        preview={!isEdit}
                                        fileName={slug || 'qr-poster'}
                                        emptyText={t(
                                            'qrCodes.editor.empty',
                                            'Enter a name to generate the landing link',
                                        )}
                                    />
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </Container>
    )
}

export default QrEditor
