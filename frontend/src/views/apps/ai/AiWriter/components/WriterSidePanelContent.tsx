import AssistView from './AssistView'
import GeneratorView from './GeneratorView'
import { useAiWriterStore } from '../store/aiWriterStore'
import type { Editor } from '@tiptap/react'

type WriterSidePanelContentProps = {
    editor: Editor
}

const WriterSidePanelContent = ({ editor }: WriterSidePanelContentProps) => {
    const view = useAiWriterStore((state) => state.view)

    return (
        <div className="h-full w-full absolute flex flex-col justify-between">
            {view === 'assistant' && <AssistView editor={editor} />}
            {view === 'generator' && <GeneratorView editor={editor} />}
        </div>
    )
}

export default WriterSidePanelContent
