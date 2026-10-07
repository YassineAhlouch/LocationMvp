import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'
import ToolButtonBold from '@/components/shared/EditorTools/ToolButtonBold'
import ToolButtonItalic from '@/components/shared/EditorTools/ToolButtonItalic'
import ToolButtonStrike from '@/components/shared/EditorTools/ToolButtonStrike'
import ToolButtonOrderedList from '@/components/shared/EditorTools/ToolButtonOrderedList'
import ToolButtonHorizontalRule from '@/components/shared/EditorTools/ToolButtonHorizontalRule'
import ToolButtonHeading from '@/components/shared/EditorTools/ToolButtonHeading'
import ToolButtonBulletList from '@/components/shared/EditorTools/ToolButtonBulletList'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
type TicketMessageTextboxProps = {
    onSubmit: ({ message, type }: { message: string; type: string }) => void
}

const { TabNav, TabList } = Tabs

const TicketMessageTextbox = ({ onSubmit }: TicketMessageTextboxProps) => {
    const [activeTab, setActiveTab] = useState('public')

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
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-hidden min-h-[90px] p-2',
            },
        },
    })

    const handleSubmit = () => {
        if (editor) {
            onSubmit({ message: editor.getHTML(), type: activeTab })
            editor.commands.clearContent()
        }
    }

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl min-h-[180px] shadow flex flex-col">
            <Tabs value={activeTab} onChange={setActiveTab}>
                <TabList>
                    <TabNav value="public">Public message</TabNav>
                    <TabNav value="private">Private note</TabNav>
                </TabList>
            </Tabs>
            <div>
                <div className="min-h-[90px]">
                    <EditorContent className="h-full" editor={editor} />
                </div>
                <div className="flex items-center justify-between p-3">
                    <div className="flex justify-center gap-x-1 gap-y-2">
                        {editor && (
                            <>
                                <ToolButtonHeading editor={editor} />
                                <ToolButtonBold editor={editor} />
                                <ToolButtonItalic editor={editor} />
                                <ToolButtonStrike editor={editor} />
                                <ToolButtonBulletList editor={editor} />
                                <ToolButtonOrderedList editor={editor} />
                                <ToolButtonHorizontalRule editor={editor} />
                            </>
                        )}
                    </div>
                    <Button variant="solid" onClick={handleSubmit}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TicketMessageTextbox
