import { useMemo } from 'react'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { LineChart, PieChart } from '@/components/shared/Chart'
import useDirection from '@/utils/hooks/useDirection'
import useTranslation from '@/utils/hooks/useTranslation'
import classNames from '@/utils/classNames'
import {
    formatDateTime,
    money,
    paymentStatusOptions,
    paymentStatusTone,
    reservationStatusOptions,
    reservationStatusTone,
    tagToneClass,
} from '../../shared'
import {
    KpiBreakdownTable,
    KpiEmpty,
    KpiMetrics,
    KpiNumericTd,
    KpiSection,
    KpiTableSkeleton,
    kpiColor,
    labelMap,
} from '../shared'
import type { ReservationsKpi } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

const statusChartColors: Record<string, string> = {
    pending: kpiColor.pending,
    confirmed: kpiColor.booked,
    reserved: kpiColor.free,
    active: kpiColor.paid,
    completed: kpiColor.refunded,
    cancelled: '#a3a3a3',
    no_show: '#d4d4d4',
}

/**
 * Reservations drill-down: the bookings picked up in the period — the exact
 * set the card counts, cancelled included — their status split and a day-by-
 * day series of how many started.
 */
const ReservationsModule = ({
    detail,
    previous,
    loading,
}: KpiModuleProps<ReservationsKpi>) => {
    const { t } = useTranslation()
    const [direction] = useDirection()

    const statusLabel = useMemo(() => labelMap(reservationStatusOptions), [])
    const paymentLabel = useMemo(() => labelMap(paymentStatusOptions), [])

    const chartData = useMemo(() => {
        if (!detail) {
            return []
        }

        return detail.trend.labels.map((label, index) => ({
            date: dayjs(label).format('DD/MM'),
            count: detail.trend.count[index] ?? 0,
        }))
    }, [detail])

    const headline = detail?.headline
    const rows = detail?.rows ?? []
    const breakdown = detail?.breakdown ?? []

    return (
        <div className="space-y-4">
            <KpiMetrics
                loading={loading}
                items={[
                    {
                        key: 'total',
                        label: t('kpi.reservations.total', 'Reservations in the period'),
                        value: String(headline?.value ?? 0),
                    },
                    {
                        key: 'active',
                        label: t('kpi.reservations.active', 'Currently on hire'),
                        value: String(headline?.currently_active ?? 0),
                        tone: 'text-emerald-600 dark:text-emerald-400',
                    },
                    {
                        key: 'statuses',
                        label: t('kpi.reservations.statuses', 'Distinct statuses'),
                        value: String(breakdown.length),
                    },
                    {
                        key: 'rows',
                        label: t('kpi.reservations.rows', 'Bookings listed'),
                        value: String(detail?.rows_total ?? 0),
                    },
                ]}
            />

            <KpiSection
                title={t('kpi.reservations.trend', 'Bookings starting, day by day')}
                description={t(
                    'kpi.reservations.trendHint',
                    'Reservations whose pickup falls on each day of the window.',
                )}
            >
                <LineChart
                    data={chartData}
                    height={280}
                    lineConfig={[{ type: 'linear', dataKey: 'count' }]}
                    xAxisConfig={{ dataKey: 'date', axisLine: false, tickLine: false }}
                    yAxisConfig={{
                        hide: false,
                        axisLine: false,
                        tickLine: false,
                        orientation: direction === 'rtl' ? 'right' : 'left',
                        width: 40,
                        allowDecimals: false,
                    }}
                    tooltipContentConfig={{
                        nameFormatter: () =>
                            t('kpi.reservations.pickups', 'Bookings'),
                    }}
                />
            </KpiSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <KpiSection title={t('kpi.reservations.byStatus', 'By status')}>
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.noData', 'Nothing in this period.')}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <PieChart
                                    data={breakdown.map((segment) => ({
                                        name: statusLabel(segment.key),
                                        value: segment.value,
                                    }))}
                                    height={200}
                                    pieConfig={{
                                        dataKey: 'value',
                                        nameKey: 'name',
                                        cx: '50%',
                                        cy: '50%',
                                        innerRadius: 60,
                                        outerRadius: 80,
                                        paddingAngle: 2,
                                        cornerRadius: 4,
                                    }}
                                    cellConfig={breakdown.map((segment) => ({
                                        fill:
                                            statusChartColors[segment.key] ??
                                            kpiColor.free,
                                    }))}
                                />
                            </div>
                            <KpiBreakdownTable
                                segments={breakdown}
                                labelOf={statusLabel}
                                labelHeader={t('kpi.column.status', 'Status')}
                                valueHeader={t('kpi.column.count', 'Count')}
                                countHeader={t('kpi.column.count', 'Count')}
                                shareHeader={t('kpi.column.share', 'Share')}
                            />
                        </>
                    )}
                </KpiSection>

                <Card className="lg:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h5>{t('kpi.reservations.rows', 'Bookings')}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t('kpi.showing', 'Showing {{shown}} of {{total}}', {
                                shown: rows.length,
                                total: detail?.rows_total ?? 0,
                            })}
                        </span>
                    </div>
                    <Table compact>
                        <THead>
                            <Tr>
                                <Th>{t('kpi.column.reservation', 'Reservation')}</Th>
                                <Th>{t('kpi.column.client', 'Client')}</Th>
                                <Th>{t('kpi.column.car', 'Car')}</Th>
                                <Th>{t('kpi.column.pickup', 'Pickup')}</Th>
                                <Th className="text-right">
                                    {t('kpi.column.amount', 'Amount')}
                                </Th>
                            </Tr>
                        </THead>
                        {loading ? (
                            <KpiTableSkeleton columns={5} />
                        ) : (
                            <TBody>
                                {rows.length === 0 ? (
                                    <KpiEmpty
                                        colSpan={5}
                                        message={t(
                                            'kpi.noData',
                                            'Nothing in this period.',
                                        )}
                                    />
                                ) : (
                                    rows.map((row) => (
                                        <Tr key={row.id}>
                                            <Td>
                                                <div className="font-medium">
                                                    {row.reservation_number ?? '—'}
                                                </div>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Tag
                                                        className={classNames(
                                                            'border-0',
                                                            tagToneClass[
                                                                reservationStatusTone[
                                                                    row.status ??
                                                                        'pending'
                                                                ]
                                                            ],
                                                        )}
                                                    >
                                                        {row.status
                                                            ? statusLabel(row.status)
                                                            : '—'}
                                                    </Tag>
                                                    {row.payment_status && (
                                                        <Tag
                                                            className={classNames(
                                                                'border-0',
                                                                tagToneClass[
                                                                    paymentStatusTone[
                                                                        row.payment_status
                                                                    ]
                                                                ],
                                                            )}
                                                        >
                                                            {paymentLabel(
                                                                row.payment_status,
                                                            )}
                                                        </Tag>
                                                    )}
                                                </div>
                                            </Td>
                                            <Td>{row.client ?? '—'}</Td>
                                            <Td>{row.car ?? '—'}</Td>
                                            <Td>{formatDateTime(row.pickup_datetime)}</Td>
                                            <KpiNumericTd>
                                                {money(row.total_amount)}
                                            </KpiNumericTd>
                                        </Tr>
                                    ))
                                )}
                            </TBody>
                        )}
                    </Table>
                </Card>
            </div>

            {previous && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('kpi.comparisonHint', 'Previous period: {{value}}.', {
                        value: String(previous.headline.value),
                    })}
                </p>
            )}
        </div>
    )
}

export default ReservationsModule
