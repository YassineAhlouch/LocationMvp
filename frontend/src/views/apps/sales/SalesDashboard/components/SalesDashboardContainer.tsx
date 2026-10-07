import Container from '@/components/shared/Container'
import useResponsive from '@/utils/hooks/useResponsive'
import type { ReactNode } from 'react'

type SalesDashboardContainerProps = {
    header: ReactNode
    metrics: ReactNode
    revenueTrend: ReactNode
    topSellingCategories: ReactNode
    averageOrderValue: ReactNode
    customerSegment: ReactNode
    totalSessions: ReactNode
    topCampaigns: ReactNode
}

const SalesDashboardContainer = ({
    header,
    metrics,
    revenueTrend,
    topSellingCategories,
    averageOrderValue,
    customerSegment,
    totalSessions,
    topCampaigns,
}: SalesDashboardContainerProps) => {
    const { windowWidth } = useResponsive()

    return (
        <div className="h-full">
            <Container>
                {header}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 xl:col-span-2">
                            {revenueTrend}
                        </div>
                        <div className="lg:col-span-1 xl:col-span-1">
                            {topSellingCategories}
                        </div>
                        <div className="lg:col-span-1 xl:hidden">
                            {windowWidth < 1280 && averageOrderValue}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="hidden xl:block">
                            {windowWidth >= 1280 && averageOrderValue}
                        </div>
                        {customerSegment}
                        {totalSessions}
                    </div>
                    {topCampaigns}
                </div>
            </Container>
        </div>
    )
}

export default SalesDashboardContainer
