import { useState } from 'react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useEmployeeStore } from '../store/employeeStore'
import useEmployeeData from '../hooks/useEmployeeData'
import sleep from '@/utils/sleep'

const BulkDeleteDialog = () => {
    const {
        selectedEmployees,
        clearSelection,
        showBulkDelete,
        closeBulkDelete,
    } = useEmployeeStore()
    const { bulkDeleteEmployees } = useEmployeeData()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleConfirm = async () => {
        setIsDeleting(true)
        await sleep(500)
        bulkDeleteEmployees(selectedEmployees)
        clearSelection()
        closeBulkDelete()
        setIsDeleting(false)
    }

    const handleCancel = () => {
        closeBulkDelete()
    }

    return (
        <ConfirmDialog
            isOpen={showBulkDelete}
            onClose={closeBulkDelete}
            type="danger"
            title="Delete Employees"
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            confirmText="Delete"
            cancelText="Cancel"
            confirmButtonProps={{
                loading: isDeleting,
            }}
        >
            <div className="flex items-start gap-2">
                <div className="flex-1">
                    <p>
                        Are you sure you want to delete{' '}
                        <span className="font-medium heading-text">
                            {selectedEmployees.length} employee
                            {selectedEmployees.length > 1 ? 's' : ''}
                        </span>
                        ? This action cannot be undone. All employee data,
                        including personal information, job history, and
                        documents will be permanently removed.
                    </p>
                </div>
            </div>
        </ConfirmDialog>
    )
}

export default BulkDeleteDialog
