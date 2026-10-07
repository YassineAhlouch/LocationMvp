import { useState, useRef } from 'react'
import Dropdown from '@/components/ui/Dropdown'
import classNames from 'classnames'
import {
    LuEllipsis,
    LuArchive,
    LuPencil,
    LuTrash,
    LuMessageCircle,
} from 'react-icons/lu'
import type { DropdownRef } from '@/components/ui/Dropdown'

import type { MouseEvent, SyntheticEvent } from 'react'

type ChatHistoryItemProps = {
    title: string
    conversation: string
    active?: boolean
    onDelete?: () => void
    onArchive?: () => void
    onRename?: () => void
    onClick?: () => void
}

const ChatHistoryItem = (props: ChatHistoryItemProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const dropdownRef = useRef<DropdownRef>(null)

    const {
        title,
        conversation,
        active,
        onRename,
        onArchive,
        onDelete,
        onClick,
        ...rest
    } = props

    const handleCallback = (
        e: SyntheticEvent<Element, Event>,
        callback?: () => void,
    ) => {
        e.stopPropagation()
        callback?.()
    }

    const handleDropdownToggleClick = (e: MouseEvent) => {
        e.stopPropagation()
        dropdownRef.current?.handleDropdownOpen()
    }

    return (
        <div
            className={classNames(
                'rounded-lg p-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group relative',
                (dropdownOpen || active) && 'bg-gray-100 dark:bg-gray-700',
            )}
            onClick={onClick}
            {...rest}
        >
            <div className="flex items-center gap-3">
                <span className="text-xl text-gray-900 dark:text-gray-100">
                    <LuMessageCircle />
                </span>
                <div className="min-w-0">
                    <div className="heading-text font-semibold truncate">
                        {title}
                    </div>
                    <div className="truncate">{conversation}</div>
                </div>
            </div>
            <div
                className={classNames(
                    'rounded-xl absolute bottom-0 top-0 to-transparent ltr:right-0 ltr:bg-linear-to-l rtl:left-0 rtl:bg-linear-to-r group-hover:from-gray-100 dark:group-hover:from-gray-700 w-8 from-0% group-hover:w-20 group-hover:from-60% flex items-center justify-end',
                    dropdownOpen &&
                        'from-gray-100 dark:from-gray-700 w-20 from-60%',
                )}
            >
                <Dropdown
                    ref={dropdownRef}
                    placement="bottom-end"
                    renderTitle={
                        <div
                            className={classNames(
                                'p-2 opacity-0 group-hover:opacity-100',
                                dropdownOpen && 'opacity-100',
                            )}
                        >
                            <LuEllipsis
                                className="text-lg"
                                onClick={handleDropdownToggleClick}
                            />
                        </div>
                    }
                    onOpen={(bool) => setDropdownOpen(bool)}
                >
                    <Dropdown.Item
                        eventKey="rename"
                        onClick={(e) => handleCallback(e, onRename)}
                    >
                        <LuPencil className="text-lg" />
                        <span>Rename</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                        eventKey="archive"
                        onClick={(e) => handleCallback(e, onArchive)}
                    >
                        <LuArchive className="text-lg" />
                        <span>Archive</span>
                    </Dropdown.Item>
                    <Dropdown.Item variant="divider" />
                    <Dropdown.Item
                        className="text-error"
                        eventKey="delete"
                        onClick={(e) => handleCallback(e, onDelete)}
                    >
                        <LuTrash className="text-lg text-error" />
                        <span className="text-error">Delete</span>
                    </Dropdown.Item>
                </Dropdown>
            </div>
        </div>
    )
}

export default ChatHistoryItem
