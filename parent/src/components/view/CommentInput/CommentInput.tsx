import { useImperativeHandle, useCallback } from 'react'
import Button from '@/components/ui/Button'
import classNames from '@/utils/classNames'
import { LiSend } from '@/icons'
import ToolButtonBold from '@/components/shared/EditorTools/ToolButtonBold'
import ToolButtonItalic from '@/components/shared/EditorTools/ToolButtonItalic'
import ToolButtonStrike from '@/components/shared/EditorTools/ToolButtonStrike'
import ToolButtonOrderedList from '@/components/shared/EditorTools/ToolButtonOrderedList'
import ToolButtonHorizontalRule from '@/components/shared/EditorTools/ToolButtonHorizontalRule'
import ToolButtonBulletList from '@/components/shared/EditorTools/ToolButtonBulletList'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import ResizableImageExtension from 'tiptap-extension-resize-image'
import type { Ref, ReactNode } from 'react'

export type CommentInputRef = {
    handleFocus: () => void
}

type CommentInputProps = {
    onSubmit: ({ message }: { message: string }) => void
    onCancel?: () => void
    onChange?: (value: string) => void
    className?: string
    ref?: Ref<CommentInputRef>
    extraTools?: ReactNode
    placeholder?: string
}

const CommentInput = ({
    onSubmit,
    onChange,
    onCancel,
    className,
    extraTools,
    placeholder,
    ref,
}: CommentInputProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                },
                orderedList: {
                    keepMarks: true,
                },
            }),
            ResizableImageExtension,
            Placeholder.configure({
                placeholder: placeholder,
            }),
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-hidden min-h-[75px] p-3 prose prose-p:text-sm',
            },
        },
        onUpdate: ({ editor }) => {
            const textContent = editor.getText()
            onChange?.(textContent || '')
        },
    })

    const handleSubmit = () => {
        if (editor) {
            onSubmit({ message: editor.getHTML() })
            editor.commands.clearContent()
        }
    }

    const handleFocus = useCallback(() => {
        editor?.commands.focus()
    }, [editor])

    useImperativeHandle(ref, () => {
        return {
            handleFocus,
        }
    }, [handleFocus])

    return (
        <div
            className={classNames(
                'border border-gray-200 dark:border-gray-700 rounded-lg min-h-[120px] shadow flex flex-col',
                className,
            )}
        >
            <div>
                <div>
                    <EditorContent className="h-full" editor={editor} />
                </div>
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex justify-center gap-x-1 gap-y-2">
                        {editor && (
                            <>
                                <ToolButtonBold editor={editor} />
                                <ToolButtonItalic editor={editor} />
                                <ToolButtonStrike editor={editor} />
                                <ToolButtonBulletList editor={editor} />
                                <ToolButtonOrderedList editor={editor} />
                                <ToolButtonHorizontalRule editor={editor} />
                                {extraTools}
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
                        <Button
                            size="sm"
                            variant="solid"
                            icon={<LiSend className="text-xl" />}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentInput
