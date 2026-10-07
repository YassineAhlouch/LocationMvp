import { useState } from 'react'
import ActionBar from '@/components/ui/ActionBar'
import Button from '@/components/ui/Button'
import LeadAssigneeDialog from './LeadAssigneeDialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useLeadsListStore } from '../store/leadsListStore'
import useLeadsList from '../hooks/useLeadsList'

const LeadsSelected = () => {
    const selectedRows = useLeadsListStore((state) => state.selectedRows)
    const setSelectAllRows = useLeadsListStore(
        (state) => state.setSelectAllRows,
    )
    const { mutate, leadsList, leadsListTotal } = useLeadsList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = () => {
        const newLeadsList = leadsList.filter((lead) => {
            return !selectedRows.some((selected) => selected.id === lead.id)
        })
        setSelectAllRows([])
        mutate(
            {
                list: newLeadsList,
                total: leadsListTotal - selectedRows.length,
            },
            false,
        )
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            <ActionBar open={selectedRows.length > 0}>
                <div className="flex items-center justify-between">
                    <span className="font-medium">
                        <span className="heading-text font-semibold">
                            {selectedRows.length} Items
                        </span>{' '}
                        selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            className={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                            }
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                        <LeadAssigneeDialog />
                    </div>
                </div>
            </ActionBar>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove customers"
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove these customers? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LeadsSelected
