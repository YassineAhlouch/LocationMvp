import { useState } from 'react'
import DealDetail from './DealDetails'
import SubscriptionDetail from './SubscriptionDetails'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Drawer from '@/components/ui/Drawer'
import Loading from '@/components/shared/Loading'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import sleep from '@/utils/sleep'
import { apiGetDeals } from '@/services/CustomersService'
import useSWR from 'swr'
import {
    LuBadgeDollarSign,
    LuChartSpline,
    LuRefreshCcw,
    LuCalendarClock,
    LuCircleCheckBig,
} from 'react-icons/lu'
import type { Deal, Subscription } from '../types'
import type { ReactNode } from 'react'

type Deals = {
    deals: Deal[]
    subscriptions: Subscription[]
}

type CustomerDealsProps = {
    customerId: string
}

const dealIconsMap: Record<string, { icon: ReactNode; color: string }> = {
    Renewal: {
        icon: <LuRefreshCcw />,
        color: 'bg-blue-500',
    },
    'New Business': {
        icon: <LuBadgeDollarSign />,
        color: 'bg-orange-500',
    },
    Upsell: {
        icon: <LuChartSpline />,
        color: 'bg-purple-500',
    },
    Active: {
        icon: <LuCircleCheckBig />,
        color: 'bg-success',
    },
}

const CustomerDeals = ({ customerId }: CustomerDealsProps) => {
    const { larger } = useResponsive()

    const [drawer, setDrawer] = useState<{ open: boolean; type: string }>({
        open: false,
        type: '',
    })

    const [updating, setUpdating] = useState(false)

    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
    const [selectedSubscription, setSelectedSubscription] =
        useState<Subscription | null>(null)

    const { data, isLoading } = useSWR(
        ['/api/customers/deals', { id: customerId }],
        ([, params]) => apiGetDeals<Deals, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const handleDrawerClose = () => {
        setDrawer({ open: false, type: '' })
    }

    const handleDealClick = (deal: Deal) => {
        setSelectedDeal(deal)
        setDrawer({ open: true, type: 'deals' })
    }

    const handleSubscriptionClick = (subscription: Subscription) => {
        setSelectedSubscription(subscription)
        setDrawer({ open: true, type: 'subscriptions' })
    }

    const handleUpdateStage = async () => {
        setUpdating(true)
        await sleep(1000)
        setUpdating(false)
        handleDrawerClose()
    }

    const handleRenewSubscription = async () => {
        setUpdating(true)
        await sleep(1000)
        setUpdating(false)
        handleDrawerClose()
    }

    return (
        <div>
            <Loading loading={isLoading}>
                {data && (
                    <>
                        <div className="mt-6">
                            <h5 className="mb-2">Active Deals</h5>
                            <div className="flex flex-col gap-4">
                                {data.deals.map((deal) => (
                                    <Card key={deal.id}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div>
                                                    <Avatar
                                                        icon={
                                                            dealIconsMap[
                                                                deal.type
                                                            ].icon
                                                        }
                                                        className={classNames(
                                                            'text-white border-0',
                                                            dealIconsMap[
                                                                deal.type
                                                            ].color,
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 font-semibold">
                                                        {deal.name}
                                                    </h6>
                                                    <p className="max-w-[300px]">
                                                        {deal.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="default"
                                                className="self-start"
                                                onClick={() =>
                                                    handleDealClick(deal)
                                                }
                                            >
                                                View Deal
                                            </Button>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-4">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center flex-wrap gap-2">
                                                    {deal.products.map(
                                                        (product) => (
                                                            <Tag key={product}>
                                                                {product}
                                                            </Tag>
                                                        ),
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 md:gap-0 md:divide-x divide-gray-200 dark:divide-neutral-700">
                                                <div className="flex flex-col md:items-end md:px-4 min-w-[110px]">
                                                    <h6 className="mb-1">
                                                        {deal.stage}/
                                                        {deal.totalStages}
                                                    </h6>
                                                    <span className="text-xs flex items-center gap-0.5 font-medium">
                                                        Current stage
                                                    </span>
                                                </div>
                                                <div className="flex flex-col md:items-end md:px-4 min-w-[110px]">
                                                    <h6 className="mb-1">
                                                        {deal.probability}%
                                                    </h6>
                                                    <span className="text-xs flex items-center gap-0.5 font-medium">
                                                        Probability
                                                    </span>
                                                </div>
                                                <div className="flex flex-col md:items-end ltr:md:pl-4 rtl:md:pr-4">
                                                    <h6 className="mb-1">
                                                        {deal.value}
                                                    </h6>
                                                    <span className="text-xs flex items-center gap-0.5 font-medium">
                                                        <LuCalendarClock />
                                                        <span>
                                                            Close:{' '}
                                                            {deal.closeDate}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8">
                            <h5 className="mb-2">Active Subscriptions</h5>
                            <div className="flex flex-col gap-4">
                                {data.subscriptions.map((subscription) => (
                                    <Card key={subscription.id}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div>
                                                    <Avatar
                                                        icon={
                                                            dealIconsMap[
                                                                subscription
                                                                    .status
                                                            ].icon
                                                        }
                                                        className={classNames(
                                                            'text-white border-0',
                                                            dealIconsMap[
                                                                subscription
                                                                    .status
                                                            ].color,
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 font-semibold">
                                                        {subscription.name}
                                                    </h6>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[300px]">
                                                        {
                                                            subscription.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="default"
                                                className="self-start"
                                                onClick={() =>
                                                    handleSubscriptionClick(
                                                        subscription,
                                                    )
                                                }
                                            >
                                                Manage Subscription
                                            </Button>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center flex-wrap gap-2">
                                                    {subscription.products.map(
                                                        (product) => (
                                                            <Tag key={product}>
                                                                {product}
                                                            </Tag>
                                                        ),
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:items-end">
                                                <h6 className="mb-1">
                                                    {subscription.value}
                                                </h6>
                                                <span className="text-xs flex items-center gap-0.5 font-medium">
                                                    <LuCalendarClock />
                                                    <span>
                                                        Renews:{' '}
                                                        {
                                                            subscription.renewalDate
                                                        }
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </Loading>
            <Drawer
                title={
                    drawer.type === 'deals'
                        ? 'Deal Details'
                        : 'Subscription Details'
                }
                isOpen={drawer.open}
                width={larger.sm ? 550 : 340}
                onClose={handleDrawerClose}
                bodyClass="p-0"
                footer={
                    <div className="flex items-center justify-end w-full gap-2">
                        <Button variant="ghost" onClick={handleDrawerClose}>
                            Close
                        </Button>
                        {drawer.type === 'deals' && (
                            <Button
                                variant="solid"
                                loading={updating}
                                onClick={handleUpdateStage}
                            >
                                Update Stage
                            </Button>
                        )}
                        {drawer.type === 'subscriptions' && (
                            <Button
                                variant="solid"
                                loading={updating}
                                onClick={handleRenewSubscription}
                            >
                                Renew Subscription
                            </Button>
                        )}
                    </div>
                }
            >
                {drawer.type === 'deals' && (
                    <DealDetail data={selectedDeal as Deal} />
                )}
                {drawer.type === 'subscriptions' && (
                    <SubscriptionDetail
                        data={selectedSubscription as Subscription}
                    />
                )}
            </Drawer>
        </div>
    )
}

export default CustomerDeals
