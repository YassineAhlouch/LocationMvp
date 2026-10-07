import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'
import HrmDashboardContainer from './HrmDashboardContainer'

const HrmDashboardLoaders = () => {
    const skelotonHeader = (
        <div className="flex items-center justify-between">
            <Skeleton height={12} width={160} />
            <Skeleton height={12} width={60} />
        </div>
    )

    return (
        <HrmDashboardContainer
            turnoverWidget={
                <Card>
                    <div className="space-y-8">
                        {skelotonHeader}
                        <div className="space-y-2">
                            <Skeleton height={12} width={60} />
                            <Skeleton height={12} width={120} />
                        </div>
                        <Skeleton height={270} />
                    </div>
                </Card>
            }
            jobLevelWidget={
                <Card>
                    <div className="space-y-8">
                        {skelotonHeader}
                        <div className="flex items-center justify-center h-[210px]">
                            <Skeleton
                                variant="circle"
                                height={180}
                                width={180}
                            />
                        </div>
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-1">
                                        <Skeleton
                                            variant="circle"
                                            height={10}
                                            width={10}
                                        />
                                        <Skeleton height={12} width={120} />
                                    </div>
                                    <Skeleton height={12} width={60} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            }
            payrollWidget={
                <Card>
                    <div className="space-y-8">
                        {skelotonHeader}
                        <div className="space-y-2">
                            <Skeleton height={12} width={60} />
                            <Skeleton height={12} width={120} />
                        </div>
                        <Skeleton height={200} />
                    </div>
                </Card>
            }
            employeeQualityWidget={
                <Card>
                    <div className="space-y-8">
                        {skelotonHeader}
                        <div className="space-y-2">
                            <Skeleton height={12} width={60} />
                            <Skeleton height={12} width={120} />
                        </div>
                        <Skeleton height={200} />
                    </div>
                </Card>
            }
            complianceWidget={
                <Card bodyClass="p-0">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700`">
                        {skelotonHeader}
                    </div>
                    <Table hoverable={false}>
                        <Table.THead>
                            <Table.Tr>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Table.Th key={index}>
                                        <Skeleton height={10} width={30} />
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.THead>
                        <Table.TBody>
                            {Array.from({ length: 8 }).map((_, rowIndex) => (
                                <Table.Tr key={rowIndex}>
                                    {Array.from({ length: 5 }).map(
                                        (_, cellIndex) => (
                                            <Table.Td
                                                key={cellIndex}
                                                className="max-w-[150px]"
                                            >
                                                <Skeleton
                                                    height={10}
                                                    width={100}
                                                />
                                            </Table.Td>
                                        ),
                                    )}
                                </Table.Tr>
                            ))}
                        </Table.TBody>
                    </Table>
                </Card>
            }
            eventsWidget={
                <Card>
                    <div className="space-y-8">
                        {skelotonHeader}
                        <div className="space-y-4">
                            {Array.from({ length: 15 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-1">
                                        <div className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 flex items-center justify-center">
                                            <Skeleton
                                                variant="circle"
                                                height={8}
                                                width={8}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton height={8} width={180} />
                                            <Skeleton height={8} width={120} />
                                        </div>
                                    </div>
                                    <Skeleton height={12} width={60} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            }
        />
    )
}

export default HrmDashboardLoaders
