```jsx
import ToolButton from '@/components/shared/EditorTools/ToolButton'
import {
    LuBold,
    LuItalic,
    LuCode,
    LuHeading1,
    LuHeading2,
    LuList,
    LuListOrdered,
    LuQuote,
    LuUndo,
    LuRedo,
    LuImage,
    LuMinus,
} from 'react-icons/lu'

const AllTools = () => {
    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-200 dark:border-gray-700 rounded">
            <ToolButton title="Bold">
                <LuBold />
            </ToolButton>
            <ToolButton title="Italic">
                <LuItalic />
            </ToolButton>
            <ToolButton title="Code">
                <LuCode />
            </ToolButton>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ToolButton title="Heading 1">
                <LuHeading1 />
            </ToolButton>
            <ToolButton title="Heading 2">
                <LuHeading2 />
            </ToolButton>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ToolButton title="Bullet List">
                <LuList />
            </ToolButton>
            <ToolButton title="Ordered List">
                <LuListOrdered />
            </ToolButton>
            <ToolButton title="Blockquote">
                <LuQuote />
            </ToolButton>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ToolButton title="Image">
                <LuImage />
            </ToolButton>
            <ToolButton title="Horizontal Rule">
                <LuMinus />
            </ToolButton>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ToolButton title="Undo">
                <LuUndo />
            </ToolButton>
            <ToolButton title="Redo">
                <LuRedo />
            </ToolButton>
        </div>
    )
}

export default AllTools
```
