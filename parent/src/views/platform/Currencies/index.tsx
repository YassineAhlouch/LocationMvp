import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Dialog, Form, FormItem, Input, Notification, Select, Switcher, toast } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import StatusPill from '../components/StatusPill'
import {
    apiCreateCurrency,
    apiDeleteCurrency,
    apiGetCurrencies,
    apiUpdateCurrency,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { LiAddCircle, LiEdit, LiTrash } from '@/icons'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Currency } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const schema = z.object({
    code: z
        .string()
        .min(1, 'Code is required')
        .max(8, 'Max 8 characters')
        .transform((value) => value.trim().toUpperCase()),
    name: z.string().min(1, 'Name is required'),
    symbol: z.string().min(1, 'Symbol is required'),
    decimals: z.coerce.number().min(0, 'Min 0').max(4, 'Max 4'),
    is_active: z.boolean(),
})

type CurrencyFormSchema = z.infer<typeof schema>

const emptyValues: CurrencyFormSchema = {
    code: '',
    name: '',
    symbol: '',
    decimals: 2,
    is_active: true,
}

const DECIMAL_OPTIONS = [0, 1, 2, 3, 4].map((value) => ({
    value,
    label: String(value),
}))

const Currencies = () => {
    const [data, setData] = useState<Currency[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Currency | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Currency | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CurrencyFormSchema>({
        // zod coerces decimals, so input/output types diverge; the form works
        // with the parsed (output) shape, mirroring the Agency form.
        resolver: zodResolver(schema) as unknown as Resolver<CurrencyFormSchema>,
        defaultValues: emptyValues,
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetCurrencies({
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
        reset(emptyValues)
        setDialogOpen(true)
    }

    const openEdit = (currency: Currency) => {
        setEditing(currency)
        reset({
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            decimals: currency.decimals,
            is_active: currency.is_active,
        })
        setDialogOpen(true)
    }

    const onSubmit = async (values: CurrencyFormSchema) => {
        setIsSubmitting(true)
        const payload = {
            code: values.code,
            name: values.name,
            symbol: values.symbol,
            decimals: values.decimals,
            is_active: values.is_active,
        }
        try {
            if (editing) {
                await apiUpdateCurrency(editing.id, payload)
                toast.push(
                    <Notification type="success" title="Currency updated" />,
                )
            } else {
                await apiCreateCurrency(payload)
                toast.push(
                    <Notification type="success" title="Currency created" />,
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
            await apiDeleteCurrency(deleteTarget.id)
            toast.push(
                <Notification type="success" title="Currency deleted" />,
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

    const columns = useMemo<ColumnDef<Currency>[]>(
        () => [
            {
                header: 'Code',
                accessorKey: 'code',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {row.original.code}
                    </span>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => row.original.name,
            },
            {
                header: 'Symbol',
                accessorKey: 'symbol',
                cell: ({ row }) => (
                    <span className="text-base">{row.original.symbol}</span>
                ),
            },
            {
                header: 'Decimals',
                accessorKey: 'decimals',
                cell: ({ row }) => row.original.decimals,
            },
            {
                header: 'Agencies',
                accessorKey: 'agencies_count',
                cell: ({ row }) => row.original.agencies_count ?? 0,
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: ({ row }) => (
                    <StatusPill active={row.original.is_active} />
                ),
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
                title="Currencies"
                description="The units agencies price and invoice in — MAD, USD, EUR and more."
                extra={
                    <Button
                        variant="solid"
                        icon={<LiAddCircle />}
                        onClick={openCreate}
                    >
                        New currency
                    </Button>
                }
            />

            <Card>
                <div className="mb-4">
                    <DebouceInput
                        placeholder="Search currencies"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPage(1)
                            setQuery(e.target.value)
                        }}
                        className="w-full sm:w-72"
                    />
                </div>

                <DataTable<Currency>
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
                width={480}
                closable={!isSubmitting}
                shouldCloseOnOverlayClick={!isSubmitting}
                shouldCloseOnEsc={!isSubmitting}
            >
                <h5 className="mb-6 heading-text">
                    {editing ? 'Edit currency' : 'Create currency'}
                </h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormItem
                            label="Code"
                            asterisk
                            invalid={Boolean(errors.code)}
                            errorMessage={errors.code?.message}
                        >
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="e.g. MAD"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Symbol"
                            asterisk
                            invalid={Boolean(errors.symbol)}
                            errorMessage={errors.symbol?.message}
                        >
                            <Controller
                                name="symbol"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="e.g. DH"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
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
                                    placeholder="e.g. Moroccan Dirham"
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Decimals"
                        invalid={Boolean(errors.decimals)}
                        errorMessage={errors.decimals?.message}
                    >
                        <Controller
                            name="decimals"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    size="sm"
                                    placeholder="Number of decimals"
                                    options={DECIMAL_OPTIONS}
                                    value={
                                        DECIMAL_OPTIONS.find(
                                            (option) =>
                                                option.value === field.value,
                                        ) ?? null
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    isDisabled={isSubmitting}
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
                                    onChange={field.onChange}
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
                            {editing ? 'Save changes' : 'Create currency'}
                        </Button>
                    </div>
                </Form>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                type="danger"
                title="Delete currency"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                confirmButtonProps={{ variant: 'solid' }}
            >
                <p>
                    Delete{' '}
                    <span className="font-semibold">
                        {deleteTarget?.code}
                    </span>
                    ? Agencies already working in it will block the deletion.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default Currencies