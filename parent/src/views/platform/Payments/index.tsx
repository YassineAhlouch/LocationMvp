import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button,
    Card,
    Notification,
    Select,
    toast,
} from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import PaymentFormDialog from './PaymentFormDialog'
import { paymentStatusMeta, paymentStatusOptions } from './status'
import {
    apiDeleteAgencyPayment,
    apiGetAgencies,
    apiGetAgencyPayments,
    apiPayAgencyPayment,
    apiUnpayAgencyPayment,
} from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { formatDate } from '@/utils/formatDate'
import { LiAddCircle, LiEdit, LiTick, LiTrash, LiUndo } from '@/icons'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { AgencyPayment, PlatformAgency } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const amountLabel = (
    value: number,
    currency: AgencyPayment['currency'],
): string => {
    const decimals = currency?.decimals ?? 2
    const symbol = currency?.symbol ?? 'DH'

    return `${value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })} ${symbol}`
}

const Payments = () => {
    const [data, setData] = useState<AgencyPayment[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [agencyId, setAgencyId] = useState('')

    const [agencies, setAgencies] = useState<PlatformAgency[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<AgencyPayment | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<AgencyPayment | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetAgencyPayments({
                page,
                per_page: pageSize,
                ...(query ? { q: query } : {}),
                ...(status ? { status } : {}),
                ...(agencyId ? { agency_id: agencyId } : {}),
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
    }, [page, pageSize, query, status, agencyId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        apiGetAgencies({ per_page: 100 })
            .then((response) => setAgencies(response.data))
            .catch(() => setAgencies([]))
    }, [])

    const agencyFilterOptions = useMemo(
        () => [
            { label: 'All agencies', value: '' },
            ...agencies.map((agency) => ({
                label: agency.name,
                value: String(agency.id),
            })),
        ],
        [agencies],
    )

    const markPaid = async (payment: AgencyPayment) => {
        try {
            await apiPayAgencyPayment(payment.id)
            toast.push(
                <Notification type="success" title="Invoice marked paid" />,
            )
            fetchData()
        } catch (error) {
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        }
    }

    const markUnpaid = async (payment: AgencyPayment) => {
        try {
            await apiUnpayAgencyPayment(payment.id)
            toast.push(
                <Notification type="success" title="Invoice marked unpaid" />,
            )
            fetchData()
        } catch (error) {
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        }
    }

    const confirmDelete = async () => {
        if (!deleteTarget) {
            return
        }

        try {
            await apiDeleteAgencyPayment(deleteTarget.id)
            toast.push(
                <Notification type="success" title="Invoice deleted" />,
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

    const columns: ColumnDef<AgencyPayment>[] = [
        {
            header: 'Agency',
            accessorKey: 'agency.name',
            cell: ({ row }) => (
                <span className="font-medium heading-text">
                    {row.original.agency?.name ?? '—'}
                </span>
            ),
        },
        {
            header: 'Period',
            accessorKey: 'period',
            cell: ({ row }) => row.original.period ?? '—',
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ row }) => (
                <span className="font-medium heading-text">
                    {amountLabel(row.original.amount, row.original.currency)}
                </span>
            ),
        },
        {
            header: 'Due date',
            accessorKey: 'due_date',
            cell: ({ row }) =>
                row.original.due_date ? formatDate(row.original.due_date) : '—',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => {
                const meta = paymentStatusMeta[row.original.status]
                return (
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
                    >
                        {meta.label}
                    </span>
                )
            },
        },
        {
            header: 'Paid',
            accessorKey: 'paid_at',
            cell: ({ row }) =>
                row.original.paid_at ? formatDate(row.original.paid_at) : '—',
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => {
                const isPaid = row.original.status === 'paid'
                return (
                    <div className="flex justify-end gap-2">
                        {isPaid ? (
                            <Button
                                size="sm"
                                icon={<LiUndo />}
                                onClick={() => markUnpaid(row.original)}
                            >
                                Mark unpaid
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="solid"
                                icon={<LiTick />}
                                onClick={() => markPaid(row.original)}
                            >
                                Mark paid
                            </Button>
                        )}
                        <Button
                            size="sm"
                            icon={<LiEdit />}
                            onClick={() => {
                                setEditing(row.original)
                                setDialogOpen(true)
                            }}
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
                )
            },
        },
    ]

    return (
        <>
            <PageHeading
                title="Payments"
                description="Subscription invoices per agency. An unpaid invoice past its due date locks that agency's workspace until it is marked paid."
                extra={
                    <Button
                        variant="solid"
                        icon={<LiAddCircle />}
                        onClick={() => {
                            setEditing(null)
                            setDialogOpen(true)
                        }}
                    >
                        New invoice
                    </Button>
                }
            />

            <Card>
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
                    <DebouceInput
                        placeholder="Search by agency name"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPage(1)
                            setQuery(e.target.value)
                        }}
                        className="w-full lg:w-72"
                    />
                    <Select
                        size="sm"
                        isSearchable
                        placeholder="All agencies"
                        options={agencyFilterOptions}
                        value={
                            agencyFilterOptions.find(
                                (option) =>
                                    String(option.value) === String(agencyId),
                            ) ?? agencyFilterOptions[0]
                        }
                        onChange={(option) => {
                            setPage(1)
                            setAgencyId(String(option?.value ?? ''))
                        }}
                        className="w-full lg:w-60"
                    />
                    <Select
                        size="sm"
                        placeholder="All statuses"
                        options={paymentStatusOptions}
                        value={
                            paymentStatusOptions.find(
                                (option) =>
                                    String(option.value) === String(status),
                            ) ?? paymentStatusOptions[0]
                        }
                        onChange={(option) => {
                            setPage(1)
                            setStatus(String(option?.value ?? ''))
                        }}
                        className="w-full lg:w-44"
                    />
                </div>

                <DataTable<AgencyPayment>
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

            <PaymentFormDialog
                isOpen={dialogOpen}
                payment={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchData}
            />

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                type="danger"
                title="Delete invoice"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                confirmButtonProps={{ variant: 'solid' }}
            >
                <p>
                    Delete this invoice for{' '}
                    <span className="font-semibold">
                        {deleteTarget?.agency?.name}
                    </span>
                    ? The agency is unlocked if no other invoice is overdue.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default Payments
