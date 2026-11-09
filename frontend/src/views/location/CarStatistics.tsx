import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import dayjs from 'dayjs'
import { Line } from 'recharts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Table from '@/components/ui/Table'
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
import useTranslation from '@/utils/hooks/useTranslation'
import { money, currencyCode, apiErrorMessage, formatDate, tagToneClass } from './shared'
import type {
    CarInstallment,
    CarStatistics as CarStatisticsData,
    InstallmentStatus,
} from '@/@types/location'
import type { DateRange } from '@/components/shared/PeriodPicker'
import type { TagTone } from './shared'

const { Tr, Th, Td, THead, TBody } = Table

type CarStatisticsProps = {
    carId: number
    range: DateRange
}

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
    const { t } = useTranslation()
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
                    {t('cars.overview.statistics.noData', 'No data to chart yet.')}
                </p>
            ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex-shrink-0 self-center">
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
                    <div className="min-w-0 flex-1 space-y-4">
                        <div>
                            <div className="mb-1 font-medium heading-text">
                                {totalLabel}
                            </div>
                            <h3 className="break-all tabular-nums">
                                {formatValue(total)}
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {segments.map((segment) => (
                                <div
                                    key={segment.name}
                                    className="flex min-w-0 items-center justify-between gap-3"
                                >
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div
                                            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    segment.color,
                                            }}
                                        />
                                        <span className="truncate font-medium">
                                            {segment.name}
                                        </span>
                                    </div>
                                    <span className="min-w-0 break-all text-right font-medium heading-text">
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

const CarStatistics = ({ carId, range }: CarStatisticsProps) => {
    const { t } = useTranslation()
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

    const [financingOpen, setFinancingOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [payTarget, setPayTarget] = useState<CarInstallment | null>(null)
    const [payDate, setPayDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [payReference, setPayReference] = useState('')
    const [payAmount, setPayAmount] = useState('')
    const [paying, setPaying] = useState(false)

    const load = useCallback(() => {
        setLoading(true)
        setFailed(false)
        setForbidden(false)
        apiGetCarStatistics(carId, {
            from: dayjs(range.from).format('YYYY-MM-DD'),
            to: dayjs(range.to).format('YYYY-MM-DD'),
        })
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
    }, [carId, range])

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

    const openPayDialog = (installment: CarInstallment) => {
        setPayDate(installment.paid_date ?? dayjs().format('YYYY-MM-DD'))
        setPayReference(installment.reference ?? '')
        setPayAmount(String(installment.paid_amount ?? installment.amount))
        setPayTarget(installment)
    }

    const submitPay = async () => {
        if (!payTarget) {
            return
        }
        const amount = Number(payAmount)
        if (!Number.isFinite(amount) || amount < 0) {
            toast.push(
                <Notification
                    type="danger"
                    title={t(
                        'cars.overview.statistics.invalidPaidAmount',
                        'Enter a valid paid amount',
                    )}
                />,
            )
            return
        }
        setPaying(true)
        try {
            await apiPayCarInstallment(carId, payTarget.id, {
                paid_date: payDate,
                reference: payReference.trim() || null,
                paid_amount: amount,
            })
            toast.push(
                <Notification
                    type="success"
                    title={
                        payTarget.status === 'paid'
                            ? t(
                                  'cars.overview.statistics.installmentUpdated',
                                  'Installment payment updated!',
                              )
                            : t(
                                  'cars.overview.statistics.installmentPaid',
                                  'Installment paid!',
                              )
                    }
                />,
            )
            setPayTarget(null)
            load()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        t(
                            'cars.overview.statistics.genericError',
                            'Something went wrong',
                        ),
                    )}
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
                <Notification
                    type="success"
                    title={t(
                        'cars.overview.statistics.financingRemoved',
                        'Financing removed',
                    )}
                />,
            )
            setDeleteOpen(false)
            load()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        t(
                            'cars.overview.statistics.genericError',
                            'Something went wrong',
                        ),
                    )}
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
                        {t(
                            'cars.overview.statistics.restrictedTitle',
                            'Financial data is restricted',
                        )}
                    </h5>
                    <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            'cars.overview.statistics.restrictedDesc',
                            "Your role does not have access to this vehicle's financing and profitability figures.",
                        )}
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
            name: t('cars.status.rented', 'Rented'),
            value: utilization.rented_days,
            color: colors.emerald.chart,
        },
        {
            name: t('cars.status.maintenance', 'Maintenance'),
            value: utilization.maintenance_days,
            color: colors.orange.chart,
        },
        {
            name: t('cars.overview.statistics.idle', 'Idle'),
            value: utilization.idle_days,
            color: colors.gray.chart,
        },
    ]

    const expenseSegments: DonutSegment[] = data.expenses_by_type.map(
        (item, index) => ({
            name: t(`expenses.type.${item.type}`, humanize(item.type)),
            value: item.amount,
            color: donutPalette[index % donutPalette.length],
        }),
    )

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <KpiGroupCard
                    title={t('cars.overview.statistics.profitability', 'Profitability')}
                    tone="success"
                    Icon={LuTrendingUp}
                    metrics={[
                        {
                            label: t('cars.overview.revenuePaid', 'Revenue (paid)'),
                            value: money(kpis.total_revenue),
                            hint: t('cars.overview.statistics.payback', {
                                n: kpis.payback_percent.toFixed(0),
                            }),
                        },
                        {
                            label: t(
                                'cars.overview.statistics.operatingProfit',
                                'Operating profit',
                            ),
                            value: money(kpis.operating_profit),
                            hint: `${money(kpis.profit_per_day)} / ${t('cars.overview.statistics.day', 'day')}`,
                        },
                    ]}
                />
                <KpiGroupCard
                    title={t('cars.overview.statistics.cashFinancing', 'Cash & financing')}
                    tone="primary"
                    Icon={LuWallet}
                    metrics={[
                        {
                            label: t(
                                'cars.overview.statistics.netCashPosition',
                                'Net cash position',
                            ),
                            value: money(kpis.net_cash_position),
                            hint: `${kpis.days_in_service} ${t('cars.overview.statistics.daysInService', 'days in service')}`,
                        },
                        {
                            label: t(
                                'cars.overview.statistics.installmentsPaid',
                                'Installments paid',
                            ),
                            value: money(kpis.installments_paid),
                            hint: `${money(kpis.down_payment)} ${t('cars.overview.statistics.downPayment', 'down payment')}`,
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
                                        {t(
                                            'cars.overview.statistics.financingProgress',
                                            'Financing progress',
                                        )}
                                    </h6>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t(
                                            'cars.overview.statistics.financingSub',
                                            'Installments settled and capital paid back',
                                        )}
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
                                                {t(
                                                    'cars.actions.edit',
                                                    'Edit',
                                                )}
                                            </Button>
                                            <Button
                                                variant="default"
                                                className="text-error hover:text-error"
                                                icon={<LiTrash />}
                                                onClick={() =>
                                                    setDeleteOpen(true)
                                                }
                                            >
                                                {t(
                                                    'cars.overview.statistics.remove',
                                                    'Remove',
                                                )}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            icon={<LiAdd />}
                                            onClick={() =>
                                                setFinancingOpen(true)
                                            }
                                        >
                                            {t(
                                                'cars.overview.statistics.addFinancing',
                                                'Add financing',
                                            )}
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
                                {t(
                                    'cars.overview.statistics.noFinancingTitle',
                                    'No financing set up yet',
                                )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    'cars.overview.statistics.noFinancingDesc',
                                    'Record the purchase and its installment plan to track payback.',
                                )}
                            </p>
                        </div>
                        {canManage && (
                            <Button
                                icon={<LiAdd />}
                                onClick={() => setFinancingOpen(true)}
                            >
                                {t(
                                    'cars.overview.statistics.addFinancing',
                                    'Add financing',
                                )}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    {t(
                                        'cars.overview.statistics.installmentsSettled',
                                        'Installments settled',
                                    )}
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
                                    {financing.installments_paid_count} /{' '}
                                    {financing.installments_count}{' '}
                                    {t(
                                        'cars.overview.statistics.paidWord',
                                        'paid',
                                    )}{' '}
                                    ·{' '}
                                    {money(financing.installments_paid_amount)}
                                </span>
                                <span>
                                    {money(
                                        financing.installments_remaining_amount,
                                    )}{' '}
                                    {t(
                                        'cars.overview.statistics.remaining',
                                        'remaining',
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    {t(
                                        'cars.overview.statistics.capitalPaidBack',
                                        'Capital paid back',
                                    )}
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
                                    {money(kpis.total_revenue)} /{' '}
                                    {money(kpis.purchase_price)}
                                </span>
                                <span>
                                    {money(kpis.remaining_to_payback)}{' '}
                                    {t('cars.overview.statistics.toGo', 'to go')}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 border-t border-gray-200 pt-3 sm:grid-cols-3 dark:border-gray-700">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('activity.field.lender', 'Lender')}
                                </p>
                                <p className="text-sm font-medium heading-text">
                                    {financing.lender ?? '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        'activity.field.purchase_date',
                                        'Purchase date',
                                    )}
                                </p>
                                <p className="text-sm font-medium heading-text">
                                    {formatDate(financing.purchase_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        'cars.overview.statistics.nextInstallment',
                                        'Next installment',
                                    )}
                                </p>
                                <p className="text-sm font-medium heading-text">
                                    {financing.next_installment
                                        ? `${money(financing.next_installment.amount)} · ${formatDate(financing.next_installment.due_date)}`
                                        : t(
                                              'cars.overview.statistics.fullyPaid',
                                              'Fully paid',
                                          )}
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
                                    {t('cars.overview.statistics.cashFlow', 'Cash flow')}
                                </h6>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        'cars.overview.statistics.cashFlowSub',
                                        'Revenue, expenses and installments per month',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    ),
                }}
            >
                <div className="space-y-4">
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                        <div className="flex items-baseline gap-2">
                            <h3>{money(periodRevenue)}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    'cars.overview.statistics.revenueThisPeriod',
                                    'revenue this period',
                                )}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span
                                className={`text-lg font-semibold ${periodNet >= 0 ? 'text-success' : 'text-error'}`}
                            >
                                {money(periodNet)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t('cars.overview.statistics.netCash', 'net cash')}
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
                                name: t('dashboard.revenue', 'Revenue'),
                                fill: colors.emerald.chart,
                            },
                            {
                                dataKey: 'expenses',
                                name: t('dashboard.expenses', 'Expenses'),
                                fill: colors.rose.chart,
                            },
                            {
                                dataKey: 'installments',
                                name: t(
                                    'cars.overview.statistics.seriesInstallments',
                                    'Installments',
                                ),
                                fill: colors.blue.chart,
                            },
                        ]}
                        tooltipContentConfig={{
                            valueFormatter: (value: number) => money(value),
                        }}
                    >
                        <Line
                            type="monotone"
                            dataKey="net"
                            name={t('cars.overview.statistics.seriesNet', 'Net')}
                            stroke={colors.purple.chart}
                            strokeWidth={2}
                            dot={false}
                        />
                    </BarChart>
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <DonutCard
                    title={t('cars.overview.statistics.utilization', 'Utilization')}
                    subtitle={t(
                        'cars.overview.statistics.utilizationSub',
                        'How the selected period was spent',
                    )}
                    Icon={LiTask}
                    segments={utilizationSegments}
                    total={utilization.days_in_service}
                    totalLabel={t(
                        'cars.overview.statistics.daysInServiceLabel',
                        'Days in service',
                    )}
                    formatValue={(value) => `${value} ${t('cars.overview.statistics.dayShort', 'd')}`}
                />
                <DonutCard
                    title={t('cars.overview.statistics.expensesByType', 'Expenses by type')}
                    subtitle={t(
                        'cars.overview.statistics.expensesByTypeSub',
                        'Costs booked within the selected period',
                    )}
                    Icon={LiReceipt}
                    segments={expenseSegments}
                    total={expenseSegments.reduce(
                        (sum, segment) => sum + segment.value,
                        0,
                    )}
                    totalLabel={t('cars.overview.statistics.totalExpenses', 'Total expenses')}
                    /* fr-MA groups amounts with NBSP; real spaces let a big
                       total wrap at the group boundaries instead of bleeding. */
                    formatValue={(value) =>
                        money(value).replace(/\u202F|\u00A0/g, ' ')
                    }
                />
            </div>

            <Card bodyClass="p-0">
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <h6>
                        {t(
                            'cars.overview.statistics.installmentSchedule',
                            'Installment schedule',
                        )}
                    </h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('cars.overview.statistics.installmentsCount', {
                            n: installments.length,
                        })}
                    </p>
                </div>
                <div className="max-h-[420px] overflow-auto">
                    <Table className="text-nowrap">
                        <THead>
                            <Tr>
                                <Th>#</Th>
                                <Th>
                                    {t(
                                        'cars.overview.table.dueDate',
                                        'Due date',
                                    )}
                                </Th>
                                <Th className="text-right">
                                    {t('cars.overview.table.amount', 'Amount')}
                                </Th>
                                <Th className="text-right">
                                    {t('activity.field.paid_amount', 'Paid amount')}
                                </Th>
                                <Th>
                                    {t('cars.overview.table.status', 'Status')}
                                </Th>
                                <Th>
                                    {t(
                                        'cars.overview.table.paidDate',
                                        'Paid date',
                                    )}
                                </Th>
                                <Th>
                                    {t('activity.field.reference', 'Reference')}
                                </Th>
                                {canManage && (
                                    <Th className="text-right">
                                        {t('activity.columns.action', 'Action')}
                                    </Th>
                                )}
                            </Tr>
                        </THead>
                        <TBody>
                            {installments.length === 0 ? (
                                <Tr>
                                    <Td colSpan={canManage ? 8 : 7}>
                                        <span className="block py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                                            {t(
                                                'cars.overview.statistics.noInstallments',
                                                'No installments yet.',
                                            )}
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
                                                {money(installment.amount)}
                                            </span>
                                        </Td>
                                        <Td className="text-right">
                                            {installment.paid_amount ===
                                            null ? (
                                                <span className="text-gray-400">
                                                    —
                                                </span>
                                            ) : (
                                                <span
                                                    className={`font-semibold ${
                                                        installment.paid_amount <
                                                        installment.amount
                                                            ? 'text-warning'
                                                            : 'text-success'
                                                    }`}
                                                >
                                                    {money(
                                                        installment.paid_amount,
                                                    )}
                                                </span>
                                            )}
                                        </Td>
                                        <Td>
                                            <Tag
                                                className={`capitalize ${tagToneClass[installmentStatusTone[installment.status]]}`}
                                            >
                                                {t(
                                                    `expenses.status.${installment.status}`,
                                                    installment.status,
                                                )}
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
                                                <Button
                                                    size="sm"
                                                    variant="link"
                                                    className={
                                                        installment.status ===
                                                        'paid'
                                                            ? 'px-2 text-primary hover:text-primary'
                                                            : 'px-2 text-success hover:text-success'
                                                    }
                                                    onClick={() =>
                                                        openPayDialog(
                                                            installment,
                                                        )
                                                    }
                                                >
                                                    {installment.status ===
                                                    'paid'
                                                        ? t(
                                                              'cars.actions.edit',
                                                              'Edit',
                                                          )
                                                        : t(
                                                              'cars.overview.statistics.markPaid',
                                                              'Mark paid',
                                                          )}
                                                </Button>
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
                    {t(
                        'cars.overview.statistics.' +
                            (hasFinancing ? 'editFinancing' : 'addFinancing'),
                        hasFinancing ? 'Edit financing' : 'Add financing',
                    )}
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
                    {t(
                        'cars.overview.statistics.recordPayment',
                        'Record installment payment',
                    )}
                </h5>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {payTarget
                        ? `#${payTarget.installment_number} · ${money(payTarget.amount)} ${t('cars.overview.statistics.scheduled', 'scheduled')} · ${t('cars.overview.statistics.due', 'due')} ${formatDate(payTarget.due_date)}`
                        : ''}
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            {t('activity.field.paid_amount', 'Paid amount')} (
                            {currencyCode()})
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                        />
                        {payTarget &&
                            Number.isFinite(Number(payAmount)) &&
                            Number(payAmount) < payTarget.amount && (
                                <p className="mt-1 text-xs text-warning">
                                    {t(
                                        'cars.overview.statistics.lessThanScheduled',
                                        'Less than the scheduled',
                                    )}{' '}
                                    {money(payTarget.amount)}{' '}
                                    {t(
                                        'cars.overview.statistics.unpaidRemainder',
                                        '— the difference still counts as unpaid financing.',
                                    )}
                                </p>
                            )}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            {t('cars.overview.table.paidDate', 'Paid date')}
                        </label>
                        <Input
                            type="date"
                            value={payDate}
                            onChange={(e) => setPayDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            {t(
                                'cars.overview.statistics.referenceOptional',
                                'Reference (optional)',
                            )}
                        </label>
                        <Input
                            placeholder={t(
                                'cars.overview.statistics.chequePlaceholder',
                                'Cheque or receipt number',
                            )}
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
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        loading={paying}
                        disabled={!payDate || payAmount.trim() === ''}
                        onClick={submitPay}
                    >
                        {t(
                            'cars.overview.statistics.savePayment',
                            'Save payment',
                        )}
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                width={420}
            >
                <h5 className="mb-2 text-base font-bold dark:text-gray-100">
                    {t(
                        'cars.overview.statistics.removeFinancing',
                        'Remove financing',
                    )}
                </h5>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    {t(
                        'cars.overview.statistics.deleteFinancingDesc',
                        'This deletes the financing record and its installment schedule. This cannot be undone.',
                    )}
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setDeleteOpen(false)}
                    >
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        className="bg-error hover:bg-error"
                        loading={deleting}
                        onClick={submitDelete}
                    >
                        {t('cars.overview.statistics.remove', 'Remove')}
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default CarStatistics
