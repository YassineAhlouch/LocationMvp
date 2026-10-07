import { useRef } from 'react'
import Card from '@/components/ui/Card'
import LifeCycleConnector from './LifeCycleConnector'
import { useSubscriptionAnalyticsStore } from '@/views/apps/analytics/Subscriptions/store/subscriptionAnalyticsStore'
import { apiGetLifecycleData } from '@/services/AnalyticService'
import LifecycleStage from './LifecycleStage'
import useSWR from 'swr'
import useResponsive from '@/utils/hooks/useResponsive'
import useDirection from '@/utils/hooks/useDirection'
import type { GetLifecycleDataResponse } from '../types'

const SubscriberLifecycleJourney = () => {
    const { dateRange } = useSubscriptionAnalyticsStore()
    const { larger } = useResponsive()
    const [direction] = useDirection()

    const { data, isLoading, error } = useSWR(
        [
            '/api/analytic/subscription/lifecycle',
            {
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString(),
            },
        ],
        ([, params]) =>
            apiGetLifecycleData<
                GetLifecycleDataResponse,
                Record<string, unknown>
            >(params),
        {
            revalidateOnFocus: false,
        },
    )

    const lifecycleData =
        data ||
        (isLoading
            ? [
                  { stage: '', count: 0, percentage: 0, trend: '' },
                  { stage: '', count: 0, percentage: 0, trend: '' },
                  { stage: '', count: 0, percentage: 0, trend: '' },
                  { stage: '', count: 0, percentage: 0, trend: '' },
                  { stage: '', count: 0, percentage: 0, trend: '' },
              ]
            : [])

    const horizontalContainerRef = useRef<HTMLDivElement>(null)
    const horizontalDiv1Ref = useRef<HTMLDivElement>(null)
    const horizontalDiv2Ref = useRef<HTMLDivElement>(null)

    if (error) {
        return null
    }

    return (
        <Card>
            <div className="mb-6">
                <h5>Subscriber Lifecycle Journey</h5>
                <p>
                    Track subscriber progression through different engagement
                    stages
                </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
                {lifecycleData.map((stageData, index) => (
                    <div
                        key={stageData.stage || `loading-${index}`}
                        className="z-10 flex-1 min-w-full sm:min-w-[250px] lg:min-w-auto"
                    >
                        <LifecycleStage
                            stage={stageData.stage}
                            count={stageData.count}
                            percentage={stageData.percentage}
                            trend={stageData.trend}
                            loading={isLoading}
                        />
                    </div>
                ))}
                <div
                    ref={horizontalContainerRef}
                    className="absolute top-1/2 lg:top-1/2 left-1/2 lg:left-0 w-full h-full lg:h-1 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 lg:-translate-y-1/2"
                >
                    <div className="flex flex-col lg:flex-row justify-between h-full lg:h-auto">
                        <div ref={horizontalDiv1Ref} />
                        <div ref={horizontalDiv2Ref} />
                    </div>
                    <LifeCycleConnector
                        duration={5}
                        reverse={direction === 'rtl'}
                        containerRef={horizontalContainerRef}
                        fromRef={horizontalDiv1Ref}
                        toRef={horizontalDiv2Ref}
                        vertical={!larger.lg}
                    />
                </div>
            </div>
        </Card>
    )
}

export default SubscriberLifecycleJourney
