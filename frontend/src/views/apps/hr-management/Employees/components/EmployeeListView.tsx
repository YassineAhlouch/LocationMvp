import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import BulkActionBar from './BulkActionBar'
import DataTable from '@/components/shared/DataTable'
import useDataTableState from '@/utils/hooks/useDataTableState'
import { useEmployeeStore } from '../store/employeeStore'
import useEmployeeData from '../hooks/useEmployeeData'
import { formatDate } from '@/utils/formatDate'
import { LuEllipsis, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu'
import type { Employee } from '../types'
import type { ColumnDef } from '@/components/shared/DataTable'

type EmployeeListViewProps = {
    onViewDetails: (employee: Employee) => void
}

const EmployeeListView = ({ onViewDetails }: EmployeeListViewProps) => {
    const { employees, total, isLoading, pagingState, setQueryParams } =
        useEmployeeData()
    const {
        selectedEmployees,
        setSelectedEmployees,
        openEditEmployee,
        openDeleteEmployee,
        openBulkEdit,
        openBulkDelete,
    } = useEmployeeStore()

    const handleRowSelect = (checked: boolean, row: Employee) => {
        if (checked) {
            setSelectedEmployees([...selectedEmployees, row.id])
        } else {
            setSelectedEmployees(
                selectedEmployees.filter((id) => id !== row.id),
            )
        }
    }

    const handleAllRowSelect = (rows: Employee[]) => {
        const allIds = rows.map((row) => row.id)
        setSelectedEmployees(allIds)
    }

    // Use the proper DataTable state management hook
    const tableState = useDataTableState({
        pagingState,
        onPagingChange: setQueryParams,
        selectedRows: selectedEmployees
            .map((id) => employees?.find((emp) => emp.id === id))
            .filter((emp): emp is Employee => emp !== undefined),
        onRowSelectionChange: handleRowSelect,
        onAllRowSelectChange: handleAllRowSelect,
    })

    const getEmploymentTypeLabel = (type: string) => {
        switch (type) {
            case 'full-time':
                return 'Full-time'
            case 'part-time':
                return 'Part-time'
            case 'contract':
                return 'Contract'
            case 'intern':
                return 'Intern'
            case 'freelance':
                return 'Freelance'
            default:
                return type
        }
    }

    const columns: ColumnDef<Employee>[] = useMemo(
        () => [
            {
                accessorKey: 'personalInfo.fullName',
                header: 'Name',
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={25}
                            shape="circle"
                            src={row.original.personalInfo.profilePhoto}
                            alt={row.original.personalInfo.fullName}
                        >
                            {row.original.personalInfo.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </Avatar>
                        <div>
                            <div className="font-medium heading-text">
                                {row.original.personalInfo.fullName}
                            </div>
                            <div className="text-xs">
                                {row.original.personalInfo.email}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'employeeId',
                header: 'Employee ID',
                cell: ({ row }) => (
                    <span className="heading-text">
                        {row.original.employeeId}
                    </span>
                ),
            },
            {
                accessorKey: 'jobInfo.department',
                header: 'Department',
                cell: ({ row }) => (
                    <span className="heading-text">
                        {row.original.jobInfo.department}
                    </span>
                ),
            },
            {
                accessorKey: 'jobInfo.role',
                header: 'Role',
                cell: ({ row }) => (
                    <span className="heading-text text-nowrap">
                        {row.original.jobInfo.role}
                    </span>
                ),
            },
            {
                accessorKey: 'jobInfo.employmentType',
                header: 'Employment Type',
                cell: ({ row }) => (
                    <span className="heading-text">
                        {getEmploymentTypeLabel(
                            row.original.jobInfo.employmentType,
                        )}
                    </span>
                ),
            },
            {
                accessorKey: 'jobInfo.joiningDate',
                header: 'Joining Date',
                cell: ({ row }) => (
                    <span className="heading-text text-nowrap">
                        {formatDate(row.original.jobInfo.joiningDate)}
                    </span>
                ),
                size: 120,
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <div className="text-center">
                        <Dropdown
                            placement="bottom-end"
                            toggleClassName="inline-flex"
                            renderTitle={
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    icon={<LuEllipsis />}
                                />
                            }
                        >
                            <Dropdown.Item
                                onClick={() => onViewDetails(row.original)}
                                eventKey="view"
                            >
                                <div className="flex items-center gap-2">
                                    <LuEye />
                                    <span>View Details</span>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => openEditEmployee(row.original)}
                                eventKey="edit"
                            >
                                <div className="flex items-center gap-2">
                                    <LuPencil />
                                    <span>Edit</span>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => openDeleteEmployee(row.original)}
                                eventKey="delete"
                            >
                                <div className="flex items-center gap-2 text-red-600">
                                    <LuTrash2 />
                                    <span>Delete</span>
                                </div>
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                ),
                enableSorting: false,
                size: 80,
            },
        ],
        [onViewDetails, openEditEmployee, openDeleteEmployee],
    )

    return (
        <div className="relative">
            {selectedEmployees.length > 0 && (
                <BulkActionBar
                    selectedCount={selectedEmployees.length}
                    onEdit={openBulkEdit}
                    onDelete={openBulkDelete}
                />
            )}
            <DataTable
                columns={columns}
                data={employees || []}
                loading={isLoading}
                selectable
                {...tableState}
                pagingData={{
                    total: total,
                    pageIndex: pagingState.pageIndex || 1,
                    pageSize: pagingState.pageSize || 20,
                }}
                pageSizes={[20, 40, 80, 120]}
                skeletonAvatarColumns={[2]}
            />
        </div>
    )
}

export default EmployeeListView
