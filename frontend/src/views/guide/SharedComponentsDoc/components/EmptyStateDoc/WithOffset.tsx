import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { LiDocumentDownload } from '@/icons'

const WithOffset = () => {
    return (
        <EmptyState
            variant="dots"
            size={200}
            offset={-10}
            illustration={
                <IconFrame>
                    <LiDocumentDownload className="text-xl heading-text" />
                </IconFrame>
            }
        >
            <div className="text-center">
                <h5>No documents uploaded</h5>
            </div>
        </EmptyState>
    )
}

export default WithOffset
