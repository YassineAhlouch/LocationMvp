import { useState } from 'react'
import DealDetail from '@/views/apps/customers/CustomerDetails/components/DealDetails'
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
import type { Deal } from '../types'
import type { ReactNode } from 'react'

type Deals = {
    deals: Deal[]
}

type CustomerDealsProps = {
    leadId: string
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

const LeadDeals = ({ leadId }: CustomerDealsProps) => {
    const { larger } = useResponsive()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
    const [updating, setUpdating] = useState(false)

    const { data, isLoading } = useSWR(
        [`/api/${leadId}/deals`, { id: leadId }],
        ([, params]) => apiGetDeals<Deals, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    const handleDealClick = (deal: Deal) => {
        setSelectedDeal(deal)
        setIsDrawerOpen(true)
    }

    const handleUpdateStage = async () => {
        setUpdating(true)
        await sleep(1000)
        setUpdating(false)
        setIsDrawerOpen(false)
    }

    return (
        <div>
            <Loading loading={isLoading}>
                {data && (
                    <>
                        <div className="mt-6">
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
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[300px]">
                                                        {deal.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="default"
                                                size="sm"
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
                    </>
                )}
            </Loading>
            <Drawer
                title="Deal Details"
                isOpen={isDrawerOpen}
                width={larger.sm ? 550 : 340}
                onClose={handleDrawerClose}
                bodyClass="p-0"
                footer={
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDrawerClose}
                        >
                            Close
                        </Button>
                        <Button
                            variant="solid"
                            size="sm"
                            loading={updating}
                            onClick={handleUpdateStage}
                        >
                            Update Stage
                        </Button>
                    </div>
                }
            >
                <DealDetail data={selectedDeal as Deal} />
            </Drawer>
        </div>
    )
}

export default LeadDeals
