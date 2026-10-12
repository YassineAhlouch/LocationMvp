import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button,
    Card,
    Dialog,
    Form,
    FormItem,
    Input,
    toast,
} from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import {
    apiCreateCategory,
    apiDeleteCategory,
    apiGetCategories,
    apiUpdateCategory,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { LiAddCircle, LiEdit, LiTrash } from '@/icons'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { CarCategory } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().max(2000, 'Too long').optional(),
})

type CategoryFormSchema = z.infer<typeof schema>

const CarCategories = () => {
    const [data, setData] = useState<CarCategory[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<CarCategory | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<CarCategory | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormSchema>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', description: '' },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetCategories({
                page,
                per_page: pageSize,
                ...(query ? { q: query } : {}),
            })
            setData(response.data)
            setTotal(response.total)
        } catch (error) {
            toast.push(
                <div className="text-red-600 font-medium">
                    {apiErrorMessage(error)}
                </div>,
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
        reset({ name: '', description: '' })
        setDialogOpen(true)
    }

    const openEdit = (category: CarCategory) => {
        setEditing(category)
        reset({
            name: category.name,
            description: category.description ?? '',
        })
        setDialogOpen(true)
    }

    const onSubmit = async (values: CategoryFormSchema) => {
        setIsSubmitting(true)

        const payload = {
            name: values.name,
            description: values.description || null,
        }

        try {
            if (editing) {
                await apiUpdateCategory(editing.id, payload)
                toast.push(
                    <div className="text-emerald-600 font-medium">
                        Category updated
                    </div>,
                )
            } else {
                await apiCreateCategory(payload)
                toast.push(
                    <div className="text-emerald-600 font-medium">
                        Category created
                    </div>,
                )
            }
            setDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.push(
                <div className="text-red-600 font-medium">
                    {apiErrorMessage(error)}
                </div>,
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
            await apiDeleteCategory(deleteTarget.id)
            toast.push(
                <div className="text-emerald-600 font-medium">
                    Category deleted
                </div>,
            )
            setDeleteTarget(null)
            fetchData()
        } catch (error) {
            setDeleteTarget(null)
            toast.push(
                <div className="text-red-600 font-medium">
                    {apiErrorMessage(error)}
                </div>,
            )
        }
    }

    const columns = useMemo<ColumnDef<CarCategory>[]>(
        () => [
            {
                header: 'Category',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {row.original.name}
                    </span>
                ),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: ({ row }) => (
                    <span className="line-clamp-1">
                        {row.original.description || '—'}
                    </span>
                ),
            },
            {
                header: 'Cars',
                accessorKey: 'cars_count',
                cell: ({ row }) => row.original.cars_count ?? 0,
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
                title="Categories"
                description="Group car models into rental categories."
                extra={
                    <Button
                        variant="solid"
                        icon={<LiAddCircle />}
                        onClick={openCreate}
                    >
                        New category
                    </Button>
                }
            />

            <Card>
                <div className="mb-4">
                    <DebouceInput
                        placeholder="Search categories"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPage(1)
                            setQuery(e.target.value)
                        }}
                        className="w-full sm:w-72"
                    />
                </div>

                <DataTable<CarCategory>
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
                    {editing ? 'Edit category' : 'Create category'}
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
                                    placeholder="e.g. SUV"
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Description"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    textArea
                                    rows={3}
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
                            {editing ? 'Save changes' : 'Create category'}
                        </Button>
                    </div>
                </Form>
            </Dialog>

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                type="danger"
                title="Delete category"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                confirmButtonProps={{ variant: 'solid' }}
            >
                <p>
                    Delete <strong>{deleteTarget?.name}</strong>? Categories
                    still used by cars cannot be removed.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CarCategories
