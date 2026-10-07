import Card from '@/components/ui/Card'
import Divider from '@/components/shared/Divider'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import type { PlatformStabilityData } from '../types'

type PlatformStabilityProps = {
    data: PlatformStabilityData
    isLoading?: boolean
}

const PlatformStability = ({ data, isLoading }: PlatformStabilityProps) => {
    if (isLoading) {
        return (
            <Card>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </Card>
        )
    }

    const {
        uptime,
        errorRate,
        totalRequests,
        p95ResponseTime,
        uptimeTrend,
        errorImpact,
        requestBreakdown,
    } = data

    return (
        <Card>
            <div className="mb-4">
                <h5>Platform Stability</h5>
                <div className="text-sm mt-1">
                    Last 24h • {totalRequests}M Requests • P95 {p95ResponseTime}
                    ms
                </div>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <div className="text-sm font-medium mb-2">Uptime</div>
                        <h4 className="mb-1">{uptime.toFixed(2)}%</h4>
                        <div className="flex flex-wrap items-center gap-1">
                            <GrowShrinkTag value={uptimeTrend} suffix="%" />
                            <span>vs Last Month</span>
                        </div>
                    </div>
                    <div>
                        <div className="font-medium mb-2">Error Rate</div>
                        <h4 className="mb-1">{errorRate.toFixed(2)}%</h4>
                        <div>Error Impact {errorImpact.toFixed(2)}%</div>
                    </div>
                </div>
                <Divider />
                <div className="pt-4">
                    <div>
                        <h6 className="mb-2 font-semibold">
                            Request Status Breakdown
                        </h6>
                        <div className="w-full rounded-lg overflow-hidden flex items-center">
                            <div
                                className="bg-success h-1.5 transition-all duration-300"
                                style={{
                                    width: `${requestBreakdown.successful.percentage}%`,
                                }}
                            />
                            <div
                                className="bg-warning h-1.5 transition-all duration-300"
                                style={{
                                    width: `${requestBreakdown.clientErrors.percentage}%`,
                                }}
                            />
                            <div
                                className="bg-error h-1.5 transition-all duration-300"
                                style={{
                                    width: `${requestBreakdown.serverErrors.percentage}%`,
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2 ">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-success"></div>
                                    <span className="font-medium">
                                        Successful (2xx)
                                    </span>
                                </div>
                                <span className="heading-text font-medium">
                                    {requestBreakdown.successful.count}B (
                                    {requestBreakdown.successful.percentage}%)
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                                    <span className="font-medium">
                                        Client Errors (4xx)
                                    </span>
                                </div>
                                <span className="heading-text font-medium">
                                    {(
                                        requestBreakdown.clientErrors.count *
                                        1000
                                    ).toFixed(0)}
                                    M (
                                    {requestBreakdown.clientErrors.percentage}%)
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-error"></div>
                                    <span className="font-medium">
                                        Server Errors (5xx)
                                    </span>
                                </div>
                                <span className="heading-text font-medium">
                                    {(
                                        requestBreakdown.serverErrors.count *
                                        1000
                                    ).toFixed(0)}
                                    M (
                                    {requestBreakdown.serverErrors.percentage}%)
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Total Requests</span>
                            <span className="heading-text font-medium">
                                {requestBreakdown.totalRequests}B
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default PlatformStability
