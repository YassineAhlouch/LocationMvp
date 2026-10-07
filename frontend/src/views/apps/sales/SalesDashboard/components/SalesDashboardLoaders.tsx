import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'
import StatisticCard from '@/components/shared/StatisticCard'
import Divider from '@/components/shared/Divider'
import SalesDashboardContainer from './SalesDashboardContainer'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'

const { Tr, Th, Td, THead, TBody } = Table

const SalesDashboardLoaders = () => {
    const comparisonEnabled = useSalesDashboardStore(
        (state) => state.comparisonEnabled,
    )

    const skeletonHeader = (
        <div className="flex items-center justify-between mb-8">
            <Skeleton height={12} width={160} />
        </div>
    )

    return (
        <SalesDashboardContainer
            header={
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0 py-2.5">
                    <div className="space-y-2">
                        <Skeleton height={12} width={160} />
                        <Skeleton height={12} width={200} />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton height={16} width={60} />
                            <Skeleton height={16} width={40} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton height={16} width={60} />
                            <Skeleton height={16} width={80} />
                        </div>
                    </div>
                </div>
            }
            metrics={
                <>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <StatisticCard
                            key={index}
                            inset
                            footer={
                                comparisonEnabled && (
                                    <div className="flex items-center justify-between gap-2 py-1.5">
                                        <Skeleton height={12} width={60} />
                                        <span>
                                            <Skeleton height={12} width={60} />
                                        </span>
                                    </div>
                                )
                            }
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg text-xl border border-gray-200 dark:border-gray-700 heading-text">
                                    <Skeleton height={16} width={16} />
                                </div>
                            </div>
                            <div className="mt-8 space-y-2">
                                <Skeleton height={12} width={80} />
                                <Skeleton height={12} width={160} />
                            </div>
                        </StatisticCard>
                    ))}
                </>
            }
            revenueTrend={
                <Card>
                    <div className="space-y-8">
                        {skeletonHeader}
                        <div className="flex items-center gap-8">
                            <div className="space-y-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={16} width={120} />
                            </div>
                            <Divider orientation="vertical" className="h-12" />
                            <div className="space-y-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={16} width={120} />
                            </div>
                        </div>
                        <Skeleton height={315} />
                    </div>
                </Card>
            }
            topSellingCategories={
                <Card>
                    <div className="space-y-10">
                        {skeletonHeader}
                        <div className="flex items-center justify-center">
                            <Skeleton
                                variant="circle"
                                height={180}
                                width={180}
                            />
                        </div>
                        <Table compact overflow={false} hoverable={false}>
                            <THead>
                                <Tr className="bg-transparent">
                                    <Th>
                                        <Skeleton height={12} width={40} />
                                    </Th>
                                    <Th className="text-right">
                                        <Skeleton height={12} width={40} />
                                    </Th>
                                    <Th className="text-right">
                                        <Skeleton height={12} width={40} />
                                    </Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <div className="flex items-center gap-2 py-1">
                                                <Skeleton
                                                    variant="circle"
                                                    height={12}
                                                    width={12}
                                                />
                                                <Skeleton
                                                    height={12}
                                                    width={80}
                                                />
                                            </div>
                                        </Td>
                                        <Td className="text-right">
                                            <Skeleton height={12} width={40} />
                                        </Td>
                                        <Td className="text-right">
                                            <Skeleton height={12} width={60} />
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </div>
                </Card>
            }
            averageOrderValue={
                <Card>
                    <div className="space-y-8">
                        {skeletonHeader}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={16} width={50} />
                            </div>
                            <Skeleton height={16} width={180} />
                        </div>
                        <Skeleton height={275} />
                    </div>
                </Card>
            }
            customerSegment={
                <Card>
                    <div className="space-y-8">
                        {skeletonHeader}
                        <div className="flex items-center gap-8">
                            <div className="space-y-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={16} width={120} />
                            </div>
                            <Divider orientation="vertical" className="h-12" />
                            <div className="space-y-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={16} width={120} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Skeleton height={240} />
                            <div className="flex items-center justify-center gap-4">
                                <Skeleton height={12} width={100} />
                                <Skeleton height={12} width={120} />
                            </div>
                        </div>
                    </div>
                </Card>
            }
            totalSessions={
                <Card>
                    <div className="space-y-8">
                        {skeletonHeader}
                        <div className="flex items-center gap-8">
                            <div className="space-y-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={16} width={120} />
                            </div>
                            <Divider orientation="vertical" className="h-12" />
                            <div className="space-y-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={16} width={120} />
                            </div>
                        </div>
                        <Skeleton height={140} />
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <Skeleton height={12} width={60} />
                                    <div className="flex items-center gap-3">
                                        <Skeleton height={12} width={50} />
                                        <Skeleton height={12} width={40} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            }
            topCampaigns={
                <Card bodyClass="p-0">
                    <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
                        <Skeleton height={12} width={200} />
                    </div>
                    <Table hoverable={false}>
                        <THead>
                            <Tr>
                                <Th>
                                    <Skeleton height={14} width={160} />
                                </Th>
                                <Th>
                                    <Skeleton height={14} width={120} />
                                </Th>
                                <Th>
                                    {' '}
                                    <Skeleton height={14} width={80} />
                                </Th>
                                <Th>
                                    {' '}
                                    <Skeleton height={14} width={80} />
                                </Th>
                                <Th>
                                    <Skeleton height={14} width={40} />
                                </Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 flex items-center justify-center heading-text border border-gray-300 rounded-lg text-lg">
                                                <Skeleton
                                                    variant="circle"
                                                    height={12}
                                                    width={12}
                                                />
                                            </div>
                                            <span className="font-medium heading-text">
                                                <Skeleton
                                                    height={14}
                                                    width={160}
                                                />
                                            </span>
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            <Skeleton
                                                variant="circle"
                                                height={20}
                                                width={20}
                                            />
                                            <Skeleton height={14} width={120} />
                                        </div>
                                    </Td>
                                    <Td className="heading-text">
                                        <Skeleton height={14} width={80} />
                                    </Td>
                                    <Td>
                                        <Skeleton height={14} width={80} />
                                    </Td>
                                    <Td>
                                        <Skeleton height={14} width={40} />
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </Card>
            }
        />
    )
}

export default SalesDashboardLoaders
