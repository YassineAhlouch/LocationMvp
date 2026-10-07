import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import StatisticCard from '@/components/shared/StatisticCard'
import IconFrame from '@/components/shared/IconFrame'
import formatNumber from '@/utils/formatNumber'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'
import type { ReactNode } from 'react'

export type MetricCardProps = {
    title: string
    value: number | string
    change: number
    icon?: ReactNode
    formatter?: (value: number) => string
}
const MetricCard = ({
    title,
    value,
    change,
    icon,
    formatter,
}: MetricCardProps) => {
    const comparisonEnabled = useSalesDashboardStore(
        (state) => state.comparisonEnabled,
    )

    const formatValue = (val: number | string): string => {
        if (typeof val === 'string') return val
        if (formatter) return formatter(val)
        return formatNumber(val)
    }

    return (
        <StatisticCard
            inset
            footer={
                comparisonEnabled && (
                    <div className="flex items-center justify-between gap-2 py-0.5 px-2">
                        <GrowShrinkTag
                            value={change}
                            suffix="%"
                            showIcon={true}
                            className="bg-transparent px-0 font-semibold"
                        />
                        <span>vs last period</span>
                    </div>
                )
            }
        >
            <div className="flex items-center gap-4">
                <IconFrame>
                    <span className="text-xl heading-text">{icon}</span>
                </IconFrame>
            </div>
            <div className="mt-4">
                <p>{title}</p>
                <h4>{formatValue(value)}</h4>
            </div>
        </StatisticCard>
    )
}

export default MetricCard
