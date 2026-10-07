import StatisticCard from '@/components/shared/StatisticCard'
import { LiDollarCircle } from '@/icons'

const WithHeaderFooter = () => {
    return (
        <div className="w-full max-w-sm mx-auto">
            <StatisticCard
                inset
                footer={
                    <div className="flex items-center justify-between px-2">
                        <span className="font-medium text-success">+12.5%</span>
                        <span>vs last period</span>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg text-xl border border-gray-200 dark:border-gray-700 heading-text">
                        <LiDollarCircle />
                    </div>
                    <div>
                        <h4>$1,862</h4>
                        <span>Total Revenue</span>
                    </div>
                </div>
            </StatisticCard>
        </div>
    )
}

export default WithHeaderFooter
