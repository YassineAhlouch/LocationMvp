import { useState } from 'react'
import ActionBar from '@/components/ui/ActionBar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import BulkEditUserDrawer from './BulkEditUserDrawer'
import SelectedUsersList from './SelectedUsersList'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { LiTrash, LiEdit } from '@/icons'
import type { User } from '../types'

type UserTableActionBarProps = {
    selectedRows: User[]
    onClearSelection: () => void
    onBulkDelete: (userIds: string[]) => Promise<void>
    onBulkUpdate: (data: Partial<User>) => Promise<void>
    loading?: boolean
}

const UserTableActionBar = ({
    selectedRows,
    onClearSelection,
    onBulkDelete,
    onBulkUpdate,
    loading = false,
}: UserTableActionBarProps) => {
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [bulkEditDrawerOpen, setBulkEditDrawerOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleEdit = () => {
        setBulkEditDrawerOpen(true)
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleCloseBulkEdit = () => {
        setBulkEditDrawerOpen(false)
    }

    const handleConfirmDelete = async () => {
        if (selectedRows.length === 0) return

        setIsDeleting(true)
        try {
            const userIds = selectedRows.map((user) => user.id)
            await onBulkDelete(userIds)

            toast.push(
                <Notification type="success" title="Users Deleted">
                    {selectedRows.length} user
                    {selectedRows.length > 1 ? 's' : ''} deleted successfully.
                </Notification>,
            )

            onClearSelection()
            setDeleteConfirmationOpen(false)
        } catch (error) {
            console.error('Failed to delete users:', error)
            toast.push(
                <Notification type="danger" title="Delete Failed">
                    Failed to delete users. Please try again.
                </Notification>,
            )
        } finally {
            setIsDeleting(false)
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
                            onClick={handleEdit}
                            disabled={loading || isDeleting}
                            icon={<LiEdit className="text-base" />}
                        >
                            Edit
                        </Button>
                        <Button
                            className="border-error bg-white text-error hover:border-error hover:ring-error hover:text-error hover:bg-error-subtle"
                            onClick={handleDelete}
                            disabled={loading || isDeleting}
                            icon={<LiTrash className="text-base" />}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </ActionBar>

            <Dialog isOpen={deleteConfirmationOpen} onClose={handleCancel}>
                <h5 className="mb-4 mt-1">Delete Users</h5>
                <p>
                    Are you sure you want to delete{' '}
                    <strong>{selectedRows.length}</strong> selected user
                    {selectedRows.length > 1 ? 's' : ''}? This action cannot be
                    undone.
                </p>
                {selectedRows.length > 0 && (
                    <div className="mt-3">
                        <p className="heading-text font-medium mb-2">
                            Users to be deleted:
                        </p>
                        <div className="max-h-[500px] overflow-y-auto space-y-1">
                            <SelectedUsersList users={selectedRows} />
                        </div>
                    </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={handleCancel} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleConfirmDelete}
                        loading={isDeleting}
                        disabled={isDeleting}
                    >
                        Delete All
                    </Button>
                </div>
            </Dialog>
            <BulkEditUserDrawer
                isOpen={bulkEditDrawerOpen}
                onClose={handleCloseBulkEdit}
                users={selectedRows}
                onSave={onBulkUpdate}
                loading={loading}
            />
        </>
    )
}

export default UserTableActionBar
