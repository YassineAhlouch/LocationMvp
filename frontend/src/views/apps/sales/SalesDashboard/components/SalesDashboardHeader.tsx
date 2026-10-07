import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import Switcher from '@/components/ui/Switcher'
import { LiChevronDown } from '@/icons'
import { useSalesDashboardStore } from '@/views/apps/sales/SalesDashboard/store/salesDashboardStore'
import { formatDate } from '@/utils/formatDate'
import type { SalesDashboardHeaderProps, TimeRange } from '../types'

const SalesDashboardHeader = ({
    userName,
    currentDate,
}: SalesDashboardHeaderProps) => {
    const { timeRange, comparisonEnabled, setTimeRange, setComparisonEnabled } =
        useSalesDashboardStore()

    const formattedDate = useMemo(
        () => formatDate(currentDate, 'dddd, DD MMMM YYYY'),
        [currentDate],
    )

    const displayName = userName || 'User'

    const timeRangeOptions = [
        { key: 'thisWeek', label: 'This Week' },
        { key: 'thisMonth', label: 'This Month' },
        { key: 'thisQuarter', label: 'This Quarter' },
        { key: 'thisYear', label: 'This Year' },
    ]

    const currentTimeRangeLabel =
        timeRangeOptions.find((opt) => opt.key === timeRange)?.label ||
        'This Month'

    const handleTimeRangeSelect = (eventKey: string) => {
        setTimeRange(eventKey as TimeRange)
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
            <div>
                <h4>Hey, {displayName}</h4>
                <p className="mt-1">{formattedDate}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="heading-text">Comparison:</span>
                    <Switcher
                        checked={comparisonEnabled}
                        onChange={(checked) => setComparisonEnabled(checked)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="heading-text">Time Range:</span>
                    <Dropdown
                        activeKey={timeRange}
                        renderTitle={
                            <Button
                                icon={<LiChevronDown className="text-sm" />}
                                iconAlignment="end"
                            >
                                {currentTimeRangeLabel}
                            </Button>
                        }
                        placement="bottom-end"
                    >
                        {timeRangeOptions.map((option) => (
                            <Dropdown.Item
                                key={option.key}
                                eventKey={option.key}
                                onSelect={handleTimeRangeSelect}
                            >
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default SalesDashboardHeader
