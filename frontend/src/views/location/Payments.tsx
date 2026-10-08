import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Scroll from '@/components/ui/Scroll'
import Tabs from '@/components/ui/Tabs'
import InputGroup from '@/components/ui/InputGroup'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import { LineChart } from '@/components/shared/Chart'
import useResponsive from '@/utils/hooks/useResponsive'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import {
    LuCircleCheck,
    LuClock,
    LuRotateCcw,
    LuSearch,
    LuTrash2,
    LuTrendingUp,
    LuWallet,
} from 'react-icons/lu'
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

type DateRangePreset = '7D' | '30D' | '90D' | '1Y'
type MetricKey = 'paid' | 'pending' | 'refunded' | 'net'

const { TabNav, TabList } = Tabs

const dateRangePresets: Array<{
    value: DateRangePreset
    label: string
    shortLabel: string
}> = [
    { value: '7D', label: '7 Days', shortLabel: '7d' },
    { value: '30D', label: '30 Days', shortLabel: '30d' },
    { value: '90D', label: '90 Days', shortLabel: '90d' },
    { value: '1Y', label: '1 Year', shortLabel: '1y' },
]

const presetRange = (preset: DateRangePreset): { from: string; to: string } => {
    const days = { '7D': 7, '30D': 30, '90D': 90, '1Y': 365 }[preset]
    const to = dayjs()
    return {
        from: to.subtract(days - 1, 'day').format('YYYY-MM-DD'),
        to: to.format('YYYY-MM-DD'),
    }
}

const metricConfig: Record<
    MetricKey,
    { label: string; color: string; Icon: typeof LuWallet }
> = {
    paid: { label: 'Total Received', color: 'var(--success)', Icon: LuWallet },
    pending: { label: 'Pending', color: 'var(--warning)', Icon: LuClock },
    refunded: {
        label: 'Refunded',
        color: 'var(--error)',
        Icon: LuRotateCcw,
    },
    net: { label: 'Net Revenue', color: 'var(--primary)', Icon: LuTrendingUp },
}

const statusFilterOptions = [
    { value: '', label: 'All statuses' },
    ...paymentRecordStatusOptions,
]

const methodFilterOptions = [
    { value: '', label: 'All methods' },
    ...paymentMethodOptions,
]

const Payments = () => {
    const { larger } = useResponsive()

    const [preset, setPreset] = useState<DateRangePreset>('30D')
    const [metric, setMetric] = useState<MetricKey>('paid')

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

    const range = useMemo(() => presetRange(preset), [preset])

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
                    <Notification
                        type="success"
                        title="Payment confirmed"
                    />,
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

    const chartData = useMemo(() => {
        if (!overview) {
            return []
        }
        return overview.trend.labels.map((label, index) => {
            const paid = overview.trend.paid[index] ?? 0
            const pending = overview.trend.pending[index] ?? 0
            const refunded = overview.trend.refunded[index] ?? 0
            return {
                date: dayjs(label).format('MMM DD'),
                paid,
                pending,
                refunded,
                net: Number((paid - refunded).toFixed(2)),
            }
        })
    }, [overview])

    const metrics: Array<{
        key: MetricKey
        label: string
        value: number
        count: number
        Icon: typeof LuWallet
    }> = [
        {
            key: 'paid',
            label: metricConfig.paid.label,
            value: overview?.totals.paid ?? 0,
            count: overview?.counts.paid ?? 0,
            Icon: metricConfig.paid.Icon,
        },
        {
            key: 'pending',
            label: metricConfig.pending.label,
            value: overview?.totals.pending ?? 0,
            count: overview?.counts.pending ?? 0,
            Icon: metricConfig.pending.Icon,
        },
        {
            key: 'refunded',
            label: metricConfig.refunded.label,
            value: overview?.totals.refunded ?? 0,
            count: overview?.counts.refunded ?? 0,
            Icon: metricConfig.refunded.Icon,
        },
        {
            key: 'net',
            label: metricConfig.net.label,
            value: overview?.totals.net ?? 0,
            count: overview?.counts.total ?? 0,
            Icon: metricConfig.net.Icon,
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
                header: '',
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

    const activeMetric = metricConfig[metric]

    return (
        <Container>
            <div className="space-y-4">
                {/* Header + date range */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h4>Payments</h4>
                        <p>
                            Every payment received across reservations, with
                            confirmation and refund controls
                        </p>
                    </div>
                    <InputGroup>
                        {dateRangePresets.map((item) => (
                            <Button
                                key={item.value}
                                active={preset === item.value}
                                clickFeedback={false}
                                onClick={() => {
                                    setPreset(item.value)
                                    setPageIndex(1)
                                }}
                                block
                            >
                                {larger.sm ? item.label : item.shortLabel}
                            </Button>
                        ))}
                    </InputGroup>
                </div>

                {/* Metrics + trend */}
                <Card bodyClass="p-0">
                    <Tabs
                        value={metric}
                        onChange={(value) => setMetric(value as MetricKey)}
                    >
                        <Scroll edgeShadow>
                            <TabList className="flex lg:grid lg:grid-cols-4 overflow-x-hidden">
                                {metrics.map((item) => {
                                    const Icon = item.Icon
                                    return (
                                        <TabNav
                                            key={item.key}
                                            value={item.key}
                                            className="justify-start min-w-[230px] p-0"
                                        >
                                            <span className="w-full space-y-1 px-6 py-4 transition duration-150 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <span className="flex items-center gap-2 font-medium text-gray-500 dark:text-gray-400">
                                                    <Icon className="text-base" />
                                                    {item.label}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <span className="h5">
                                                        {overviewLoading
                                                            ? '--'
                                                            : MAD(item.value)}
                                                    </span>
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.count} payment
                                                    {item.count === 1
                                                        ? ''
                                                        : 's'}
                                                </span>
                                            </span>
                                        </TabNav>
                                    )
                                })}
                            </TabList>
                        </Scroll>
                    </Tabs>
                    <div className="p-6">
                        <Loading loading={overviewLoading} type="cover">
                            <LineChart
                                data={chartData}
                                height={320}
                                xAxisConfig={{ dataKey: 'date' }}
                                lineConfig={[
                                    {
                                        type: 'monotone',
                                        dataKey: metric,
                                        stroke: activeMetric.color,
                                        strokeWidth: 2,
                                        dot: false,
                                    },
                                ]}
                                tooltipContentConfig={{
                                    valueFormatter: (value: number) =>
                                        MAD(value),
                                }}
                            />
                        </Loading>
                    </div>
                </Card>

                {/* Ledger */}
                <Card bodyClass="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <div>
                            <h6>Payments ledger</h6>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {total} payment{total === 1 ? '' : 's'} in the
                                selected period
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <DebouceInput
                                placeholder="Search reference, client…"
                                prefix={<LuSearch className="text-lg" />}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                    setPageIndex(1)
                                }}
                            />
                            <div className="w-44">
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
                                />
                            </div>
                            <div className="w-44">
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
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <DataTable<Payment>
                            compact
                            verticalDivider={{ head: true, body: true }}
                            className="border-t border-b border-gray-200 dark:border-gray-700"
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
            </div>

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
