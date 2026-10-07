import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ChatHistory from './ChatHistory'
import { useAiChatStore } from '../store/aiChatStore'
import useDebounce from '@/utils/hooks/useDebounce'
import classNames from '@/utils/classNames'
import { LuSearch, LuCommand, LuPlus } from 'react-icons/lu'
import type { ChangeEvent } from 'react'
import type { CardProps } from '@/components/ui/Card'

type ChatSideNavProps = Pick<CardProps, 'className' | 'bodyClass'> & {
    onClick?: () => void
}

const ChatSideNav = ({ className, onClick }: ChatSideNavProps) => {
    const [queryText, setQueryText] = useState('')

    const { setSelectedConversation } = useAiChatStore()

    function handleDebounceFn(e: ChangeEvent<HTMLInputElement>) {
        setQueryText?.(e.target.value)
    }

    const debounceFn = useDebounce(handleDebounceFn, 500)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e)
    }

    const handleNewChat = () => {
        setSelectedConversation('')
        onClick?.()
    }

    return (
        <div
            className={classNames(
                'flex-1 xl:max-w-[320px] h-full ltr:border-l rtl:border-r border-gray-200 dark:border-gray-800',
                className,
            )}
        >
            <div className="flex items-center gap-2 px-2 w-full h-[60px]">
                <Input
                    placeholder="Search chat"
                    onChange={handleInputChange}
                    prefix={<LuSearch />}
                    suffix={
                        <div className="flex items-center gap-1">
                            <div className="border border-gray-300 dark:border-gray-500 h-5 w-5 rounded flex items-center justify-center">
                                <LuCommand />
                            </div>
                            <span className="border border-gray-300 dark:border-gray-500 h-5 w-5 rounded flex items-center justify-center text-xs">
                                K
                            </span>
                        </div>
                    }
                />
            </div>
            <div className="h-[calc(100%-60px-60px)]">
                <ChatHistory queryText={queryText} onClick={onClick} />
                <div className="px-2 py-2">
                    <Button
                        block
                        variant="subtle"
                        icon={<LuPlus />}
                        onClick={handleNewChat}
                    >
                        New chat
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChatSideNav
