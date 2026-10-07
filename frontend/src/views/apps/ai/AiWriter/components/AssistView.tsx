import { useRef, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Scroll from '@/components/ui/Scroll'
import Spinner from '@/components/ui/Spinner'
import QuickPromptDropdown from './QuickPromptDropdown'
import PromptResult from './PromptResult'
import { useAiWriterStore } from '../store/aiWriterStore'
import { highlightText, removeHighlightFromText } from '../utils'
import { apiPostWriterAmend } from '@/services/AiService'
import { FaQuoteLeft } from 'react-icons/fa6'
import { LuX, LuArrowUp, LuPencil, LuSparkles } from 'react-icons/lu'
import type { BasePromptResultProps } from './PromptResult'
import type { Editor } from '@tiptap/react'

type AssistViewProps = {
    editor: Editor
}

const AssistView = ({ editor }: AssistViewProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const selectedText = useAiWriterStore((state) => state.selectedText)
    const setSelectedText = useAiWriterStore((state) => state.setSelectedText)
    const loading = useAiWriterStore((state) => state.loading)
    const lastFocusPoint = useAiWriterStore((state) => state.lastFocusPoint)
    const setLoading = useAiWriterStore((state) => state.setLoading)
    const setShowBubbleMenu = useAiWriterStore(
        (state) => state.setShowBubbleMenu,
    )
    const setView = useAiWriterStore((state) => state.setView)
    const promptResultList = useAiWriterStore((state) => state.promptResultList)
    const setPromptResultList = useAiWriterStore(
        (state) => state.setPromptResultList,
    )
    const setSidePanelOpen = useAiWriterStore((state) => state.setSidePanelOpen)

    useEffect(() => {
        if (inputRef.current && selectedText.content.length > 0) {
            inputRef.current.focus()
        }
    }, [selectedText])

    const handleRemoveText = () => {
        setSelectedText({
            content: '',
        })
    }

    const handleFetchResult = async () => {
        return await apiPostWriterAmend<{
            id: string
            choices: {
                finish_reason: string
                index: number
                message: {
                    content: string
                    role: string
                }
            }[]
            created: number
            model: string
        }>({
            prompt: inputRef.current?.value || '',
            selectedText: selectedText.content,
        })
    }

    const handleSendPrompt = async () => {
        setLoading(true)
        try {
            const resp = await handleFetchResult()
            if (resp) {
                setPromptResultList([
                    ...(promptResultList || []),
                    {
                        id: resp.id,
                        content: resp.choices[0].message.content || '',
                        prompt: inputRef.current?.value || '',
                        showButton: true,
                        selectedText: selectedText.content,
                        range: selectedText.range,
                        type: 'ammend',
                    },
                ])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setSelectedText({
                content: '',
            })
        }
    }

    const handleSelectedQuickPrompt = (prompt: {
        label: string
        value: string
    }) => {
        if (inputRef.current) {
            inputRef.current.value = prompt.label

            handleSendPrompt()
        }
    }

    const handleMouseEnter = (payload: BasePromptResultProps) => {
        if (payload.showButton && payload.range) {
            highlightText(editor, payload.range)
        }
    }

    const handleMouseLeave = (payload: BasePromptResultProps) => {
        if (payload.showButton && payload.range) {
            removeHighlightFromText(editor, payload.range)
        }
    }

    const handleApplyContent = (payload: BasePromptResultProps) => {
        setPromptResultList(
            promptResultList.map((item) => {
                if (item.id === payload.id) {
                    return { ...item, showButton: false }
                }
                return item
            }),
        )

        handleMouseLeave(payload)

        if (payload.range) {
            editor
                .chain()
                .focus()
                .insertContentAt({ ...payload.range }, payload.content)
                .run()
        }

        if (!payload.range && lastFocusPoint !== null) {
            editor.commands.insertContentAt(lastFocusPoint, payload.content)
        }

        // Close drawer on mobile after applying
        setSidePanelOpen(false)
    }

    const handleRetry = async (payload: BasePromptResultProps) => {
        setPromptResultList(
            promptResultList.map((item) => {
                if (item.id === payload.id) {
                    return { ...item, retrying: true }
                }
                return item
            }),
        )

        try {
            const resp = await handleFetchResult()
            if (resp) {
                setPromptResultList(
                    promptResultList.map((item) => {
                        if (item.id === payload.id) {
                            return {
                                ...item,
                                content: resp.choices[0].message.content || '',
                                retrying: false,
                            }
                        }
                        return item
                    }),
                )
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="h-[60px] flex items-center justify-between px-4">
                <h5>AI Assistant</h5>
                <div className="flex items-center gap-1">
                    <Button
                        icon={<LuPencil />}
                        onClick={() => setView('generator')}
                    >
                        Generate New
                    </Button>
                </div>
            </div>
            <Scroll
                className="h-full"
                contentClassName="h-full"
                scrollbars="vertical"
            >
                <div className="flex flex-col justify-end h-full p-4">
                    {promptResultList.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 flex items-center justify-center mb-4">
                                <LuSparkles className="text-2xl text-purple-500" />
                            </div>
                            <h6 className="mb-2">Ready to assist</h6>
                            <p>
                                Select any text in the editor and click{' '}
                                <span className="font-semibold text-purple-500">
                                    "Ask AI"
                                </span>{' '}
                                to improve, translate, or transform it.
                            </p>
                        </div>
                    )}
                    {promptResultList.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {promptResultList.map((item) => (
                                <PromptResult
                                    key={item.id}
                                    {...item}
                                    onMouseEnter={() => handleMouseEnter(item)}
                                    onMouseLeave={() => handleMouseLeave(item)}
                                    onApplyContent={() =>
                                        handleApplyContent(item)
                                    }
                                    onRetry={() => handleRetry(item)}
                                />
                            ))}
                        </div>
                    )}
                    {loading && (
                        <div className="flex items-center gap-1 mt-4">
                            <Spinner />
                            <span className="ml-2">Generating...</span>
                        </div>
                    )}
                </div>
            </Scroll>
            <div className="flex flex-col justify-between gap-y-4 p-2 border-t border-gray-200 dark:border-gray-700">
                {selectedText.content && (
                    <>
                        <span className="text-medium">Work with:</span>
                        <div className="border border-gray-200 dark:border-gray-700 flex justify-between gap-2 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div>
                                        <FaQuoteLeft className="text-lg" />
                                    </div>
                                    <span className="font-medium">
                                        {selectedText.content.length > 230
                                            ? `${selectedText.content.substring(0, 230)}...`
                                            : selectedText.content}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Button
                                    icon={<LuX className="text-sm" />}
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveText}
                                />
                            </div>
                        </div>
                    </>
                )}
                <div className="flex items-center">
                    <QuickPromptDropdown onSelect={handleSelectedQuickPrompt} />
                    <input
                        type="text"
                        ref={inputRef}
                        placeholder="Write your prompt"
                        className="h-10 placeholder:text-gray-400 w-full outline-0 px-2 py-1 heading-text font-medium"
                        onFocus={() => setShowBubbleMenu(false)}
                    />
                    <div>
                        <Button
                            variant="solid"
                            onClick={handleSendPrompt}
                            size="sm"
                            icon={<LuArrowUp />}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssistView
