import { useMemo } from 'react'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { BarChart, PieChart } from '@/components/shared/Chart'
import useDirection from '@/utils/hooks/useDirection'
import useTranslation from '@/utils/hooks/useTranslation'
import classNames from '@/utils/classNames'
import { expenseStatusTone, expenseTypeOptions, money, tagToneClass } from '../../shared'
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
import type { ExpensesKpi } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

const typeChartColors = [
    kpiColor.pending,
    kpiColor.paid,
    kpiColor.refunded,
    kpiColor.booked,
    kpiColor.free,
]

/**
 * Expenses drill-down: the two buckets the card adds up — bills paid inside
 * the window and bills booked while still pending — split by type and listed
 * with the date that places each one in the period.
 */
const ExpensesModule = ({
    detail,
    previous,
    loading,
}: KpiModuleProps<ExpensesKpi>) => {
    const { t } = useTranslation()
    const [direction] = useDirection()

    const typeLabel = useMemo(() => labelMap(expenseTypeOptions), [])

    const chartData = useMemo(() => {
        if (!detail) {
            return []
        }

        return detail.trend.labels.map((label, index) => ({
            date: dayjs(label).format('DD/MM'),
            paid: detail.trend.paid[index] ?? 0,
            pending: detail.trend.pending[index] ?? 0,
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
                        label: t('kpi.expenses.total', 'Total for the period'),
                        value: money(headline?.value ?? 0),
                    },
                    {
                        key: 'paid',
                        label: t('kpi.expenses.paid', 'Paid'),
                        value: money(headline?.paid ?? 0),
                        tone: 'text-emerald-600 dark:text-emerald-400',
                    },
                    {
                        key: 'pending',
                        label: t('kpi.expenses.pending', 'Booked, still pending'),
                        value: money(headline?.pending ?? 0),
                        tone: 'text-orange-600 dark:text-orange-400',
                    },
                    {
                        key: 'overdue',
                        label: t('kpi.expenses.overdue', 'Overdue bills'),
                        value: String(headline?.overdue_count ?? 0),
                        tone: 'text-rose-600 dark:text-rose-400',
                    },
                ]}
            />

            <KpiSection
                title={t('kpi.expenses.trend', 'Bills, day by day')}
                description={t(
                    'kpi.expenses.trendHint',
                    'Paid bills bucketed by payment date, pending bills by the day they were booked.',
                )}
            >
                <BarChart
                    data={chartData}
                    height={300}
                    xAxisConfig={{ dataKey: 'date', axisLine: false, tickLine: false }}
                    yAxisConfig={{
                        hide: false,
                        axisLine: false,
                        tickLine: false,
                        orientation: direction === 'rtl' ? 'right' : 'left',
                        width: 50,
                    }}
                    barConfig={[
                        { dataKey: 'paid', name: 'paid', fill: kpiColor.paid },
                        { dataKey: 'pending', name: 'pending', fill: kpiColor.pending },
                    ]}
                    tooltipContentConfig={{
                        valueFormatter: (value: number) => money(value),
                        nameFormatter: (name: string) =>
                            name === 'paid'
                                ? t('kpi.expenses.paid', 'Paid')
                                : t('kpi.expenses.pending', 'Booked, still pending'),
                    }}
                />
            </KpiSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <KpiSection title={t('kpi.expenses.byType', 'By expense type')}>
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.noData', 'Nothing in this period.')}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <PieChart
                                    data={breakdown.map((segment) => ({
                                        name: typeLabel(segment.key),
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
                                        fill: typeChartColors[index % typeChartColors.length],
                                    }))}
                                />
                            </div>
                            <KpiBreakdownTable
                                segments={breakdown}
                                labelOf={typeLabel}
                                format={money}
                                labelHeader={t('kpi.column.type', 'Type')}
                                valueHeader={t('kpi.column.amount', 'Amount')}
                                countHeader={t('kpi.column.count', 'Count')}
                                shareHeader={t('kpi.column.share', 'Share')}
                            />
                        </>
                    )}
                </KpiSection>

                <Card className="lg:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h5>{t('kpi.expenses.rows', 'Bills in the period')}</h5>
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
                                <Th>{t('kpi.column.title', 'Bill')}</Th>
                                <Th>{t('kpi.column.car', 'Car')}</Th>
                                <Th>{t('kpi.column.type', 'Type')}</Th>
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
                                                {row.period_date
                                                    ? dayjs(row.period_date).format(
                                                          'DD/MM/YYYY',
                                                      )
                                                    : '—'}
                                            </Td>
                                            <Td>
                                                <span className="inline-flex items-center gap-2">
                                                    {row.title ?? '—'}
                                                    {row.status && (
                                                        <Tag
                                                            className={classNames(
                                                                'border-0',
                                                                tagToneClass[
                                                                    expenseStatusTone[
                                                                        row.status
                                                                    ]
                                                                ],
                                                            )}
                                                        >
                                                            {row.status}
                                                        </Tag>
                                                    )}
                                                </span>
                                            </Td>
                                            <Td>{row.car ?? '—'}</Td>
                                            <Td>
                                                {row.type ? typeLabel(row.type) : '—'}
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
                    {t('kpi.comparisonHint', 'Previous period: {{value}}.', {
                        value: money(previous.headline.value),
                    })}
                </p>
            )}
        </div>
    )
}

export default ExpensesModule
