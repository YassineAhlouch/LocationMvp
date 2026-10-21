import { useMemo } from 'react'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { PieChart } from '@/components/shared/Chart'
import useTranslation from '@/utils/hooks/useTranslation'
import classNames from '@/utils/classNames'
import {
    clientSourceOptions,
    formatDate,
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
import type { NewClientsKpi } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

const sourceChartColors = [
    kpiColor.booked,
    kpiColor.paid,
    kpiColor.pending,
    kpiColor.refunded,
    kpiColor.free,
]

/**
 * New clients drill-down: the signups inside the window, where they came from
 * and how much each one has booked since — the roster behind the card.
 */
const NewClientsModule = ({
    detail,
    previous,
    loading,
}: KpiModuleProps<NewClientsKpi>) => {
    const { t } = useTranslation()

    const sourceLabel = useMemo(() => labelMap(clientSourceOptions), [])

    const headline = detail?.headline
    const rows = detail?.rows ?? []
    const breakdown = detail?.breakdown ?? []

    const chartData = useMemo(() => {
        if (!detail) {
            return []
        }

        return detail.trend.labels.map((label, index) => ({
            date: dayjs(label).format('DD/MM'),
            count: detail.trend.count[index] ?? 0,
        }))
    }, [detail])

    const booked = rows.reduce((sum, row) => sum + row.reservations_count, 0)

    return (
        <div className="space-y-4">
            <KpiMetrics
                loading={loading}
                items={[
                    {
                        key: 'total',
                        label: t('kpi.newClients.total', 'New clients'),
                        value: String(headline?.value ?? 0),
                        tone: 'text-indigo-600 dark:text-indigo-400',
                    },
                    {
                        key: 'booked',
                        label: t(
                            'kpi.newClients.booked',
                            'Bookings from those clients',
                        ),
                        value: String(booked),
                    },
                    {
                        key: 'sources',
                        label: t('kpi.newClients.sources', 'Sources'),
                        value: String(breakdown.length),
                    },
                    {
                        key: 'peak',
                        label: t('kpi.newClients.peak', 'Best day'),
                        value: String(
                            detail?.trend.count.length
                                ? Math.max(...detail.trend.count)
                                : 0,
                        ),
                    },
                ]}
            />

            <KpiSection
                title={t('kpi.newClients.trend', 'Signups, day by day')}
                description={t(
                    'kpi.newClients.trendHint',
                    'Clients created on each day of the window, by their registration date.',
                )}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.noData', 'Nothing in this period.')}
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <PieChart
                                data={breakdown.map((segment) => ({
                                    name: sourceLabel(segment.key),
                                    value: segment.value,
                                }))}
                                height={220}
                                pieConfig={{
                                    dataKey: 'value',
                                    nameKey: 'name',
                                    cx: '50%',
                                    cy: '50%',
                                    innerRadius: 65,
                                    outerRadius: 85,
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                }}
                                cellConfig={breakdown.map((_, index) => ({
                                    fill: sourceChartColors[
                                        index % sourceChartColors.length
                                    ],
                                }))}
                            />
                        </div>
                    )}
                    <KpiBreakdownTable
                        segments={breakdown}
                        labelOf={sourceLabel}
                        labelHeader={t('kpi.column.source', 'Source')}
                        valueHeader={t('kpi.column.clients', 'Clients')}
                        countHeader={t('kpi.column.count', 'Count')}
                        shareHeader={t('kpi.column.share', 'Share')}
                    />
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    {t('kpi.newClients.peakHint', 'Busiest day: {{count}} signups.', {
                        count: chartData.length
                            ? Math.max(...chartData.map((point) => point.count))
                            : 0,
                    })}
                </p>
            </KpiSection>

            <Card>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h5>{t('kpi.newClients.rows', 'Clients who signed up')}</h5>
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
                            <Th>{t('kpi.column.client', 'Client')}</Th>
                            <Th>{t('kpi.column.contact', 'Contact')}</Th>
                            <Th>{t('kpi.column.source', 'Source')}</Th>
                            <Th className="text-right">
                                {t('kpi.column.reservations', 'Bookings')}
                            </Th>
                            <Th className="text-right">
                                {t('kpi.column.date', 'Signed up')}
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
                                                {row.full_name ?? '—'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {row.city ?? '—'}
                                            </div>
                                        </Td>
                                        <Td>
                                            <div>{row.phone ?? '—'}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {row.email ?? '—'}
                                            </div>
                                        </Td>
                                        <Td>
                                            {row.source ? (
                                                <Tag
                                                    className={classNames(
                                                        'border-0',
                                                        tagToneClass['primary'],
                                                    )}
                                                >
                                                    {sourceLabel(row.source)}
                                                </Tag>
                                            ) : (
                                                '—'
                                            )}
                                        </Td>
                                        <KpiNumericTd>
                                            {row.reservations_count}
                                        </KpiNumericTd>
                                        <KpiNumericTd>
                                            {formatDate(row.created_at)}
                                        </KpiNumericTd>
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    )}
                </Table>
            </Card>

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

export default NewClientsModule
