import { useState } from 'react'
import ActionBar from '@/components/ui/ActionBar'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useProductListStore } from '../store/productListStore'
import useProductListData from '../hooks/useProductListData'

const LeadsSelected = () => {
    const selectedRows = useProductListStore((state) => state.selectedRows)
    const setSelectAllRows = useProductListStore(
        (state) => state.setSelectAllRows,
    )
    const { setData } = useProductListData()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = () => {
        setData((prev) => ({
            ...prev,
            list: prev.list.filter(
                (product) =>
                    !selectedRows.some(
                        (selected) => selected.id === product.id,
                    ),
            ),
        }))
        setSelectAllRows([])
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
                    Are you sure you want to remove these product? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LeadsSelected
