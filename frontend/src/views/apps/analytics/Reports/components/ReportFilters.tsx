import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Popover from '@/components/ui/Popover'
import AdvancedFilterBuilder from '@/components/shared/AdvancedFilterBuilder'
import { LiSetting4 } from '@/icons'
import useResponsive from '@/utils/hooks/useResponsive'
import type {
    FieldConfig,
    RuleGroup,
} from '@/components/shared/AdvancedFilterBuilder'
import { parseQueryString } from '@/components/shared/AdvancedFilterBuilder/utils'
import { useSearchParams } from 'react-router'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

type ReportFiltersProps = {
    filters?: Record<string, unknown>
    onFiltersChange: (filters: Record<string, unknown>) => void
}

const fieldList: FieldConfig[] = [
    { key: 'signupDate', label: 'Signup Date', type: 'date' },
    { key: 'lastActive', label: 'Last Active', type: 'date' },
    {
        key: 'plan',
        label: 'Plan',
        type: 'select',
        options: [
            { label: 'Basic', value: 'Basic' },
            { label: 'Standard', value: 'Standard' },
            { label: 'Pro', value: 'Pro' },
        ],
    },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'Paid', value: 'Paid' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Failed', value: 'Failed' },
            { label: 'Refunded', value: 'Refunded' },
        ],
    },
    {
        key: 'paymentMethod',
        label: 'Payment Method',
        type: 'select',
        options: [
            { label: 'Credit Card', value: 'Credit Card' },
            { label: 'PayPal', value: 'PayPal' },
            { label: 'Bank Transfer', value: 'Bank Transfer' },
            { label: 'Stripe', value: 'Stripe' },
        ],
    },
    { key: 'amount', label: 'Amount', type: 'number' },
    {
        key: 'feature',
        label: 'Feature',
        type: 'select',
        options: [
            { label: 'Dashboard View', value: 'Dashboard View' },
            { label: 'Report Generation', value: 'Report Generation' },
            { label: 'Data Export', value: 'Data Export' },
            { label: 'User Management', value: 'User Management' },
            { label: 'Analytics View', value: 'Analytics View' },
            { label: 'File Upload', value: 'File Upload' },
            { label: 'API Access', value: 'API Access' },
            { label: 'Custom Charts', value: 'Custom Charts' },
            { label: 'Team Collaboration', value: 'Team Collaboration' },
            { label: 'Data Import', value: 'Data Import' },
            { label: 'Notification Settings', value: 'Notification Settings' },
            { label: 'Profile Update', value: 'Profile Update' },
        ],
    },
    {
        key: 'device',
        label: 'Device',
        type: 'select',
        options: [
            { label: 'Desktop', value: 'Desktop' },
            { label: 'Mobile', value: 'Mobile' },
            { label: 'Tablet', value: 'Tablet' },
        ],
    },
    {
        key: 'country',
        label: 'Country',
        type: 'select',
        options: [
            { label: 'United States', value: 'US' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Canada', value: 'CA' },
            { label: 'Germany', value: 'DE' },
            { label: 'France', value: 'FR' },
            { label: 'Japan', value: 'JP' },
            { label: 'Australia', value: 'AU' },
            { label: 'Brazil', value: 'BR' },
            { label: 'India', value: 'IN' },
            { label: 'Turkey', value: 'TR' },
        ],
    },
]

const ReportFilters = ({ onFiltersChange }: ReportFiltersProps) => {
    const [currentFilter, setCurrentFilter] = useState<RuleGroup>()
    const [filterOpen, setFilterOpen] = useState(false)
    const [queryParam] = useSearchParams()
    const { onAppendQueryParams } = useAppendQueryParams()
    const { larger } = useResponsive()

    useEffect(() => {
        const filterQuery = queryParam.get('filter') || ''
        const parsed = parseQueryString(filterQuery)
        setCurrentFilter(parsed)
    }, [queryParam])

    const handleFilterChange = (filter: RuleGroup) => {
        setCurrentFilter(filter)
    }

    const handleApplyFilter = (queryString: string) => {
        setFilterOpen(false)
        onAppendQueryParams({ filter: queryString }, { replace: true })
        onFiltersChange({ filter: queryString })
    }

    return (
        <Popover
            renderTrigger={
                <Button
                    icon={<LiSetting4 />}
                    onClick={() => setFilterOpen(!filterOpen)}
                >
                    {larger.sm && (
                        <span className="flex items-center gap-1">
                            <span>Filter</span>
                            {queryParam.get('filter') &&
                                currentFilter &&
                                currentFilter.children && (
                                    <span className="text-xs bg-primary text-white w-4.5 h-4.5 flex items-center justify-center rounded">
                                        {currentFilter.children.length}
                                    </span>
                                )}
                        </span>
                    )}
                </Button>
            }
            open={filterOpen}
            placement="bottom-end"
            onOpenChange={setFilterOpen}
            className="p-0"
            width={'auto'}
        >
            <AdvancedFilterBuilder
                value={currentFilter}
                fields={fieldList}
                onChange={handleFilterChange}
                onApply={(_, queryString) => {
                    handleApplyFilter(queryString)
                }}
                onReset={() => {
                    onAppendQueryParams({ filter: '' }, { replace: true })
                    onFiltersChange({ filter: '' })
                }}
            />
        </Popover>
    )
}

export default ReportFilters
export type {}
