import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Select from '@/components/ui/Select'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import { LuSearch } from 'react-icons/lu'
import { LiEdit2 } from '@/icons'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { apiGetReservations } from '@/services/LocationService'
import {
    MAD,
    formatDateTime,
    paymentStatusTone,
    reservationStatusOptions,
    reservationStatusTone,
    tagToneClass,
} from './shared'
import type { Reservation, SelectOption } from '@/@types/location'
import type { ColumnDef } from '@tanstack/react-table'

type CarReservationsProps = {
    carId: number
}

const statusOptions: SelectOption<string>[] = [
    { value: '', label: 'All statuses' },
    ...reservationStatusOptions,
]

const CarReservations = ({ carId }: CarReservationsProps) => {
    const [rows, setRows] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const fetchData = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            car_id: carId,
            page: pageIndex,
            per_page: pageSize,
            sort_by: 'pickup_datetime',
            sort_dir: 'desc',
        }
        if (q.trim()) {
            params.q = q.trim()
        }
        if (statusFilter) {
            params.status = statusFilter
        }
        apiGetReservations(params)
            .then((res) => {
                setRows(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setRows([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [carId, pageIndex, pageSize, q, statusFilter])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns = useMemo<ColumnDef<Reservation>[]>(
        () => [
            {
                header: 'Reservation',
                accessorKey: 'reservation_number',
                cell: (props) => (
                    <Link
                        to={`${APPS_PREFIX_PATH}/reservations/${props.row.original.id}/modifier`}
                        className="font-semibold text-primary hover:underline"
                    >
                        {props.row.original.reservation_number}
                    </Link>
                ),
            },
            {
                header: 'Client',
                id: 'client',
                cell: (props) => (
                    <span className="text-gray-700 dark:text-gray-200">
                        {props.row.original.primary_client?.full_name ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Pickup',
                accessorKey: 'pickup_datetime',
                cell: (props) => (
                    <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDateTime(props.row.original.pickup_datetime)}
                    </span>
                ),
            },
            {
                header: 'Return',
                accessorKey: 'expected_return_datetime',
                cell: (props) => (
                    <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDateTime(
                            props.row.original.expected_return_datetime,
                        )}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    return (
                        <Tag
                            className={`capitalize ${tagToneClass[reservationStatusTone[status]]}`}
                        >
                            {status.replace('_', ' ')}
                        </Tag>
                    )
                },
            },
            {
                header: 'Payment',
                accessorKey: 'payment_status',
                cell: (props) => {
                    const status = props.row.original.payment_status
                    return (
                        <Tag
                            className={`capitalize ${tagToneClass[paymentStatusTone[status]]}`}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: 'Total',
                accessorKey: 'total_amount',
                cell: (props) => (
                    <span className="whitespace-nowrap font-semibold dark:text-gray-100">
                        {MAD(props.row.original.total_amount)}
                    </span>
                ),
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => (
                    <div className="flex items-center justify-end">
                        <Link
                            to={`${APPS_PREFIX_PATH}/reservations/${props.row.original.id}/modifier`}
                        >
                            <Button
                                size="sm"
                                variant="link"
                                title="Open reservation"
                                icon={<LiEdit2 className="text-base" />}
                            />
                        </Link>
                    </div>
                ),
            },
        ],
        [],
    )

    return (
        <Card bodyClass="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                    <h6>Reservations</h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {total} reservation{total === 1 ? '' : 's'} for this
                        vehicle
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <DebouceInput
                        placeholder="Search client, number…"
                        prefix={<LuSearch className="text-lg" />}
                        onChange={(e) => {
                            setQ(e.target.value)
                            setPageIndex(1)
                        }}
                    />
                    <div className="w-44">
                        <Select
                            options={statusOptions}
                            value={
                                statusOptions.find(
                                    (option) => option.value === statusFilter,
                                ) ?? null
                            }
                            onChange={(option) => {
                                setStatusFilter(option?.value ?? '')
                                setPageIndex(1)
                            }}
                        />
                    </div>
                </div>
            </div>
            <DataTable<Reservation>
                compact
                verticalDivider={{ head: true, body: true }}
                className="border-t border-b border-gray-200 dark:border-gray-700"
                columns={columns}
                data={rows}
                noData={!loading && rows.length === 0}
                loading={loading}
                pagingData={{ total, pageIndex, pageSize }}
                onPaginationChange={(page) => setPageIndex(page)}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setPageIndex(1)
                }}
            />
        </Card>
    )
}

export default CarReservations
