import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useTranslation from '@/utils/hooks/useTranslation'
import { useScrumboardStore } from '../store/scrumboardStore'
import useScrumboard from '../hooks/useScrumboardData'
import { apiDeleteTaskGroup } from '@/services/TaskService'

const DeleteColumnDialog = () => {
    const { t } = useTranslation()
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
            title={t('tasks.deleteDialog.title')}
            onClose={handleCancel}
            onCancel={handleCancel}
            onConfirm={handleConfirmDelete}
        >
            <p>{t('tasks.deleteDialog.message')}</p>
        </ConfirmDialog>
    )
}

export default DeleteColumnDialog
