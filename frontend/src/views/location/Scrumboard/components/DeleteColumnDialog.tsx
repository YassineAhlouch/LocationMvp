import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useScrumboardStore } from '../store/scrumboardStore'
import useScrumboard from '../hooks/useScrumboardData'
import { apiDeleteTaskGroup } from '@/services/TaskService'

const DeleteColumnDialog = () => {
    const { mutate } = useScrumboard()
    const selectedColumn = useScrumboardStore((state) => state.selectedColumn)
    const setSelectedColumn = useScrumboardStore(
        (state) => state.setSelectedColumn,
    )
    const setDeleteColumnDialogOpen = useScrumboardStore(
        (state) => state.setDeleteColumnDialogOpen,
    )
    const deleteColumnDialogOpen = useScrumboardStore(
        (state) => state.deleteColumnDialogOpen,
    )

    const handleCancel = () => {
        setDeleteColumnDialogOpen(false)
        setSelectedColumn('')
    }

    const handleConfirmDelete = async () => {
        await apiDeleteTaskGroup({ id: selectedColumn })
        mutate()
        setDeleteColumnDialogOpen(false)
        setSelectedColumn('')
    }

    return (
        <ConfirmDialog
            isOpen={deleteColumnDialogOpen}
            type="danger"
            title="Remove columns"
            onClose={handleCancel}
            onCancel={handleCancel}
            onConfirm={handleConfirmDelete}
        >
            <p>
                {' '}
                Are you sure you want to remove this column? This action
                can&apos;t be undo.{' '}
            </p>
        </ConfirmDialog>
    )
}

export default DeleteColumnDialog
