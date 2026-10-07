import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { LiFolderOpen } from '@/icons'

const Basic = () => {
    return (
        <EmptyState
            size={200}
            illustration={
                <IconFrame>
                    <LiFolderOpen className="text-xl heading-text" />
                </IconFrame>
            }
        >
            <div className="text-center">
                <h5>No data available</h5>
            </div>
        </EmptyState>
    )
}

export default Basic
