import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Table from '@/components/ui/Table'
import OverallTasks from './components/OverallTasks'
import EffortTracking from './components/EffortTracking'
import ProjectProgress from './components/ProjectProgress'
import TimelineSection from './components/ProjectTimeline'
import ProjectList from './components/ProjectList'
import useProjectDashboard from './hooks/useProjectDashboard'
import { Fragment } from 'react'

const ProjectDashboard = () => {
    const { dashboardData, isLoading } = useProjectDashboard()

    const widgetSkeletonHeader = (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Skeleton height={32} width={32} />
                <Skeleton height={10} width={100} />
            </div>
            <Skeleton height={10} width={80} />
        </div>
    )

    return (
        <Container>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {isLoading ? (
                        <>
                            <Card
                                header={{
                                    content: widgetSkeletonHeader,
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <Skeleton
                                        variant="circle"
                                        height={180}
                                        width={180}
                                    />
                                    <div className="flex flex-col gap-4 flex-1">
                                        <Skeleton
                                            height={20}
                                            width={60}
                                            className="mb-2"
                                        />
                                        <div className="space-y-4">
                                            {Array.from({ length: 3 }).map(
                                                (_, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <Skeleton
                                                                height={10}
                                                                width={10}
                                                                variant="circle"
                                                            />
                                                            <Skeleton
                                                                height={10}
                                                                width="50%"
                                                            />
                                                        </div>
                                                        <Skeleton
                                                            height={10}
                                                            width={30}
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card
                                header={{
                                    content: widgetSkeletonHeader,
                                }}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="space-y-4">
                                        <Skeleton height={10} width={130} />
                                        <Skeleton height={10} width={150} />
                                    </div>
                                    <Skeleton height={130} />
                                </div>
                            </Card>
                            <Card
                                header={{
                                    content: widgetSkeletonHeader,
                                }}
                                className="md:col-span-2 xl:col-span-1"
                            >
                                <div className="space-y-8 pt-8">
                                    {Array.from({ length: 2 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Skeleton
                                                        height={10}
                                                        width={130}
                                                    />
                                                    <Skeleton
                                                        height={10}
                                                        width={100}
                                                    />
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {Array.from({
                                                        length: 50,
                                                    }).map((_, segIndex) => (
                                                        <Skeleton
                                                            key={segIndex}
                                                            height={28}
                                                            className="flex-1 rounded-none"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </Card>
                        </>
                    ) : (
                        <>
                            {dashboardData?.taskDistribution && (
                                <OverallTasks
                                    data={dashboardData.taskDistribution}
                                />
                            )}
                            {dashboardData?.performance && (
                                <EffortTracking
                                    data={dashboardData.performance}
                                />
                            )}
                            {dashboardData?.progress && (
                                <ProjectProgress
                                    data={dashboardData.progress}
                                    className="md:col-span-2 xl:col-span-1"
                                />
                            )}
                        </>
                    )}
                </div>
                {isLoading ? (
                    <>
                        <Card
                            header={{
                                content: widgetSkeletonHeader,
                            }}
                            bodyClass="p-0"
                        >
                            <Table hoverable={false}>
                                <Table.THead>
                                    <Table.Tr className="bg-transparent">
                                        <Table.Th className="w-[150px]">
                                            <Skeleton height={10} />
                                        </Table.Th>
                                        <Table.Th className="w-[150px]">
                                            <Skeleton height={10} />
                                        </Table.Th>
                                        {Array.from({ length: 10 }).map(
                                            (_, index) => (
                                                <Table.Th
                                                    key={index}
                                                    className="py-8"
                                                >
                                                    <Skeleton
                                                        height={10}
                                                        width={30}
                                                    />
                                                </Table.Th>
                                            ),
                                        )}
                                    </Table.Tr>
                                </Table.THead>
                                <Table.TBody>
                                    {Array.from({ length: 10 }).map(
                                        (_, rowIndex) => (
                                            <Fragment key={rowIndex}>
                                                <Table.Tr key={rowIndex}>
                                                    {Array.from({
                                                        length: 2,
                                                    }).map((_, cellIndex) => (
                                                        <Table.Td
                                                            key={cellIndex}
                                                            className="max-w-[150px]"
                                                        >
                                                            <Skeleton
                                                                height={10}
                                                                width={100}
                                                            />
                                                        </Table.Td>
                                                    ))}
                                                    <Table.Td
                                                        className="w-full border-l border-gray-200 dark:border-gray-700"
                                                        colSpan={10}
                                                    >
                                                        <Skeleton height={10} />
                                                    </Table.Td>
                                                </Table.Tr>
                                            </Fragment>
                                        ),
                                    )}
                                </Table.TBody>
                            </Table>
                        </Card>
                        <Card
                            header={{
                                content: widgetSkeletonHeader,
                            }}
                            bodyClass="p-0"
                        >
                            <Table hoverable={false}>
                                <Table.THead>
                                    <Table.Tr>
                                        {Array.from({ length: 5 }).map(
                                            (_, index) => (
                                                <Table.Th key={index}>
                                                    <Skeleton
                                                        height={10}
                                                        width={60}
                                                    />
                                                </Table.Th>
                                            ),
                                        )}
                                    </Table.Tr>
                                </Table.THead>
                                <Table.TBody>
                                    {Array.from({ length: 6 }).map(
                                        (_, rowIndex) => (
                                            <Fragment key={rowIndex}>
                                                <Table.Tr key={rowIndex}>
                                                    <Table.Td>
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton
                                                                height={25}
                                                                width={25}
                                                            />
                                                            <Skeleton
                                                                height={10}
                                                                width={80}
                                                            />
                                                        </div>
                                                    </Table.Td>
                                                    {Array.from({
                                                        length: 4,
                                                    }).map((_, cellIndex) => (
                                                        <Table.Td
                                                            key={cellIndex}
                                                            className="max-w-[150px]"
                                                        >
                                                            <Skeleton
                                                                height={10}
                                                                width={100}
                                                            />
                                                        </Table.Td>
                                                    ))}
                                                </Table.Tr>
                                            </Fragment>
                                        ),
                                    )}
                                </Table.TBody>
                            </Table>
                        </Card>
                    </>
                ) : (
                    <>
                        {dashboardData?.timeline && (
                            <TimelineSection data={dashboardData.timeline} />
                        )}

                        {dashboardData?.projects && (
                            <ProjectList data={dashboardData.projects} />
                        )}
                    </>
                )}
            </div>
        </Container>
    )
}

export default ProjectDashboard
