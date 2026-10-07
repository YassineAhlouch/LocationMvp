import classNames from '@/utils/classNames'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Skeleton from '@/components/ui/Skeleton'
import dayjs from 'dayjs'
import { useReferralData } from '../hooks/useReferralData'
import { LiDollarCircle, LiCard, LiDiscountBadge, LiFileText } from '@/icons'
import type { ReferralActivity } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

const ReferralHistory = () => {
    const { data, loading, error } = useReferralData()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-success-subtle text-success'
            case 'pending':
                return 'bg-warning-subtle text-warning'
            case 'expired':
                return 'bg-error-subtle text-error'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const getRewardIcon = (type: string) => {
        switch (type) {
            case 'cash':
                return <LiDollarCircle />
            case 'credits':
                return <LiCard />
            case 'discount':
                return <LiDiscountBadge />
            default:
                return <LiDollarCircle />
        }
    }

    const formatReward = (activity: ReferralActivity) => {
        const { amount, currency, type } = activity.reward
        if (
            activity.status === 'pending' &&
            activity.referredUser.status === 'expired'
        ) {
            return 'Expired'
        }
        if (type === 'cash') {
            return `${currency} $${amount.toFixed(2)}`
        } else if (type === 'credits') {
            return `${amount} Credits`
        } else if (type === 'discount') {
            return `${amount}% Off`
        }
        return `${currency} $${amount.toFixed(2)}`
    }

    return (
        <Card bodyClass="p-0">
            <div className="p-4">
                <h5 className="flex items-center gap-2 mb-1">
                    <LiFileText />
                    Program History
                </h5>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <THead>
                        <Tr>
                            <Th>Referred User</Th>
                            <Th>Signup Date</Th>
                            <Th>Status</Th>
                            <Th>Reward</Th>
                        </Tr>
                    </THead>
                    {loading && (
                        <TBody>
                            {[1, 2, 3, 4].map((i) => (
                                <Tr key={i}>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            <Skeleton
                                                variant="circle"
                                                width={30}
                                                height={30}
                                            />
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-28" />
                                                <Skeleton className="h-3 w-36" />
                                            </div>
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </Td>
                                    <Td>
                                        <Skeleton className="h-3 w-20 rounded-md" />
                                    </Td>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            <Skeleton
                                                variant="circle"
                                                width={20}
                                                height={20}
                                            />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    )}
                    {!loading &&
                        !error &&
                        data?.history &&
                        data.history.length > 0 && (
                            <TBody>
                                {data.history.map((activity) => (
                                    <Tr key={activity.id}>
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    size={30}
                                                    shape="circle"
                                                    src={
                                                        activity.referredUser
                                                            .img
                                                    }
                                                    alt={
                                                        activity.referredUser
                                                            .name
                                                    }
                                                >
                                                    {activity.referredUser.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium heading-text">
                                                        {
                                                            activity
                                                                .referredUser
                                                                .name
                                                        }
                                                    </div>
                                                    <div>
                                                        {
                                                            activity
                                                                .referredUser
                                                                .email
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td>
                                            <div className="heading-text text-nowrap">
                                                {dayjs(
                                                    activity.signupDate,
                                                ).format('MMM DD, YYYY')}
                                            </div>
                                            <div>
                                                {dayjs(
                                                    activity.signupDate,
                                                ).format('hh:mm A')}
                                            </div>
                                        </Td>
                                        <Td>
                                            <Tag
                                                className={classNames(
                                                    'border-0 text-xs font-medium',
                                                    getStatusColor(
                                                        activity.referredUser
                                                            .status,
                                                    ),
                                                )}
                                            >
                                                {activity.referredUser.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    activity.referredUser.status.slice(
                                                        1,
                                                    )}
                                            </Tag>
                                        </Td>
                                        <Td>
                                            <div className="flex items-center gap-2 heading-text">
                                                <span className="text-lg">
                                                    {getRewardIcon(
                                                        activity.reward.type,
                                                    )}
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {formatReward(activity)}
                                                </span>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        )}
                </Table>
            </div>
        </Card>
    )
}

export default ReferralHistory
