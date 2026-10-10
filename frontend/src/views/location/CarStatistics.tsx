import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import dayjs from 'dayjs'
import { Line } from 'recharts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Table from '@/components/ui/Table'
import Select from '@/components/ui/Select'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import SegmentedProgressBar from '@/components/shared/SegmentProgressBar'
import { BarChart, PieChart } from '@/components/shared/Chart'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useSessionUser } from '@/store/authStore'
import { colors } from '@/constants/colors.constant'
import {
    LiAdd,
    LiBank,
    LiBarChartUp,
    LiEdit2,
    LiReceipt,
    LiSpeedometer,
    LiTask,
    LiTrash,
} from '@/icons'
import { LuTrendingUp, LuWallet } from 'react-icons/lu'
import {
    apiDeleteCarFinancing,
    apiGetCarStatistics,
    apiPayCarInstallment,
} from '@/services/LocationService'
import { isVerbGranted } from './PermissionChecklist'
import CarFinancingDialog from './CarFinancingDialog'
import { MAD, apiErrorMessage, formatDate, tagToneClass } from './shared'
import type {
    CarInstallment,
    CarStatistics as CarStatisticsData,
    InstallmentStatus,
    SelectOption,
} from '@/@types/location'
import type { TagTone } from './shared'

const { Tr, Th, Td, THead, TBody } = Table

type CarStatisticsProps = {
    carId: number
}

const periodOptions: SelectOption<string>[] = [
    { value: '6', label: 'Last 6 months' },
    { value: '12', label: 'Last 12 months' },
    { value: '24', label: 'Last 24 months' },
]

const installmentStatusTone: Record<InstallmentStatus, TagTone> = {
    paid: 'success',
    pending: 'warning',
    overdue: 'error',
}

const donutPalette = [
    colors.blue.chart,
    colors.emerald.chart,
    colors.orange.chart,
    colors.purple.chart,
    colors.yellow.chart,
    colors.rose.chart,
    colors.cyan.chart,
    colors.gray.chart,
]

/** "oil_change" → "Oil change". */
const humanize = (value: string) =>
    value.replace(/_/g, ' ').replace(/^\w/, (char) => char.toUpperCase())

type KpiMetric = {
    label: string
    value: string
    hint?: string
}

type KpiGroupCardProps = {
    title: string
    tone: TagTone
    Icon: ComponentType<{ className?: string }>
    metrics: KpiMetric[]
}

