import Tag from '@/components/ui/Tag'
import { PiCommandLight } from 'react-icons/pi'
const Custom = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 rounded-full border-0">
                Tag 1
            </Tag>
            <Tag className="bg-emerald-500 dark:bg-emerald-500 text-white border-0 rounded-sm">
                Tag 2
            </Tag>
            <Tag className="p-1">
                <PiCommandLight className="text-base" />
            </Tag>
            <Tag className="p-1 font-mono">Ctrl</Tag>
        </div>
    )
}

export default Custom
