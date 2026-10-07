import DebounceInput from '@/components/shared/DebouceInput'
import Button from '@/components/ui/Button'
import PopoverFilter from '@/components/shared/PopoverFilter'
import useReportsData from '../hooks/useReportsData'
import { useReportsStore } from '../store/reportStore'
import { LiGrid9, LiSearch } from '@/icons'
import ReportFilters from './ReportFilters'
import useResponsive from '@/utils/hooks/useResponsive'
import { useMemo } from 'react'

const ReportActionTools = () => {
    const visibleColumns = useReportsStore((state) => state.visibleColumns)
    const setVisibleColumns = useReportsStore(
        (state) => state.setVisibleColumns,
    )
    const { filterState, setQueryParams } = useReportsData()
    const { larger } = useResponsive()
    const allColumns = useMemo(
        () => [
            'plan',
            'featureUsed',
            'device',
            'customer',
            'email',
            'amount',
            'paymentMethod',
            'status',
            'country',
            'signupDate',
            'lastActive',
            'mrrRange',
            'autoRenewal',
        ],
        [],
    )

    const handleSearch = (query: string) => {
        setQueryParams({ query, pageIndex: 1 })
    }

    const renderReportFilters = () => (
        <ReportFilters filters={filterState} onFiltersChange={setQueryParams} />
    )

    const toReadableText = (str: string) => {
        const withSpaces = str.replace(/([A-Z])/g, ' $1')
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
    }

    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 sm:flex-none">
                        <DebounceInput
                            wait={300}
                            placeholder={`Search...`}
                            prefix={<LiSearch />}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <PopoverFilter
                            data={allColumns.map((col) => ({
                                label: toReadableText(col),
                                value: col,
                            }))}
                            value={visibleColumns}
                            onChange={(selected) =>
                                setVisibleColumns(
                                    selected.map((item) => item.value),
                                )
                            }
                            placement="bottom-end"
                            title="Columns"
                            showReset={false}
                            renderTrigger={
                                <Button icon={<LiGrid9 />}>
                                    {larger.sm ? 'Column View' : ''}
                                </Button>
                            }
                        />
                        {renderReportFilters()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportActionTools
