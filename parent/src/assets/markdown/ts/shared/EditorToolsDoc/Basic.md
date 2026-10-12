```tsx
import { useState } from 'react'
import ToolButton from '@/components/shared/EditorTools/ToolButton'
import { LuBold, LuItalic, LuUnderline, LuStrikethrough } from 'react-icons/lu'

const Basic = () => {
    const [activeTools, setActiveTools] = useState<string[]>([])

    const toggleTool = (tool: string) => {
        setActiveTools((prev) =>
            prev.includes(tool)
                ? prev.filter((t) => t !== tool)
                : [...prev, tool],
        )
    }

    return (
        <div className="flex items-center gap-1 p-2 border border-gray-200 dark:border-gray-700 rounded">
            <ToolButton
                active={activeTools.includes('bold')}
                onClick={() => toggleTool('bold')}
                title="Bold"
            >
                <LuBold />
            </ToolButton>
            <ToolButton
                active={activeTools.includes('italic')}
                onClick={() => toggleTool('italic')}
                title="Italic"
            >
                <LuItalic />
            </ToolButton>
            <ToolButton
                active={activeTools.includes('underline')}
                onClick={() => toggleTool('underline')}
                title="Underline"
            >
                <LuUnderline />
            </ToolButton>
            <ToolButton
                active={activeTools.includes('strike')}
                onClick={() => toggleTool('strike')}
                title="Strikethrough"
            >
                <LuStrikethrough />
            </ToolButton>
            <ToolButton disabled title="Disabled">
                <LuBold />
            </ToolButton>
        </div>
    )
}

export default Basic
```
