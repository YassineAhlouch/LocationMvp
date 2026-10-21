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
import type { TodayKpi, KpiHandoverRow } from '@/@types/location'
import type { KpiModuleProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

/**
 * Today's handovers drill-down: the cars leaving the garage and the ones
 * coming back, each in schedule order with the client and balance to chase.
 */
const TodayModule = ({ detail, loading }: KpiModuleProps<TodayKpi>) => {
    const { t } = useTranslation()

    const statusLabel = useMemo(() => labelMap(reservationStatusOptions), [])

    const headline = detail?.headline
    const rows = useMemo(() => detail?.rows ?? [], [detail])
    const pickups = useMemo(
        () => rows.filter((row) => row.kind === 'pickup'),
        [rows],
    )
    const returns = useMemo(
        () => rows.filter((row) => row.kind === 'return'),
        [rows],
    )

    const kindLabel = (key: string) =>
        key === 'pickups'
            ? t('kpi.today.pickups', 'Pickups')
            : t('kpi.today.returns', 'Returns')

    const handoverTable = (
        title: string,
        rows: KpiHandoverRow[],
        dateKey: 'pickup_datetime' | 'expected_return_datetime',
    ) => (
        <Card>
            <div className="mb-4 flex items-center justify-between gap-2">
                <h5>{title}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {rows.length}
                </span>
            </div>
            <Table compact>
                <THead>
                    <Tr>
                        <Th>{t('kpi.column.hour', 'Time')}</Th>
                        <Th>{t('kpi.column.reservation', 'Reservation')}</Th>
                        <Th>{t('kpi.column.client', 'Client')}</Th>
                        <Th>{t('kpi.column.car', 'Car')}</Th>
                        <Th className="text-right">
                            {t('kpi.column.total', 'Total')}
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
                                message={t('kpi.today.none', 'Nothing scheduled.')}
                            />
                        ) : (
                            rows.map((row) => (
                                <Tr key={`${row.kind}-${row.id}`}>
                                    <Td>
                                        <span className="font-medium">
                                            {row[dateKey]
                                                ? new Date(
                                                      row[dateKey] as string,
                                                  ).toLocaleTimeString([], {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : '—'}
                                        </span>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDateTime(row[dateKey]).split(' ')[0]}
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="font-medium">
                                            {row.reservation_number ?? '—'}
                                        </div>
                                        {row.status && (
                                            <Tag
                                                className={classNames(
                                                    'mt-1 border-0',
                                                    tagToneClass[
                                                        reservationStatusTone[row.status]
                                                    ],
                                                )}
                                            >
                                                {statusLabel(row.status)}
                                            </Tag>
                                        )}
                                    </Td>
                                    <Td>{row.client ?? '—'}</Td>
                                    <Td>{row.car ?? '—'}</Td>
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
    )

    return (
        <div className="space-y-4">
            <KpiMetrics
                loading={loading}
                items={[
                    {
                        key: 'total',
                        label: t('kpi.today.total', "Today's handovers"),
                        value: String(headline?.value ?? 0),
                    },
                    {
                        key: 'pickups',
                        label: t('kpi.today.pickups', 'Pickups'),
                        value: String(headline?.pickups ?? 0),
                    },
                    {
                        key: 'returns',
                        label: t('kpi.today.returns', 'Returns'),
                        value: String(headline?.returns ?? 0),
                    },
                    {
                        key: 'statuses',
                        label: t('kpi.today.rows', 'Bookings listed'),
                        value: String(detail?.rows_total ?? 0),
                    },
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <KpiSection
                    title={t('kpi.today.split', 'The day at a glance')}
                    description={t(
                        'kpi.today.splitHint',
                        "Today's schedule never depends on the period picker.",
                    )}
                >
                    {(headline?.value ?? 0) === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {t('kpi.today.none', 'Nothing scheduled.')}
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <PieChart
                                    data={(detail?.breakdown ?? []).map(
                                        (segment) => ({
                                            name: kindLabel(segment.key),
                                            value: segment.value,
                                        }),
                                    )}
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
                                    cellConfig={(detail?.breakdown ?? []).map(
                                        (segment) => ({
                                            fill:
                                                segment.key === 'pickups'
                                                    ? kpiColor.paid
                                                    : kpiColor.booked,
                                        }),
                                    )}
                                />
                            </div>
                            <KpiBreakdownTable
                                segments={detail?.breakdown ?? []}
                                labelOf={kindLabel}
                                labelHeader={t('kpi.column.type', 'Type')}
                                valueHeader={t('kpi.column.count', 'Count')}
                                countHeader={t('kpi.column.count', 'Count')}
                                shareHeader={t('kpi.column.share', 'Share')}
                            />
                        </>
                    )}
                </KpiSection>

                <div className="lg:col-span-2 space-y-4">
                    {handoverTable(
                        t('kpi.today.pickupList', 'Going out'),
                        pickups,
                        'pickup_datetime',
                    )}
                    {handoverTable(
                        t('kpi.today.returnList', 'Coming back'),
                        returns,
                        'expected_return_datetime',
                    )}
                </div>
            </div>
        </div>
    )
}

export default TodayModule
