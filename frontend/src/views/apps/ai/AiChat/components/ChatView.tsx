import { useRef, useEffect, useMemo, useState } from 'react'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import ChatBox from '@/components/view/ChatBox'
import ChatLandingView from './ChatLandingView'
import ChatMobileNav from './ChatMobileNav'
import ChatCustomContent from './ChatCustomContent'
import ChatCustomAction from './ChatCustomAction'
import { useAiChatStore } from '../store/aiChatStore'
import useChatSend from '../hooks/useChatSend'
import { LuPaperclip, LuArrowUp, LuGlobe, LuLightbulb } from 'react-icons/lu'
import type { ScrollBarRef } from '@/components/view/ChatBox'

const ChatView = () => {
    const scrollRef = useRef<ScrollBarRef>(null)
    const { selectedConversation, chatHistory, isTyping, disabledChatFresh } =
        useAiChatStore()
    const { handleSend } = useChatSend()

    const [withSearchWeb, setWithSearchWeb] = useState(false)
    const [withReason, setWithReason] = useState(false)

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [selectedConversation, chatHistory])

    const messageList = useMemo(() => {
        const chat = chatHistory.find(
            (chat) => chat.id === selectedConversation,
        )
        return chat?.conversation || []
    }, [selectedConversation, chatHistory])

    const handleInputChange = async ({
        value,
    }: {
        value: string
        attachments?: File[]
    }) => {
        await handleSend(value)
    }

    const handleFinish = (id: string) => {
        disabledChatFresh(id)
        scrollToBottom()
    }

    return (
        <div className="flex-1 h-full p-4 max-w-[900px] mx-auto">
            <ChatMobileNav />
            <ChatBox
                ref={scrollRef}
                messageList={messageList}
                showMessageList={Boolean(selectedConversation)}
                showAvatar={true}
                avatarGap={true}
                containerClass="h-[calc(100%-30px)] xl:h-full"
                messageListClass="h-[calc(100%-100px)] xl:h-[calc(100%-70px)]"
                bubbleClass="bg-transparent dark:bg-gray-800 border border-gray-200 dark:border-gray-800 max-w-[500px]"
                typing={
                    isTyping
                        ? {
                              id: 'ai',
                              name: 'Chat AI',
                              avatarImageUrl: '/img/thumbs/ai.png',
                          }
                        : false
                }
                customRenderer={(message) => {
                    if (message.sender.id === 'ai') {
                        return (
                            <ChatCustomContent
                                content={message.content as string}
                                triggerTyping={
                                    message.fresh ? message.fresh : false
                                }
                                onFinish={() => handleFinish(message.id)}
                            />
                        )
                    }

                    return message.content
                }}
                customAction={(message) => {
                    if (message.sender.id === 'ai') {
                        return (
                            <ChatCustomAction
                                content={message.content as string}
                            />
                        )
                    }

                    return null
                }}
                onInputChange={handleInputChange}
                customInput={({
                    attachments,
                    ref,
                    setAttachments,
                    onKeyDown,
                    onChange,
                }) => (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl min-h-[120px] shadow px-3 flex flex-col">
                        {attachments.length > 0 && (
                            <Upload
                                fileList={attachments}
                                fileListClass="flex gap-4"
                                fileItemClass="flex gap-8"
                                onFileRemove={(_, files) =>
                                    setAttachments(files)
                                }
                            >
                                <></>
                            </Upload>
                        )}
                        <div className="flex flex-col justify-between gap-2 w-full h-full">
                            <textarea
                                ref={ref}
                                className="flex-1 h-full placeholder:text-gray-400 bg-transparent focus:outline-hidden heading-text resize-none py-2"
                                placeholder="Enter a prompt here"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                    }
                                    if (
                                        (e.target as HTMLTextAreaElement).value
                                    ) {
                                        onKeyDown(e)
                                    }
                                }}
                            />
                            <div className="flex items-center justify-between gap-2 py-2">
                                <div className="flex items-center gap-2">
                                    <Upload
                                        fileList={attachments}
                                        showList={false}
                                        onChange={(_, files) =>
                                            setAttachments(files)
                                        }
                                    >
                                        <button
                                            className="text-lg heading-text hover:text-primary px-1 py-2"
                                            type="button"
                                        >
                                            <LuPaperclip />
                                        </button>
                                    </Upload>
                                    <Button
                                        icon={<LuGlobe />}
                                        className={
                                            withSearchWeb
                                                ? 'border-primary text-primary hover:bg-primary-subtle'
                                                : ''
                                        }
                                        onClick={() =>
                                            setWithSearchWeb(!withSearchWeb)
                                        }
                                    >
                                        Search
                                    </Button>
                                    <Button
                                        icon={<LuLightbulb />}
                                        className={
                                            withReason
                                                ? 'border-primary text-primary hover:bg-primary-subtle'
                                                : ''
                                        }
                                        onClick={() =>
                                            setWithReason(!withReason)
                                        }
                                    >
                                        Reason
                                    </Button>
                                </div>
                                <Button
                                    variant="solid"
                                    onClick={onChange}
                                    icon={<LuArrowUp />}
                                />
                            </div>
                        </div>
                    </div>
                )}
            >
                {!selectedConversation && <ChatLandingView />}
            </ChatBox>
        </div>
    )
}

export default ChatView
