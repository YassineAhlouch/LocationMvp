import { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Loading from '@/components/shared/Loading'
import classNames from '@/utils/classNames'

type ForecastCardProps = {
    title: string
    description: string
    children?: ReactNode
    loading?: boolean
    content: ReactNode | null
    graph: ReactNode | null
}

const ForecastCard = ({
    title,
    description,
    loading = false,
    content,
    graph,
}: ForecastCardProps) => {
    return (
        <Card>
            <div className="flex flex-col lg:flex-row gap-16">
                <div className="md:max-w-[350px] xl:w-[500px] flex flex-col gap-4">
                    {loading ? (
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <Skeleton height={12} width="60%" />
                                <Skeleton height={12} />
                            </div>
                            <div className="space-y-2">
                                <Skeleton height={12} width={80} />
                                <Skeleton height={12} width={120} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton height={12} width={60} />
                                    <Skeleton height={12} width={60} />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton height={12} width={60} />
                                    <Skeleton height={12} width={60} />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton height={12} width={60} />
                                    <Skeleton height={12} width={60} />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton height={12} width={60} />
                                    <Skeleton height={12} width={60} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <h5>{title}</h5>
                                <p>{description}</p>
                            </div>
                            {content}
                        </>
                    )}
                </div>
                <div
                    className={classNames(
                        'flex flex-1 xl:min-w-[600px]',
                        loading ? 'items-center' : 'items-end',
                    )}
                >
                    <div className="w-full">
                        {loading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <Loading loading />
                            </div>
                        ) : (
                            graph
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ForecastCard
