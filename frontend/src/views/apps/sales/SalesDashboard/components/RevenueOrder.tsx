import Card from '@/components/ui/Card'
import Divider from '@/components/shared/Divider'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { LineChart } from '@/components/shared/Chart'
import formatCurrency from '@/utils/formatCurrency'
import formatCurrencyCompact from '@/utils/formatCurrencyCompact'
import formatNumber from '@/utils/formatNumber'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'
import useDirection from '@/utils/hooks/useDirection'
import type { RevenueOrderData, TimeRange } from '../types'

type RevenueOrderProps = {
    data: RevenueOrderData[]
    comparisonData: RevenueOrderData[]
    totalRevenue: number
    change: number
    totalOrders: number
    ordersChange: number
    timeRange: TimeRange
}

const RevenueOrder = ({
    data,
    totalRevenue,
    change,
    totalOrders,
    ordersChange,
}: RevenueOrderProps) => {
    const comparisonEnabled = useSalesDashboardStore(
        (state) => state.comparisonEnabled,
    )

    const [direction] = useDirection()

    const chartData = data.map((item) => ({
        date: item.formattedDate,
        revenue: item.revenue,
        orders: item.orders,
        orderCount: item.orderCount,
        fullDate: item.date,
    }))

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <h5>Revenue & Orders</h5>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4">
                        <div className="">
                            <span>Total Revenue</span>
                            <div className="flex items-center gap-2">
                                <h4>
                                    {formatCurrency(
                                        totalRevenue,
                                        'USD',
                                        'en-US',
                                        0,
                                    )}
                                </h4>
                                {comparisonEnabled && (
                                    <GrowShrinkTag
                                        value={change}
                                        suffix="%"
                                        showIcon={true}
                                    />
                                )}
                            </div>
                        </div>
                        <Divider
                            orientation="vertical"
                            className="hidden sm:block h-12"
                        />
                        <div>
                            <span>Total Orders</span>
                            <div className="flex items-center gap-2">
                                <h4>{formatNumber(totalOrders)}</h4>
                                {comparisonEnabled && (
                                    <GrowShrinkTag
                                        value={ordersChange}
                                        suffix="%"
                                        showIcon={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <LineChart
                    data={chartData}
                    height={315}
                    lineConfig={[
                        {
                            type: 'linear',
                            dataKey: 'revenue',
                        },
                        {
                            type: 'linear',
                            dataKey: 'orders',
                        },
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
                        width: 30,
                        tickFormatter: (value: number) =>
                            formatCurrencyCompact(value, 'USD', 1),
                        tick: {
                            textAnchor: 'end',
                        },
                    }}
                    tooltipContentConfig={{
                        valueFormatter: (value: number, entry) => {
                            const name = entry.name
                            if (name === 'revenue') {
                                return formatCurrency(value, 'USD', 'en-US', 2)
                            }

                            if (name === 'orders') {
                                return formatNumber(
                                    entry.payload?.orderCount || 0,
                                )
                            }

                            return formatNumber(value)
                        },
                        nameFormatter: (name: string) => {
                            if (name === 'revenue') {
                                return 'Revenue'
                            }
                            return 'Orders'
                        },
                    }}
                />
            </div>
        </Card>
    )
}

export default RevenueOrder
