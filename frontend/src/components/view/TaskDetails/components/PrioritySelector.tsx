import { useState } from 'react'
import Popover from '@/components/ui/Popover'
import classNames from '@/utils/classNames'
import { LuCheck } from 'react-icons/lu'
import type { ComponentProps, ReactNode } from 'react'

type PrioritySelectorProps = ComponentProps<'span'> & {
    value?: string
    list: Array<{ value: string; label: string; indicator: string | ReactNode }>
    onValueChange: (value: string) => void
}

const PrioritySelector = ({
    children,
    list,
    value,
    onValueChange,
}: PrioritySelectorProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false)

    return (
        <Popover
            renderTrigger={children}
            open={popoverOpen}
            placement="bottom-start"
            onOpenChange={setPopoverOpen}
            className="p-1"
            width={220}
        >
            <ul>
                {list.map((item) => (
                    <li
                        className={classNames(
                            'flex items-center justify-between cursor-pointer font-medium px-3 rounded-md  w-full whitespace-nowrap gap-x-2 transition-colors duration-150 text-gray-900 dark:text-gray-100 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-700 h-[36px]',
                            item.value === value &&
                                'font-semibold text-gray-900 dark:text-gray-100',
                        )}
                        key={item.value}
                        onClick={() => {
                            onValueChange(item.value)
                            setPopoverOpen(false)
                        }}
                        role="option"
                        aria-selected={item.value === value}
                        tabIndex={-1}
                    >
                        <span className="flex items-center gap-2">
                            {item.indicator}
                            <span>{item.label}</span>
                        </span>
                        {item.value === value && (
                            <LuCheck className="text-primary text-lg" />
                        )}
                    </li>
                ))}
            </ul>
        </Popover>
    )
}

export default PrioritySelector
