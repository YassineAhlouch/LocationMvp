import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Notification, Select, toast } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import InvoiceViewDialog from './InvoiceViewDialog'
import { formatAmount, paymentStatusMeta } from './status'
import { apiGetAgencies, apiGetInvoices } from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { formatDateTime } from '@/utils/formatDate'
import { LiFileText } from '@/icons'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { PlatformAgency, PlatformInvoice } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const ALL_AGENCIES = 0

const Invoices = () => {
    const [data, setData] = useState<PlatformInvoice[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [agencyId, setAgencyId] = useState<number | undefined>()
    const [paymentStatus, setPaymentStatus] = useState<string | undefined>()

    const [agencies, setAgencies] = useState<PlatformAgency[]>([])
    const [viewing, setViewing] = useState<PlatformInvoice | null>(null)

    useEffect(() => {
        apiGetAgencies({ per_page: 100, sort_by: 'name', sort_dir: 'asc' })
            .then((response) => setAgencies(response.data))
            .catch(() => setAgencies([]))
    }, [])

    const agencyOptions = useMemo(
        () => [
            { value: ALL_AGENCIES, label: 'All agencies' },
            ...agencies.map((agency) => ({
                value: agency.id,
                label: agency.name,
            })),
        ],
        [agencies],
    )

    const paymentStatusOptions = useMemo(
        () => [
            { value: '', label: 'All payment statuses' },
            { value: 'paid', label: 'Paid' },
            { value: 'partial', label: 'Partial' },
            { value: 'unpaid', label: 'Unpaid' },
        ],
        [],
    )

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetInvoices({
                page,
                per_page: pageSize,
                ...(agencyId ? { agency_id: agencyId } : {}),
                ...(paymentStatus ? { payment_status: paymentStatus } : {}),
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
    }, [page, pageSize, agencyId, paymentStatus, query])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns = useMemo<ColumnDef<PlatformInvoice>[]>(
        () => [
            {
                header: 'Invoice',
                accessorKey: 'reservation_number',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {row.original.reservation_number}
                    </span>
                ),
            },
            {
                header: 'Agency',
                accessorKey: 'agency.name',
                cell: ({ row }) => (
                    <div>
                        <span>{row.original.agency.name}</span>
                        {row.original.agency.currency && (
                            <div className="text-xs text-gray-500">
                                {row.original.agency.currency.code}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                header: 'Client',
                accessorKey: 'primary_client.full_name',
                cell: ({ row }) => {
                    const client = row.original.primary_client
                    return client ? client.full_name : '—'
                },
            },
            {
                header: 'Vehicle',
                accessorKey: 'car.registration_number',
                cell: ({ row }) => row.original.car.registration_number,
            },
            {
                header: 'Pickup',
                accessorKey: 'pickup_datetime',
                cell: ({ row }) =>
                    row.original.pickup_datetime
                        ? formatDateTime(row.original.pickup_datetime)
                        : '—',
            },
            {
                header: 'Total',
                accessorKey: 'total_amount',
                cell: ({ row }) => (
                    <span className="font-medium">
                        {formatAmount(
                            row.original.total_amount,
                            row.original.agency.currency,
                        )}
                    </span>
                ),
            },
            {
                header: 'Payment',
                accessorKey: 'payment_status',
                cell: ({ row }) => {
                    const meta =
                        paymentStatusMeta[row.original.payment_status] ?? {
                            label: row.original.payment_status,
                            className: 'bg-gray-100 text-gray-600',
                        }
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
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            icon={<LiFileText />}
                            onClick={() => setViewing(row.original)}
                        >
                            View invoice
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    )

    return (
        <>
            <PageHeading
                title="Invoices"
                description="Browse reservations as invoices, one agency at a time or platform-wide."
            />

            <Card>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Select
                        size="sm"
                        className="w-full sm:w-56"
                        placeholder="All agencies"
                        options={agencyOptions}
                        value={
                            agencyOptions.find(
                                (option) =>
                                    option.value === (agencyId ?? ALL_AGENCIES),
                            ) ?? null
                        }
                        onChange={(option) => {
                            setPage(1)
                            const value = option?.value
                            setAgencyId(
                                value === undefined || value === ALL_AGENCIES
                                    ? undefined
                                    : value,
                            )
                        }}
                    />
                    <Select
                        size="sm"
                        className="w-full sm:w-52"
                        placeholder="All payment statuses"
                        options={paymentStatusOptions}
                        value={
                            paymentStatusOptions.find(
                                (option) => option.value === (paymentStatus ?? ''),
                            ) ?? null
                        }
                        onChange={(option) => {
                            setPage(1)
                            setPaymentStatus(option?.value || undefined)
                        }}
                    />
                    <DebouceInput
                        placeholder="Search invoice, client or vehicle"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPage(1)
                            setQuery(e.target.value)
                        }}
                        className="w-full sm:w-72"
                    />
                </div>

                <DataTable<PlatformInvoice>
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

            <InvoiceViewDialog
                invoice={viewing}
                onClose={() => setViewing(null)}
            />
        </>
    )
}

export default Invoices