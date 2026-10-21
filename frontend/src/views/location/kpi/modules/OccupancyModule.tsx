import { useMemo } from 'react'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { BarChart, PieChart } from '@/components/shared/Chart'
import useDirection from '@/utils/hooks/useDirection'
import useTranslation from '@/utils/hooks/useTranslation'
import { money } from '../../shared'
import {
    KpiBreakdownTable,
    KpiEmpty,
    KpiMetrics,
    KpiNumericTd,
    KpiSection,
    KpiTableSkeleton,
    kpiColor,
} from '../shared'
import type { OccupancyKpi } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

/**
 * Occupancy drill-down: the booked-versus-free split behind the rate, how
 * many cars were on hire each day and which cars sat idle.
 */
const OccupancyModule = ({
    detail,
    previous,
    loading,
}: KpiModuleProps<OccupancyKpi>) => {
    const { t } = useTranslation()
    const [direction] = useDirection()

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
    const totalCars = headline?.total_cars ?? 0

    const segmentLabel = (key: string) =>
        key === 'booked'
            ? t('kpi.occupancy.booked', 'Nights booked')
            : t('kpi.occupancy.free', 'Nights free')

    return (
        <div className="space-y-4">
            <KpiMetrics
                loading={loading}
                items={[
                    {
                        key: 'rate',
                        label: t('kpi.occupancy.rate', 'Occupancy rate'),
                        value: `${((headline?.value ?? 0) * 100).toFixed(1)}%`,
                        tone: 'text-indigo-600 dark:text-indigo-400',
                    },
                    {
                        key: 'booked',
                        label: t('kpi.occupancy.booked', 'Nights booked'),
                        value: String(headline?.booked_days ?? 0),
                    },
                    {
                        key: 'available',
                        label: t('kpi.occupancy.available', 'Nights available'),
                        value: String(headline?.available_days ?? 0),
                    },
                    {
                        key: 'cars',
                        label: t('kpi.occupancy.cars', 'Cars in the fleet'),
                        value: String(totalCars),
                    },
                ]}
            />

            <KpiSection
                title={t('kpi.occupancy.trend', 'Cars on hire, day by day')}
                description={t(
                    'kpi.occupancy.trendHint',
                    'How many vehicles each day of the window had a hire running — the daily shape of the rate.',
                )}
            >
                <BarChart
                    data={chartData}
                    height={280}
                    xAxisConfig={{ dataKey: 'date', axisLine: false, tickLine: false }}
                    yAxisConfig={{
                        hide: false,
                        axisLine: false,
                        tickLine: false,
                        orientation: direction === 'rtl' ? 'right' : 'left',
                        width: 40,
                        allowDecimals: false,
                        domain: [0, Math.max(totalCars, 1)],
                    }}
                    barConfig={[
                        { dataKey: 'count', name: 'count', fill: kpiColor.booked },
                    ]}
                    tooltipContentConfig={{
                        nameFormatter: () =>
                            t('kpi.occupancy.carsOnHire', 'Cars on hire'),
                    }}
                />
            </KpiSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <KpiSection title={t('kpi.occupancy.split', 'Booked vs free')}>
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.noData', 'Nothing in this period.')}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <PieChart
                                    data={breakdown.map((segment) => ({
                                        name: segmentLabel(segment.key),
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
                                            segment.key === 'booked'
                                                ? kpiColor.booked
                                                : kpiColor.free,
                                    }))}
                                />
                            </div>
                            <KpiBreakdownTable
                                segments={breakdown}
                                labelOf={segmentLabel}
                                labelHeader={t('kpi.column.type', 'Type')}
                                valueHeader={t('kpi.occupancy.nights', 'Nights')}
                                countHeader={t('kpi.column.count', 'Count')}
                                shareHeader={t('kpi.column.share', 'Share')}
                            />
                        </>
                    )}
                </KpiSection>

                <Card className="lg:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h5>{t('kpi.occupancy.rows', 'Per car')}</h5>
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
                                <Th>{t('kpi.column.car', 'Car')}</Th>
                                <Th className="text-right">
                                    {t('kpi.occupancy.nightsBooked', 'Nights booked')}
                                </Th>
                                <Th className="text-right">
                                    {t('kpi.occupancy.utilization', 'Utilization')}
                                </Th>
                                <Th className="text-right">
                                    {t('kpi.column.amount', 'Revenue')}
                                </Th>
                            </Tr>
                        </THead>
                        {loading ? (
                            <KpiTableSkeleton columns={4} />
                        ) : (
                            <TBody>
                                {rows.length === 0 ? (
                                    <KpiEmpty
                                        colSpan={4}
                                        message={t(
                                            'kpi.occupancy.noFleet',
                                            'No cars in the fleet yet.',
                                        )}
                                    />
                                ) : (
                                    rows.map((row) => (
                                        <Tr key={row.car_id}>
                                            <Td>
                                                <div className="font-medium">
                                                    {row.registration_number}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {[row.brand, row.model]
                                                        .filter(Boolean)
                                                        .join(' ') || '—'}
                                                </div>
                                            </Td>
                                            <KpiNumericTd>
                                                {row.booked_days}
                                            </KpiNumericTd>
                                            <KpiNumericTd>
                                                {(row.utilization * 100).toFixed(1)}%
                                            </KpiNumericTd>
                                            <KpiNumericTd>
                                                {money(row.revenue)}
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
                        value: `${(previous.headline.value * 100).toFixed(1)}%`,
                    })}
                </p>
            )}
        </div>
    )
}

export default OccupancyModule
