import { Fragment } from 'react'
import Scroll from '@/components/ui/Scroll'
import ChatHistoryItem from './ChatHistoryItem'
import { useAiChatStore } from '../store/aiChatStore'
import { apiGetChatHistory } from '@/services/AiService'
import useSWR from 'swr'
import type { GetChatHistoryResponse } from '../types'

type ChatHistoryProps = {
    queryText?: string
    onClick?: () => void
}

const ChatHistory = ({ queryText = '', onClick }: ChatHistoryProps) => {
    const {
        chatHistory,
        setChatHistory,
        setRenameDialog,
        setSelectedConversation,
        selectedConversation,
    } = useAiChatStore()

    useSWR(
        ['/api/ai/chat/history'],
        () => apiGetChatHistory<GetChatHistoryResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            onSuccess: (data) => {
                setChatHistory(data)
            },
        },
    )

    const handleDelete = (id: string) => {
        setChatHistory(chatHistory.filter((item) => item.id !== id))
        setSelectedConversation('')
    }

    const handleArchive = (id: string) => {
        setChatHistory(chatHistory.filter((item) => item.id !== id))
        setSelectedConversation('')
    }

    const handleRename = (id: string, title: string) => {
        setRenameDialog({
            id,
            title,
            open: true,
        })
    }

    const handleClick = (id: string) => {
        setSelectedConversation(id)
        onClick?.()
    }

    const renderChatHistory = (timeGroup: string, queryText: string) => {
        let title = ''

        if (timeGroup === 'today') {
            title = 'Today'
        } else if (timeGroup === 'lastWeek') {
            title = 'Last Week'
        } else {
            title = timeGroup
        }

        return (
            <div>
                {!queryText && (
                    <div className="text-gray-400 dark:text-gray-600 px-4 uppercase font-medium text-xs mb-1">
                        {title}
                    </div>
                )}
                <div className="mb-4">
                    {chatHistory
                        .filter((item) => item.timeGroup === timeGroup)
                        .filter((item) =>
                            item.title
                                .toLowerCase()
                                .includes(queryText.toLowerCase()),
                        )
                        .map((item) => {
                            if (!item.enable) {
                                return <Fragment key={item.id} />
                            }
                            return (
                                <ChatHistoryItem
                                    key={item.id}
                                    data-testid={item.id}
                                    title={item.title}
                                    conversation={item.lastConversation}
                                    active={selectedConversation === item.id}
                                    onDelete={() => handleDelete(item.id)}
                                    onArchive={() => handleArchive(item.id)}
                                    onRename={() =>
                                        handleRename(item.id, item.title)
                                    }
                                    onClick={() => handleClick(item.id)}
                                />
                            )
                        })}
                </div>
            </div>
        )
    }

    return (
        <Scroll edgeShadow className="h-full" scrollbars="vertical">
            <div className="flex flex-col gap-2 p-2 xl:max-w-[320px]">
                {renderChatHistory('today', queryText)}
                {renderChatHistory('lastWeek', queryText)}
            </div>
        </Scroll>
    )
}

export default ChatHistory
