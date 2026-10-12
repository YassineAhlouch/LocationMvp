import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import hooks from '@/components/ui/hooks'
import { TbPhotoPlus } from 'react-icons/tb'
import type { ReactNode, KeyboardEvent, Ref } from 'react'

export type ChatInputProps = {
    placeholder?: string
    onInputChange?: (payload: { value: string; attachments: File[] }) => void
    ref?: Ref<HTMLInputElement | HTMLTextAreaElement>
    customInput?: (props: {
        ref: (element: HTMLInputElement | HTMLTextAreaElement | null) => void
        setAttachments: (value: File[]) => void
        onKeyDown: (
            event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => void
        onChange: () => void
        attachments: File[]
    }) => ReactNode
}

const { useMergeRef } = hooks

const ChatInput = (props: ChatInputProps) => {
    const [attachments, setAttachments] = useState<File[]>([])

    const { placeholder, onInputChange, customInput, ref = null } = props

    const inputRef = useRef<HTMLInputElement>(null)

    const handleInputClear = () => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        setAttachments([])
    }

    const handleChange = () => {
        if (inputRef.current?.value) {
            onInputChange?.({
                value: inputRef.current?.value || '',
                attachments,
            })
            handleInputClear()
        }
    }

    const handleKeyDown = (
        event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (event.key === 'Enter') {
            onInputChange?.({
                value: inputRef.current?.value || '',
                attachments,
            })
            handleInputClear()
        }
    }

    const chatInputRef = useMergeRef(inputRef, ref)

    return (
        <>
            {customInput ? (
                customInput({
                    attachments,
                    ref: chatInputRef,
                    setAttachments,
                    onKeyDown: handleKeyDown,
                    onChange: handleChange,
                })
            ) : (
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg min-h-[50px] px-3 flex flex-col">
                    {attachments.length > 0 && (
                        <Upload
                            fileList={attachments}
                            fileListClass="flex gap-4"
                            fileItemClass="flex gap-8"
                            onFileRemove={(_, files) => setAttachments(files)}
                        >
                            <></>
                        </Upload>
                    )}
                    <div className="flex items-center gap-2 w-full h-[50px]">
                        <Upload
                            fileList={attachments}
                            showList={false}
                            onChange={(_, files) => setAttachments(files)}
                        >
                            <button
                                className="text-xl heading-text hover:text-primary px-1 py-2"
                                type="button"
                            >
                                <TbPhotoPlus />
                            </button>
                        </Upload>
                        <input
                            ref={chatInputRef}
                            className="flex-1 h-full placeholder:text-gray-400 bg-transparent focus:outline-hidden heading-text"
                            placeholder={placeholder}
                            onKeyDown={handleKeyDown}
                        />
                        <Button variant="solid" onClick={handleChange}>
                            Send
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatInput
