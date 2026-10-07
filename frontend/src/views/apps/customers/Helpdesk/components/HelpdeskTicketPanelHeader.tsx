import Button from '@/components/ui/Button'
import { useHelpdeskStore } from '../store/helpdeskStore'
import TicketListFilter from './TicketListFilter'
import TicketListQueryInput from './TicketListQueryInput'

import { BsFilter } from 'react-icons/bs'

const HelpdeskTicketPanelHeader = () => {
    const setFilterDrawerOpen = useHelpdeskStore(
        (state) => state.setFilterDrawerOpen,
    )

    return (
        <>
            <div className="h-[60px] min-h-[60px] flex items-center gap-1 justify-between px-2 border-b border-gray-200 dark:border-gray-800">
                <TicketListQueryInput />
                <Button
                    size="sm"
                    variant="ghost"
                    icon={<BsFilter className="text-xl" />}
                    title="Filter"
                    onClick={() => setFilterDrawerOpen(true)}
                />
                <TicketListFilter />
            </div>
        </>
    )
}

export default HelpdeskTicketPanelHeader
