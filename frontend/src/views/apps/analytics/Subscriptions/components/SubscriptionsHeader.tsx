import { useState } from 'react'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { useSubscriptionAnalyticsStore } from '@/views/apps/analytics/Subscriptions/store/subscriptionAnalyticsStore'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'

type DateRangePreset = '180D' | '30D' | '90D' | '1Y'

const dateRangePresets: Array<{
    value: DateRangePreset
    label: string
    shortLabel: string
}> = [
    { value: '30D', label: '1 Month', shortLabel: '1m' },
    { value: '90D', label: '3 Months', shortLabel: '3m' },
    { value: '180D', label: '6 Months', shortLabel: '6m' },
    { value: '1Y', label: '1 Year', shortLabel: '1y' },
]

const getDateRangeFromPreset = (preset: DateRangePreset) => {
    const now = dayjs()
    let startDate: dayjs.Dayjs

    switch (preset) {
        case '30D':
            startDate = now.subtract(30, 'day')
            break
        case '90D':
            startDate = now.subtract(90, 'day')
            break
        case '180D':
            startDate = now.subtract(180, 'day')
            break
        case '1Y':
            startDate = now.subtract(1, 'year')
            break
        default:
            startDate = now.subtract(30, 'day')
    }

    return {
        startDate: startDate.toDate(),
        endDate: now.toDate(),
    }
}

const SubscriptionsHeader = () => {
    const { setDateRange } = useSubscriptionAnalyticsStore()
    const [datePickerValue, setDatePickerValue] = useState('180D')
    const { larger } = useResponsive()

    const handleDateRangeChange = (label: DateRangePreset) => {
        const dates = getDateRangeFromPreset(label as DateRangePreset)
        if (dates) {
            setDatePickerValue(label)
            setDateRange({
                startDate: dates.startDate,
                endDate: dates.endDate,
            })
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
                <h4>Subscription Analytics</h4>
                <p>
                    Comprehensive insights into your subscriber lifecycle and
                    growth patterns
                </p>
            </div>
            <div className="flex-shrink-0">
                <InputGroup>
                    {dateRangePresets.map((preset) => (
                        <Button
                            key={preset.value}
                            active={datePickerValue === preset.value}
                            clickFeedback={false}
                            onClick={() => handleDateRangeChange(preset.value)}
                            block
                        >
                            {larger.sm ? preset.label : preset.shortLabel}
                        </Button>
                    ))}
                </InputGroup>
            </div>
        </div>
    )
}

export default SubscriptionsHeader
