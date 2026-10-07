import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { ChartContainer } from '@/components/shared/Chart'
import { ComposedChart, Area, XAxis } from 'recharts'
import { defaultColors } from '@/components/shared/Chart/configs'
import {
    convertCurrency,
    calculateConversionRate,
    formatPercentage,
} from '../utils/dataTransformers'
import type { PipelineFunnelProps } from '../types'

const reduceColorOpacity = (
    hexColor: string,
    steps: number,
    currentStep: number,
): string => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)

    const startOpacity = 0.75
    const endOpacity = 0.1
    const opacity =
        startOpacity - ((startOpacity - endOpacity) / (steps - 1)) * currentStep

    const lightenFactor = currentStep / (steps - 1) // 0 to 1
    const lightenedR = Math.round(r + (255 - r) * lightenFactor * 0.4)
    const lightenedG = Math.round(g + (255 - g) * lightenFactor * 0.4)
    const lightenedB = Math.round(b + (255 - b) * lightenFactor * 0.4)

    return `rgba(${lightenedR}, ${lightenedG}, ${lightenedB}, ${opacity})`
}

const PipelineFunnel = ({
    data,
    pipelineStages,
    applyProbabilityWeighting,
    highlightStalledDeals,
    currency,
}: PipelineFunnelProps) => {
    const chartData = useMemo(() => {
        const stageMap: Record<string, keyof typeof pipelineStages> = {
            Prospecting: 'prospecting',
            Qualified: 'qualified',
            Negotiation: 'negotiation',
            'Closed Won': 'closedWon',
        }

        const STALLED_THRESHOLD = 30

        const filtered = data.stages.filter((stage) => {
            const key = stageMap[stage.stage]
            return key && pipelineStages[key]
        })

        return filtered.map((stage, index) => {
            const nextStage = filtered[index + 1]
            const conversionRate = nextStage
                ? calculateConversionRate(stage.count, nextStage.count)
                : 100

            const probabilityMultiplier = stage.probability
                ? stage.probability > 1
                    ? stage.probability / 100
                    : stage.probability
                : 1
            const weightedValue =
                applyProbabilityWeighting && stage.probability
                    ? stage.value * probabilityMultiplier
                    : stage.value

            const isStalled =
                stage.averageAge && stage.averageAge > STALLED_THRESHOLD

            let stageColor = reduceColorOpacity(
                defaultColors[0],
                filtered.length,
                index,
            )
            if (highlightStalledDeals && isStalled) {
                if (stage.averageAge && stage.averageAge > 45) {
                    stageColor = 'rgba(220, 38, 38, 0.7)'
                } else {
                    stageColor = 'rgba(234, 88, 12, 0.7)'
                }
            }

            return {
                ...stage,
                color: stageColor,
                conversionRate,
                value: convertCurrency(weightedValue, currency),
            }
        })
    }, [
        data,
        pipelineStages,
        applyProbabilityWeighting,
        highlightStalledDeals,
        currency,
    ])

    return (
        <Card className="flex flex-col">
            <div className="mb-4 flex items-center">
                <h5 className="heading-text">Pipeline Funnel</h5>
            </div>
            <div className="flex-1 min-h-[200px] relative">
                <div className="absolute top-0 left-0 w-full h-full z-10">
                    <div
                        className="grid h-full divide-x divide-gray-200 dark:divide-gray-800"
                        style={{
                            gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`,
                        }}
                    >
                        {chartData.map((stage, index) => (
                            <div
                                key={stage.stage}
                                className="border-4 border-white dark:border-gray-800 relative"
                            >
                                <div className="md:px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-xs md:text-sm">
                                            {stage.stage}
                                        </div>
                                        {index > 0 &&
                                            stage.conversionRate < 100 && (
                                                <Tag className="text-success bg-transparent hidden xl:block">
                                                    {formatPercentage(
                                                        stage.conversionRate,
                                                    )}
                                                </Tag>
                                            )}
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                        <h5 className="font-semibold">
                                            {stage.count.toLocaleString()}
                                        </h5>
                                        <div className="heading-text font-medium hidden md:block">
                                            {currency === 'USD' ? '$' : '€'}
                                            {(stage.value / 1000).toFixed(0)}K
                                        </div>
                                    </div>
                                </div>
                                {index !== chartData.length - 1 && (
                                    <div className="w-0.25 h-full bg-gray-200 dark:bg-gray-700 absolute -right-1.25 z-10 top-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <ChartContainer
                    className="pt-16 rtl:transform rtl:-scale-x-100"
                    height={320}
                >
                    <ComposedChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="chartGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                {chartData.map((_, index) => {
                                    const offset =
                                        (index / (chartData.length - 1)) * 100
                                    const color = reduceColorOpacity(
                                        defaultColors[0],
                                        chartData.length,
                                        index,
                                    )
                                    const rgbMatch = color.match(
                                        /rgba?\((\d+),\s*(\d+),\s*(\d+)/,
                                    )
                                    const rgb = rgbMatch
                                        ? `rgb(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]})`
                                        : defaultColors[0]
                                    const opacityMatch =
                                        color.match(/[\d.]+\)$/)
                                    const opacity = opacityMatch
                                        ? parseFloat(opacityMatch[0])
                                        : 0.9

                                    return (
                                        <stop
                                            key={index}
                                            offset={`${offset}%`}
                                            stopColor={rgb}
                                            stopOpacity={opacity}
                                        />
                                    )
                                })}
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="stage" hide />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={defaultColors[0]}
                            fill="url(#chartGradient)"
                            fillOpacity={1}
                            strokeWidth={2}
                        />
                    </ComposedChart>
                </ChartContainer>
            </div>
        </Card>
    )
}

export default PipelineFunnel
