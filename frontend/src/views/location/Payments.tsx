import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import DatePicker from '@/components/ui/DatePicker'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import StatisticCard from '@/components/shared/StatisticCard'
import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { colors } from '@/constants/colors.constant'
import { LiClock, LiRefresh, LiStatusUp, LiWallet } from '@/icons'
import { LuCircleCheck, LuRotateCcw, LuSearch, LuTrash2 } from 'react-icons/lu'
import {
    apiGetPaymentsLedger,
    apiGetPaymentsOverview,
    apiConfirmPayment,
    apiRefundPayment,
    apiDeletePayment,
} from '@/services/LocationService'
import type { Payment, PaymentOverview } from '@/@types/location'
import {
    MAD,
    apiErrorMessage,
    formatDate,
    paymentMethodOptions,
    paymentRecordStatusOptions,
    paymentRecordStatusTone,
    tagToneClass,
} from './shared'
import type { ColumnDef } from '@tanstack/react-table'

const statusFilterOptions = [
    { value: '', label: 'All statuses' },
    ...paymentRecordStatusOptions,
]

const methodFilterOptions = [
    { value: '', label: 'All methods' },
    ...paymentMethodOptions,
]

const Payments = () => {
    const [selectedDate, setSelectedDate] = useState(
        dayjs().format('YYYY-MM-DD'),
    )

    const [overview, setOverview] = useState<PaymentOverview | null>(null)
    const [overviewLoading, setOverviewLoading] = useState(true)

    const [payments, setPayments] = useState<Payment[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [methodFilter, setMethodFilter] = useState('')

    const [busyId, setBusyId] = useState<number | null>(null)
    const [refundTarget, setRefundTarget] = useState<Payment | null>(null)
    const [refundReason, setRefundReason] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null)

    const range = useMemo(
        () => ({
            from: dayjs(selectedDate)
                .subtract(29, 'day')
                .format('YYYY-MM-DD'),
            to: selectedDate,
        }),
        [selectedDate],
    )

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(dayjs(date).format('YYYY-MM-DD'))
            setPageIndex(1)
        }
    }

    const loadOverview = useCallback(() => {
        setOverviewLoading(true)
        apiGetPaymentsOverview({ from: range.from, to: range.to })
            .then(setOverview)
            .catch(() => setOverview(null))
            .finally(() => setOverviewLoading(false))
    }, [range.from, range.to])

    const fetchLedger = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            page: pageIndex,
            per_page: pageSize,
            from: range.from,
            to: range.to,
        }
        if (q.trim()) {
            params.q = q.trim()
        }
        if (statusFilter) {
            params.status = statusFilter
        }
        if (methodFilter) {
            params.method = methodFilter
        }
        apiGetPaymentsLedger(params)
            .then((res) => {
                setPayments(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setPayments([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, q, statusFilter, methodFilter, range.from, range.to])

    useEffect(() => {
        loadOverview()
    }, [loadOverview])

    useEffect(() => {
        fetchLedger()
    }, [fetchLedger])

    const handleConfirm = useCallback(
        async (payment: Payment) => {
            setBusyId(payment.id)
            try {
                await apiConfirmPayment(payment.id)
                toast.push(
                    <Notification type="success" title="Payment confirmed" />,
                )
                fetchLedger()
                loadOverview()
            } catch (error) {
                toast.push(
                    <Notification
                        type="danger"
                        title={apiErrorMessage(
                            error,
                            'Could not confirm the payment',
                        )}
                    />,
                )
            } finally {
                setBusyId(null)
            }
        },
        [fetchLedger, loadOverview],
    )

    const submitRefund = async () => {
        if (!refundTarget || !refundReason.trim()) {
            return
        }
        setBusyId(refundTarget.id)
        try {
            await apiRefundPayment(refundTarget.id, refundReason.trim())
            toast.push(
                <Notification type="success" title="Payment refunded" />,
            )
            setRefundTarget(null)
            setRefundReason('')
            fetchLedger()
            loadOverview()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(error, 'Could not refund')}
                />,
            )
        } finally {
            setBusyId(null)
        }
    }

    const submitDelete = async () => {
        if (!deleteTarget) {
            return
        }
        setBusyId(deleteTarget.id)
        try {
            await apiDeletePayment(deleteTarget.reservation_id, deleteTarget.id)
            toast.push(
                <Notification type="success" title="Payment deleted" />,
            )
            setDeleteTarget(null)
            fetchLedger()
            loadOverview()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(error, 'Could not delete')}
                />,
            )
        } finally {
            setBusyId(null)
        }
    }

    const metricsData = [
        {
            key: 'paid',
            title: 'Total Received',
            value: overview?.totals.paid ?? 0,
            icon: <LiWallet />,
            color: colors.emerald,
        },
        {
            key: 'pending',
            title: 'Pending',
            value: overview?.totals.pending ?? 0,
            icon: <LiClock />,
            color: colors.yellow,
        },
        {
            key: 'refunded',
            title: 'Refunded',
            value: overview?.totals.refunded ?? 0,
            icon: <LiRefresh />,
            color: colors.red,
        },
        {
            key: 'net',
            title: 'Net Revenue',
            value: overview?.totals.net ?? 0,
            icon: <LiStatusUp />,
            color: colors.blue,
        },
    ]

    const columns = useMemo<ColumnDef<Payment>[]>(
        () => [
            {
                header: 'Date',
                accessorKey: 'payment_date',
                cell: (props) => (
                    <span className="text-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(props.row.original.payment_date)}
                    </span>
                ),
            },
            {
                header: 'Reservation',
                id: 'reservation',
                cell: (props) => {
                    const payment = props.row.original
                    const reservation = payment.reservation
                    if (!reservation) {
                        return (
                            <span className="text-sm text-gray-500">
                                #{payment.reservation_id}
                            </span>
                        )
                    }
                    return (
                        <Link
                            to={`${APPS_PREFIX_PATH}/reservations/${reservation.id}/modifier`}
                            className="font-semibold text-primary hover:underline"
                        >
                            {reservation.reservation_number}
                        </Link>
                    )
                },
            },
            {
                header: 'Client',
                id: 'client',
                cell: (props) => (
                    <span className="text-gray-700 dark:text-gray-200">
                        {props.row.original.reservation?.primary_client
                            ?.full_name ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Method',
                accessorKey: 'method',
                cell: (props) => (
                    <Tag className="bg-white font-medium capitalize shadow dark:bg-gray-800">
                        {props.row.original.method}
                    </Tag>
                ),
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => (
                    <span className="text-nowrap font-semibold dark:text-gray-100">
                        {MAD(props.row.original.amount)}
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
                            className={`capitalize ${tagToneClass[paymentRecordStatusTone[status]]}`}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: 'Reference',
                accessorKey: 'reference',
                cell: (props) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {props.row.original.reference ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: (props) => {
                    const payment = props.row.original
                    const busy = busyId === payment.id
                    return (
                        <div className="flex items-center justify-center gap-1">
                            {payment.status === 'pending' && (
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="px-2 text-success hover:text-success"
                                    title="Confirm payment"
                                    disabled={busy}
                                    onClick={() => handleConfirm(payment)}
                                >
                                    <LuCircleCheck className="text-base" />
                                </Button>
                            )}
                            {payment.status === 'paid' && (
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="px-2 text-warning hover:text-warning"
                                    title="Refund payment"
                                    disabled={busy}
                                    onClick={() => {
                                        setRefundReason('')
                                        setRefundTarget(payment)
                                    }}
                                >
                                    <LuRotateCcw className="text-base" />
                                </Button>
                            )}
                            {payment.status === 'pending' && (
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="px-2 text-error hover:text-error"
                                    title="Delete payment"
                                    disabled={busy}
                                    onClick={() => setDeleteTarget(payment)}
                                >
                                    <LuTrash2 className="text-base" />
                                </Button>
                            )}
                        </div>
                    )
                },
            },
        ],
        [busyId, handleConfirm],
    )

    return (
        <Container>
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h4>Payments</h4>
                    <p>
                        Every payment received across reservations, with
                        confirmation and refund controls
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <DatePicker
                        value={new Date(selectedDate)}
                        onChange={handleDateChange}
                        placeholder="Select date"
                        inputFormat="DD MMM YYYY"
                        clearable={false}
                    />
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {metricsData.map((item) => (
                    <StatisticCard key={item.key}>
                        <div className="flex items-center gap-4">
                            <Avatar
                                className={classNames(
                                    'border-0',
                                    item.color.iconBg,
                                    item.color.iconText,
                                )}
                            >
                                <span className="text-2xl">{item.icon}</span>
                            </Avatar>
                            <div>
                                <p>{item.title}</p>
                                <h4>
                                    {overviewLoading ? '--' : MAD(item.value)}
                                </h4>
                            </div>
                        </div>
                    </StatisticCard>
                ))}
            </div>

            {/* Ledger */}
            <Card bodyClass="p-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-1">
                            <div className="w-full sm:w-auto">
                                <DebouceInput
                                    className="lg:max-w-[250px]"
                                    prefix={
                                        <LuSearch className="text-base heading-text" />
                                    }
                                    placeholder="Search reference, client..."
                                    onChange={(e) => {
                                        setQ(e.target.value)
                                        setPageIndex(1)
                                    }}
                                />
                            </div>
                            <div className="w-full sm:min-w-[150px] sm:w-auto">
                                <Select
                                    options={methodFilterOptions}
                                    value={
                                        methodFilterOptions.find(
                                            (o) => o.value === methodFilter,
                                        ) ?? null
                                    }
                                    onChange={(option) => {
                                        setMethodFilter(option?.value ?? '')
                                        setPageIndex(1)
                                    }}
                                    placeholder="Filter by method"
                                />
                            </div>
                            <div className="w-full sm:min-w-[150px] sm:w-auto">
                                <Select
                                    options={statusFilterOptions}
                                    value={
                                        statusFilterOptions.find(
                                            (o) => o.value === statusFilter,
                                        ) ?? null
                                    }
                                    onChange={(option) => {
                                        setStatusFilter(option?.value ?? '')
                                        setPageIndex(1)
                                    }}
                                    placeholder="Filter by status"
                                />
                            </div>
                        </div>
                        <div className="font-medium heading-text text-center sm:text-left">
                            {total} payment{total === 1 ? '' : 's'}
                        </div>
                    </div>
                </div>
                <div className="pb-4">
                    <DataTable<Payment>
                        columns={columns}
                        data={payments}
                        noData={!loading && payments.length === 0}
                        loading={loading}
                        pagingData={{ total, pageIndex, pageSize }}
                        onPaginationChange={(page) => setPageIndex(page)}
                        onPageSizeChange={(size) => {
                            setPageSize(size)
                            setPageIndex(1)
                        }}
                    />
                </div>
            </Card>

            {/* Refund dialog */}
            <Dialog
                isOpen={Boolean(refundTarget)}
                onClose={() => setRefundTarget(null)}
                width={440}
            >
                <h5 className="mb-2 text-base font-bold dark:text-gray-100">
                    Refund payment
                </h5>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {refundTarget
                        ? `${MAD(refundTarget.amount)} · ${refundTarget.reference ?? 'no reference'}`
                        : ''}
                </p>
                <Input
                    textArea
                    placeholder="Reason for the refund (required)"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                />
                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setRefundTarget(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        disabled={!refundReason.trim()}
                        loading={busyId === refundTarget?.id}
                        onClick={submitRefund}
                    >
                        Refund
                    </Button>
                </div>
            </Dialog>

            {/* Delete dialog */}
            <Dialog
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                width={420}
            >
                <h5 className="mb-2 text-base font-bold dark:text-gray-100">
                    Delete payment
                </h5>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    Only pending payments can be deleted. This cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setDeleteTarget(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        className="bg-error hover:bg-error"
                        loading={busyId === deleteTarget?.id}
                        onClick={submitDelete}
                    >
                        Delete
                    </Button>
                </div>
            </Dialog>
        </Container>
    )
}

export default Payments
