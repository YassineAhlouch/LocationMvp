import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { PieChart } from '@/components/shared/Chart'
import useTranslation from '@/utils/hooks/useTranslation'
import classNames from '@/utils/classNames'
import { formatDate, tagToneClass } from '../../shared'
import {
    KpiBreakdownTable,
    KpiEmpty,
    KpiMetrics,
    KpiNumericTd,
    KpiSection,
    KpiTableSkeleton,
    kpiColor,
} from '../shared'
import type { FleetAttentionKpi } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

/**
 * Fleet attention drill-down: the cars parked in maintenance and the ones
 * already past their service mileage, with how far past each one is. A stock,
 * so the period picker does not move it.
 */
const FleetAttentionModule = ({
    detail,
    loading,
}: KpiModuleProps<FleetAttentionKpi>) => {
    const { t } = useTranslation()

    const headline = detail?.headline
    const rows = detail?.rows ?? []
    const breakdown = detail?.breakdown ?? []

    const reasonLabel = (key: string) =>
        key === 'maintenance'
            ? t('kpi.attention.maintenance', 'In maintenance')
            : t('kpi.attention.serviceOverdue', 'Service overdue')

    return (
        <div className="space-y-4">
            <KpiMetrics
                loading={loading}
                items={[
                    {
                        key: 'total',
                        label: t('kpi.attention.total', 'Cars needing attention'),
                        value: String(headline?.value ?? 0),
                        tone: 'text-amber-600 dark:text-amber-400',
                    },
                    {
                        key: 'maintenance',
                        label: t('kpi.attention.maintenance', 'In maintenance'),
                        value: String(headline?.maintenance ?? 0),
                    },
                    {
                        key: 'overdue',
                        label: t(
                            'kpi.attention.serviceOverdue',
                            'Service overdue',
                        ),
                        value: String(headline?.service_overdue ?? 0),
                    },
                    {
                        key: 'fleet',
                        label: t('kpi.attention.rows', 'Cars listed'),
                        value: String(detail?.rows_total ?? 0),
                    },
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <KpiSection
                    title={t('kpi.attention.split', 'Why they need attention')}
                    description={t(
                        'kpi.attention.splitHint',
                        'A car can be in both buckets — parked and past its service.',
                    )}
                >
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.attention.clear', 'The whole fleet is healthy.')}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <PieChart
                                    data={breakdown.map((segment) => ({
                                        name: reasonLabel(segment.key),
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
                                            segment.key === 'maintenance'
                                                ? kpiColor.pending
                                                : kpiColor.refunded,
                                    }))}
                                />
                            </div>
                            <KpiBreakdownTable
                                segments={breakdown}
                                labelOf={reasonLabel}
                                labelHeader={t('kpi.column.reason', 'Reason')}
                                valueHeader={t('kpi.column.count', 'Count')}
                                countHeader={t('kpi.column.count', 'Count')}
                                shareHeader={t('kpi.column.share', 'Share')}
                            />
                        </>
                    )}
                </KpiSection>

                <Card className="lg:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h5>{t('kpi.attention.rows', 'Cars needing attention')}</h5>
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
                                <Th>{t('kpi.column.reason', 'Reason')}</Th>
                                <Th className="text-right">
                                    {t('kpi.attention.mileage', 'Mileage')}
                                </Th>
                                <Th className="text-right">
                                    {t('kpi.attention.gap', 'Past service by')}
                                </Th>
                                <Th className="text-right">
                                    {t('kpi.attention.lastService', 'Last service')}
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
                                            'kpi.attention.clear',
                                            'The whole fleet is healthy.',
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
                                            <Td>
                                                <div className="flex flex-wrap gap-1">
                                                    {row.in_maintenance && (
                                                        <Tag
                                                            className={classNames(
                                                                'border-0',
                                                                tagToneClass[
                                                                    'warning'
                                                                ],
                                                            )}
                                                        >
                                                            {t(
                                                                'kpi.attention.maintenance',
                                                                'In maintenance',
                                                            )}
                                                        </Tag>
                                                    )}
                                                    {row.service_overdue && (
                                                        <Tag
                                                            className={classNames(
                                                                'border-0',
                                                                tagToneClass['error'],
                                                            )}
                                                        >
                                                            {t(
                                                                'kpi.attention.serviceOverdue',
                                                                'Service overdue',
                                                            )}
                                                        </Tag>
                                                    )}
                                                </div>
                                            </Td>
                                            <KpiNumericTd>
                                                {row.current_mileage !== null
                                                    ? `${row.current_mileage.toLocaleString()} km`
                                                    : '—'}
                                                {row.next_service_mileage !== null && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {t('kpi.attention.nextAt', 'due at')}{' '}
                                                        {row.next_service_mileage.toLocaleString()} km
                                                    </div>
                                                )}
                                            </KpiNumericTd>
                                            <KpiNumericTd>
                                                {row.service_overdue ? (
                                                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                        {row.service_gap.toLocaleString()} km
                                                    </span>
                                                ) : (
                                                    '—'
                                                )}
                                            </KpiNumericTd>
                                            <KpiNumericTd>
                                                {row.last_maintenance_at
                                                    ? formatDate(row.last_maintenance_at)
                                                    : '—'}
                                            </KpiNumericTd>
                                        </Tr>
                                    ))
                                )}
                            </TBody>
                        )}
                    </Table>
                </Card>
            </div>
        </div>
    )
}

export default FleetAttentionModule
