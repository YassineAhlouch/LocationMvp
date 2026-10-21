import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { PieChart } from '@/components/shared/Chart'
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
import type { OutstandingKpi } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

const statusChartColors: Record<string, string> = {
    pending: kpiColor.pending,
    confirmed: kpiColor.booked,
    reserved: kpiColor.free,
    active: kpiColor.paid,
    completed: kpiColor.refunded,
}

/**
 * Outstanding payments drill-down: the debt book — who still owes what, how
 * much each booking has collected so far and how the debt splits across
 * booking statuses. A stock, so the period picker does not move it.
 */
const OutstandingModule = ({
    detail,
    loading,
}: KpiModuleProps<OutstandingKpi>) => {
    const { t } = useTranslation()

    const statusLabel = useMemo(() => labelMap(reservationStatusOptions), [])
    const paymentLabel = useMemo(() => labelMap(paymentStatusOptions), [])

    const headline = detail?.headline
    const rows = detail?.rows ?? []
    const breakdown = detail?.breakdown ?? []
    const collected = rows.reduce((sum, row) => sum + row.paid_amount, 0)
    const billed = collected + (headline?.value ?? 0)

    return (
        <div className="space-y-4">
            <KpiMetrics
                loading={loading}
                items={[
                    {
                        key: 'amount',
                        label: t('kpi.outstanding.amount', 'Outstanding'),
                        value: money(headline?.value ?? 0),
                        tone: 'text-rose-600 dark:text-rose-400',
                    },
                    {
                        key: 'reservations',
                        label: t('kpi.outstanding.reservations', 'Bookings owing'),
                        value: String(headline?.reservations ?? 0),
                    },
                    {
                        key: 'billed',
                        label: t('kpi.outstanding.billed', 'Billed on those bookings'),
                        value: money(billed),
                    },
                    {
                        key: 'collected',
                        label: t('kpi.outstanding.collected', 'Already collected'),
                        value: money(collected),
                        tone: 'text-emerald-600 dark:text-emerald-400',
                    },
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <KpiSection
                    title={t('kpi.outstanding.byStatus', 'Debt by booking status')}
                    description={t(
                        'kpi.outstanding.byStatusHint',
                        'Where the money is tied up across the booking lifecycle.',
                    )}
                >
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.outstanding.settled', 'Everything is settled.')}
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
                                format={money}
                                labelHeader={t('kpi.column.status', 'Status')}
                                valueHeader={t('kpi.column.due', 'Outstanding')}
                                countHeader={t('kpi.column.count', 'Count')}
                                shareHeader={t('kpi.column.share', 'Share')}
                            />
                        </>
                    )}
                </KpiSection>

                <Card className="lg:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h5>{t('kpi.outstanding.rows', 'Bookings still owing')}</h5>
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
                                <Th>{t('kpi.column.pickup', 'Pickup')}</Th>
                                <Th className="text-right">
                                    {t('kpi.column.total', 'Total')}
                                </Th>
                                <Th className="text-right">
                                    {t('kpi.column.paid', 'Paid')}
                                </Th>
                                <Th className="text-right">
                                    {t('kpi.column.due', 'Outstanding')}
                                </Th>
                            </Tr>
                        </THead>
                        {loading ? (
                            <KpiTableSkeleton columns={6} />
                        ) : (
                            <TBody>
                                {rows.length === 0 ? (
                                    <KpiEmpty
                                        colSpan={6}
                                        message={t(
                                            'kpi.outstanding.settled',
                                            'Everything is settled.',
                                        )}
                                    />
                                ) : (
                                    rows.map((row) => (
                                        <Tr key={row.id} className="text-nowrap">
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
                                            <Td>
                                                <div>{row.client ?? '—'}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {row.car ?? '—'}
                                                </div>
                                            </Td>
                                            <Td>{formatDateTime(row.pickup_datetime)}</Td>
                                            <KpiNumericTd>
                                                {money(row.total_amount)}
                                            </KpiNumericTd>
                                            <KpiNumericTd>
                                                {money(row.paid_amount)}
                                            </KpiNumericTd>
                                            <KpiNumericTd>
                                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                    {money(row.due_amount)}
                                                </span>
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

export default OutstandingModule
