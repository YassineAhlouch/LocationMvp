import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Dialog, Form, FormItem, Input, Notification, Select, toast } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import {
    apiCreateModel,
    apiDeleteModel,
    apiGetBrands,
    apiGetModels,
    apiUpdateModel,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { LiAddCircle, LiEdit, LiTrash } from '@/icons'
import { Controller, useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Brand, CarModel } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const schema = z.object({
    brand_id: z.coerce.number().int().positive('Brand is required'),
    name: z.string().min(1, 'Name is required'),
})

type ModelFormSchema = z.infer<typeof schema>

const CarModels = () => {
    const [data, setData] = useState<CarModel[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [brandFilter, setBrandFilter] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<CarModel | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<CarModel | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ModelFormSchema>({
        // Numbers are coerced by zod, so the schema's input and output types
        // differ; the form works with the parsed (output) shape.
        resolver: zodResolver(schema) as unknown as Resolver<ModelFormSchema>,
        defaultValues: { brand_id: 0, name: '' },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetModels({
                page,
                per_page: pageSize,
                ...(query ? { q: query } : {}),
                ...(brandFilter ? { brand_id: brandFilter } : {}),
            })
            setData(response.data)
            setTotal(response.total)
        } catch (error) {
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, query, brandFilter])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        apiGetBrands({ per_page: 100 })
            .then((response) => setBrands(response.data))
            .catch(() => setBrands([]))
    }, [])

    const brandOptions = useMemo(
        () =>
            brands.map((brand) => ({ value: brand.id, label: brand.name })),
        [brands],
    )

    const brandFilterOptions = useMemo(
        () => [
            { label: 'All brands', value: '' },
            ...brands.map((brand) => ({
                value: String(brand.id),
                label: brand.name,
            })),
        ],
        [brands],
    )

    const openCreate = () => {
        setEditing(null)
        reset({ brand_id: 0, name: '' })
        setDialogOpen(true)
    }

    const openEdit = (model: CarModel) => {
        setEditing(model)
        reset({ brand_id: model.brand_id, name: model.name })
        setDialogOpen(true)
    }

    const onSubmit = async (values: ModelFormSchema) => {
        setIsSubmitting(true)
        try {
            if (editing) {
                await apiUpdateModel(editing.id, values)
                toast.push(
                    <Notification type="success" title="Model updated" />,
                )
            } else {
                await apiCreateModel(values)
                toast.push(
                    <Notification type="success" title="Model created" />,
                )
            }
            setDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        if (!deleteTarget) {
            return
        }

        try {
            await apiDeleteModel(deleteTarget.id)
            toast.push(
                <Notification type="success" title="Model deleted" />,
            )
            setDeleteTarget(null)
            fetchData()
        } catch (error) {
            setDeleteTarget(null)
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        }
    }

    const columns = useMemo<ColumnDef<CarModel>[]>(
        () => [
            {
                header: 'Model',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {row.original.name}
                    </span>
                ),
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
                cell: ({ row }) => row.original.brand?.name || '—',
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            icon={<LiEdit />}
                            onClick={() => openEdit(row.original)}
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            icon={<LiTrash />}
                            onClick={() => setDeleteTarget(row.original)}
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    return (
        <>
            <PageHeading
                title="Models"
                description="Car models, each belonging to a brand."
                extra={
                    <Button
                        variant="solid"
                        icon={<LiAddCircle />}
                        onClick={openCreate}
                    >
                        New model
                    </Button>
                }
            />

            <Card>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <DebouceInput
                        placeholder="Search models"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPage(1)
                            setQuery(e.target.value)
                        }}
                        className="w-full sm:w-72"
                    />
                    <Select
                        isSearchable
                        className="w-full sm:w-56"
                        options={brandFilterOptions}
                        value={
                            brandFilterOptions.find(
                                (option) => option.value === brandFilter,
                            ) ?? brandFilterOptions[0]
                        }
                        onChange={(option) => {
                            setPage(1)
                            setBrandFilter(String(option?.value ?? ''))
                        }}
                    />
                </div>

                <DataTable<CarModel>
                    columns={columns}
                    data={data}
                    loading={loading}
                    pagingData={{ total, pageIndex: page, pageSize }}
                    onPaginationChange={(nextPage) => setPage(nextPage)}
                    onPageSizeChange={(size) => {
                        setPage(1)
                        setPageSize(size)
                    }}
                />
            </Card>

            <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                width={460}
                closable={!isSubmitting}
                shouldCloseOnOverlayClick={!isSubmitting}
                shouldCloseOnEsc={!isSubmitting}
            >
                <h5 className="mb-6 heading-text">
                    {editing ? 'Edit model' : 'Create model'}
                </h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Brand"
                        asterisk
                        invalid={Boolean(errors.brand_id)}
                        errorMessage={errors.brand_id?.message}
                    >
                        <Controller
                            name="brand_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isSearchable
                                    isDisabled={isSubmitting}
                                    placeholder="Select brand"
                                    options={brandOptions}
                                    value={
                                        brandOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        ) ?? null
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value ?? 0)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Model name"
                        asterisk
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="e.g. Duster"
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            type="button"
                            onClick={() => setDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                        >
                            {editing ? 'Save changes' : 'Create model'}
                        </Button>
                    </div>
                </Form>
            </Dialog>

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                type="danger"
                title="Delete model"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                confirmButtonProps={{ variant: 'solid' }}
            >
                <p>
                    Delete <strong>{deleteTarget?.name}</strong>? Models still
                    used by cars cannot be removed.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CarModels
