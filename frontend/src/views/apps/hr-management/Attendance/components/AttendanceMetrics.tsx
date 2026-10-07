import Avatar from '@/components/ui/Avatar'
import Skeleton from '@/components/ui/Skeleton'
import StatisticCard from '@/components/shared/StatisticCard'
import {
    LiTickCircle,
    LiCrossCircle,
    LiBrifecaseTime,
    LiTaskSquare,
} from '@/icons'
import useAttendanceData from '../hooks/useAttendanceData'
import { colors } from '@/constants/colors.constant'
import classNames from '@/utils/classNames'

const AttendanceMetrics = () => {
    const { data } = useAttendanceData()
    const metrics = data?.metrics

    if (!metrics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <StatisticCard key={index} className="animate-pulse">
                        <div className="flex items-center gap-4">
                            <Skeleton
                                className="rounded-lg"
                                width={40}
                                height={40}
                            />
                            <div className="space-y-2">
                                <Skeleton width={70} height={8} />
                                <Skeleton width={120} height={8} />
                            </div>
                        </div>
                    </StatisticCard>
                ))}
            </div>
        )
    }

    const metricsData = [
        {
            title: 'Present Today',
            value: metrics.presentToday,
            icon: <LiTickCircle />,
            color: colors.emerald,
        },
        {
            title: 'Absent Today',
            value: metrics.absentToday,
            icon: <LiCrossCircle />,
            color: colors.red,
        },
        {
            title: 'Late Arrivals',
            value: metrics.lateArrivals,
            icon: <LiBrifecaseTime />,
            color: colors.yellow,
        },
        {
            title: 'Attendance Rate',
            value: `${metrics.attendanceRate}%`,
            icon: <LiTaskSquare />,
            color: colors.blue,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricsData.map((metric, index) => (
                <StatisticCard key={index}>
                    <div className="flex items-center gap-4">
                        <Avatar
                            className={classNames(
                                'border-0',
                                metric.color.iconBg,
                                metric.color.iconText,
                            )}
                        >
                            <span className="text-2xl">{metric.icon}</span>
                        </Avatar>
                        <div>
                            <p>{metric.title}</p>
                            <h4>{metric.value}</h4>
                        </div>
                    </div>
                </StatisticCard>
            ))}
        </div>
    )
}

export default AttendanceMetrics
