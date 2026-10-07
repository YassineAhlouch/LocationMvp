import { useState } from 'react'
import Popover from '@/components/ui/Popover'
import Scroll from '@/components/ui/Scroll'
import classNames from '@/utils/classNames'
import { LuCheck } from 'react-icons/lu'
import type { ComponentProps, ReactNode } from 'react'

type AssigneeSelectorProps = ComponentProps<'span'> & {
    value?: string[]
    list: Array<{ value: string; label: string; indicator: string | ReactNode }>
    onValueChange: (value: string) => void
}

const AssigneeSelector = ({
    children,
    list,
    value,
    onValueChange,
}: AssigneeSelectorProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false)

    return (
        <Popover
            renderTrigger={children}
            open={popoverOpen}
            placement="bottom-start"
            onOpenChange={setPopoverOpen}
            className="p-1"
            style={{ width: 230 }}
        >
            <Scroll className="h-[170px]">
                <ul className="ltr:pr-1.5 rtl:pl-1.5">
                    {list.map((item) => (
                        <li
                            className={classNames(
                                'flex items-center justify-between cursor-pointer font-medium px-3 rounded-md  w-full whitespace-nowrap gap-x-2 transition-colors duration-150 text-gray-900 dark:text-gray-100 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-700 h-[36px]',
                                value?.includes(item.value) &&
                                    'font-semibold text-gray-900 dark:text-gray-100',
                            )}
                            key={item.value}
                            onClick={() => {
                                onValueChange(item.value)
                            }}
                            role="option"
                            aria-selected={value?.includes(item.value)}
                            tabIndex={-1}
                        >
                            <span className="flex items-center gap-2">
                                {item.indicator}
                                <span>{item.label}</span>
                            </span>
                            {value?.includes(item.value) && (
                                <LuCheck className="text-primary text-lg" />
                            )}
                        </li>
                    ))}
                </ul>
            </Scroll>
        </Popover>
    )
}

export default AssigneeSelector
