import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import Input from '@/components/ui/Input'
import Tag from '@/components/ui/Tag'
import Spinner from '@/components/ui/Spinner'
import Upload from '@/components/ui/Upload'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LiCamera, LiStar, LiTrash } from '@/icons'
import {
    apiCreateCar,
    apiUpdateCar,
    apiUploadCarImage,
    apiGetBrands,
    apiGetModels,
    apiGetCategories,
} from '@/services/LocationService'
import type {
    Car,
    CarPayload,
    CarStatus,
    TransmissionType,
    FuelType,
} from '@/@types/location'
import {
    carStatusOptions,
    carStatusTone,
    tagToneClass,
    transmissionOptions,
    fuelOptions,
} from '../shared'

/** Renders a car status as a coloured badge, used both in the select field
 * and in its option list. */
const CarStatusBadge = ({ status }: { status: CarStatus }) => (
    <Tag className={`capitalize ${tagToneClass[carStatusTone[status]]}`}>
        {carStatusOptions.find((option) => option.value === status)?.label ??
            status}
    </Tag>
)

type CarFormValues = {
    brand_id?: number
    model_id?: number
    category_id?: number
    registration_number: string
    vin?: string
    year?: string
    color?: string
    seats_count?: string
    doors_count?: string
    transmission_type?: TransmissionType
    fuel_type?: FuelType
    daily_price: string
    purchase_price?: string
    initial_mileage?: string
    current_mileage?: string
    current_fuel_level?: string
    insurance_company?: string
    insurance_policy_number?: string
    insurance_expiry_date?: string
    technical_inspection_expiry?: string
    next_service_mileage?: string
    last_maintenance_at?: string
    status?: CarStatus
    notes?: string
    is_active: boolean
}

/** Local gallery item; uploading placeholders exist until the file lands. */
type CarImageDraft = {
    url: string
    is_primary: boolean
    sort_order: number
    uploading?: boolean
}

const carSchema = z.object({
    brand_id: z.number({ message: 'Brand is required' }),
    model_id: z.number({ message: 'Model is required' }),
    category_id: z.number({ message: 'Category is required' }),
    registration_number: z.string().min(1, 'Registration number is required'),
    daily_price: z.string().min(1, 'Daily price is required'),
    is_active: z.boolean(),
    // Optional fields are validated in the payload builder instead.
    vin: z.string().optional(),
    year: z.string().optional(),
    color: z.string().optional(),
    seats_count: z.string().optional(),
    doors_count: z.string().optional(),
    transmission_type: z.string().optional(),
    fuel_type: z.string().optional(),
    purchase_price: z.string().optional(),
    initial_mileage: z.string().optional(),
    current_mileage: z.string().optional(),
    current_fuel_level: z.string().optional(),
    insurance_company: z.string().optional(),
    insurance_policy_number: z.string().optional(),
    insurance_expiry_date: z.string().optional(),
    technical_inspection_expiry: z.string().optional(),
    next_service_mileage: z.string().optional(),
    last_maintenance_at: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
})

const toNumberOrNull = (value?: string) => {
    if (value === undefined || value === null || value === '') {
        return null
    }
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
}

const toDateInput = (value?: string | null) => (value ? value.slice(0, 10) : '')

const defaultFormValues = (car?: Car | null): CarFormValues => ({
    brand_id: car?.brand?.id,
    model_id: car?.model?.id,
    category_id: car?.category?.id,
    registration_number: car?.registration_number ?? '',
    vin: car?.vin ?? '',
    year: car?.year ? String(car.year) : '',
    color: car?.color ?? '',
    seats_count: car?.seats_count ? String(car.seats_count) : '',
    doors_count: car?.doors_count ? String(car.doors_count) : '',
    transmission_type: car?.transmission_type ?? undefined,
    fuel_type: car?.fuel_type ?? undefined,
    daily_price: car?.daily_price ? String(car.daily_price) : '',
    purchase_price: car?.purchase_price ? String(car.purchase_price) : '',
    initial_mileage: car?.initial_mileage ? String(car.initial_mileage) : '',
    current_mileage: car?.current_mileage ? String(car.current_mileage) : '',
    current_fuel_level: car?.current_fuel_level
        ? String(car.current_fuel_level)
        : '',
    insurance_company: car?.insurance_company ?? '',
    insurance_policy_number: car?.insurance_policy_number ?? '',
    insurance_expiry_date: toDateInput(car?.insurance_expiry_date),
    technical_inspection_expiry: toDateInput(car?.technical_inspection_expiry),
    next_service_mileage: car?.next_service_mileage
        ? String(car.next_service_mileage)
        : '',
    last_maintenance_at: toDateInput(car?.last_maintenance_at),
    status: car?.status ?? 'available',
    notes: car?.notes ?? '',
    is_active: car?.is_active ?? true,
})

