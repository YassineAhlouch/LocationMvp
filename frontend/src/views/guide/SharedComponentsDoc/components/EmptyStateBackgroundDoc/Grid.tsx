import EmptyStateBackground from '@/components/shared/EmptyStateBackground'
import { LuFileX } from 'react-icons/lu'

const Grid = () => {
    return (
        <EmptyStateBackground variant="grid" size={200}>
            <div className="flex flex-col items-center gap-2 z-10">
                <LuFileX className="text-4xl text-gray-400" />
                <p className="text-gray-500">No files found</p>
            </div>
        </EmptyStateBackground>
    )
}

export default Grid
