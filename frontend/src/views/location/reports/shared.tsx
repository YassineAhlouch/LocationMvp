import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import StatisticCard from '@/components/shared/StatisticCard'
import classNames from '@/utils/classNames'
import { LiChevronDown } from '@/icons'
import { MAD } from '../shared'
import type { ReactNode } from 'react'

dayjs.extend(quarterOfYear)

export type ReportRange =
    'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'

export const reportRangeOptions: { key: ReportRange; label: string }[] = [
    { key: 'thisWeek', label: 'This Week' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'thisQuarter', label: 'This Quarter' },
    { key: 'thisYear', label: 'This Year' },
]

/** Resolve a named range to the from/to strings the reports API expects. */
export const resolveReportRange = (
    range: ReportRange,
): { from: string; to: string } => {
    const now = dayjs()

    switch (range) {
        case 'thisWeek':
            return {
                from: now.startOf('week').format('YYYY-MM-DD'),
                to: now.endOf('week').format('YYYY-MM-DD'),
            }
        case 'thisQuarter':
            return {
                from: now.startOf('quarter').format('YYYY-MM-DD'),
                to: now.endOf('quarter').format('YYYY-MM-DD'),
            }
        case 'thisYear':
            return {
                from: now.startOf('year').format('YYYY-MM-DD'),
                to: now.endOf('year').format('YYYY-MM-DD'),
            }
        case 'thisMonth':
        default:
            return {
                from: now.startOf('month').format('YYYY-MM-DD'),
                to: now.endOf('month').format('YYYY-MM-DD'),
            }
    }
}

type ReportHeaderProps = {
    title: string
    description: string
    range: ReportRange
    onRangeChange: (range: ReportRange) => void
    actions?: ReactNode
}

/** Title + description on the left, named period picker on the right. */
export const ReportHeader = ({
    title,
    description,
    range,
    onRangeChange,
    actions,
}: ReportHeaderProps) => {
    const currentLabel =
        reportRangeOptions.find((option) => option.key === range)?.label ??
        'This Month'

    return (
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {actions}
                <Dropdown
                    activeKey={range}
                    renderTitle={
                        <Button
                            icon={<LiChevronDown className="text-sm" />}
                            iconAlignment="end"
                        >
                            {currentLabel}
                        </Button>
                    }
                    placement="bottom-end"
                >
                    {reportRangeOptions.map((option) => (
                        <Dropdown.Item
                            key={option.key}
                            eventKey={option.key}
                            onSelect={(eventKey) =>
                                onRangeChange(eventKey as ReportRange)
                            }
                        >
                            {option.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            </div>
        </div>
    )
}

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
                                : (item.formatter ?? MAD)(item.value)}
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
