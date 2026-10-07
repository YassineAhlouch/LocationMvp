import TicketInfo from './TicketInfo'
import TicketMessages from './TicketMessages'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import useTicketDetails from '../hooks/useTicketDetails'
import useTicketList from '../hooks/useTicketList'
import useResponsive from '@/utils/hooks/useResponsive'
import { useHelpdeskStore } from '../store/helpdeskStore'
import { LuMousePointerClick, LuAlignLeft } from 'react-icons/lu'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import type { EditableTicketDetails } from '../types'

const HelpdeskWorkSpace = () => {
    const { larger } = useResponsive()
    const {
        ticketDetails,
        selectedTicket,
        isLoading,
        mutate: mutateTicketDetails,
    } = useTicketDetails()
    const {
        ticketList,
        ticketListTotal,
        mutate: mutateTicketList,
    } = useTicketList()

    const ticketInfoDrawerOpen = useHelpdeskStore(
        (state) => state.ticketInfoDrawerOpen,
    )
    const setTicketInfoDrawerOpen = useHelpdeskStore(
        (state) => state.setTicketInfoDrawerOpen,
    )
    const setTicketPanelDrawerOpen = useHelpdeskStore(
        (state) => state.setTicketPanelDrawerOpen,
    )

    const handleMessageSubmit = ({
        message,
        type,
    }: {
        message: string
        type: string
    }) => {
        if (ticketDetails) {
            mutateTicketDetails(
                {
                    ...ticketDetails,
                    messages: [
                        ...ticketDetails.messages,
                        {
                            id: uniqueId('message-'),
                            user: {
                                id: '1',
                                name: 'Angelina Gotelli',
                                img: '/img/avatars/thumb-1.jpg',
                            },
                            type: type as 'private' | 'public',
                            createdDate: dayjs().toISOString(),
                            content: message,
                            attachments: [],
                            sender: 'support',
                        },
                    ],
                },
                false,
            )
        }
    }

    const handleInfoUpdate = (payload: EditableTicketDetails) => {
        if (ticketDetails) {
            mutateTicketDetails(
                {
                    ...ticketDetails,
                    ...payload,
                },
                false,
            )
        }
        if (ticketList) {
            mutateTicketList(
                {
                    list: ticketList.map((ticket) => {
                        if (ticket.id === selectedTicket) {
                            return {
                                ...ticket,
                                ...payload,
                            }
                        }
                        return ticket
                    }),
                    total: ticketListTotal,
                },
                false,
            )
        }
    }

    const handleRemoveLinkedTicket = (id: string) => {
        if (ticketDetails) {
            mutateTicketDetails(
                {
                    ...ticketDetails,
                    linkedTickes: ticketDetails.linkedTickes.filter(
                        (ticket) => ticket.id !== id,
                    ),
                },
                false,
            )
        }
    }

    const handlePinClick = (pinned: boolean) => {
        if (ticketDetails) {
            mutateTicketDetails(
                {
                    ...ticketDetails,
                    pinned,
                },
                false,
            )
        }
        if (ticketList) {
            mutateTicketList(
                {
                    list: ticketList.map((ticket) => {
                        if (ticket.id === selectedTicket) {
                            return {
                                ...ticket,
                                pinned,
                            }
                        }
                        return ticket
                    }),
                    total: ticketListTotal,
                },
                false,
            )
        }
    }

    const renderTicketInfo = () => {
        if (!ticketDetails || isLoading) return null

        if (!larger.xl) {
            return (
                <Drawer
                    title="Ticket Info"
                    isOpen={ticketInfoDrawerOpen}
                    placement="right"
                    width={300}
                    onClose={() => setTicketInfoDrawerOpen(false)}
                    bodyClass="p-0"
                >
                    <TicketInfo
                        data={ticketDetails}
                        onUpdate={handleInfoUpdate}
                        onRemoveLinkedTicket={handleRemoveLinkedTicket}
                    />
                </Drawer>
            )
        }

        return (
            <div className="w-[280px] relative ltr:border-l rtl:border-r border-gray-200 dark:border-gray-800 ltr:rounded-br-lg rtl:rounded-bl-lg z-10">
                <TicketInfo
                    data={ticketDetails}
                    onUpdate={handleInfoUpdate}
                    onRemoveLinkedTicket={handleRemoveLinkedTicket}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-auto w-full min-w-0 overflow-hidden xl:ltr:ml-[280px] xl:rtl:mr-[280px]">
            {!selectedTicket && (
                <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                    {!larger.xl && (
                        <div className="absolute top-4 left-4">
                            <Button
                                icon={<LuAlignLeft />}
                                size="sm"
                                onClick={() => setTicketPanelDrawerOpen(true)}
                            />
                        </div>
                    )}
                    <EmptyState
                        size={340}
                        offset={-80}
                        illustration={
                            <IconFrame
                                variant="thick"
                                className="bg-white dark:bg-gray-700"
                                size={50}
                            >
                                <LuMousePointerClick className="text-2xl heading-text" />
                            </IconFrame>
                        }
                    >
                        <div className="text-center space-y-4">
                            <h3>No Ticket Selected</h3>
                            <p className="max-w-[400px]">
                                Select a ticket from the list to view its
                                details and start assisting your customer.
                            </p>
                        </div>
                    </EmptyState>
                </div>
            )}
            {selectedTicket && (
                <>
                    <TicketMessages
                        data={ticketDetails}
                        isLoading={isLoading}
                        onMessageSubmit={handleMessageSubmit}
                        onPinClick={handlePinClick}
                        showPanelTriggers={!larger.xl}
                        onTicketPanelOpen={() => setTicketPanelDrawerOpen(true)}
                        onTicketInfoOpen={() => setTicketInfoDrawerOpen(true)}
                    />
                    {renderTicketInfo()}
                </>
            )}
        </div>
    )
}

export default HelpdeskWorkSpace
