import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Divider from '@/components/shared/Divider'
import formatCurrency from '@/utils/formatCurrency'
import IconFrame from '@/components/shared/IconFrame'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiDollarCircle } from '@/icons'
import type { PayrollMetrics } from '../types'

type TotalPaidCardProps = {
    totalAmount: number
    breakdown: PayrollMetrics['summary']
    loading?: boolean
}

const TotalPaidCard = ({
    totalAmount,
    breakdown,
    loading,
}: TotalPaidCardProps) => {
    const breakdownItems = [
        { label: 'Deductions', value: breakdown.deductions },
        { label: 'Extras', value: breakdown.extras },
        { label: 'Retentions', value: breakdown.retentions },
        { label: 'Additions', value: breakdown.additions },
    ]

    const { larger } = useResponsive()

    return (
        <Card bodyClass="h-full">
            <div className="flex flex-col sm:flex-row gap-4 2xl:gap-12 h-full">
                {loading ? (
                    <>
                        <div className="space-y-4 sm:space-y-12 sm:min-w-[240px] xl:min-w-auto 2xl:min-w-[270px]">
                            <div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <Divider
                            orientation={larger.sm ? 'vertical' : 'horizontal'}
                            className="h-[1px] sm:h-32 self-center"
                        />
                        <div className="space-y-4 flex flex-col justify-center flex-1">
                            <Skeleton className="h-3 w-28" />
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-4 sm:space-y-12 sm:min-w-[240px] xl:min-w-auto 2xl:min-w-[270px]">
                            <div>
                                <h5>Total Paid</h5>
                                <p>Net in this period</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <IconFrame variant="thick">
                                    <LiDollarCircle className="text-xl heading-text" />
                                </IconFrame>
                                <h3>{formatCurrency(totalAmount)}</h3>
                            </div>
                        </div>
                        <Divider
                            orientation={larger.sm ? 'vertical' : 'horizontal'}
                            className="h-[1px] sm:h-32 self-center"
                        />
                        <div className="space-y-4 flex flex-col justify-center flex-1">
                            <div>
                                <h6 className="mb-4">Breakdown</h6>
                                <div className="space-y-2">
                                    {breakdownItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <span>{item.label}</span>
                                            <span className="heading-text font-medium">
                                                ${item.value.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    )
}

export default TotalPaidCard
