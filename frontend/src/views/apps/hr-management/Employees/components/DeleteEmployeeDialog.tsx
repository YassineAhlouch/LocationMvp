import { useState } from 'react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useEmployeeData from '../hooks/useEmployeeData'
import { useEmployeeStore } from '../store/employeeStore'
import sleep from '@/utils/sleep'

const DeleteEmployeeDialog = () => {
    const { deleteEmployee } = useEmployeeData()
    const { deleteEmployee: employeeToDelete, closeDeleteEmployee } =
        useEmployeeStore()
    const [isDeleting, setIsDeleting] = useState(false)

    if (!employeeToDelete) return null

    const handleConfirm = async () => {
        setIsDeleting(true)
        await sleep(500)
        deleteEmployee(employeeToDelete.id)
        closeDeleteEmployee()
        setIsDeleting(false)
    }

    const handleCancel = () => {
        closeDeleteEmployee()
    }

    return (
        <ConfirmDialog
            isOpen={Boolean(employeeToDelete)}
            onClose={closeDeleteEmployee}
            type="danger"
            title="Delete Employee"
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            confirmText="Delete Employee"
            cancelText="Cancel"
            confirmButtonProps={{
                loading: isDeleting,
            }}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <p className="mb-4">
                        Are you sure you want to delete{' '}
                        <strong>
                            {employeeToDelete.personalInfo.fullName}
                        </strong>
                        ?
                    </p>

                    <div className="space-y-2">
                        <p className="font-medium heading-text">
                            This action will permanently:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Remove all employee personal information</li>
                            <li>Delete job history and employment records</li>
                            <li>Remove access to company systems</li>
                            <li>Delete all uploaded documents</li>
                            <li>Remove compensation and payroll data</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ConfirmDialog>
    )
}

export default DeleteEmployeeDialog
