import Card from '@/components/ui/Card'
import { LineChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Divider from '@/components/shared/Divider'
import { colors } from '@/constants/colors.constant'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'
import type { CustomerSegmentData } from '../types'

type CustomerSegmentProps = {
    data: CustomerSegmentData
    loading?: boolean
}

const line1Color = colors.cyan.chart
const line2Color = '#00add147'

const CustomerSegment = ({ data }: CustomerSegmentProps) => {
    const comparisonEnabled = useSalesDashboardStore(
        (state) => state.comparisonEnabled,
    )

    const lineConfig = [
        {
            type: 'linear' as const,
            dataKey: 'newCustomers',
            name: 'New Customers',
            stroke: line1Color,
        },
        {
            type: 'linear' as const,
            dataKey: 'returningCustomers',
            name: 'Returning Customers',
            stroke: line2Color,
        },
    ]

    return (
        <Card>
            <div className="flex items-center gap-2 mb-4">
                <h5>Customer Segmentation</h5>
            </div>
            <div className="flex items-center gap-2 sm:gap-8 mb-4">
                <div>
                    <p className="mb-1">New Customers</p>
                    <div className="flex items-center gap-2">
                        <h4>{data.newCustomers.total.toLocaleString()}</h4>
                        {comparisonEnabled && (
                            <GrowShrinkTag
                                value={data.newCustomers.change}
                                suffix="%"
                            />
                        )}
                    </div>
                </div>
                <Divider orientation="vertical" className="h-12" />
                <div>
                    <p className="mb-1">Returning Customers</p>
                    <div className="flex items-center gap-2">
                        <h4>
                            {data.returningCustomers.total.toLocaleString()}
                        </h4>
                        {comparisonEnabled && (
                            <GrowShrinkTag
                                value={data.returningCustomers.change}
                                suffix="%"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <LineChart
                    data={data.chartData}
                    height={250}
                    lineConfig={lineConfig}
                    xAxisConfig={{
                        dataKey: 'label',
                        axisLine: false,
                        tickLine: false,
                    }}
                    yAxisConfig={{
                        axisLine: false,
                        tickLine: false,
                        width: 30,
                    }}
                />
            </div>
            <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-0.5"
                        style={{ backgroundColor: line1Color }}
                    />
                    <span className="text-sm">New Customers</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-0.5"
                        style={{ backgroundColor: line2Color }}
                    />
                    <span className="text-sm">Returning Customers</span>
                </div>
            </div>
        </Card>
    )
}

export default CustomerSegment
