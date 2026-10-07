import { useState, useEffect } from 'react'
import { useCrmDashboardStore } from '@/views/apps/customers/CrmDashboard/store/crmDashboardStore'
import Skeleton from '@/components/ui/Skeleton'
import Card from '@/components/ui/Card'
import RevenuePerformance from './RevenuePerformance'
import PipelineFunnel from './PipelineFunnel'
import AtRiskDeals from './AtRiskDeals'
import ActionList from './ActionList'
import GeographicDistribution from './GeographicDistribution'
import LeadVelocity from './LeadVelocity'
import WinRateGauge from './WinRateGauge'
import type { CrmDashboardData } from '../types'

type BentoGridProps = {
    data: CrmDashboardData | null
    isLoading: boolean
}

const CrmDashboardContent = ({ data, isLoading }: BentoGridProps) => {
    const { filters } = useCrmDashboardStore()
    const [actions, setActions] = useState(data?.actions || [])

    useEffect(() => {
        if (data?.actions) {
            setActions(data.actions)
        }
    }, [data?.actions])

    const handleToggleComplete = (actionId: string) => {
        setActions((prev) =>
            prev.map((action) =>
                action.id === actionId
                    ? { ...action, completed: !action.completed }
                    : action,
            ),
        )
    }

    const loading = isLoading || !data
    const showData = data && !isLoading

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
                {loading && (
                    <>
                        <Card bodyClass="space-y-4">
                            <div>
                                <Skeleton height={12} width={160} />
                            </div>
                            <Skeleton height={320} width="100%" />
                        </Card>
                        <Card bodyClass="space-y-4">
                            <div>
                                <Skeleton height={12} width={160} />
                            </div>
                            <Skeleton height={370} width="100%" />
                        </Card>
                    </>
                )}
                {showData && (
                    <>
                        <PipelineFunnel
                            data={data.pipeline}
                            pipelineStages={filters.pipelineStages}
                            applyProbabilityWeighting={
                                filters.viewPreferences
                                    .applyProbabilityWeighting
                            }
                            highlightStalledDeals={
                                filters.viewPreferences.highlightStalledDeals
                            }
                            currency={filters.viewPreferences.currency}
                        />
                        <RevenuePerformance
                            data={data.revenue}
                            timeHorizon={filters.timeHorizon}
                            applyProbabilityWeighting={
                                filters.viewPreferences
                                    .applyProbabilityWeighting
                            }
                            highlightStalledDeals={
                                filters.viewPreferences.highlightStalledDeals
                            }
                            currency={filters.viewPreferences.currency}
                            teamSelection={filters.teamSelection}
                        />
                    </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading && (
                        <>
                            <Card bodyClass="space-y-4">
                                <div>
                                    <Skeleton height={12} width={160} />
                                </div>
                                <div className="h-[350px] divide-y divide-gray-200 dark:divide-gray-700">
                                    {Array.from({ length: 8 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-2"
                                            >
                                                <div className="flex gap-2">
                                                    <Skeleton
                                                        variant="circle"
                                                        height={16}
                                                        width={16}
                                                    />
                                                    <div className="space-y-2">
                                                        <Skeleton
                                                            height={12}
                                                            width={120}
                                                        />
                                                        <Skeleton
                                                            height={12}
                                                            width={180}
                                                        />
                                                    </div>
                                                </div>
                                                <Skeleton
                                                    height={12}
                                                    width={50}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </Card>
                            <Card bodyClass="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Skeleton height={12} width={160} />
                                    <Skeleton height={12} width={60} />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton height={20} width={100} />
                                </div>
                                <div>
                                    {Array.from({ length: 3 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-2"
                                            >
                                                <div className="flex gap-2">
                                                    <Skeleton
                                                        height={12}
                                                        width={120}
                                                    />
                                                </div>
                                                <Skeleton
                                                    height={12}
                                                    width={50}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                                <Skeleton height={250} width="100%" />
                            </Card>
                        </>
                    )}
                    {showData && (
                        <>
                            <ActionList
                                data={actions}
                                timeHorizon={filters.timeHorizon}
                                onToggleComplete={handleToggleComplete}
                            />
                            <LeadVelocity
                                data={data.leadVelocity}
                                timeHorizon={filters.timeHorizon}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-1 space-y-4">
                {loading && (
                    <>
                        <Card bodyClass="space-y-4">
                            <div>
                                <Skeleton height={12} width={160} />
                            </div>
                            <Skeleton height={230} width="100%" />
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div className="flex gap-2">
                                            <Skeleton height={12} width={120} />
                                        </div>
                                        <Skeleton height={12} width={50} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card bodyClass="space-y-4">
                            <Skeleton height={12} width={160} />
                            <Skeleton height={20} width={100} />
                            <div className="flex gap-0.5">
                                {Array.from({ length: 45 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="flex-1"
                                        height={32}
                                    />
                                ))}
                            </div>
                            <div>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <div className="flex gap-2">
                                            <Skeleton
                                                variant="circle"
                                                height={16}
                                                width={16}
                                            />
                                            <Skeleton height={12} width={120} />
                                        </div>
                                        <Skeleton height={12} width={50} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card bodyClass="space-y-4">
                            <Skeleton height={12} width={160} />
                            <div className="flex justify-center my-12">
                                <Skeleton
                                    variant="circle"
                                    height={190}
                                    width={190}
                                />
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <div className="flex gap-2">
                                            <Skeleton height={12} width={120} />
                                        </div>
                                        <Skeleton height={12} width={50} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                )}
                {showData && (
                    <>
                        <GeographicDistribution
                            data={data.geographic}
                            currency={filters.viewPreferences.currency}
                            highlightStalledDeals={
                                filters.viewPreferences.highlightStalledDeals
                            }
                        />
                        <AtRiskDeals
                            data={data.atRisk}
                            teamSelection={filters.teamSelection}
                        />
                        <WinRateGauge data={data.winRate} />
                    </>
                )}
            </div>
        </div>
    )
}

export default CrmDashboardContent
