import { useState, useMemo } from 'react'
import Drawer from '@/components/ui/Drawer'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import { statusMap, priorityMap, categoriesMap } from '../utils'
import { useHelpdeskStore } from '../store/helpdeskStore'
import type { Filter } from '../types'

const TicketListFilter = () => {
    const filterDrawerOpen = useHelpdeskStore((state) => state.filterDrawerOpen)
    const setFilterDrawerOpen = useHelpdeskStore(
        (state) => state.setFilterDrawerOpen,
    )
    const setFilterData = useHelpdeskStore((state) => state.setFilterData)
    const filterData = useHelpdeskStore((state) => state.filterData)

    const [filterDataTemp, setFilterDataTemp] = useState<Filter>(filterData)

    const statusList = useMemo(
        () =>
            Object.entries(statusMap).map(([key]) => ({
                label: key,
                value: key,
            })),
        [],
    )

    const priorityList = useMemo(
        () =>
            Object.entries(priorityMap).map(([key]) => ({
                label: key,
                value: key,
            })),
        [],
    )

    const categoryList = useMemo(
        () =>
            Object.entries(categoriesMap).map(([key]) => ({
                label: key,
                value: key,
            })),
        [],
    )

    const handleSetFilterData = () => {
        setFilterData({
            ...filterDataTemp,
        })
        setFilterDrawerOpen(false)
    }

    const handleResetFilterData = () => {
        setFilterDataTemp({
            status: [],
            priority: [],
            category: [],
            query: '',
        })
    }

    const handleStatusCheck = (status: string[]) => {
        setFilterDataTemp((prev) => ({
            ...prev,
            status,
        }))
    }

    const handlePriorityCheck = (priority: string[]) => {
        setFilterDataTemp((prev) => ({
            ...prev,
            priority,
        }))
    }

    const handleCategoryCheck = (category: string[]) => {
        setFilterDataTemp((prev) => ({
            ...prev,
            category,
        }))
    }

    return (
        <Drawer
            isOpen={filterDrawerOpen}
            title="Filter"
            onClose={() => setFilterDrawerOpen(false)}
            placement="left"
            width={300}
            footer={
                <div className="space-y-3 w-full">
                    <Button block onClick={handleResetFilterData}>
                        Reset
                    </Button>
                    <Button block variant="solid" onClick={handleSetFilterData}>
                        Apply
                    </Button>
                </div>
            }
            footerClass="border-0"
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="heading-text font-medium">Status</div>
                    <Checkbox.Group
                        vertical
                        className="gap-0"
                        value={filterDataTemp.status}
                        onChange={handleStatusCheck}
                    >
                        {statusList.map((item, index) => (
                            <Checkbox
                                key={index}
                                value={item.value}
                                className="hover:bg-gray-100 hover:dark:bg-gray-700 rounded py-1.5 px-2 flex-row-reverse justify-between"
                            >
                                {item.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="heading-text font-medium">Priority</div>
                    <Checkbox.Group
                        vertical
                        className="gap-0"
                        value={filterDataTemp.priority}
                        onChange={handlePriorityCheck}
                    >
                        {priorityList.map((item, index) => (
                            <Checkbox
                                key={index}
                                value={item.value}
                                className="hover:bg-gray-100 hover:dark:bg-gray-700 rounded py-1.5 px-2 flex-row-reverse justify-between"
                            >
                                {item.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="heading-text font-medium">Category</div>
                    <Checkbox.Group
                        vertical
                        className="gap-0"
                        value={filterDataTemp.category}
                        onChange={handleCategoryCheck}
                    >
                        {categoryList.map((item, index) => (
                            <Checkbox
                                key={index}
                                value={item.value}
                                className="hover:bg-gray-100 hover:dark:bg-gray-700 rounded py-1.5 px-2 flex-row-reverse justify-between"
                            >
                                {item.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>
            </div>
        </Drawer>
    )
}

export default TicketListFilter