const buildPayload = (
    values: CarFormValues,
    images: CarImageDraft[],
): CarPayload => ({
    brand_id: values.brand_id as number,
    model_id: values.model_id as number,
    category_id: values.category_id as number,
    registration_number: values.registration_number.trim(),
    vin: values.vin?.trim() || null,
    year: toNumberOrNull(values.year),
    color: values.color?.trim() || null,
    seats_count: toNumberOrNull(values.seats_count),
    doors_count: toNumberOrNull(values.doors_count),
    transmission_type: (values.transmission_type as TransmissionType) || null,
    fuel_type: (values.fuel_type as FuelType) || null,
    daily_price: Number(values.daily_price),
    purchase_price: toNumberOrNull(values.purchase_price),
    initial_mileage: toNumberOrNull(values.initial_mileage),
    current_mileage: toNumberOrNull(values.current_mileage),
    current_fuel_level: toNumberOrNull(values.current_fuel_level),
    insurance_company: values.insurance_company?.trim() || null,
    insurance_policy_number: values.insurance_policy_number?.trim() || null,
    insurance_expiry_date: values.insurance_expiry_date || null,
    technical_inspection_expiry: values.technical_inspection_expiry || null,
    next_service_mileage: toNumberOrNull(values.next_service_mileage),
    last_maintenance_at: values.last_maintenance_at || null,
    status: (values.status as CarPayload['status']) || 'available',
    is_active: values.is_active,
    notes: values.notes?.trim() || null,
    images: images
        .filter((img) => !img.uploading)
        .map((img) => ({
            image: img.url,
            is_primary: img.is_primary,
            sort_order: img.sort_order,
        })),
})

type CarFormProps = {
    car: Car | null
    /** Used by dialogs to (re)fetch catalog data and reset on each open. */
    isOpen?: boolean
    onCancel: () => void
    onSaved: () => void
}

