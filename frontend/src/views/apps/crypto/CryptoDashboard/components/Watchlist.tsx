import { useNavigate } from 'react-router'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import { ComposedChart, Line, ResponsiveContainer } from 'recharts'
import classNames from '@/utils/classNames'
import formatCurrency from '@/utils/formatCurrency'
import formatNumber from '@/utils/formatNumber'
import { colors } from '@/constants/colors.constant'

import type { DashboardWatchlistItem } from '../types'

const getChangeColorClass = (value: number) => {
    if (value > 0) return 'text-success'
    if (value < 0) return 'text-error'
    return ''
}

type WatchlistProps = {
    watchlist: DashboardWatchlistItem[]
    onBuyClick: (item: DashboardWatchlistItem) => void
}

const SparklineCell = ({
    data,
    change,
}: {
    data: number[]
    change: number
}) => {
    const chartColor = change >= 0 ? colors.emerald.chart : colors.red.chart
    const chartData = data.map((value, index) => ({ index, value }))

    return (
        <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={chartColor}
                        strokeWidth={1.5}
                        dot={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

const Watchlist = ({ watchlist, onBuyClick }: WatchlistProps) => {
    const navigate = useNavigate()

    const handleSeeAllClick = () => {
        navigate('/apps/crypto/market')
    }

    return (
        <Card bodyClass="p-0">
            <div className="flex items-center justify-between p-4">
                <h5 className="font-semibold heading-text">Watchlist</h5>
                <Button onClick={handleSeeAllClick}>View All</Button>
            </div>
            <Table hoverable>
                <Table.THead>
                    <Table.Tr>
                        <Table.Th>NAME</Table.Th>
                        <Table.Th>PRICE</Table.Th>
                        <Table.Th>LAST 7 DAYS</Table.Th>
                        <Table.Th>CHANGE</Table.Th>
                        <Table.Th>MARKET CAP</Table.Th>
                        <Table.Th className="w-20"></Table.Th>
                    </Table.Tr>
                </Table.THead>
                <Table.TBody>
                    {watchlist.map((item) => (
                        <Table.Tr key={item.id}>
                            <Table.Td>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.icon}
                                        alt={item.name}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium heading-text">
                                            {item.name}
                                        </div>
                                        <div className="text-xs fomt-medium text-nowrap">
                                            {item.symbol} ·{' '}
                                            {item.apy.toFixed(2)}% APY
                                        </div>
                                    </div>
                                </div>
                            </Table.Td>
                            <Table.Td>
                                <span className="heading-text font-medium">
                                    {formatCurrency(item.price)}
                                </span>
                            </Table.Td>
                            <Table.Td>
                                <SparklineCell
                                    data={item.sparklineData}
                                    change={item.change24h}
                                />
                            </Table.Td>
                            <Table.Td>
                                <span
                                    className={classNames(
                                        'font-medium',
                                        getChangeColorClass(item.change24h),
                                    )}
                                >
                                    {item.change24h >= 0 ? '+' : ''}
                                    {item.change24h.toFixed(2)}%
                                </span>
                            </Table.Td>
                            <Table.Td>
                                <span className="heading-text">
                                    ${formatNumber(item.marketCap)}
                                </span>
                            </Table.Td>
                            <Table.Td>
                                <Button onClick={() => onBuyClick(item)}>
                                    Buy
                                </Button>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.TBody>
            </Table>
        </Card>
    )
}

export default Watchlist
