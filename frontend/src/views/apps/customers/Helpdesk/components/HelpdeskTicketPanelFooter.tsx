import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import useTicketList from '../hooks/useTicketList'
import { useHelpdeskStore } from '../store/helpdeskStore'
import classNames from '@/utils/classNames'
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu'

type HelpdeskTicketPanelFooterProps = {
    className?: string
}

const HelpdeskTicketPanelFooter = ({
    className,
}: HelpdeskTicketPanelFooterProps) => {
    const { ticketListTotal } = useTicketList()

    const pagingState = useHelpdeskStore((state) => state.pagingState)
    const setPagingState = useHelpdeskStore((state) => state.setPagingState)

    const pageCount = useMemo(() => {
        return Math.ceil(ticketListTotal / (pagingState.pageSize as number))
    }, [pagingState.pageSize, ticketListTotal])

    const handlePreviousPage = () => {
        if (pagingState.pageIndex && pagingState.pageIndex > 1) {
            setPagingState({
                ...pagingState,
                pageIndex: pagingState.pageIndex - 1,
            })
        }
    }

    const handleNextPage = () => {
        if (pagingState.pageIndex && pagingState.pageIndex < pageCount) {
            setPagingState({
                ...pagingState,
                pageIndex: (pagingState.pageIndex as number) + 1,
            })
        }
    }

    return (
        <div className={classNames(className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {pagingState.pageIndex} of {pageCount} entries
                </span>
                <div className="inline-flex items-center gap-2">
                    <Button
                        size="sm"
                        className="w-6 h-6 rounded-sm"
                        icon={<LuChevronLeft />}
                        onClick={handlePreviousPage}
                        disabled={pagingState.pageIndex === 1}
                    />
                    <Button
                        size="sm"
                        className="w-6 h-6 rounded-sm"
                        icon={<LuChevronRight />}
                        onClick={handleNextPage}
                        disabled={pagingState.pageIndex === pageCount}
                    />
                </div>
            </div>
        </div>
    )
}

export default HelpdeskTicketPanelFooter
