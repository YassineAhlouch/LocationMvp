import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import { getWinRateColor, formatPercentage } from '../utils/dataTransformers'
import type { WinRateGaugeProps } from '../types'
import { LiTrophy, LiFlag, LiWatch } from '@/icons'
import { TbSum } from 'react-icons/tb'

const WinRateGauge = ({ data }: WinRateGaugeProps) => {
    const { fill } = getWinRateColor(data.winRate, data.target)

    return (
        <Card>
            <div className="mb-2">
                <h5>Win Rate</h5>
            </div>
            <div className="py-8">
                <Progress
                    className="flex justify-center"
                    variant="circle"
                    percent={data.winRate}
                    width={200}
                    gapDegree={120}
                    gapPosition="bottom"
                    strokeClass={fill}
                    customInfo={
                        <div className="text-center">
                            <h3>{formatPercentage(data.winRate, 1)}</h3>
                            <span>Win Rate</span>
                        </div>
                    }
                />
            </div>
            <div className="-mt-14 divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 heading-text">
                        <LiTrophy className="text-lg" />
                        <span>Won Deals</span>
                    </div>
                    <span className="font-semibold heading-text">
                        {data.wonDeals}
                    </span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 heading-text">
                        <TbSum className="text-lg" />
                        <span>Total Deals</span>
                    </div>
                    <span className="font-semibold heading-text">
                        {data.totalDeals}
                    </span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 heading-text">
                        <LiFlag className="text-lg" />
                        <span>Target</span>
                    </div>
                    <span className="font-semibold heading-text">
                        {formatPercentage(data.target, 0)}
                    </span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 heading-text">
                        <LiWatch className="text-lg" />
                        <span>Cycle Length</span>
                    </div>
                    <span className="font-semibold heading-text">
                        {data.cycleLength} days
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default WinRateGauge
