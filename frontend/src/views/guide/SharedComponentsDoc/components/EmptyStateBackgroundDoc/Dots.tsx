import EmptyStateBackground from '@/components/shared/EmptyStateBackground'
import { LuSearch } from 'react-icons/lu'

const Dots = () => {
    return (
        <EmptyStateBackground variant="dots" size={200}>
            <div className="flex flex-col items-center gap-2 z-10">
                <LuSearch className="text-4xl text-gray-400" />
                <p className="text-gray-500">No results</p>
            </div>
        </EmptyStateBackground>
    )
}

export default Dots
