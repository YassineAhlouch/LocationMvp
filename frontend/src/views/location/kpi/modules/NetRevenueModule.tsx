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
    money,
    paymentMethodOptions,
    paymentRecordStatusTone,
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
import type { NetRevenueKpi } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

const methodChartColors = [kpiColor.paid, kpiColor.booked, kpiColor.pending]

/**
 * Net revenue drill-down: the cash that came in for the period, how it split
 * across payment methods and every money movement behind it.
 */
const NetRevenueModule = ({
    detail,
    previous,
    loading,
}: KpiModuleProps<NetRevenueKpi>) => {
    const { t } = useTranslation()
    const [direction] = useDirection()

    const methodLabel = useMemo(() => labelMap(paymentMethodOptions(t)), [t])

    const chartData = useMemo(() => {
        if (!detail) {
            return []
        }

        return detail.trend.labels.map((label, index) => ({
            date: dayjs(label).format('DD/MM'),
            paid: detail.trend.paid[index] ?? 0,
            pending: detail.trend.pending[index] ?? 0,
            refunded: detail.trend.refunded[index] ?? 0,
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
                        key: 'paid',
                        label: t('kpi.netRevenue.paid', 'Paid in'),
                        value: money(headline?.paid ?? 0),
                        tone: 'text-emerald-600 dark:text-emerald-400',
                    },
                    {
                        key: 'refunded',
                        label: t('kpi.netRevenue.refunded', 'Refunded'),
                        value: money(headline?.refunded ?? 0),
                        tone: 'text-rose-600 dark:text-rose-400',
                    },
                    {
                        key: 'pending',
                        label: t('kpi.netRevenue.pending', 'Pending'),
                        value: money(headline?.pending ?? 0),
                        tone: 'text-orange-600 dark:text-orange-400',
                    },
                    {
                        key: 'net',
                        label: t('kpi.netRevenue.net', 'Net inflow'),
                        value: money(headline?.value ?? 0),
                        tone: 'text-indigo-600 dark:text-indigo-400',
                    },
                ]}
            />

            <KpiSection
                title={t('kpi.netRevenue.trend', 'Money in, day by day')}
                description={t(
                    'kpi.netRevenue.trendHint',
                    'Paid payments bucketed by payment date — the same cash basis the card uses.',
                )}
            >
                <LineChart
                    data={chartData}
                    height={300}
                    lineConfig={[
                        { type: 'linear', dataKey: 'paid' },
                        { type: 'linear', dataKey: 'pending' },
                        { type: 'linear', dataKey: 'refunded' },
                    ]}
                    xAxisConfig={{
                        dataKey: 'date',
                        axisLine: false,
                        tickLine: false,
                    }}
                    yAxisConfig={{
                        hide: false,
                        axisLine: false,
                        tickLine: false,
                        orientation: direction === 'rtl' ? 'right' : 'left',
                        width: 50,
                    }}
                    tooltipContentConfig={{
                        valueFormatter: (value: number) => money(value),
                        nameFormatter: (name: string) =>
                            name === 'paid'
                                ? t('kpi.netRevenue.paid', 'Paid in')
                                : name === 'pending'
                                  ? t('kpi.netRevenue.pending', 'Pending')
                                  : t('kpi.netRevenue.refunded', 'Refunded'),
                    }}
                />
            </KpiSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <KpiSection title={t('kpi.netRevenue.byMethod', 'Paid by method')}>
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.noData', 'Nothing in this period.')}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <PieChart
                                    data={breakdown.map((segment) => ({
                                        name: methodLabel(segment.key),
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
                                    cellConfig={breakdown.map((_, index) => ({
                                        fill: methodChartColors[
                                            index % methodChartColors.length
                                        ],
                                    }))}
                                />
                            </div>
                            <KpiBreakdownTable
                                segments={breakdown}
                                labelOf={methodLabel}
                                format={money}
                                labelHeader={t('kpi.column.method', 'Method')}
                                valueHeader={t('kpi.column.amount', 'Amount')}
                                countHeader={t('kpi.column.count', 'Count')}
                                shareHeader={t('kpi.column.share', 'Share')}
                            />
                        </>
                    )}
                </KpiSection>

                <Card className="lg:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h5>{t('kpi.netRevenue.rows', 'Money movements')}</h5>
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
                                <Th>{t('kpi.column.date', 'Date')}</Th>
                                <Th>{t('kpi.column.reservation', 'Reservation')}</Th>
                                <Th>{t('kpi.column.client', 'Client')}</Th>
                                <Th>{t('kpi.column.method', 'Method')}</Th>
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
                                                {dayjs(row.payment_date).format(
                                                    'DD/MM/YYYY',
                                                )}
                                            </Td>
                                            <Td>{row.reservation_number ?? '—'}</Td>
                                            <Td>{row.client ?? '—'}</Td>
                                            <Td>
                                                <span className="inline-flex items-center gap-2">
                                                    {row.method
                                                        ? methodLabel(row.method)
                                                        : '—'}
                                                    <Tag
                                                        className={classNames(
                                                            'border-0',
                                                            tagToneClass[
                                                                paymentRecordStatusTone[
                                                                    row.status
                                                                ]
                                                            ],
                                                        )}
                                                    >
                                                        {row.status}
                                                    </Tag>
                                                </span>
                                            </Td>
                                            <KpiNumericTd>
                                                {money(row.amount)}
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
                    {t(
                        'kpi.comparisonHint',
                        'Previous period: {{value}}.',
                        { value: money(previous.headline.value) },
                    )}
                </p>
            )}
        </div>
    )
}

export default NetRevenueModule
