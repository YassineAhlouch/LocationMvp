import AnalyticDashboardContainer from './AnalyticDashboardContainer'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { Table } from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody } = Table

const AnalyticDashboardLoaders = () => {
    return (
        <AnalyticDashboardContainer
            recurringRevenueHealth={
                <Card>
                    <div className="space-y-8">
                        <Skeleton height={12} width={160} />
                        <Skeleton height={180} />
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="space-y-2">
                                    <Skeleton height={12} width={120} />
                                    <Skeleton height={12} width={80} />
                                    <Skeleton height={12} width={160} />
                                </div>
                            ))}
                        </div>
                        <Skeleton height={12} width={160} />
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <Skeleton height={12} width={120} />
                                    <Skeleton height={12} width={80} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            }
            channels={
                <Card>
                    <div className="space-y-8">
                        <Skeleton height={12} width={160} />
                        <div className="flex items-center gap-2">
                            <Skeleton height={12} width={100} />
                            <Skeleton height={12} width={30} />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 50 }).map((_, index) => (
                                    <Skeleton key={index} height={32} />
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton height={12} width={60} />
                                <Skeleton height={12} width={60} />
                                <Skeleton height={12} width={60} />
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3"
                                >
                                    <Skeleton height={12} width={120} />
                                    <Skeleton height={12} width={80} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            }
            cashRunway={
                <Card bodyClass="flex flex-col gap-4 h-full">
                    <Skeleton height={12} width={120} />
                    <div className="flex flex-col justify-between flex-1 space-y-4">
                        {/* Cash section */}
                        <div className="flex gap-4">
                            <div className="flex flex-col justify-center w-64 space-y-2">
                                <Skeleton height={16} width={80} />
                                <Skeleton height={12} width={140} />
                                <Skeleton height={12} width={200} />
                            </div>
                            <div className="flex-1">
                                <Skeleton height={160} />
                            </div>
                        </div>
                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-600"></div>
                        {/* Runway section */}
                        <div className="flex gap-4">
                            <div className="flex flex-col justify-center w-64 space-y-2">
                                <Skeleton height={16} width={60} />
                                <Skeleton height={12} width={160} />
                                <Skeleton height={12} width={180} />
                            </div>
                            <div className="flex-1">
                                <Skeleton height={160} />
                            </div>
                        </div>
                    </div>
                </Card>
            }
            nrr={
                <Card>
                    <div className="space-y-8">
                        <Skeleton height={12} width={160} />
                        <div>
                            <div className="flex items-end gap-2 mt-4">
                                <Skeleton height={12} width={80} />
                                <Skeleton height={12} width={60} />
                            </div>
                            <div className="mt-2 flex items-center gap-1">
                                <Skeleton height={12} width={40} />
                                <Skeleton height={12} width={80} />
                            </div>
                        </div>
                        <Skeleton height={180} />
                        <div className="space-y-4">
                            <Skeleton height={6} width="100%" />
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center"
                                    >
                                        <Skeleton height={12} width={100} />
                                        <Skeleton height={12} width={60} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            }
            churn={
                <Card>
                    <div className="space-y-8">
                        <Skeleton height={12} width={120} />
                        <div className="grid grid-cols-2 gap-8">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index}>
                                    <div className="mb-4">
                                        <Skeleton height={12} width={100} />
                                    </div>
                                    <div className="mb-1">
                                        <Skeleton height={12} width={60} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton height={12} width={80} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="mb-4">
                                <Skeleton height={12} width={140} />
                            </div>
                            <div className="space-y-2">
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {Array.from({ length: 8 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-3"
                                            >
                                                <Skeleton
                                                    height={12}
                                                    width={120}
                                                />
                                                <Skeleton
                                                    height={12}
                                                    width={80}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            }
            plans={
                <Card>
                    <div className="space-y-8">
                        <Skeleton height={12} width={140} />
                        <div className="flex justify-center h-60 items-center">
                            <Skeleton
                                variant="circle"
                                height={180}
                                width={180}
                            />
                        </div>
                        <Table compact hoverable>
                            <THead>
                                <Tr className="bg-transparent">
                                    <Th>
                                        <Skeleton height={12} width={80} />
                                    </Th>
                                    <Th>
                                        <Skeleton height={12} width={80} />
                                    </Th>
                                    <Th>
                                        <Skeleton height={12} width={80} />
                                    </Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                <Skeleton
                                                    className="rounded-lg"
                                                    height={20}
                                                    width={20}
                                                />
                                                <Skeleton
                                                    height={12}
                                                    width={80}
                                                />
                                            </div>
                                        </Td>
                                        <Td>
                                            <Skeleton height={12} width={40} />
                                        </Td>
                                        <Td>
                                            <Skeleton height={12} width={60} />
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </div>
                </Card>
            }
            atRiskAccounts={
                <Card>
                    <div className="space-y-8">
                        <div>
                            <Skeleton height={12} width={140} />
                        </div>

                        <Table compact hoverable>
                            <THead>
                                <Tr className="bg-transparent">
                                    <Th>
                                        <Skeleton height={12} width={80} />
                                    </Th>
                                    <Th>
                                        <div className="flex justify-end">
                                            <Skeleton height={12} width={80} />
                                        </div>
                                    </Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <div className="flex items-center gap-4 py-2">
                                                <Skeleton
                                                    className="rounded-lg"
                                                    height={36}
                                                    width={36}
                                                />
                                                <div>
                                                    <div className="mb-1">
                                                        <Skeleton
                                                            height={12}
                                                            width={100}
                                                        />
                                                    </div>
                                                    <Skeleton
                                                        height={12}
                                                        width={60}
                                                    />
                                                </div>
                                            </div>
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end">
                                                <Skeleton
                                                    height={12}
                                                    width={80}
                                                />
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </div>
                </Card>
            }
            trialFunnel={
                <Card
                    className="flex flex-col"
                    bodyClass="h-full relative flex flex-col"
                >
                    <div className="mb-4">
                        <Skeleton height={12} width={100} />
                    </div>
                    <div className="flex-1 relative">
                        <div className="grid grid-cols-4 h-full gap-1">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="py-2">
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="flex-1 border-r border-gray-200 dark:border-gray-700 px-2 space-y-2 flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <Skeleton
                                                    height={12}
                                                    width={60}
                                                />
                                                <Skeleton
                                                    height={12}
                                                    width={40}
                                                />
                                            </div>
                                            <Skeleton
                                                height={`${100 / (index + 1)}%`}
                                            />
                                        </div>
                                        <div className="space-y-2 px-2 pt-2">
                                            {Array.from({ length: 3 }).map(
                                                (_, metricIndex) => (
                                                    <div
                                                        key={metricIndex}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Skeleton
                                                            height={12}
                                                            width={60}
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            }
            platformStability={
                <Card>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Skeleton height={12} width={140} />
                            <Skeleton height={12} width={200} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="space-y-2">
                                    <Skeleton height={12} width={120} />
                                    <Skeleton height={12} width={80} />
                                    <Skeleton height={12} width={100} />
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600"></div>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Skeleton height={12} width={180} />
                                <Skeleton height={6} width="100%" />
                            </div>
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                            <Skeleton height={12} width={120} />
                                        </div>
                                        <Skeleton height={12} width={80} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton height={12} width={100} />
                                <Skeleton height={12} width={60} />
                            </div>
                        </div>
                    </div>
                </Card>
            }
        />
    )
}

export default AnalyticDashboardLoaders