const KpiGroupCard = ({ title, tone, Icon, metrics }: KpiGroupCardProps) => (
    <Card bodyClass="p-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 dark:border-gray-700">
            <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${tagToneClass[tone]}`}
            >
                <Icon />
            </span>
            <h6 className="font-semibold">{title}</h6>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {metrics.map((metric) => (
                <div
                    key={metric.label}
                    className="flex items-center justify-between gap-3 py-2.5"
                >
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {metric.label}
                        </p>
                        {metric.hint && (
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                {metric.hint}
                            </p>
                        )}
                    </div>
                    <span className="shrink-0 text-lg font-semibold heading-text">
                        {metric.value}
                    </span>
                </div>
            ))}
        </div>
    </Card>
)

const KpiGroupSkeleton = () => (
    <Card bodyClass="p-4">
        <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                ))}
            </div>
        </div>
    </Card>
)

const CardSkeleton = ({ height = 220 }: { height?: number }) => (
    <Card bodyClass="p-4">
        <div className="animate-pulse space-y-4">
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div
                className="rounded bg-gray-200 dark:bg-gray-700"
                style={{ height }}
            />
        </div>
    </Card>
)

type DonutSegment = {
    name: string
    value: number
    color: string
}

type DonutCardProps = {
    title: string
    subtitle: string
    Icon: ComponentType<{ className?: string }>
    segments: DonutSegment[]
    total: number
    totalLabel: string
    formatValue: (value: number) => string
}

const DonutCard = ({
    title,
    subtitle,
    Icon,
    segments,
    total,
    totalLabel,
    formatValue,
}: DonutCardProps) => {
    const visible = segments.filter((segment) => segment.value > 0)

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-lg border border-gray-300 p-0.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 heading-text">
                                <Icon className="text-xl" />
                            </div>
                        </div>
                        <div>
                            <h6 className="font-semibold">{title}</h6>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                ),
            }}
        >
            {visible.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    No data to chart yet.
                </p>
            ) : (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <PieChart
                            data={visible.map((segment) => ({
                                name: segment.name,
                                value: segment.value,
                            }))}
                            height={150}
                            width={150}
                            pieConfig={{
                                dataKey: 'value',
                                nameKey: 'name',
                                cx: '50%',
                                cy: '50%',
                                innerRadius: 44,
                                outerRadius: 66,
                                paddingAngle: 2,
                                cornerRadius: 4,
                            }}
                            cellConfig={visible.map((segment) => ({
                                fill: segment.color,
                            }))}
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="mb-1 font-medium heading-text">
                                {totalLabel}
                            </div>
                            <h3>{formatValue(total)}</h3>
                        </div>
                        <div className="space-y-2">
                            {segments.map((segment) => (
                                <div
                                    key={segment.name}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    segment.color,
                                            }}
                                        />
                                        <span className="font-medium">
                                            {segment.name}
                                        </span>
                                    </div>
                                    <span className="font-medium heading-text">
                                        {formatValue(segment.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

const CarStatistics = ({ carId }: CarStatisticsProps) => {
    const { user } = useSessionUser()
    const canManage = isVerbGranted(
        user?.role?.permissions ?? [],
        'financing',
        'manage',
    )

    const [data, setData] = useState<CarStatisticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [forbidden, setForbidden] = useState(false)
    const [months, setMonths] = useState(12)

    const [financingOpen, setFinancingOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [payTarget, setPayTarget] = useState<CarInstallment | null>(null)
    const [payDate, setPayDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [payReference, setPayReference] = useState('')
    const [paying, setPaying] = useState(false)

    const load = useCallback(() => {
        setLoading(true)
        setFailed(false)
        setForbidden(false)
        apiGetCarStatistics(carId, months)
            .then((res) => setData(res))
            .catch((error: unknown) => {
                const status = (error as { response?: { status?: number } })
                    ?.response?.status
                if (status === 403) {
                    setForbidden(true)
                } else {
                    setFailed(true)
                }
            })
            .finally(() => setLoading(false))
    }, [carId, months])

    useEffect(() => {
        load()
    }, [load])

    const chartData = useMemo(
        () =>
            (data?.monthly_series ?? []).map((point) => ({
                month: dayjs(`${point.month}-01`).format('MMM YY'),
                revenue: point.revenue,
                expenses: point.expenses,
                installments: point.installments,
                net: point.net,
            })),
        [data],
    )

    const periodRevenue = useMemo(
        () => chartData.reduce((sum, point) => sum + point.revenue, 0),
        [chartData],
    )
    const periodNet = useMemo(
        () => chartData.reduce((sum, point) => sum + point.net, 0),
        [chartData],
    )

    const submitPay = async () => {
        if (!payTarget) {
            return
        }
        setPaying(true)
        try {
            await apiPayCarInstallment(carId, payTarget.id, {
                paid_date: payDate,
                reference: payReference.trim() || null,
            })
            toast.push(
                <Notification
                    type="success"
                    title="Installment marked as paid!"
                />,
            )
            setPayTarget(null)
            load()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(error, 'Something went wrong')}
                />,
            )
        } finally {
            setPaying(false)
        }
    }

    const submitDelete = async () => {
        setDeleting(true)
        try {
            await apiDeleteCarFinancing(carId)
            toast.push(
                <Notification type="success" title="Financing removed" />,
            )
            setDeleteOpen(false)
            load()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(error, 'Something went wrong')}
                />,
            )
        } finally {
            setDeleting(false)
        }
    }

    if (forbidden) {
        return (
            <Card bodyClass="p-8">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <LiBank className="text-4xl text-gray-400" />
                    <h5 className="dark:text-gray-100">
                        Financial data is restricted
                    </h5>
                    <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                        Your role does not have access to this vehicle&apos;s
                        financing and profitability figures.
                    </p>
                </div>
            </Card>
        )
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <KpiGroupSkeleton />
                    <KpiGroupSkeleton />
                </div>
                <CardSkeleton />
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        )
    }

    if (failed || !data) {
        return (
            <Card bodyClass="p-6">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Could not load this vehicle&apos;s statistics.
                </p>
            </Card>
        )
    }

    const { kpis, utilization, financing_progress: financing } = data
    const installments = data.installments ?? []
    const hasFinancing = Boolean(financing?.has_financing)

    const utilizationSegments: DonutSegment[] = [
        {
            name: 'Rented',
            value: utilization.rented_days,
            color: colors.emerald.chart,
        },
        {
            name: 'Maintenance',
            value: utilization.maintenance_days,
            color: colors.orange.chart,
        },
        {
            name: 'Idle',
            value: utilization.idle_days,
            color: colors.gray.chart,
        },
    ]

    const expenseSegments: DonutSegment[] = data.expenses_by_type.map(
        (item, index) => ({
            name: humanize(item.type),
            value: item.amount,
            color: donutPalette[index % donutPalette.length],
        }),
    )

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <KpiGroupCard
                    title="Profitability"
                    tone="success"
                    Icon={LuTrendingUp}
                    metrics={[
                        {
                            label: 'Revenue (paid)',
                            value: MAD(kpis.total_revenue),
                            hint: `${kpis.payback_percent.toFixed(0)}% of purchase paid back`,
                        },
                        {
                            label: 'Operating profit',
                            value: MAD(kpis.operating_profit),
                            hint: `${MAD(kpis.profit_per_day)} / day`,
                        },
                    ]}
                />
                <KpiGroupCard
                    title="Cash & financing"
                    tone="primary"
                    Icon={LuWallet}
                    metrics={[
                        {
                            label: 'Net cash position',
                            value: MAD(kpis.net_cash_position),
                            hint: `${kpis.days_in_service} days in service`,
                        },
                        {
                            label: 'Installments paid',
                            value: MAD(kpis.installments_paid),
                            hint: `${MAD(kpis.down_payment)} down payment`,
                        },
                    ]}
                />
            </div>

            <Card
                header={{
                    content: (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex rounded-lg border border-gray-300 p-0.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 heading-text">
                                        <LiBarChartUp className="text-xl" />
                                    </div>
                                </div>
                                <div>
                                    <h6 className="font-semibold">
                                        Financing progress
                                    </h6>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Installments settled and capital paid
                                        back
                                    </p>
                                </div>
                            </div>
                            {canManage && (
                                <div className="flex items-center gap-2">
                                    {hasFinancing ? (
                                        <>
                                            <Button
                                                variant="default"
                                                icon={<LiEdit2 />}
                                                onClick={() =>
                                                    setFinancingOpen(true)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="default"
                                                className="text-error hover:text-error"
                                                icon={<LiTrash />}
                                                onClick={() =>
                                                    setDeleteOpen(true)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            icon={<LiAdd />}
                                            onClick={() =>
                                                setFinancingOpen(true)
                                            }
                                        >
                                            Add financing
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ),
                }}
            >
                {!hasFinancing || !financing ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                        <LiBank className="text-3xl text-gray-400" />
                        <div>
                            <p className="font-medium heading-text dark:text-gray-100">
                                No financing set up yet
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Record the purchase and its installment plan to
                                track payback.
                            </p>
                        </div>
                        {canManage && (
                            <Button
                                icon={<LiAdd />}
                                onClick={() => setFinancingOpen(true)}
                            >
                                Add financing
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    Installments settled
                                </span>
                                <span className="text-lg font-bold heading-text">
                                    {financing.progress_percent}%
                                </span>
                            </div>
                            <SegmentedProgressBar
                                segments={60}
                                percent={financing.progress_percent}
                                filledClass={colors.emerald.bg}
                                gap={2}
                                height={28}
                            />
                            <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                    {financing.installments_paid_count} of{' '}
                                    {financing.installments_count} paid ·{' '}
                                    {MAD(financing.installments_paid_amount)}
                                </span>
                                <span>
                                    {MAD(
                                        financing.installments_remaining_amount,
                                    )}{' '}
                                    remaining
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    Capital paid back
                                </span>
                                <span className="text-lg font-bold heading-text">
                                    {financing.payback_percent}%
                                </span>
                            </div>
                            <SegmentedProgressBar
                                segments={60}
                                percent={Math.min(
                                    100,
                                    financing.payback_percent,
                                )}
                                filledClass={colors.blue.bg}
                                gap={2}
                                height={28}
                            />
                            <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                    {MAD(kpis.total_revenue)} of{' '}
                                    {MAD(kpis.purchase_price)}
                                </span>
                                <span>
                                    {MAD(kpis.remaining_to_payback)} to go
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 border-t border-gray-200 pt-3 sm:grid-cols-3 dark:border-gray-700">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Lender
                                </p>
                                <p className="text-sm font-medium heading-text">
                                    {financing.lender ?? '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Purchase date
                                </p>
                                <p className="text-sm font-medium heading-text">
                                    {formatDate(financing.purchase_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Next installment
                                </p>
                                <p className="text-sm font-medium heading-text">
                                    {financing.next_installment
                                        ? `${MAD(financing.next_installment.amount)} · ${formatDate(financing.next_installment.due_date)}`
                                        : 'Fully paid'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            <Card
                header={{
                    content: (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex rounded-lg border border-gray-300 p-0.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 heading-text">
                                        <LiSpeedometer className="text-xl" />
                                    </div>
                                </div>
                                <div>
                                    <h6 className="font-semibold">
                                        Cash flow
                                    </h6>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Revenue, expenses and installments per
                                        month
                                    </p>
                                </div>
                            </div>
                            <div className="w-44">
                                <Select
                                    options={periodOptions}
                                    value={
                                        periodOptions.find(
                                            (option) =>
                                                option.value === String(months),
                                        ) ?? null
                                    }
                                    onChange={(option) =>
                                        setMonths(
                                            Number(option?.value ?? '12'),
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ),
                }}
            >
                <div className="space-y-4">
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                        <div className="flex items-baseline gap-2">
                            <h3>{MAD(periodRevenue)}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                revenue this period
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span
                                className={`text-lg font-semibold ${periodNet >= 0 ? 'text-success' : 'text-error'}`}
                            >
                                {MAD(periodNet)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                net cash
                            </span>
                        </div>
                    </div>
                    <BarChart
                        data={chartData}
                        height={300}
                        xAxisConfig={{ dataKey: 'month' }}
                        barConfig={[
                            {
                                dataKey: 'revenue',
                                name: 'Revenue',
                                fill: colors.emerald.chart,
                            },
                            {
                                dataKey: 'expenses',
                                name: 'Expenses',
                                fill: colors.rose.chart,
                            },
                            {
                                dataKey: 'installments',
                                name: 'Installments',
                                fill: colors.blue.chart,
                            },
                        ]}
                        tooltipContentConfig={{
                            valueFormatter: (value: number) => MAD(value),
                        }}
                    >
                        <Line
                            type="monotone"
                            dataKey="net"
                            name="Net"
                            stroke={colors.purple.chart}
                            strokeWidth={2}
                            dot={false}
                        />
                    </BarChart>
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <DonutCard
                    title="Utilization"
                    subtitle="How the service window was spent"
                    Icon={LiTask}
                    segments={utilizationSegments}
                    total={utilization.days_in_service}
                    totalLabel="Days in service"
                    formatValue={(value) => `${value} d`}
                />
                <DonutCard
                    title="Expenses by type"
                    subtitle="Costs booked to this vehicle"
                    Icon={LiReceipt}
                    segments={expenseSegments}
                    total={expenseSegments.reduce(
                        (sum, segment) => sum + segment.value,
                        0,
                    )}
                    totalLabel="Total expenses"
                    formatValue={(value) => MAD(value)}
                />
            </div>

            <Card bodyClass="p-0">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <h6>Installment schedule</h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {installments.length} installment
                        {installments.length === 1 ? '' : 's'}
                    </p>
                </div>
                <div className="max-h-[420px] overflow-auto">
                    <Table className="text-nowrap">
                        <THead>
                            <Tr>
                                <Th>#</Th>
                                <Th>Due date</Th>
                                <Th className="text-right">Amount</Th>
                                <Th>Status</Th>
                                <Th>Paid date</Th>
                                <Th>Reference</Th>
                                {canManage && (
                                    <Th className="text-right">Action</Th>
                                )}
                            </Tr>
                        </THead>
                        <TBody>
                            {installments.length === 0 ? (
                                <Tr>
                                    <Td colSpan={canManage ? 7 : 6}>
                                        <span className="block py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                                            No installments yet.
                                        </span>
                                    </Td>
                                </Tr>
                            ) : (
                                installments.map((installment) => (
                                    <Tr key={installment.id}>
                                        <Td>
                                            {installment.installment_number}
                                        </Td>
                                        <Td>
                                            {formatDate(
                                                installment.due_date,
                                            )}
                                        </Td>
                                        <Td className="text-right">
                                            <span className="font-semibold dark:text-gray-100">
                                                {MAD(installment.amount)}
                                            </span>
                                        </Td>
                                        <Td>
                                            <Tag
                                                className={`capitalize ${tagToneClass[installmentStatusTone[installment.status]]}`}
                                            >
                                                {installment.status}
                                            </Tag>
                                        </Td>
                                        <Td>
                                            {formatDate(
                                                installment.paid_date,
                                            )}
                                        </Td>
                                        <Td>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {installment.reference ?? '—'}
                                            </span>
                                        </Td>
                                        {canManage && (
                                            <Td className="text-right">
                                                {installment.status ===
                                                'paid' ? (
                                                    <span className="text-xs text-gray-400">
                                                        —
                                                    </span>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="link"
                                                        className="px-2 text-success hover:text-success"
                                                        onClick={() => {
                                                            setPayDate(
                                                                dayjs().format(
                                                                    'YYYY-MM-DD',
                                                                ),
                                                            )
                                                            setPayReference('')
                                                            setPayTarget(
                                                                installment,
                                                            )
                                                        }}
                                                    >
                                                        Mark paid
                                                    </Button>
                                                )}
                                            </Td>
                                        )}
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    </Table>
                </div>
            </Card>

            <Dialog
                isOpen={financingOpen}
                onClose={() => setFinancingOpen(false)}
                width={720}
                className="max-h-[90vh] overflow-y-auto"
            >
                <h5 className="mb-6 text-base font-bold dark:text-gray-100">
                    {hasFinancing ? 'Edit financing' : 'Add financing'}
                </h5>
                <CarFinancingDialog
                    carId={carId}
                    financing={data.financing}
                    isOpen={financingOpen}
                    onClose={() => setFinancingOpen(false)}
                    onSaved={load}
                />
            </Dialog>

            <Dialog
                isOpen={Boolean(payTarget)}
                onClose={() => setPayTarget(null)}
                width={440}
            >
                <h5 className="mb-2 text-base font-bold dark:text-gray-100">
                    Mark installment as paid
                </h5>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {payTarget
                        ? `#${payTarget.installment_number} · ${MAD(payTarget.amount)} due ${formatDate(payTarget.due_date)}`
                        : ''}
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Paid date
                        </label>
                        <Input
                            type="date"
                            value={payDate}
                            onChange={(e) => setPayDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Reference (optional)
                        </label>
                        <Input
                            placeholder="Cheque or receipt number"
                            value={payReference}
                            onChange={(e) => setPayReference(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setPayTarget(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        loading={paying}
                        disabled={!payDate}
                        onClick={submitPay}
                    >
                        Mark paid
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                width={420}
            >
                <h5 className="mb-2 text-base font-bold dark:text-gray-100">
                    Remove financing
                </h5>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    This deletes the financing record and its installment
                    schedule. This cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setDeleteOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        className="bg-error hover:bg-error"
                        loading={deleting}
                        onClick={submitDelete}
                    >
                        Remove
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default CarStatistics
