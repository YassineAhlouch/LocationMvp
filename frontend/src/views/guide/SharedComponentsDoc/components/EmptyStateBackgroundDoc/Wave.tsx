import EmptyStateBackground from '@/components/shared/EmptyStateBackground'
import { LuInbox } from 'react-icons/lu'

const Wave = () => {
    return (
        <EmptyStateBackground variant="wave" size={200}>
            <div className="flex flex-col items-center gap-2 z-10">
                <LuInbox className="text-4xl text-gray-400" />
                <p className="text-gray-500">No data available</p>
            </div>
        </EmptyStateBackground>
    )
}

export default Wave
