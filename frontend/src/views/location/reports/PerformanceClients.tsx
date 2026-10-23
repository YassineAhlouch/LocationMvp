import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { BarChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import { apiGetClientReports } from '@/services/LocationService'
import { LiCalendar, LiEye, LiMoney, LiProfiles, LiWalletMoney } from '@/icons'
import { money, clientStatusTone, formatDate, tagToneClass } from '../shared'
import useTranslation from '@/utils/hooks/useTranslation'
import { ReportEmpty, ReportHeader, ReportMetrics } from './shared'
import { rangeToQuery } from './shared'
import ReservationHistoryDrawer from './ReservationHistoryDrawer'
import type { ReportMetric } from './shared'
import type { ClientReport } from '@/@types/location'
import { currentMonthRange } from '@/components/shared/PeriodPicker'
import type { DateRange } from '@/components/shared/PeriodPicker'
const { Tr, Th, Td, THead, TBody } = Table

const compactMAD = (value: number) => {
    if (Math.abs(value) >= 1e6) {
        return `${(value / 1e6).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1e3) {
        return `${(value / 1e3).toFixed(0)}k`
    }
    return `${Math.round(value)}`
}

const PerformanceClients = () => {
    const { t } = useTranslation()
    const [range, setRange] = useState<DateRange>(currentMonthRange)
    const [clients, setClients] = useState<ClientReport[]>([])
    const [loading, setLoading] = useState(true)
    const [historyClient, setHistoryClient] = useState<ClientReport | null>(
        null,
    )

    const period = useMemo(() => rangeToQuery(range), [range])

    const fetchReports = useCallback(() => {
        setLoading(true)
        apiGetClientReports({ from: period.from, to: period.to })
            .then(setClients)
            .catch(() => setClients([]))
            .finally(() => setLoading(false))
    }, [period.from, period.to])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const totals = useMemo(
        () =>
            clients.reduce(
                (acc, client) => ({
                    revenue: acc.revenue + client.revenue,
                    reservations: acc.reservations + client.reservations,
                }),
                { revenue: 0, reservations: 0 },
            ),
        [clients],
    )

    const averagePerClient =
        clients.length > 0 ? totals.revenue / clients.length : 0

    const metrics: ReportMetric[] = [
        {
            key: 'clients',
            title: t('reports.clients.metricClients', 'Active clients'),
            value: clients.length,
            icon: <LiProfiles />,
            color: colors.blue,
            formatter: (value) => value.toLocaleString(),
        },
        {
            key: 'revenue',
            title: t('reports.clients.metricRevenue', 'Revenue'),
            value: totals.revenue,
            icon: <LiWalletMoney />,
            color: colors.emerald,
        },
        {
            key: 'reservations',
            title: t('reports.clients.metricReservations', 'Reservations'),
            value: totals.reservations,
            icon: <LiCalendar />,
            color: colors.orange,
            formatter: (value) => value.toLocaleString(),
        },
        {
            key: 'average',
            title: t('reports.clients.metricAverage', 'Revenue / client'),
            value: averagePerClient,
            icon: <LiMoney />,
            color: colors.purple,
        },
    ]

    const chartData = useMemo(
        () =>
            [...clients]
                .slice(0, 8)
                .map((client) => ({
                    label: client.full_name ?? '—',
                    value: client.revenue,
                })),
        [clients],
    )

    return (
        <Container>
            <ReportHeader
                title={t('reports.clients.title', 'Client performance')}
                description={t(
                    'reports.clients.description',
                    'Your best clients ranked by revenue over the period',
                )}
                range={range}
                onRangeChange={setRange}
            />

            <ReportMetrics items={metrics} loading={loading} />

            <div className="mb-6">
                <Card>
                    <div className="mb-4">
                        <h5>
                            {t(
                                'reports.clients.topClients',
                                'Top clients by revenue',
                            )}
                        </h5>
                    </div>
                    {loading ? (
                        <Skeleton height={280} />
                    ) : chartData.length > 0 ? (
                        <BarChart
                            data={chartData}
                            height={280}
                            barConfig={[
                                {
                                    dataKey: 'value',
                                    fill: colors.blue.chart,
                                    barSize: 26,
                                    radius: [2, 2, 0, 0] as [
                                        number,
                                        number,
                                        number,
                                        number,
                                    ],
                                },
                            ]}
                            xAxisConfig={{ dataKey: 'label' }}
                            yAxisConfig={{
                                tickFormatter: (value: number) =>
                                    compactMAD(value),
                                width: 48,
                            }}
                            tooltipContentConfig={{
                                valueFormatter: (value: number) => money(value),
                                nameFormatter: () =>
                                    t('reports.clients.metricRevenue', 'Revenue'),
                            }}
                        />
                    ) : (
                        <ReportEmpty
                            message={t(
                                'reports.clients.noData',
                                'No client data available',
                            )}
                        />
                    )}
                </Card>
            </div>

            <Card bodyClass="p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h5>{t('reports.clients.title', 'Client performance')}</h5>
                </div>
                {loading ? (
                    <Table hoverable={false}>
                        <THead>
                            <Tr>
                                <Th>{t('reports.clients.columns.client', 'Client')}</Th>
                                <Th>{t('reports.clients.columns.status', 'Status')}</Th>
                                <Th>{t('reports.clients.columns.reservations', 'Reservations')}</Th>
                                <Th>{t('reports.clients.columns.revenue', 'Revenue')}</Th>
                                <Th>{t('reports.clients.columns.average', 'Avg / rental')}</Th>
                                <Th>{t('reports.clients.columns.lastRental', 'Last rental')}</Th>
                                <Th className="text-right">
                                    {t('reports.history.details', 'Details')}
                                </Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Tr key={index}>
                                    {Array.from({ length: 7 }).map(
                                        (__, cellIndex) => (
                                            <Td key={cellIndex}>
                                                <Skeleton
                                                    height={14}
                                                    width={90}
                                                />
                                            </Td>
                                        ),
                                    )}
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : clients.length > 0 ? (
                    <Table>
                        <THead>
                            <Tr>
                                <Th>{t('reports.clients.columns.client', 'Client')}</Th>
                                <Th>{t('reports.clients.columns.status', 'Status')}</Th>
                                <Th>{t('reports.clients.columns.reservations', 'Reservations')}</Th>
                                <Th>{t('reports.clients.columns.revenue', 'Revenue')}</Th>
                                <Th>{t('reports.clients.columns.average', 'Avg / rental')}</Th>
                                <Th>{t('reports.clients.columns.lastRental', 'Last rental')}</Th>
                                <Th className="text-right">
                                    {t('reports.history.details', 'Details')}
                                </Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {clients.map((client) => (
                                <Tr key={client.client_id}>
                                    <Td>
                                        <div>
                                            <span className="font-medium heading-text">
                                                {client.full_name ?? '—'}
                                            </span>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {client.phone ??
                                                    client.email ??
                                                    '—'}
                                            </div>
                                        </div>
                                    </Td>
                                    <Td>
                                        {client.status ? (
                                            <Tag
                                                className={`capitalize ${tagToneClass[clientStatusTone[client.status]]}`}
                                            >
                                                {t(
                                                    `clients.statusOption.${client.status}`,
                                                    client.status,
                                                )}
                                            </Tag>
                                        ) : (
                                            '—'
                                        )}
                                    </Td>
                                    <Td className="heading-text">
                                        {client.reservations}
                                    </Td>
                                    <Td className="heading-text">
                                        {money(client.revenue)}
                                    </Td>
                                    <Td className="heading-text">
                                        {money(client.average_spend)}
                                    </Td>
                                    <Td className="text-gray-600 dark:text-gray-300">
                                        {formatDate(client.last_rental)}
                                    </Td>
                                    <Td className="text-right">
                                        <Button
                                            size="sm"
                                            variant="link"
                                            className="inline-flex items-center gap-1 px-2"
                                            title={t(
                                                'reports.history.details',
                                                'Details',
                                            )}
                                            onClick={() =>
                                                setHistoryClient(client)
                                            }
                                        >
                                            <LiEye className="text-base" />
                                            {t(
                                                'reports.history.details',
                                                'Details',
                                            )}
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : (
                    <ReportEmpty
                        message={t(
                            'reports.clients.noData',
                            'No client data available',
                        )}
                    />
                )}
            </Card>

            <ReservationHistoryDrawer
                isOpen={Boolean(historyClient)}
                onClose={() => setHistoryClient(null)}
                clientId={historyClient?.client_id}
                title={
                    historyClient?.full_name ??
                    t('reports.history.title', 'Reservation history')
                }
                subtitle={t(
                    'reports.history.clientSubtitle',
                    'All reservations for this client',
                )}
            />
        </Container>
    )
}

export default PerformanceClients