const MAX_IMAGES = 10
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const CarForm = ({ car, isOpen = true, onCancel, onSaved }: CarFormProps) => {
    const [brands, setBrands] = useState<{ value: number; label: string }[]>([])
    const [models, setModels] = useState<{ value: number; label: string }[]>([])
    const [categories, setCategories] = useState<
        { value: number; label: string }[]
    >([])
    const [submitting, setSubmitting] = useState(false)
    const [images, setImages] = useState<CarImageDraft[]>([])
    // Upload's onChange only forwards the first picked file, so stash the
    // whole selection during beforeUpload and flush it in the handler.
    const pendingFiles = useRef<File[]>([])

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<CarFormValues>({
        resolver: zodResolver(carSchema) as unknown as Resolver<CarFormValues>,
        defaultValues: defaultFormValues(car),
    })

    const brandId = watch('brand_id')

    useEffect(() => {
        reset(defaultFormValues(car))
        setImages(
            (car?.images ?? []).map((img) => ({
                url: img.image,
                is_primary: img.is_primary,
                sort_order: img.sort_order,
            })),
        )
    }, [car, isOpen, reset])

    useEffect(() => {
        if (!isOpen) {
            return
        }
        apiGetBrands()
            .then((res) =>
                setBrands(
                    res.data.map((b) => ({ value: b.id, label: b.name })),
                ),
            )
            .catch(() => setBrands([]))
        apiGetCategories()
            .then((res) =>
                setCategories(
                    res.data.map((c) => ({ value: c.id, label: c.name })),
                ),
            )
            .catch(() => setCategories([]))
    }, [isOpen])

    useEffect(() => {
        if (!brandId) {
            setModels([])
            return
        }
        apiGetModels({ brand_id: brandId })
            .then((res) =>
                setModels(
                    res.data.map((m) => ({ value: m.id, label: m.name })),
                ),
            )
            .catch(() => setModels([]))
    }, [brandId])

    const uploadFiles = async (files: File[]) => {
        for (const file of files) {
            const placeholderUrl = `pending:${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`
            setImages((prev) => [
                ...prev,
                {
                    url: placeholderUrl,
                    is_primary: prev.length === 0,
                    sort_order: prev.length,
                    uploading: true,
                },
            ])
            try {
                const res = await apiUploadCarImage(file)
                setImages((prev) =>
                    prev.map((img) =>
                        img.url === placeholderUrl
                            ? { ...img, url: res.url, uploading: false }
                            : img,
                    ),
                )
            } catch {
                setImages((prev) =>
                    prev.filter((img) => img.url !== placeholderUrl),
                )
                toast.push(
                    <Notification
                        type="danger"
                        title="Could not upload that image"
                    />,
                )
            }
        }
    }

    const beforeUpload = (newFiles: FileList | null) => {
        if (!newFiles || newFiles.length === 0) {
            return false
        }
        const files = Array.from(newFiles)
        if (images.length + files.length > MAX_IMAGES) {
            return `A car can have up to ${MAX_IMAGES} images`
        }
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                return 'Only image files are allowed'
            }
            if (file.size > MAX_IMAGE_BYTES) {
                return 'Each image must be 5MB or smaller'
            }
        }
        pendingFiles.current = files
        return true
    }

    const handleUploadChange = (file: File) => {
        const files =
            pendingFiles.current.length > 0 ? pendingFiles.current : [file]
        pendingFiles.current = []
        void uploadFiles(files)
    }

    const setPrimary = (index: number) => {
        setImages((prev) =>
            prev.map((img, i) => ({ ...img, is_primary: i === index })),
        )
    }

    const removeImage = (index: number) => {
        setImages((prev) => {
            const removed = prev[index]
            const next = prev.filter((_, i) => i !== index)
            if (removed?.is_primary && next.length > 0) {
                next[0] = { ...next[0], is_primary: true }
            }
            return next
        })
    }

    const onSubmit = handleSubmit(async (values) => {
        setSubmitting(true)
        const payload = buildPayload(values, images)
        try {
            if (car) {
                await apiUpdateCar(car.id, payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Car updated successfully!"
                    />,
                )
            } else {
                await apiCreateCar(payload)
                toast.push(
                    <Notification
                        type="success"
                        title="Car added successfully!"
                    />,
                )
            }
            onSaved()
            onCancel()
        } catch {
            toast.push(
                <Notification type="danger" title="Something went wrong" />,
            )
        } finally {
            setSubmitting(false)
        }
    })

    return (
        <Form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormItem
                    label="Brand"
                    invalid={Boolean(errors.brand_id)}
                    errorMessage={errors.brand_id?.message}
                >
                    <Controller
                        name="brand_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select brand"
                                options={brands}
                                value={brands.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Model"
                    invalid={Boolean(errors.model_id)}
                    errorMessage={errors.model_id?.message}
                >
                    <Controller
                        name="model_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select model"
                                options={models}
                                isDisabled={!brandId}
                                value={models.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Category"
                    invalid={Boolean(errors.category_id)}
                    errorMessage={errors.category_id?.message}
                >
                    <Controller
                        name="category_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select category"
                                options={categories}
                                value={categories.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Registration number"
                    invalid={Boolean(errors.registration_number)}
                    errorMessage={errors.registration_number?.message}
                >
                    <Controller
                        name="registration_number"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="e.g. 45678-A-6" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="VIN">
                    <Controller
                        name="vin"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Optional VIN" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Year">
                    <Controller
                        name="year"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                placeholder="2023"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Color">
                    <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Blue" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Daily price (MAD)">
                    <Controller
                        name="daily_price"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="500"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Transmission">
                    <Controller
                        name="transmission_type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Manual"
                                options={transmissionOptions}
                                value={transmissionOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Fuel type">
                    <Controller
                        name="fuel_type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Diesel"
                                options={fuelOptions}
                                value={fuelOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Seats">
                    <Controller
                        name="seats_count"
                        control={control}
                        render={({ field }) => (
                            <Input type="number" placeholder="5" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Doors">
                    <Controller
                        name="doors_count"
                        control={control}
                        render={({ field }) => (
                            <Input type="number" placeholder="4" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Purchase price (MAD)">
                    <Controller
                        name="purchase_price"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="250000"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Initial mileage">
                    <Controller
                        name="initial_mileage"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                placeholder="10000"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Current mileage">
                    <Controller
                        name="current_mileage"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                placeholder="15000"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Fuel level (%)">
                    <Controller
                        name="current_fuel_level"
                        control={control}
                        render={({ field }) => (
                            <Input type="number" placeholder="100" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Insurance company">
                    <Controller
                        name="insurance_company"
                        control={control}
                        render={({ field }) => (
                            <Input placeholder="Wafa Assurance" {...field} />
                        )}
                    />
                </FormItem>
                <FormItem label="Insurance expiry">
                    <Controller
                        name="insurance_expiry_date"
                        control={control}
                        render={({ field }) => <Input type="date" {...field} />}
                    />
                </FormItem>
                <FormItem label="Technical inspection expiry">
                    <Controller
                        name="technical_inspection_expiry"
                        control={control}
                        render={({ field }) => <Input type="date" {...field} />}
                    />
                </FormItem>
                <FormItem label="Status">
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={carStatusOptions}
                                value={carStatusOptions.find(
                                    (o) => o.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                customInputDisplay={(option) =>
                                    option ? (
                                        <CarStatusBadge
                                            status={option.value as CarStatus}
                                        />
                                    ) : null
                                }
                                customOption={({
                                    option,
                                    selected,
                                    CheckIcon,
                                }) => (
                                    <span className="flex w-full items-center justify-between gap-2">
                                        <CarStatusBadge
                                            status={option.value as CarStatus}
                                        />
                                        {selected && CheckIcon}
                                    </span>
                                )}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label="Active">
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <Switcher
                                checked={field.value}
                                onChange={(checked) => field.onChange(checked)}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem label="Images" className="mt-4">
                <Upload
                    draggable
                    multiple
                    showList={false}
                    accept="image/*"
                    beforeUpload={beforeUpload}
                    onChange={handleUploadChange}
                >
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                        <LiCamera className="text-3xl text-gray-400" />
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                            Click or drag images here
                        </span>
                        <span className="text-xs text-gray-400">
                            JPG, PNG or WEBP — 5MB max each, up to {MAX_IMAGES}{' '}
                            images
                        </span>
                    </div>
                </Upload>
                {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {images.map((img, index) => (
                            <div
                                key={img.url}
                                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                            >
                                {img.uploading ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Spinner size={20} />
                                    </div>
                                ) : (
                                    <img
                                        src={img.url}
                                        alt={`Car image ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                                {img.is_primary && (
                                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                        Primary
                                    </span>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                                    <button
                                        type="button"
                                        title="Set as primary"
                                        className="rounded-full bg-white p-1.5 text-gray-600 hover:bg-gray-100"
                                        onClick={() => setPrimary(index)}
                                    >
                                        <LiStar
                                            className={
                                                img.is_primary
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : ''
                                            }
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        title="Remove image"
                                        className="rounded-full bg-white p-1.5 text-error hover:bg-red-50"
                                        onClick={() => removeImage(index)}
                                    >
                                        <LiTrash className="text-base" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </FormItem>
            <FormItem label="Notes" className="mt-4">
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            placeholder="Any additional notes"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="solid" loading={submitting}>
                    {car ? 'Save changes' : 'Add car'}
                </Button>
            </div>
        </Form>
    )
}

export default CarForm
