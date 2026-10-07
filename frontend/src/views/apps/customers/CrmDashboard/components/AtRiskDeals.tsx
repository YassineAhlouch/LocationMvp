import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import classNames from '@/utils/classNames'
import { colors } from '@/constants/colors.constant'
import { formatPercentage } from '../utils/dataTransformers'
import type { AtRiskDealsProps } from '../types'

const getAtRiskColors = (type: string) => {
    switch (type) {
        case 'Stalled':
            return colors.blue.bg
        case 'Competitor':
            return colors.orange.bg
        case 'Budget':
            return colors.yellow.bg

        default:
            return colors.gray.bg
    }
}

const AtRiskDeals = ({ data, teamSelection }: AtRiskDealsProps) => {
    const chartData = useMemo(() => {
        if (teamSelection === 'all') {
            return data
        }
        // Filter deals by team member (simplified - in real app would filter by owner)
        return data
    }, [data, teamSelection])

    const totalAtRisk = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0)
    }, [chartData])

    return (
        <Card>
            <div className="mb-4">
                <h5>At-Risk Deals</h5>
            </div>
            <div className="mb-4">
                <div
                    className="flex w-full gap-0.5 mb-4"
                    style={{ height: '32px' }}
                >
                    {chartData.map((item) => {
                        // Calculate number of segments for this section (proportional to percentage)
                        const segmentCount = Math.max(
                            1,
                            Math.round(item.percentage / 2),
                        )

                        return (
                            <div
                                key={item.reason}
                                style={{ width: `${item.percentage}%` }}
                                className="flex gap-0.5"
                            >
                                {Array.from({ length: segmentCount }).map(
                                    (_, idx) => (
                                        <div
                                            key={idx}
                                            className={classNames(
                                                'flex-1 rounded-sm',
                                                getAtRiskColors(item.reason),
                                            )}
                                        />
                                    ),
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="flex items-baseline gap-2">
                    <h3>{totalAtRisk}</h3>
                    <span>Total at risk deals</span>
                </div>
            </div>
            <div className="space-y-2">
                {chartData.map((item) => (
                    <div
                        key={item.reason}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={classNames(
                                    'w-2.5 h-2.5 rounded-full flex-shrink-0',
                                    getAtRiskColors(item.reason),
                                )}
                            />
                            <span className="font-medium">{item.reason}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>{item.count} Deals</span>
                            <Tag className="bg-transparent">
                                {formatPercentage(item.percentage, 0)}
                            </Tag>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default AtRiskDeals
