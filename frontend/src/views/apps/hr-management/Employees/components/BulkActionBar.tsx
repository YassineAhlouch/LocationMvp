import { LiEdit2, LiTrash, LiCross } from '@/icons'
import ActionBar from '@/components/ui/ActionBar'
import Button from '@/components/ui/Button'
import useResponsive from '@/utils/hooks/useResponsive'
import { useEmployeeStore } from '../store/employeeStore'

type BulkActionBarProps = {
    selectedCount: number
    onEdit: () => void
    onDelete: () => void
}

const BulkActionBar = ({
    selectedCount,
    onEdit,
    onDelete,
}: BulkActionBarProps) => {
    const { clearSelection } = useEmployeeStore()

    const { larger } = useResponsive()

    return (
        <ActionBar open={selectedCount > 0} width={600}>
            <div className="flex items-center justify-between gap-8">
                <span className="font-medium flex items-center gap-2 text-nowrap">
                    <span className="heading-text text-white bg-primary h-5 w-5 flex items-center justify-center rounded text-xs">
                        {selectedCount}
                    </span>
                    {larger.sm && `Employee${selectedCount > 1 ? 's' : ''}`}{' '}
                    selected
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="default"
                        onClick={onEdit}
                        icon={<LiEdit2 />}
                    >
                        {larger.sm && 'Edit Status'}
                    </Button>

                    <Button
                        variant="default"
                        onClick={onDelete}
                        icon={<LiTrash />}
                        className="border-red-500 bg-white text-red-600 hover:border-red-600 hover:ring-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        {larger.sm && 'Delete'}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={clearSelection}
                        icon={!larger.sm && <LiCross />}
                    >
                        {larger.sm && 'Cancel'}
                    </Button>
                </div>
            </div>
        </ActionBar>
    )
}

export default BulkActionBar
