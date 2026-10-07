import { useMemo } from 'react'
import StatisticCard from '@/components/shared/StatisticCard'
import {
    LiArrowUp,
    LiArrowDown,
    LiDocumentText,
    LiTickSquare,
    LiUserCross,
    LiNote,
} from '@/icons'
import Loading from '@/components/shared/Loading'
import useLeaveData from '../hooks/useLeaveData'
import type { ReactNode } from 'react'
import classNames from '@/utils/classNames'

const LeaveStatistics = () => {
    const { statistics, statisticsLoading } = useLeaveData()

    const statisticsData = useMemo(() => {
        if (statistics) {
            const getTrendIcon = (trend: string): ReactNode => {
                if (trend === 'up') {
                    return <LiArrowUp className="text-success" />
                }
                return <LiArrowDown className="text-error" />
            }

            return [
                {
                    icon: <LiDocumentText />,
                    title: 'Total Leave Requests',
                    value: statistics.totalRequests.value,
                    changes: (
                        <span
                            className={classNames(
                                'flex items-center gap-1',
                                statistics.totalRequests.trend === 'up'
                                    ? 'text-success'
                                    : 'text-error',
                            )}
                        >
                            <span>
                                {getTrendIcon(statistics.totalRequests.trend)}
                            </span>
                            {statistics?.totalRequests.change || '+0%'}
                        </span>
                    ),
                    additionalInfo: 'From last month',
                },
                {
                    icon: <LiTickSquare />,
                    title: 'Approval Rate',
                    value: statistics.approvalRate.value,
                    changes: (
                        <span
                            className={classNames(
                                'flex items-center gap-1',
                                statistics.approvalRate.trend === 'up'
                                    ? 'text-success'
                                    : 'text-error',
                            )}
                        >
                            <span>
                                {getTrendIcon(statistics.approvalRate.trend)}
                            </span>
                            {statistics?.approvalRate.change || '+0%'}
                        </span>
                    ),
                    additionalInfo: 'From last month',
                },
                {
                    icon: <LiUserCross />,
                    title: 'On Leave Today',
                    value: statistics.onLeaveToday.value,
                    changes:
                        statistics?.onLeaveToday.departments ||
                        'No departments',
                    additionalInfo: 'Out of 150 employees',
                },
                {
                    icon: <LiNote />,
                    title: 'Upcoming Leaves',
                    value: statistics.upcomingLeaves.value,
                    changes: statistics?.upcomingLeaves.period || 'Next 7 days',
                    additionalInfo: 'Covers 12 employees',
                },
            ]
        }
        return []
    }, [statistics])

    return (
        <Loading loading={statisticsLoading} type="cover">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statisticsData.map((statistic) => (
                    <StatisticCard
                        inset
                        key={statistic.title}
                        footer={
                            <div className="flex items-center justify-between px-2">
                                <div className="font-medium heading-text">
                                    {statistic.changes}
                                </div>
                                <div className="font-medium">
                                    {statistic.additionalInfo}
                                </div>
                            </div>
                        }
                    >
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg border border-gray-200 dark:border-gray-800 h-9 w-9 flex items-center justify-center text-xl heading-text">
                                    {statistic.icon}
                                </div>
                                <div className="font-medium">
                                    {statistic.title}
                                </div>
                            </div>
                        </div>
                        <div className="heading-text font-semibold text-lg mt-4">
                            {statistic.value}
                        </div>
                    </StatisticCard>
                ))}
            </div>
        </Loading>
    )
}

export default LeaveStatistics
