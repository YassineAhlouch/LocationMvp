import EmployeeCard from './EmployeeCard'
import EmployeeCardSkeleton from './EmployeeCardSkeleton'
import BulkActionBar from './BulkActionBar'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { useEmployeeStore } from '../store/employeeStore'
import useEmployeeData from '../hooks/useEmployeeData'
import { LiUserCircle } from '@/icons'
import type { Employee } from '../types'

type EmployeeGridViewProps = {
    onViewDetails: (employee: Employee) => void
}

const EmployeeGridView = ({ onViewDetails }: EmployeeGridViewProps) => {
    const { employees, total, isLoading, pagingState, setQueryParams } =
        useEmployeeData()
    const {
        selectedEmployees,
        openEditEmployee,
        openDeleteEmployee,
        openBulkEdit,
        openBulkDelete,
    } = useEmployeeStore()

    const displayEmployees = employees || []

    const handlePageChange = (page: number) => {
        setQueryParams({ pageIndex: page })
    }

    const handlePageSizeChange = (size: number) => {
        setQueryParams({ pageSize: size, pageIndex: 1 })
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 20 }).map((_, index) => (
                    <EmployeeCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (!displayEmployees || displayEmployees.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center my-8">
                <EmptyState
                    variant="dots"
                    offset={-24}
                    size={180}
                    illustration={
                        <IconFrame className="bg-white dark:bg-gray-700">
                            <LiUserCircle className="text-xl heading-text" />
                        </IconFrame>
                    }
                >
                    <div className="text-center">
                        <h5>No employees found</h5>
                        <p className="max-w-[500px]">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                </EmptyState>
            </div>
        )
    }

    return (
        <div className="relative">
            {selectedEmployees.length > 0 && (
                <BulkActionBar
                    selectedCount={selectedEmployees.length}
                    onEdit={openBulkEdit}
                    onDelete={openBulkDelete}
                />
            )}

            {/* Employee Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {displayEmployees.map((employee) => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onViewDetails={onViewDetails}
                        onEdit={openEditEmployee}
                        onDelete={openDeleteEmployee}
                    />
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Pagination
                    total={total}
                    currentPage={pagingState.pageIndex || 1}
                    pageSize={pagingState.pageSize || 20}
                    onChange={handlePageChange}
                />
                <div className="flex items-center gap-2">
                    <Select
                        size="sm"
                        value={{
                            value: pagingState.pageSize || 20,
                            label: `${pagingState.pageSize || 20} / page`,
                        }}
                        options={[
                            { value: 20, label: '20 / page' },
                            { value: 40, label: '40 / page' },
                            { value: 80, label: '80 / page' },
                            { value: 120, label: '120 / page' },
                        ]}
                        onChange={(option) =>
                            handlePageSizeChange(option?.value || 20)
                        }
                        isSearchable={false}
                        className="min-w-[120px]"
                    />
                </div>
            </div>
        </div>
    )
}

export default EmployeeGridView
