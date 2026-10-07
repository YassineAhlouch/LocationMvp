import { useRef, useState, useEffect } from 'react'
import Scroll from '@/components/ui/Scroll'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import ToolButtonBold from '@/components/shared/EditorTools/ToolButtonBold'
import ToolButtonItalic from '@/components/shared/EditorTools/ToolButtonItalic'
import ToolButtonStrike from '@/components/shared/EditorTools/ToolButtonStrike'
import ToolButtonCode from '@/components/shared/EditorTools/ToolButtonCode'
import ToolButtonOrderedList from '@/components/shared/EditorTools/ToolButtonOrderedList'
import ToolButtonCodeBlock from '@/components/shared/EditorTools/ToolButtonCodeBlock'
import ToolButtonBlockquote from '@/components/shared/EditorTools/ToolButtonBlockquote'
import ToolButtonHorizontalRule from '@/components/shared/EditorTools/ToolButtonHorizontalRule'
import ToolButtonHeading from '@/components/shared/EditorTools/ToolButtonHeading'
import ToolButtonBulletList from '@/components/shared/EditorTools/ToolButtonBulletList'
import ToolButton from '@/components/shared/EditorTools/ToolButton'
import NavToggle from '@/components/shared/NavToggle'
import ControlledBubbleMenu from './ControlledBubbleMenu'
import { useAiWriterStore } from '../store/aiWriterStore'
import useResponsive from '@/utils/hooks/useResponsive'
import { LuSparkles } from 'react-icons/lu'
import { EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'

type WorkSpaceProps = {
    editor: Editor
}

const WorkSpace = ({ editor }: WorkSpaceProps) => {
    const { larger } = useResponsive()

    const showBubbleMenu = useAiWriterStore((state) => state.showBubbleMenu)
    const setSelectedText = useAiWriterStore((state) => state.setSelectedText)
    const generating = useAiWriterStore((state) => state.generating)
    const setView = useAiWriterStore((state) => state.setView)
    const panelView = useAiWriterStore((state) => state.view)
    const sidePanelOpen = useAiWriterStore((state) => state.sidePanelOpen)
    const setSidePanelOpen = useAiWriterStore((state) => state.setSidePanelOpen)

    const handleSelectedText = () => {
        if (editor) {
            if (panelView === 'generator') {
                setView('assistant')
                return
            }

            const { view, state } = editor
            const { from, to } = view.state.selection
            const text = state.doc.textBetween(from, to, '')
            setSelectedText({
                content: text,
                range: {
                    from,
                    to,
                },
            })

            // Open side panel drawer on mobile
            if (!larger.xl) {
                setSidePanelOpen(true)
            }
        }
    }

    const editorContentRef = useRef<HTMLDivElement>(null)
    const bubbleMenuRef = useRef<HTMLDivElement>(null)

    const [isEmpty, setIsEmpty] = useState(editor.isEmpty)

    useEffect(() => {
        const updateEmpty = () => setIsEmpty(editor.isEmpty)
        editor.on('update', updateEmpty)
        return () => {
            editor.off('update', updateEmpty)
        }
    }, [editor])

    return (
        <div className="flex-1 h-full p-4 mx-auto flex flex-col justify-between relative">
            {editor && (
                <div className="absolute top-0 left-0 h-full w-full py-4">
                    <div className="relative flex items-center justify-center gap-x-1 gap-y-2 p-2">
                        {!larger.xl && (
                            <button
                                className="absolute left-2 text-xl"
                                type="button"
                                onClick={() => setSidePanelOpen(!sidePanelOpen)}
                            >
                                <NavToggle
                                    toggled={sidePanelOpen}
                                    iconType="alignment"
                                />
                            </button>
                        )}
                        <ToolButtonHeading editor={editor} />
                        <ToolButtonBold editor={editor} />
                        <ToolButtonItalic editor={editor} />
                        <ToolButtonStrike editor={editor} />
                        <ToolButtonCode editor={editor} />
                        <ToolButtonBlockquote editor={editor} />
                        <ToolButtonBulletList editor={editor} />
                        <ToolButtonOrderedList editor={editor} />
                        <ToolButtonCodeBlock editor={editor} />
                        <ToolButtonHorizontalRule editor={editor} />
                    </div>
                    <Scroll
                        className="h-[calc(100%_-_46px)]"
                        scrollbars="vertical"
                        viewportRef={editorContentRef}
                        contentClassName="h-full"
                    >
                        {editor && (
                            <ControlledBubbleMenu
                                editor={editor}
                                open={showBubbleMenu}
                            >
                                <div
                                    ref={bubbleMenuRef}
                                    className="rounded-lg bg-white dark:bg-gray-900 ring-0 shadow-md border border-gray-200 dark:border-gray-600 focus:outline-none p-1.5 flex gap-x-2"
                                >
                                    <ToolButton onClick={handleSelectedText}>
                                        <span className="flex items-center gap-1 ">
                                            <LuSparkles className="text-lg text-pink-500" />
                                            <span className="text-sm font-semibold  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-transparent bg-clip-text flex">
                                                Ask Ai
                                            </span>
                                        </span>
                                    </ToolButton>
                                    <ToolButtonBold editor={editor} />
                                    <ToolButtonItalic editor={editor} />
                                    <ToolButtonStrike editor={editor} />
                                </div>
                            </ControlledBubbleMenu>
                        )}
                        <div className="max-w-[900px] mx-auto h-full prose dark:prose-invert relative">
                            {isEmpty && !generating && (
                                <div className="absolute top-6.5 ltr:left-2 rtl:right-2">
                                    <div className="text-2xl text-center text-gray-400 dark:text-gray-400">
                                        Start typing, paste something, or let
                                        our AI do the writing...
                                    </div>
                                </div>
                            )}
                            {generating && (
                                <div className="flex flex-col gap-8 mt-4">
                                    <TextBlockSkeleton rowCount={6} />
                                    <TextBlockSkeleton rowCount={4} />
                                    <TextBlockSkeleton rowCount={8} />
                                </div>
                            )}
                            <EditorContent className="h-full" editor={editor} />
                        </div>
                    </Scroll>
                </div>
            )}
        </div>
    )
}

export default WorkSpace
