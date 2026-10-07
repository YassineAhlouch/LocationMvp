import { useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ActionBar from '@/components/ui/ActionBar'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import useDataTableState from '@/utils/hooks/useDataTableState'
import useAttendanceData from '../hooks/useAttendanceData'
import { useAttendanceStore } from '../store/attendanceStore'
import { getAttendanceStatusConfig } from '../utils'
import { LiProfile, LiEdit2, LiTrash } from '@/icons'
import { LuEllipsis, LuX } from 'react-icons/lu'
import type { ColumnDef } from '@tanstack/react-table'
import type { AttendanceRecord } from '../types'

type AttendanceTableProps = {
    onMarkAttendance: (record: AttendanceRecord | AttendanceRecord[]) => void
}

const formatTime = (time: string): string => {
    if (!time) return '—'
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
}

const AttendanceTable = ({ onMarkAttendance }: AttendanceTableProps) => {
    const navigate = useNavigate()
    const { data, isLoading, pagingState, setQueryParams, setData } =
        useAttendanceData()
    const {
        selectedRows,
        selectedRecord,
        deleteDialogOpen,
        setSelectedRows,
        addSelectedRow,
        removeSelectedRow,
        clearSelectedRows,
        setSelectedRecord,
        setDeleteDialogOpen,
    } = useAttendanceStore()
    const [isDeleting, setIsDeleting] = useState(false)

    // Use the shared data table state hook
    const pagingStateHandler = useDataTableState<AttendanceRecord>({
        pagingState,
        selectedRows,
        onPagingChange: (data) => {
            setQueryParams(data)
        },
        onRowSelectionChange: (checked, row) => {
            if (checked) {
                addSelectedRow(row)
            } else {
                removeSelectedRow(row.id)
            }
        },
        onAllRowSelectChange: (rows) => {
            setSelectedRows(rows)
        },
    })

    const handleRowAction = useCallback(
        async (action: string, record: AttendanceRecord) => {
            try {
                switch (action) {
                    case 'markAttendance':
                        onMarkAttendance(record)
                        break

                    case 'viewProfile':
                        navigate(`/apps/hrm/employees?id=${record.employee.id}`)
                        break

                    case 'delete':
                        setSelectedRecord(record)
                        setDeleteDialogOpen(true)
                        break

                    default:
                        console.warn(`Unknown action: ${action}`)
                }
            } catch (error) {
                console.error('Action failed:', error)
            }
        },
        [navigate, onMarkAttendance, setSelectedRecord, setDeleteDialogOpen],
    )

    // Delete handlers
    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            await sleep(1000)

            // Update data optimistically
            if (data) {
                if (selectedRecord) {
                    // Single delete
                    setData((prevData) => ({
                        ...prevData,
                        records: prevData.records.filter(
                            (r) => r.id !== selectedRecord.id,
                        ),
                        total: prevData.total - 1,
                    }))
                } else {
                    // Bulk delete
                    const selectedIds = selectedRows.map((r) => r.id)
                    setData((prevData) => ({
                        ...prevData,
                        records: prevData.records.filter(
                            (r) => !selectedIds.includes(r.id),
                        ),
                        total: prevData.total - selectedRows.length,
                    }))
                    clearSelectedRows()
                }
            }

            setDeleteDialogOpen(false)
            setSelectedRecord(null)
        } catch (error) {
            console.error('Failed to delete attendance record:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    // Bulk actions
    const handleBulkMarkAttendance = () => {
        onMarkAttendance(selectedRows)
    }

    const handleBulkDelete = () => {
        setSelectedRecord(null)
        setDeleteDialogOpen(true)
    }

    const getStatusBadge = useCallback((status: AttendanceRecord['status']) => {
        const config = getAttendanceStatusConfig(status)
        return (
            <Tag className={classNames(config.className, 'border-0')}>
                {config.label}
            </Tag>
        )
    }, [])

    const getActionDropdown = useCallback(
        (record: AttendanceRecord) => {
            const dropdownItems = [
                {
                    key: 'viewProfile',
                    label: 'View Profile',
                    icon: <LiProfile />,
                    onClick: () => handleRowAction('viewProfile', record),
                },
                {
                    key: 'markAttendance',
                    label: 'Mark Attendance',
                    icon: <LiEdit2 />,
                    onClick: () => handleRowAction('markAttendance', record),
                },
                {
                    key: 'delete',
                    label: 'Delete Record',
                    icon: <LiTrash />,
                    onClick: () => handleRowAction('delete', record),
                    className: 'text-red-600 hover:text-red-700',
                },
            ]

            return (
                <div className="inline-flex">
                    <Dropdown
                        placement="bottom-end"
                        renderTitle={
                            <Button
                                size="sm"
                                variant="ghost"
                                shape="circle"
                                icon={<LuEllipsis />}
                            />
                        }
                    >
                        {dropdownItems.map((item) => (
                            <Dropdown.Item
                                key={item.key}
                                eventKey={item.key}
                                onClick={item.onClick}
                                className={item.className}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            )
        },
        [handleRowAction],
    )

    const columns: ColumnDef<AttendanceRecord>[] = useMemo(
        () => [
            {
                accessorKey: 'employee',
                header: 'Employee',
                cell: ({ row }) => {
                    const employee = row.original.employee
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={25}
                                shape="circle"
                                src={employee.avatar}
                                alt={employee.name}
                            >
                                {employee.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </Avatar>
                            <div>
                                <div className="font-medium heading-text text-nowrap">
                                    {employee.name}
                                </div>
                                <div className="text-xs">{employee.role}</div>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'department',
                header: 'Department',
                cell: ({ row }) => {
                    const employee = row.original.employee
                    return employee.department
                },
            },
            {
                accessorKey: 'checkIn',
                header: 'Check-In',
                cell: ({ row }) => formatTime(row.original.checkIn || ''),
            },
            {
                accessorKey: 'checkOut',
                header: 'Check-Out',
                cell: ({ row }) => formatTime(row.original.checkOut || ''),
            },
            {
                accessorKey: 'totalHours',
                header: 'Total Hours',
                cell: ({ row }) => row.original.totalHours || '—',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                accessorKey: 'markedBy',
                header: 'Marked By',
                cell: ({ row }) => {
                    const markedBy = row.original.markedBy
                    const labels = {
                        system: 'System',
                        admin: 'Admin',
                        employee: 'Employee',
                        biometric: 'Biometric',
                    }
                    return labels[markedBy] || markedBy
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => getActionDropdown(row.original),
            },
        ],
        [getStatusBadge, getActionDropdown],
    )

    return (
        <>
            <DataTable
                columns={columns}
                data={data?.records || []}
                loading={isLoading}
                selectable
                checkboxChecked={(row) =>
                    selectedRows.some((selected) => selected.id === row.id)
                }
                pagingData={{
                    total: data?.total || 0,
                    pageIndex: pagingState.pageIndex || 1,
                    pageSize: pagingState.pageSize || 10,
                }}
                pageSizes={[10, 20, 50]}
                {...pagingStateHandler}
            />

            <ActionBar open={selectedRows.length > 0}>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                            {selectedRows.length} record
                            {selectedRows.length > 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="solid"
                            onClick={handleBulkMarkAttendance}
                        >
                            Mark Attendance
                        </Button>
                        <Button
                            variant="ghost"
                            icon={<LiTrash />}
                            onClick={handleBulkDelete}
                            className="text-error hover:bg-error-subtle"
                        >
                            Delete
                        </Button>
                        <Button
                            size="sm"
                            variant="subtle"
                            icon={<LuX />}
                            onClick={clearSelectedRows}
                        />
                    </div>
                </div>
            </ActionBar>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
                type="danger"
                title="Delete Attendance Record"
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonProps={{ loading: isDeleting }}
            >
                <p>
                    Are you sure you want to delete{' '}
                    {selectedRecord
                        ? 'this attendance record'
                        : `${selectedRows.length} attendance record${selectedRows.length > 1 ? 's' : ''}`}
                    ? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default AttendanceTable
