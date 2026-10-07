import { useRef, useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import Button from '@/components/ui/Button'
import Scroll from '@/components/ui/Scroll'
import Skeleton from '@/components/ui/Skeleton'
import Tag from '@/components/ui/Tag'
import TicketMessageTextbox from './TicketMessageTextbox'
import { LiTick, LiHeadphone, LiAlertCircle } from '@/icons'
import classNames from '@/utils/classNames'
import ReactHtmlParser from 'html-react-parser'
import { LuEllipsis, LuAlignLeft } from 'react-icons/lu'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import type { TicketDetails } from '../types'

type TicketMessagesProps = {
    data?: TicketDetails
    isLoading: boolean
    onMessageSubmit: ({
        message,
        type,
    }: {
        message: string
        type: string
    }) => void
    onPinClick: (pin: boolean) => void
    showPanelTriggers?: boolean
    onTicketPanelOpen?: () => void
    onTicketInfoOpen?: () => void
}

const messageTypeList = [
    { value: '', label: 'Show all message' },
    { value: 'public', label: 'Show public message only' },
    { value: 'private', label: 'Show private note only' },
]

const TicketMessages = ({
    data,
    isLoading,
    onMessageSubmit,
    onPinClick,
    showPanelTriggers = false,
    onTicketPanelOpen,
    onTicketInfoOpen,
}: TicketMessagesProps) => {
    const [messageType, setMessageType] = useState('')

    const scrollRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [data?.messages])

    const handleSubmit = (payload: { message: string; type: string }) => {
        onMessageSubmit(payload)
        scrollToBottom()
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="h-[60px] min-h-[60px] flex items-center border-b border-gray-200 dark:border-gray-800 px-4">
                {showPanelTriggers && (
                    <Button
                        icon={<LuAlignLeft />}
                        size="sm"
                        className="mr-2 flex-shrink-0"
                        onClick={onTicketPanelOpen}
                    />
                )}
                <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex items-center leading-normal gap-2 min-w-0 overflow-hidden">
                        <h6 className="font-semibold whitespace-nowrap">
                            # {data?.id}
                        </h6>
                        <span className="text-lg heading-text truncate">
                            {data?.subject}
                        </span>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        <Button
                            size="sm"
                            variant="ghost"
                            icon={
                                data?.pinned ? (
                                    <BsPinAngleFill className="text-primary" />
                                ) : (
                                    <BsPinAngle />
                                )
                            }
                            onClick={() => onPinClick(!data?.pinned)}
                            title="Pin"
                        />
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    icon={<LuEllipsis />}
                                />
                            }
                        >
                            {messageTypeList.map((item) => (
                                <Dropdown.Item
                                    key={item.value}
                                    className="flex items-center min-w-[220px]"
                                    onClick={() => setMessageType(item.value)}
                                    eventKey={item.value}
                                >
                                    <span className="w-4">
                                        {messageType === item.value && (
                                            <LiTick />
                                        )}
                                    </span>
                                    <span>{item.label}</span>
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>
                </div>
                {showPanelTriggers && (
                    <Button
                        variant="ghost"
                        icon={<LiAlertCircle />}
                        size="sm"
                        className="ml-2 flex-shrink-0"
                        onClick={onTicketInfoOpen}
                    />
                )}
            </div>
            <div className="flex-1 flex flex-col justify-between h-full w-full pb-4 min-h-0">
                <div className="relative flex-1 min-h-0">
                    <div className="absolute top-0 left-0 h-full w-full py-4 overflow-hidden">
                        {data && !isLoading && (
                            <Scroll
                                className="overflow-y-auto h-full w-full"
                                viewportRef={scrollRef}
                            >
                                <div className="space-y-2 max-w-[900px] mx-auto px-4">
                                    {data.messages
                                        .filter(
                                            (message) =>
                                                messageType === '' ||
                                                message.type === messageType,
                                        )
                                        .map((message) => (
                                            <div
                                                key={message.id}
                                                className={classNames(
                                                    'p-3 mx-2 rounded-lg',
                                                    message.type ===
                                                        'private' &&
                                                        'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
                                                )}
                                            >
                                                <div className="flex gap-2 w-full">
                                                    <div className="flex-shrink-0">
                                                        <Avatar
                                                            size={25}
                                                            shape="circle"
                                                            src={
                                                                message.user.img
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center justify-between gap-2 mt-0.5">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className="font-medium heading-text flex items-center gap-1">
                                                                    {message.sender ===
                                                                        'support' && (
                                                                        <LiHeadphone />
                                                                    )}
                                                                    <span className="truncate">
                                                                        {
                                                                            message
                                                                                .user
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </span>
                                                                {message.type ===
                                                                    'private' && (
                                                                    <>
                                                                        <span>
                                                                            {' '}
                                                                            •{' '}
                                                                        </span>
                                                                        <Tag className="py-0.5 px-1.5 bg-white dark:bg-transparent">
                                                                            Private
                                                                        </Tag>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <span className="flex items-center gap-2 flex-shrink-0">
                                                                <span className="flex items-center gap-1">
                                                                    <span className="text-xs">
                                                                        {dayjs(
                                                                            message.createdDate,
                                                                        ).format(
                                                                            'hh:mm A',
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="font-medium mt-4 break-words">
                                                            {ReactHtmlParser(
                                                                message.content,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </Scroll>
                        )}
                        {isLoading && !data && (
                            <div className="max-w-[900px] w-full mx-auto flex flex-col gap-8 px-6 mt-4">
                                {Array.from(new Array(5), (_, i) => i + 1).map(
                                    (row) => (
                                        <div
                                            key={row}
                                            className="flex flex-auto gap-2"
                                        >
                                            <div>
                                                <Skeleton
                                                    variant="circle"
                                                    height={25}
                                                    width={25}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-4 w-full">
                                                <Skeleton height={10} />
                                                <Skeleton
                                                    height={10}
                                                    width="60%"
                                                />
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-4 max-w-[900px] mx-auto w-full">
                    <TicketMessageTextbox onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    )
}

export default TicketMessages
