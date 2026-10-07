import { useState } from 'react'
import ActionBar from '@/components/ui/ActionBar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import SelectedPendingUsersList from './SelectedPendingUsersList'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { TbCircleCheckFilled, TbCircleX } from 'react-icons/tb'
import type { PendingUser } from '../types'

type PendingUsersTableActionBarProps = {
    selectedRows: PendingUser[]
    onClearSelection: () => void
    onBulkApprove: (userIds: string[]) => Promise<void>
    onBulkReject: (userIds: string[]) => Promise<void>
    loading?: boolean
}

const PendingUsersTableActionBar = ({
    selectedRows,
    onClearSelection,
    onBulkApprove,
    onBulkReject,
    loading = false,
}: PendingUsersTableActionBarProps) => {
    const [approveConfirmationOpen, setApproveConfirmationOpen] =
        useState(false)
    const [rejectConfirmationOpen, setRejectConfirmationOpen] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)

    const handleApprove = () => {
        setApproveConfirmationOpen(true)
    }

    const handleReject = () => {
        setRejectConfirmationOpen(true)
    }

    const handleCancelApprove = () => {
        setApproveConfirmationOpen(false)
    }

    const handleCancelReject = () => {
        setRejectConfirmationOpen(false)
    }

    const handleConfirmApprove = async () => {
        if (selectedRows.length === 0) return

        setIsApproving(true)
        try {
            const userIds = selectedRows.map((user) => user.id)
            await onBulkApprove(userIds)

            toast.push(
                <Notification type="success" title="Users Approved">
                    {selectedRows.length} user
                    {selectedRows.length > 1 ? 's' : ''} approved successfully.
                </Notification>,
            )

            onClearSelection()
            setApproveConfirmationOpen(false)
        } catch (error) {
            console.error('Failed to approve users:', error)
            toast.push(
                <Notification type="danger" title="Approval Failed">
                    Failed to approve users. Please try again.
                </Notification>,
            )
        } finally {
            setIsApproving(false)
        }
    }

    const handleConfirmReject = async () => {
        if (selectedRows.length === 0) return

        setIsRejecting(true)
        try {
            const userIds = selectedRows.map((user) => user.id)
            await onBulkReject(userIds)

            toast.push(
                <Notification type="warning" title="Users Rejected">
                    {selectedRows.length} user
                    {selectedRows.length > 1 ? 's' : ''} rejected successfully.
                </Notification>,
            )

            onClearSelection()
            setRejectConfirmationOpen(false)
        } catch (error) {
            console.error('Failed to reject users:', error)
            toast.push(
                <Notification type="danger" title="Rejection Failed">
                    Failed to reject users. Please try again.
                </Notification>,
            )
        } finally {
            setIsRejecting(false)
        }
    }

    return (
        <>
            <ActionBar open={selectedRows.length > 0} width={600}>
                <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-1">
                        <span className="heading-text text-white bg-primary h-5 w-5 flex items-center justify-center rounded">
                            {selectedRows.length}
                        </span>{' '}
                        user{selectedRows.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            className="text-error hover:bg-error-subtle hover:border-error"
                            onClick={handleReject}
                            disabled={loading || isApproving || isRejecting}
                            loading={isRejecting}
                            icon={<TbCircleX />}
                        >
                            Reject All
                        </Button>
                        <Button
                            className="text-success hover:bg-success-subtle hover:border-success"
                            onClick={handleApprove}
                            disabled={loading || isApproving || isRejecting}
                            loading={isApproving}
                            icon={<TbCircleCheckFilled />}
                        >
                            Approve All
                        </Button>
                    </div>
                </div>
            </ActionBar>
            <Dialog
                isOpen={approveConfirmationOpen}
                onClose={handleCancelApprove}
            >
                <h5 className="mb-4 mt-1">Approve Users</h5>
                <p>
                    Are you sure you want to approve{' '}
                    <strong>{selectedRows.length}</strong> selected user
                    {selectedRows.length > 1 ? 's' : ''}? This will grant them
                    access to the system with their requested roles.
                </p>
                {selectedRows.length > 0 && (
                    <div className="mt-3">
                        <p className="heading-text font-medium mb-2">
                            Users to be approved:
                        </p>
                        <div className="max-h-[500px] overflow-y-auto space-y-1">
                            <SelectedPendingUsersList users={selectedRows} />
                        </div>
                    </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        onClick={handleCancelApprove}
                        disabled={isApproving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        className="bg-success hover:bg-success-dark"
                        onClick={handleConfirmApprove}
                        loading={isApproving}
                        disabled={isApproving}
                    >
                        Approve All
                    </Button>
                </div>
            </Dialog>
            <Dialog
                isOpen={rejectConfirmationOpen}
                onClose={handleCancelReject}
            >
                <h5 className="mb-4 mt-1">Reject Users</h5>
                <p>
                    Are you sure you want to reject{' '}
                    <strong>{selectedRows.length}</strong> selected user
                    {selectedRows.length > 1 ? 's' : ''}? This will deny their
                    access request.
                </p>
                {selectedRows.length > 0 && (
                    <div className="mt-3">
                        <p className="heading-text font-medium mb-2">
                            Users to be rejected:
                        </p>
                        <div className="max-h-[500px] overflow-y-auto space-y-1">
                            <SelectedPendingUsersList users={selectedRows} />
                        </div>
                    </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={handleCancelReject} disabled={isRejecting}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        className="bg-error hover:bg-error-dark"
                        onClick={handleConfirmReject}
                        loading={isRejecting}
                        disabled={isRejecting}
                    >
                        Reject All
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default PendingUsersTableActionBar
