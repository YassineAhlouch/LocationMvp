import dayjs from 'dayjs'
import Avatar from '@/components/ui/Avatar'
import StatisticCard from '@/components/shared/StatisticCard'
import PeriodPicker from '@/components/shared/PeriodPicker'
import classNames from '@/utils/classNames'
import { money } from '../shared'
import type { DateRange } from '@/components/shared/PeriodPicker'
import type { ReactNode } from 'react'

/** Resolve the selected period to the from/to strings the reports API expects. */
export const rangeToQuery = (
    range: DateRange,
): { from: string; to: string } => ({
    from: dayjs(range.from).format('YYYY-MM-DD'),
    to: dayjs(range.to).format('YYYY-MM-DD'),
})

type ReportHeaderProps = {
    title: string
    description: string
    range: DateRange
    onRangeChange: (range: DateRange) => void
    actions?: ReactNode
}

/** Title + description on the left, period picker on the right. */
export const ReportHeader = ({
    title,
    description,
    range,
    onRangeChange,
    actions,
}: ReportHeaderProps) => (
    <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            {actions}
            <PeriodPicker value={range} onChange={onRangeChange} />
        </div>
    </div>
)

export type ReportMetric = {
    key: string
    title: string
    value: number
    icon: ReactNode
    color: { iconBg: string; iconText: string }
    formatter?: (value: number) => string
}

type ReportMetricsProps = {
    items: ReportMetric[]
    loading: boolean
}

/** Four-up metric row, matching the Attendance/Payments statistic cards. */
export const ReportMetrics = ({ items, loading }: ReportMetricsProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {items.map((item) => (
            <StatisticCard key={item.key}>
                <div className="flex items-center gap-4">
                    <Avatar
                        className={classNames(
                            'border-0',
                            item.color.iconBg,
                            item.color.iconText,
                        )}
                    >
                        <span className="text-2xl">{item.icon}</span>
                    </Avatar>
                    <div>
                        <p>{item.title}</p>
                        <h4>
                            {loading
                                ? '--'
                                : (item.formatter ?? money)(item.value)}
                        </h4>
                    </div>
                </div>
            </StatisticCard>
        ))}
    </div>
)

/** Centered placeholder used by the report table bodies. */
export const ReportEmpty = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center p-8 text-sm text-gray-400">
        {message}
    </div>
)
