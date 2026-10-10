import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Skeleton from '@/components/ui/Skeleton'
import { BarChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import { apiGetClientReports } from '@/services/LocationService'
import { LiCalendar, LiMoney, LiProfiles, LiWalletMoney } from '@/icons'
import { MAD, clientStatusTone, formatDate, tagToneClass } from '../shared'
import { ReportEmpty, ReportHeader, ReportMetrics } from './shared'
import { resolveReportRange } from './shared'
import type { ReportMetric, ReportRange } from './shared'
import type { ClientReport } from '@/@types/location'
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
    const [range, setRange] = useState<ReportRange>('thisMonth')
    const [clients, setClients] = useState<ClientReport[]>([])
    const [loading, setLoading] = useState(true)

    const period = useMemo(() => resolveReportRange(range), [range])

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
            title: 'Active clients',
            value: clients.length,
            icon: <LiProfiles />,
            color: colors.blue,
            formatter: (value) => value.toLocaleString(),
        },
        {
            key: 'revenue',
            title: 'Revenue',
            value: totals.revenue,
            icon: <LiWalletMoney />,
            color: colors.emerald,
        },
        {
            key: 'reservations',
            title: 'Reservations',
            value: totals.reservations,
            icon: <LiCalendar />,
            color: colors.orange,
            formatter: (value) => value.toLocaleString(),
        },
        {
            key: 'average',
            title: 'Revenue / client',
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
                title="Client performance"
                description="Your best clients ranked by revenue over the period"
                range={range}
                onRangeChange={setRange}
            />

            <ReportMetrics items={metrics} loading={loading} />

            <div className="mb-6">
                <Card>
                    <div className="mb-4">
                        <h5>Top clients by revenue</h5>
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
                                valueFormatter: (value: number) => MAD(value),
                                nameFormatter: () => 'Revenue',
                            }}
                        />
                    ) : (
                        <ReportEmpty message="No client data available" />
                    )}
                </Card>
            </div>

            <Card bodyClass="p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h5>Client performance</h5>
                </div>
                {loading ? (
                    <Table hoverable={false}>
                        <THead>
                            <Tr>
                                <Th>Client</Th>
                                <Th>Status</Th>
                                <Th>Reservations</Th>
                                <Th>Revenue</Th>
                                <Th>Avg / rental</Th>
                                <Th>Last rental</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Tr key={index}>
                                    {Array.from({ length: 6 }).map(
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
                                <Th>Client</Th>
                                <Th>Status</Th>
                                <Th>Reservations</Th>
                                <Th>Revenue</Th>
                                <Th>Avg / rental</Th>
                                <Th>Last rental</Th>
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
                                                {client.status}
                                            </Tag>
                                        ) : (
                                            '—'
                                        )}
                                    </Td>
                                    <Td className="heading-text">
                                        {client.reservations}
                                    </Td>
                                    <Td className="heading-text">
                                        {MAD(client.revenue)}
                                    </Td>
                                    <Td className="heading-text">
                                        {MAD(client.average_spend)}
                                    </Td>
                                    <Td className="text-gray-600 dark:text-gray-300">
                                        {formatDate(client.last_rental)}
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : (
                    <ReportEmpty message="No client data available" />
                )}
            </Card>
        </Container>
    )
}

export default PerformanceClients
