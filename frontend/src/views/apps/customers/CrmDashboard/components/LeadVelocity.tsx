import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { LineChart } from '@/components/shared/Chart'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { formatPercentage } from '../utils/dataTransformers'
import { LiArrowUp, LiArrowDown } from '@/icons'
import type { LeadVelocityProps } from '../types'

const LeadVelocity = ({ data }: LeadVelocityProps) => {
    return (
        <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h5 className="heading-text">Lead velocity</h5>
                </div>
                <Button>View report</Button>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-6">
                    <h4>{data.total}</h4>
                    <GrowShrinkTag value={data.percentageChange} suffix="%" />
                </div>

                <div className="space-y-3 mb-6">
                    {data.sources?.map((source) => {
                        const sourceIsPositive = source.percentageChange >= 0
                        return (
                            <div
                                key={source.name}
                                className="flex items-center justify-between"
                            >
                                <span>{source.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="heading-text font-medium">
                                        {source.count} leads
                                    </span>
                                    <div
                                        className={`flex items-center gap-1 text-xs font-semibold min-w-[60px] justify-end ${
                                            sourceIsPositive
                                                ? 'text-success'
                                                : 'text-error'
                                        }`}
                                    >
                                        {sourceIsPositive ? (
                                            <LiArrowUp className="text-sm" />
                                        ) : (
                                            <LiArrowDown className="text-sm" />
                                        )}
                                        <span>
                                            {formatPercentage(
                                                Math.abs(
                                                    source.percentageChange,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-auto">
                    <LineChart
                        data={data.trend || []}
                        height={180}
                        lineConfig={[
                            {
                                dataKey: 'count',
                                stroke: '#286cf0',
                                strokeWidth: 2,
                                type: 'linear',
                                dot: false,
                            },
                        ]}
                        xAxisConfig={{
                            dataKey: 'period',
                            tick: { fontSize: 11, fill: '#9ca3af' },
                            axisLine: false,
                            tickLine: false,
                        }}
                    />
                </div>
            </div>
        </Card>
    )
}

export default LeadVelocity
