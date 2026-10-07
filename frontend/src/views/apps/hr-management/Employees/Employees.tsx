import { useCallback } from 'react'
import Container from '@/components/shared/Container'
import EmployeeContextProvider from './components/EmployeeContext'
import EmployeeHeader from './components/EmployeeHeader'
import EmployeeToolbar from './components/EmployeeToolbar'
import EmployeeGridView from './components/EmployeeGridView'
import EmployeeListView from './components/EmployeeListView'
import EmployeeDetailsDrawer from './components/EmployeeDetailsDrawer'
import AddEmployeeDrawer from './components/AddEmployeeDrawer'
import DeleteEmployeeDialog from './components/DeleteEmployeeDialog'
import BulkEditDialog from './components/BulkEditDialog'
import BulkDeleteDialog from './components/BulkDeleteDialog'
import BatchUploadDialog from './components/BatchUploadDialog'
import { useEmployeeStore } from './store/employeeStore'
import { useSearchParams } from 'react-router'

import type { Employee } from './types'

const Employees = () => {
    const { viewMode } = useEmployeeStore()
    const [searchParams, setSearchParams] = useSearchParams()

    const employeeId = searchParams.get('employee')

    const openEmployeeDetails = useCallback(
        (id: string) => {
            const newParams = new URLSearchParams(searchParams)
            newParams.set('employee', id)
            setSearchParams(newParams)
        },
        [searchParams, setSearchParams],
    )

    const closeEmployeeDetails = useCallback(() => {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('employee')
        setSearchParams(newParams)
    }, [searchParams, setSearchParams])

    const handleViewDetails = (employee: Employee) => {
        openEmployeeDetails(employee.id)
    }

    return (
        <EmployeeContextProvider>
            <div className="flex flex-col h-full">
                <EmployeeHeader />
                <EmployeeToolbar />
                <Container className="flex-1 p-4">
                    {viewMode === 'grid' ? (
                        <EmployeeGridView onViewDetails={handleViewDetails} />
                    ) : (
                        <EmployeeListView onViewDetails={handleViewDetails} />
                    )}
                </Container>
                <EmployeeDetailsDrawer
                    employeeId={employeeId}
                    onClose={closeEmployeeDetails}
                />
                <AddEmployeeDrawer />
                <DeleteEmployeeDialog />
                <BulkEditDialog />
                <BulkDeleteDialog />
                <BatchUploadDialog />
            </div>
        </EmployeeContextProvider>
    )
}

export default Employees
