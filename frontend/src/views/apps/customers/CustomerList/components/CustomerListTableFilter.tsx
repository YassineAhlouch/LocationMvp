import { useState } from 'react'
import Popover from '@/components/ui/Popover'
import RangeCalendar from '@/components/ui/RangeCalendar'
import PopoverFilter from '@/components/shared/PopoverFilter'
import useCustomerList from '../hooks/useCustomerList'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiChevronDown, LiChevronUp, LiCalendar, LiTag } from '@/icons'
import dayjs from 'dayjs'

const customerLabels = [
    { label: 'VIP', value: 'VIP' },
    { label: 'Frequent Buyer', value: 'Frequent Buyer' },
    { label: 'First-Time Buyer', value: 'First-Time Buyer' },
    { label: 'Refund Risk', value: 'Refund Risk' },
    { label: 'New Customer', value: 'New Customer' },
    { label: 'High AOV', value: 'High AOV' },
    { label: 'Coupon User', value: 'Coupon User' },
    { label: 'Manual Review', value: 'Manual Review' },
    { label: 'International', value: 'International' },
]

const CustomerListTableFilter = () => {
    const [dateRangePopoverOpen, setDateRangePopoverOpen] = useState(false)

    const { filterData, setFilterData } = useCustomerList()
    const { larger } = useResponsive()

    const convertStringToDate = (
        dateString: [string, string],
    ): [Date | null, Date | null] => {
        const [startDate, endDate] = dateString

        if (!startDate || !endDate) {
            return [null, null]
        }

        return [new Date(startDate), new Date(endDate)]
    }

    const convertDateToString = (
        date: [Date | null, Date | null],
    ): [string, string] => {
        const [startDate, endDate] = date

        if (!startDate || !endDate) {
            return ['', '']
        }

        return [startDate.toISOString(), endDate.toISOString()]
    }

    const renderDateRangePopoverTitle = (dateString: [string, string]) => {
        const [startDate, endDate] = dateString
        let title = `${dayjs(startDate).format('MMM DD')} - ${dayjs(endDate).format('MMM DD')}`

        if (!startDate) {
            title = 'Date Range'
        }

        // Mobile: show only icon
        if (!larger.md) {
            return <LiCalendar className="text-lg" />
        }

        // Desktop: show text with chevron
        return (
            <span className="flex items-center gap-2">
                {title}
                {dateRangePopoverOpen ? <LiChevronUp /> : <LiChevronDown />}
            </span>
        )
    }

    const renderCustomerLabelPopoverTitle = () => {
        let title = 'Customer Label'

        if (filterData.customerLabel.length === 1) {
            title =
                customerLabels.find(
                    (item) => item.value === filterData.customerLabel[0],
                )?.label || 'Customer Label'
        }

        if (filterData.customerLabel.length > 1) {
            title = `${filterData.customerLabel.length} selected`
        }

        // Mobile: show only icon
        if (!larger.md) {
            return <LiTag className="text-lg" />
        }

        // Desktop: show text
        return <span className="flex items-center gap-2">{title}</span>
    }

    return (
        <div className="flex items-center gap-2">
            <Popover
                title={renderDateRangePopoverTitle(filterData.dateRange)}
                open={dateRangePopoverOpen}
                placement="bottom-start"
                onOpenChange={setDateRangePopoverOpen}
                style={{ width: 280 }}
            >
                <RangeCalendar
                    value={convertStringToDate(filterData.dateRange)}
                    onChange={(data) => {
                        setFilterData({
                            dateRange: convertDateToString(data),
                        })
                        if (data[1]) {
                            setDateRangePopoverOpen(false)
                        }
                    }}
                />
            </Popover>
            <PopoverFilter
                data={customerLabels}
                title={renderCustomerLabelPopoverTitle()}
                onChange={(data) => {
                    setFilterData({
                        customerLabel: data.map((item) => item.value),
                    })
                }}
            />
        </div>
    )
}

export default CustomerListTableFilter
