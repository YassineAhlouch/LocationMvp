import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import Container from '@/components/shared/Container'

import useEmployeeData from '../hooks/useEmployeeData'
import type { EmployeeStatus } from '../types'

const EmployeeHeader = () => {
    const { filterState, setQueryParams } = useEmployeeData()

    const handleStatusChange = (status: string) => {
        setQueryParams({ status: status as EmployeeStatus, pageIndex: 1 })
    }

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 mb-4">
            <Container className="px-4">
                <div className="flex flex-col gap-4 ">
                    <div className="flex justify-between">
                        <div>
                            <h4>Employees</h4>
                            <p className="text-sm mt-1">List of employees</p>
                        </div>
                        <Button onClick={() => {}}>Export</Button>
                    </div>

                    <div className="-mb-[1px]">
                        <Tabs
                            value={
                                (filterState.status as EmployeeStatus) ||
                                'active'
                            }
                            onChange={handleStatusChange}
                        >
                            <Tabs.TabList className="dark:border-gray-800">
                                <Tabs.TabNav value="active">Active</Tabs.TabNav>
                                <Tabs.TabNav value="inactive">
                                    Inactive
                                </Tabs.TabNav>
                                <Tabs.TabNav value="terminated">
                                    Terminated
                                </Tabs.TabNav>
                            </Tabs.TabList>
                        </Tabs>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default EmployeeHeader
