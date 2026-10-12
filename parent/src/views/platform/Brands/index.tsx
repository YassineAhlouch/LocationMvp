import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Dialog, Form, FormItem, Input, Notification, toast } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import {
    apiCreateBrand,
    apiDeleteBrand,
    apiGetBrands,
    apiUpdateBrand,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { LiAddCircle, LiEdit, LiTrash } from '@/icons'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Brand } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
})

type BrandFormSchema = z.infer<typeof schema>

const Brands = () => {
    const [data, setData] = useState<Brand[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Brand | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BrandFormSchema>({
        resolver: zodResolver(schema),
        defaultValues: { name: '' },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetBrands({
                page,
                per_page: pageSize,
                ...(query ? { q: query } : {}),
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
    }, [page, pageSize, query])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const openCreate = () => {
        setEditing(null)
        reset({ name: '' })
        setDialogOpen(true)
    }

    const openEdit = (brand: Brand) => {
        setEditing(brand)
        reset({ name: brand.name })
        setDialogOpen(true)
    }

    const onSubmit = async (values: BrandFormSchema) => {
        setIsSubmitting(true)
        try {
            if (editing) {
                await apiUpdateBrand(editing.id, values)
                toast.push(
                    <Notification type="success" title="Brand updated" />,
                )
            } else {
                await apiCreateBrand(values)
                toast.push(
                    <Notification type="success" title="Brand created" />,
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
            await apiDeleteBrand(deleteTarget.id)
            toast.push(
                <Notification type="success" title="Brand deleted" />,
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

    const columns = useMemo<ColumnDef<Brand>[]>(
        () => [
            {
                header: 'Brand',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {row.original.name}
                    </span>
                ),
            },
            {
                header: 'Models',
                accessorKey: 'models_count',
                cell: ({ row }) => row.original.models_count ?? 0,
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
                title="Brands"
                description="Shared reference data used by every agency's fleet."
                extra={
                    <Button
                        variant="solid"
                        icon={<LiAddCircle />}
                        onClick={openCreate}
                    >
                        New brand
                    </Button>
                }
            />

            <Card>
                <div className="mb-4">
                    <DebouceInput
                        placeholder="Search brands"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPage(1)
                            setQuery(e.target.value)
                        }}
                        className="w-full sm:w-72"
                    />
                </div>

                <DataTable<Brand>
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
                    {editing ? 'Edit brand' : 'Create brand'}
                </h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Name"
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
                                    placeholder="e.g. Dacia"
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
                            {editing ? 'Save changes' : 'Create brand'}
                        </Button>
                    </div>
                </Form>
            </Dialog>

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                type="danger"
                title="Delete brand"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                confirmButtonProps={{ variant: 'solid' }}
            >
                <p>
                    Delete <strong>{deleteTarget?.name}</strong>? Brands still
                    used by cars cannot be removed.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default Brands
