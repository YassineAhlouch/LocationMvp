import Skeleton from '@/components/ui/Skeleton'
import Tag from '@/components/ui/Tag'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { colors } from '@/constants/colors.constant'
import classNames from '@/utils/classNames'
import {
    LiUserAdd,
    LiUserCross,
    LiUserSearch,
    LiUserEdit,
    LiUserTick,
    LiUser,
} from '@/icons'
import type { LifecycleStage } from '../types'

type LifecycleStageProps = {
    stage: LifecycleStage | ''
    count: number
    percentage: number
    trend: 'up' | 'down' | 'neutral' | ''
    loading?: boolean
}

const LifecycleStage = ({
    stage,
    count,
    percentage,
    trend,
    loading,
}: LifecycleStageProps) => {
    const getStageConfig = (stage: string) => {
        switch (stage) {
            case 'trial':
                return {
                    name: 'Trial',
                    icon: <LiUserSearch />,
                    color: `${colors.blue.iconBg} ${colors.blue.iconText}`,
                }
            case 'active':
                return {
                    name: 'Active Subscriber',
                    icon: <LiUserEdit />,
                    color: `${colors.emerald.iconBg} ${colors.emerald.iconText}`,
                }
            case 'engaged':
                return {
                    name: 'Engaged',
                    icon: <LiUserTick />,
                    color: `${colors.purple.iconBg} ${colors.purple.iconText}`,
                }
            case 'churned':
                return {
                    name: 'Churned',
                    icon: <LiUserCross />,
                    color: `${colors.red.iconBg} ${colors.red.iconText}`,
                }
            case 'reactivated':
                return {
                    name: 'Re-activated',
                    icon: <LiUserAdd />,
                    color: `${colors.yellow.iconBg} ${colors.yellow.iconText}`,
                }
            default:
                return {
                    name: 'Unknown',
                    icon: <LiUser />,
                    color: 'bg-gray-100 dark:bg-gray-800',
                }
        }
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return (
                    <GrowShrinkTag
                        className="bg-transparent border border-gray-200 dark:border-gray-700"
                        value={percentage}
                        suffix="%"
                    />
                )
            case 'down':
                return (
                    <GrowShrinkTag
                        className="bg-transparent border border-gray-200 dark:border-gray-700"
                        value={-percentage}
                        suffix="%"
                    />
                )
            default:
                return <Tag className="bg-transparent">{percentage}%</Tag>
        }
    }

    const config = getStageConfig(stage)

    return (
        <div
            className={classNames(
                'relative rounded-lg border border-gray-200 dark:border-gray-700 p-1 transition-all duration-200 bg-gray-100 dark:bg-gray-800',
            )}
        >
            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-700 p-3 rounded-lg">
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton height={10} />
                        <Skeleton height={10} width="60%" />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between pb-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div
                                    className={classNames(
                                        config.color,
                                        'w-5 h-5 rounded flex items-center justify-center shrink-0',
                                    )}
                                >
                                    <span className={config.color}>
                                        {config.icon}
                                    </span>
                                </div>
                                <div className="font-semibold heading-text truncate">
                                    {config.name}
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 flex items-center justify-between">
                            <div className="font-medium heading-text">
                                {count.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                                {getTrendIcon(trend)}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default LifecycleStage
