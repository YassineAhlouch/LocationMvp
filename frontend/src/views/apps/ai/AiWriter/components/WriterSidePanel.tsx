import WriterSidePanelContent from './WriterSidePanelContent'
import type { Editor } from '@tiptap/react'

type WriterSidePanelProps = {
    editor: Editor
}

const WriterSidePanel = ({ editor }: WriterSidePanelProps) => {
    return (
        <div className="relative flex-1 xl:max-w-[450px] ltr:border-l rtl:border-r border-gray-200 dark:border-gray-800">
            <WriterSidePanelContent editor={editor} />
        </div>
    )
}

export default WriterSidePanel
