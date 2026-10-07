import { useState } from 'react'
import Button from '@/components/ui/Button'
import Popover from '@/components/ui/Popover'
import Dropdown from '@/components/ui/Dropdown'
import Segment from '@/components/ui/Segment'
import DebouceInput from '@/components/shared/DebouceInput'
import AdvancedFilterBuilder from '@/components/shared/AdvancedFilterBuilder'
import useOrderListData from '../hooks/useOrderListData'
import useResponsive from '@/utils/hooks/useResponsive'
import {
    LiSetting4,
    LiArrowDown,
    LiArrowUp,
    LiTickCircle,
    LiSearch,
} from '@/icons'
import type {
    FieldConfig,
    RuleGroup,
} from '@/components/shared/AdvancedFilterBuilder'

const fieldList: FieldConfig[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' },
        ],
    },
    { key: 'orderId', label: 'Order ID', type: 'text' },
    { key: 'productCount', label: 'Item Count', type: 'number' },
    { key: 'created_at', label: 'Created Date', type: 'date' },
    { key: 'customer', label: 'Customer Name', type: 'text' },
    { key: 'paid', label: 'Paid', type: 'boolean' },
]

const OrderListTableTools = () => {
    const { pagingState, setQueryParams } = useOrderListData()

    const [currentFilter, setCurrentFilter] = useState<RuleGroup>()

    const [currentSortOrder, setCurrentSortOrder] = useState<string>('asc')

    const [filterOpen, setFilterOpen] = useState(false)

    const { larger } = useResponsive()

    const handleFilterChange = (filter: RuleGroup) => {
        setCurrentFilter(filter)
    }

    const handleApplyFilter = (queryString: string) => {
        setFilterOpen(false)
        setQueryParams({ filter: queryString })
    }

    const handleSorting = (sortKey: string) => {
        setQueryParams({ sortKey, sortOrder: currentSortOrder })
    }

    const getSortButtonLabel = () => {
        const sortField = fieldList.find(
            (field) => field.key === pagingState.sortKey,
        )
        return sortField ? `Sort by: ${sortField.label}` : 'Sort'
    }

    const handleQuery = (query: string) => {
        setQueryParams({ query })
    }

    const handleResetSort = () => {
        setQueryParams({ sortKey: '', sortOrder: '' })
        setCurrentSortOrder('asc')
    }

    return (
        <div className="flex items-center justify-between gap-2 print:hidden">
            <div className="flex-1 sm:flex-none sm:min-w-[250px]">
                <DebouceInput
                    prefix={<LiSearch className="heading-text" />}
                    placeholder="Search orders..."
                    onChange={(e) => handleQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <Dropdown
                    placement="bottom-end"
                    renderTitle={
                        <Button
                            icon={
                                currentSortOrder === 'asc' ? (
                                    <LiArrowUp />
                                ) : (
                                    <LiArrowDown />
                                )
                            }
                        >
                            {larger.sm ? (
                                <span className="flex items-center gap-1">
                                    {getSortButtonLabel()}
                                </span>
                            ) : (
                                ''
                            )}
                        </Button>
                    }
                >
                    <div className="mb-1">
                        <Segment
                            value={currentSortOrder}
                            className="w-full"
                            onChange={setCurrentSortOrder}
                        >
                            <Segment.Item value="asc">
                                <span className="flex items-center gap-1">
                                    <LiArrowUp />
                                    <span>Asc</span>
                                </span>
                            </Segment.Item>
                            <Segment.Item value="desc">
                                <span className="flex items-center gap-1">
                                    <LiArrowDown />
                                    <span>Desc</span>
                                </span>
                            </Segment.Item>
                        </Segment>
                    </div>
                    {fieldList.map((field) => (
                        <Dropdown.Item
                            key={field.key}
                            onClick={() => handleSorting(field.key)}
                            active={pagingState.sortKey === field.key}
                        >
                            <span className="flex items-center justify-between w-full">
                                <span>{field.label}</span>
                                {pagingState.sortKey === field.key && (
                                    <LiTickCircle />
                                )}
                            </span>
                        </Dropdown.Item>
                    ))}
                    {pagingState.sortKey && (
                        <>
                            <Dropdown.Item variant="divider" />
                            <Dropdown.Item onClick={handleResetSort}>
                                <span className="text-error">Reset Sort</span>
                            </Dropdown.Item>
                        </>
                    )}
                </Dropdown>
                <Popover
                    renderTrigger={
                        <Button icon={<LiSetting4 />}>
                            {larger.sm && (
                                <span className="flex items-center gap-1">
                                    Filter{' '}
                                    {currentFilter &&
                                        currentFilter.children.length > 1 && (
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
                >
                    <AdvancedFilterBuilder
                        value={currentFilter}
                        fields={fieldList}
                        onChange={handleFilterChange}
                        onApply={(_, queryString) =>
                            handleApplyFilter(queryString)
                        }
                    />
                </Popover>
            </div>
        </div>
    )
}

export default OrderListTableTools
