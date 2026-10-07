import Card from '@/components/ui/Card'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Table from '@/components/ui/Table'
import classNames from '@/utils/classNames'
import { colors } from '@/constants/colors.constant'
import * as Icons from '@/icons'
import type { ChannelsData } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

type AcquisitionChannelsProps = {
    data: ChannelsData
}

const getChannelColor = (channelName: string) => {
    switch (channelName) {
        case 'Organic Search':
            return colors.orange.bg
        case 'Social Media':
            return colors.yellow.bg
        case 'Direct':
            return colors.cyan.bg
        default:
            return colors.gray.bg
    }
}

const AcquisitionChannels = ({ data }: AcquisitionChannelsProps) => {
    const { trafficDominance, vsLastWeek, channels, metrics } = data

    return (
        <Card>
            <div className="space-y-4">
                <h5>Acquisition Channel</h5>
                <div className="pt-2">
                    <div className="flex items-center gap-2">
                        <h4>{trafficDominance}%</h4>
                        <span className="flex flex-wrap items-center gap-1">
                            <GrowShrinkTag
                                value={vsLastWeek}
                                suffix="%"
                                showIcon
                            />
                            <span>vs last month</span>
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex w-full gap-0.5 h-8">
                        {channels.map((channel) => {
                            const segmentCount = Math.max(
                                1,
                                Math.round(channel.percentage / 2),
                            )

                            return (
                                <div
                                    key={channel.name}
                                    style={{ width: `${channel.percentage}%` }}
                                    className="flex gap-0.5"
                                >
                                    {Array.from({ length: segmentCount }).map(
                                        (_, idx) => (
                                            <div
                                                key={idx}
                                                className={classNames(
                                                    'flex-1 rounded-sm',
                                                    getChannelColor(
                                                        channel.name,
                                                    ),
                                                )}
                                            />
                                        ),
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex gap-4">
                        {channels.map((channel) => (
                            <div
                                key={channel.name}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className={classNames(
                                        'w-3 h-3 rounded-full',
                                        getChannelColor(channel.name),
                                    )}
                                />
                                <span>{channel.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-4">
                    <Table compact overflow={false} hoverable={false}>
                        <THead>
                            <Tr className="bg-transparent">
                                <Th>Channels</Th>
                                <Th>Metric</Th>
                                <Th className="text-right">Trend</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {metrics.map((metric, index) => {
                                const IconComponent = Icons[
                                    metric.icon as keyof typeof Icons
                                ] as React.ComponentType<{ className?: string }>
                                return (
                                    <Tr key={index}>
                                        <Td>
                                            <div className="flex items-center gap-2 heading-text">
                                                {IconComponent && (
                                                    <IconComponent className="text-lg" />
                                                )}
                                                <span className="font-medium">
                                                    {metric.label}
                                                </span>
                                            </div>
                                        </Td>
                                        <Td>
                                            <span className="font-medium heading-text">
                                                {metric.value}
                                            </span>
                                        </Td>
                                        <Td className="text-right">
                                            <GrowShrinkTag
                                                value={metric.trend}
                                                suffix="%"
                                                showIcon
                                            />
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </TBody>
                    </Table>
                </div>
            </div>
        </Card>
    )
}

export default AcquisitionChannels
