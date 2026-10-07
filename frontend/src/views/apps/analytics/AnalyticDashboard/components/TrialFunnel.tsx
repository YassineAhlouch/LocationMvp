import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Tooltip from '@/components/ui/Tooltip'
import { ChartContainer } from '@/components/shared/Chart'
import { ComposedChart, Area, XAxis } from 'recharts'
import { defaultColors } from '@/components/shared/Chart/configs'
import { LiDownloadCurve, LiProfiles, LiClock } from '@/icons'
import type { TrialFunnelData } from '../types'

// Helper function to reduce color opacity mathematically
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

const chartColor = defaultColors[1]

type TrialFunnelProps = {
    data: TrialFunnelData
}

const TrialFunnel = ({ data }: TrialFunnelProps) => {
    const { stages } = data

    const chartData = useMemo(() => {
        return stages.map((stage, index) => {
            const stageColor = reduceColorOpacity(
                defaultColors[0],
                stages.length,
                index,
            )

            return {
                ...stage,
                color: stageColor,
            }
        })
    }, [stages])

    return (
        <Card
            className="flex flex-col"
            bodyClass="h-full relative flex flex-col"
        >
            <div className="mb-4 flex items-center">
                <h5 className="heading-text">Trial Funnel</h5>
            </div>
            <div className="flex-1 relative">
                <div className="absolute top-0 left-0 w-full h-full z-10">
                    <div
                        className="grid h-full divide-x divide-gray-200 dark:divide-gray-800"
                        style={{
                            gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`,
                        }}
                    >
                        {chartData.map((stage, index) => {
                            return (
                                <div
                                    key={stage.name}
                                    className="border-4 border-white dark:border-gray-800 relative"
                                >
                                    <div className="flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">
                                                    {stage.name}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="heading-text font-medium">
                                                    {stage.percentage.toFixed(
                                                        1,
                                                    )}
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            {[
                                                {
                                                    icon: LiProfiles,
                                                    value: stage.count.toLocaleString(),
                                                    label: 'Count',
                                                },
                                                {
                                                    icon: LiDownloadCurve,
                                                    value: `${stage.dropoffPercentage?.toFixed(1) || 0}%`,
                                                    label: 'Drop-off',
                                                },
                                                {
                                                    icon: LiClock,
                                                    value: `${stage.velocity} sec`,
                                                    label: 'Velocity',
                                                },
                                            ].map((metric, metricIndex) => {
                                                const IconComponent =
                                                    metric.icon
                                                return (
                                                    <Tooltip
                                                        key={metricIndex}
                                                        title={metric.label}
                                                    >
                                                        <div className="flex items-center px-1 py-1 gap-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-help">
                                                            <IconComponent className="text-base" />
                                                            <span className="heading-text">
                                                                {metric.value}
                                                            </span>
                                                        </div>
                                                    </Tooltip>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {index !== chartData.length - 1 && (
                                        <div className="w-0.25 h-full bg-gray-200 dark:bg-gray-700 absolute -right-1.25 z-10 top-0"></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <ChartContainer
                    className="pt-16 rtl:transform rtl:-scale-x-100"
                    height={260}
                >
                    <ComposedChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="trialFunnelGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                {chartData.map((_, index) => {
                                    const offset =
                                        (index / (chartData.length - 1)) * 100
                                    const color = reduceColorOpacity(
                                        chartColor,
                                        chartData.length,
                                        index,
                                    )
                                    const rgbMatch = color.match(
                                        /rgba?\((\d+),\s*(\d+),\s*(\d+)/,
                                    )
                                    const rgb = rgbMatch
                                        ? `rgb(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]})`
                                        : chartColor
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
                        <XAxis dataKey="name" hide />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={chartColor}
                            fill="url(#trialFunnelGradient)"
                            fillOpacity={1}
                            strokeWidth={2}
                        />
                    </ComposedChart>
                </ChartContainer>
            </div>
        </Card>
    )
}

export default TrialFunnel
