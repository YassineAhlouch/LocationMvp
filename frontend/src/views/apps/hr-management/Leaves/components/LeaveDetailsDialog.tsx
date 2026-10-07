import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Loading from '@/components/shared/Loading'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import {
    LiArrowLeft,
    LiWatch,
    LiDocument,
    LiImport,
    LiAirplane,
    LiMask,
    LiUser,
    LiBubble,
    LiCross,
} from '@/icons'
import { getStatusColor, getEventColors } from '../utils'
import useLeaveData from '../hooks/useLeaveData'
import { useLeavesStore } from '../store/leavesStore'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import dayjs from 'dayjs'
import useSWR, { mutate } from 'swr'
import type { LeaveCalendarEvent, EmployeeLeaveDetail } from '../types'

type LeaveDetailsDialogProps = {
    isOpen: boolean
    event?: LeaveCalendarEvent
    selectedEmployee?: string
}

const DATE_FORMAT = 'DD MMM YYYY'

const LeaveDetailsDialog = ({
    isOpen,
    event,
    selectedEmployee,
}: LeaveDetailsDialogProps) => {
    const { getEmployeeLeaveDetail } = useLeaveData()
    const { closeAllDialogs, setSelectedEmployee } = useLeavesStore()
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    // Create SWR key for employee detail - only fetch when we have both selectedEmployee and event
    const swrKey =
        selectedEmployee && event
            ? `/employee-leave-detail/${selectedEmployee}/${event.id}`
            : null

    // Use SWR to fetch employee leave detail
    const {
        data: employeeDetail,
        isLoading: loading,
        error: employeeDetailError,
    } = useSWR<EmployeeLeaveDetail | null>(
        swrKey,
        swrKey
            ? async () => {
                  const detail = await getEmployeeLeaveDetail(
                      selectedEmployee!,
                      event!.id.toString(),
                  )
                  return detail
              }
            : null,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
        },
    )

    // Show error notification if employee detail failed to load
    if (employeeDetailError) {
        toast.push(
            <Notification type="danger" title="Error">
                Failed to load employee details
            </Notification>,
        )
    }

    const handleClose = async () => {
        closeAllDialogs()
        await sleep(300)
        setSelectedEmployee('')
    }

    const handleBackToList = () => {
        setSelectedEmployee('')
    }

    const handleEmployeeSelect = (employeeId: string) => {
        setSelectedEmployee(employeeId)
    }

    const handleApprove = async (requestId: string) => {
        setActionLoading('approve')
        console.log('requestId:', requestId)
        try {
            await sleep(500)
            toast.push(
                <Notification type="success" title="Success">
                    Leave request approved successfully
                </Notification>,
            )
            // Refresh employee detail using SWR mutate
            if (swrKey) {
                mutate(swrKey)
            }
        } catch {
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to approve leave request
                </Notification>,
            )
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (requestId: string) => {
        console.log('requestId:', requestId)
        setActionLoading('reject')
        try {
            await sleep(500)
            toast.push(
                <Notification type="success" title="Success">
                    Leave request rejected successfully
                </Notification>,
            )
            // Refresh employee detail using SWR mutate
            if (swrKey) {
                mutate(swrKey)
            }
        } catch {
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to reject leave request
                </Notification>,
            )
        } finally {
            setActionLoading(null)
        }
    }

    const getLeaveTypeIcon = (type: string) => {
        switch (type) {
            case 'publicHoliday':
                return <LiWatch />
            case 'annualLeave':
                return <LiAirplane />
            case 'sickLeave':
                return <LiMask />
            case 'casualLeave':
                return <LiUser />
            default:
                return <LiWatch />
        }
    }

    const closeButton = (
        <Button
            variant="subtle"
            size="sm"
            onClick={handleClose}
            icon={<LiCross className="text-2xl" />}
        />
    )

    if (!event) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            width={500}
            className="p-0"
            closable={false}
        >
            {selectedEmployee && employeeDetail ? (
                <Loading className="min-h-[350px]" loading={loading}>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<LiArrowLeft />}
                                    onClick={handleBackToList}
                                    className="h-7 w-7"
                                />
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={`/img/avatars/thumb-${employeeDetail.id}.jpg`}
                                        shape="circle"
                                        size="sm"
                                        alt={employeeDetail.name}
                                    />
                                    <div>
                                        <div className="font-medium heading-text">
                                            {employeeDetail.name}
                                        </div>
                                        <div className="text-xs">
                                            {employeeDetail.title}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {closeButton}
                        </div>
                        <div className="space-y-4 mt-4">
                            {/* Leave Information */}
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <label className="text-xs">
                                        Leave Type
                                    </label>
                                    <div className="flex items-center gap-2 heading-text font-medium">
                                        {getLeaveTypeIcon(event.type)}
                                        <span className="capitalize">
                                            {event.type
                                                .replace(/([A-Z])/g, ' $1')
                                                .trim()}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs">Status</label>
                                    <div className="heading-text font-medium">
                                        <Tag className="gap-1 bg-white dark:bg-gray-900">
                                            <Badge
                                                className={classNames(
                                                    getStatusColor(
                                                        employeeDetail.status.toLowerCase() as
                                                            | 'pending'
                                                            | 'approved'
                                                            | 'rejected',
                                                    ),
                                                    'h-2.5 w-2.5',
                                                )}
                                            />
                                            <span className="capitalize">
                                                {employeeDetail.status}
                                            </span>
                                        </Tag>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs">
                                        Start Date
                                    </label>
                                    <p className="heading-text font-medium">
                                        {dayjs(employeeDetail.startDate).format(
                                            DATE_FORMAT,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs">End Date</label>
                                    <p className="heading-text font-medium">
                                        {dayjs(employeeDetail.endDate).format(
                                            DATE_FORMAT,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs">
                                        Applied Date
                                    </label>
                                    <p className="heading-text font-medium">
                                        {dayjs(employeeDetail.appliedAt).format(
                                            DATE_FORMAT,
                                        )}
                                    </p>
                                </div>

                                {employeeDetail.approvedAt && (
                                    <div>
                                        <label className="text-xs">
                                            Approved Date
                                        </label>
                                        <p className="heading-text font-medium">
                                            {dayjs(
                                                employeeDetail.approvedAt,
                                            ).format(DATE_FORMAT)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Reason */}
                            {employeeDetail.reason && (
                                <div>
                                    <label className="text-xs">Reason</label>
                                    <div className="p-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-700 rounded-lg mt-1 heading-text font-medium">
                                        {employeeDetail.reason}
                                    </div>
                                </div>
                            )}

                            {/* Documents */}
                            {employeeDetail.doc &&
                                employeeDetail.doc.length > 0 && (
                                    <div>
                                        <label className="text-xs">
                                            Supporting Documents
                                        </label>
                                        <div className="mt-1 space-y-2">
                                            {employeeDetail.doc.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                                                >
                                                    <div className="heading-text text-xl">
                                                        <LiDocument />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="heading-text font-medium">
                                                            {doc.name}
                                                        </div>
                                                        <div className="text-xs">
                                                            {doc.type}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={
                                                            <LiImport
                                                                size={16}
                                                            />
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* Actions for pending requests */}
                            {employeeDetail.status === 'Pending' && (
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="default"
                                        onClick={() =>
                                            handleReject(employeeDetail.id)
                                        }
                                        loading={actionLoading === 'reject'}
                                        disabled={actionLoading !== null}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="solid"
                                        onClick={() =>
                                            handleApprove(employeeDetail.id)
                                        }
                                        loading={actionLoading === 'approve'}
                                        disabled={actionLoading !== null}
                                    >
                                        Approve
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Loading>
            ) : (
                <>
                    <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                            <IconFrame variant="thick">
                                <span className="text-xl heading-text">
                                    {getLeaveTypeIcon(event.type)}
                                </span>
                            </IconFrame>
                            <div>
                                <h6>
                                    <span>{event.title}</span>
                                    <span className="mx-1">-</span>
                                    <span>
                                        {dayjs(event.startDate).format(
                                            'DD MMM YYYY',
                                        )}
                                        {event.startDate !== event.endDate &&
                                            ` - ${dayjs(event.endDate).format('DD MMM YYYY')}`}
                                    </span>
                                </h6>
                                <div className="pr-12">
                                    <Tag className="gap-1 bg-transparent">
                                        <Badge
                                            className={classNames(
                                                getEventColors(event.type),
                                                'h-2.5 w-2.5',
                                            )}
                                        />
                                        <span>{event.description}</span>
                                    </Tag>
                                </div>
                            </div>
                        </div>
                        {closeButton}
                    </div>
                    <div className="p-4">
                        {event.employees && event.employees.length > 0 ? (
                            <div>
                                {event.employees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                        onClick={() =>
                                            handleEmployeeSelect(employee.id)
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                size="sm"
                                                shape="circle"
                                                src={`/img/avatars/thumb-${employee.id}.jpg`}
                                                alt={employee.name}
                                            />
                                            <div>
                                                <div className="font-medium heading-text">
                                                    {employee.name}
                                                </div>
                                                <div className="text-xs">
                                                    {employee.title}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="gap-1 bg-white dark:bg-gray-900">
                                                <Badge
                                                    className={classNames(
                                                        getStatusColor(
                                                            employee.status,
                                                        ),
                                                        'h-2.5 w-2.5',
                                                    )}
                                                />
                                                <span className="capitalize">
                                                    {employee.status}
                                                </span>
                                            </Tag>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 mx-auto">
                                <EmptyState
                                    variant="dots"
                                    size={180}
                                    illustration={
                                        <IconFrame>
                                            <LiBubble className="text-xl heading-text" />
                                        </IconFrame>
                                    }
                                ></EmptyState>
                                <h6>
                                    {event.type === 'holiday'
                                        ? 'Holiday applies to all employees'
                                        : 'No employees affected by this event'}
                                </h6>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Dialog>
    )
}

export default LeaveDetailsDialog
