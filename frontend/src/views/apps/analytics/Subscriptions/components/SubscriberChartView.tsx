import { Card } from '@/components/ui'
import SubscriberMetrics from './SubscriberMetrics'
import SubscriberChart from './SubscriberChart'

const SubscriberChartView = () => {
    return (
        <Card bodyClass="p-0">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 p-4">
                    <SubscriberChart />
                </div>
                <div className="lg:w-[350px] flex-shrink-0 border-l border-gray-200 dark:border-gray-700">
                    <SubscriberMetrics />
                </div>
            </div>
        </Card>
    )
}

export default SubscriberChartView
