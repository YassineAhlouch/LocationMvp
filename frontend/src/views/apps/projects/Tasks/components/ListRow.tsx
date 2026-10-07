import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import DueDateSelector from '@/components/view/TaskDetails/components/DueDateSelector'
import AssigneeSelector from '@/components/view/TaskDetails/components/AssigneeSelector'
import AssineeSelectorListProvider from './AssineeSelectorListProvider'
import PrioritySelector from '@/components/view/TaskDetails/components/PrioritySelector'
import PrioritySelectorListProvider from './PrioritySelectorListProvider'
import TagsSelector from '@/components/view/TaskDetails/components/TagsSelector'
import TagsSelectorListProvider from './TagsSelectorListProvider'
import SubjectEdtitor from '@/components/view/TaskDetails/components/SubjectEditor'
import { priorityMap } from '../utils'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import type { ComponentProps } from 'react'

import type { Task, TaskDragData } from '../types'

type BoardCardProps = {
    task: Task
    isOverlay?: boolean
    onDataChange?: (payload: { key: string; value: string; id: string }) => void
}

const CustomTableCell = ({
    children,
    isDragging,
    ...rest
}: ComponentProps<'td'> & { isDragging?: boolean }) => (
    <Table.Td className="p-0" {...rest}>
        <div
            className={classNames(
                !isDragging &&
                    'hover:outline-primary focus:outline-primary active:outline-primary',
                'outline outline-transparent h-full',
            )}
        >
            {children}
        </div>
    </Table.Td>
)

const DraggablePresentation = memo(
    ({
        task,
        isOverlay,
        isDragging,
        onDataChange,
    }: BoardCardProps & { isDragging?: boolean }) => {
        const handleDueDateChange = (date: string) => {
            onDataChange?.({ key: 'dueDate', value: date, id: task.id })
        }

        const handlePriorityChange = (priority: string) => {
            onDataChange?.({ key: 'priority', value: priority, id: task.id })
        }

        const handleAssigneeChange = (assignee: string) => {
            onDataChange?.({ key: 'assignee', value: assignee, id: task.id })
        }

        const handleTagsChange = (tag: string) => {
            onDataChange?.({ key: 'tags', value: tag, id: task.id })
        }

        const handleSubjectChange = (subject: string) => {
            onDataChange?.({ key: 'subject', value: subject, id: task.id })
        }

        const onTicketClick = () => {
            onDataChange?.({ key: 'ticket', value: '', id: task.id })
        }

        return (
            <>
                <CustomTableCell width="10%" isDragging={isOverlay}>
                    <span
                        className="text-nowrap font-medium py-2 px-4 w-full flex items-center gap-2"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation()
                            onTicketClick()
                        }}
                    >
                        <span>#{task.id}</span>
                    </span>
                </CustomTableCell>
                <CustomTableCell isDragging={isOverlay}>
                    <SubjectEdtitor
                        className="font-medium py-2 px-2 w-full flex items-center heading-text text-nowrap"
                        value={task.subject}
                        onValueChange={handleSubjectChange}
                    />
                </CustomTableCell>
                <CustomTableCell width="10%" isDragging={isOverlay}>
                    <PrioritySelectorListProvider>
                        {(priorityList) => (
                            <PrioritySelector
                                list={priorityList}
                                value={task.priority}
                                onValueChange={handlePriorityChange}
                                className="w-full"
                            >
                                <span className="py-2 px-2 w-full flex items-center gap-2 heading-text">
                                    {priorityMap[task.priority]?.icon}
                                    <span>{task.priority}</span>
                                </span>
                            </PrioritySelector>
                        )}
                    </PrioritySelectorListProvider>
                </CustomTableCell>
                <CustomTableCell width="10%" isDragging={isOverlay}>
                    <DueDateSelector
                        className="py-2 px-2 w-full flex items-center"
                        value={dayjs(task.dueDate).format('DD MMM YYYY')}
                        onValueChange={handleDueDateChange}
                    >
                        <span className="py-2 px-2 w-full flex items-center gap-2 heading-text text-nowrap">
                            {dayjs(task.dueDate).format('DD MMM YYYY')}
                        </span>
                    </DueDateSelector>
                </CustomTableCell>
                <CustomTableCell width="30%" isDragging={isOverlay}>
                    <TagsSelectorListProvider>
                        {(tagsList) => (
                            <TagsSelector
                                list={tagsList}
                                value={task.tags.map((tag) => tag)}
                                onValueChange={handleTagsChange}
                            >
                                <span className="py-2 px-2 w-full flex items-center flex-wrap gap-1">
                                    {task.tags.map((label, index) => (
                                        <Tag
                                            key={index}
                                            className="py-0.5 px-1.5"
                                        >
                                            {label}
                                        </Tag>
                                    ))}
                                </span>
                            </TagsSelector>
                        )}
                    </TagsSelectorListProvider>
                </CustomTableCell>
                <CustomTableCell width="10%" isDragging={isOverlay}>
                    {isDragging || isOverlay ? (
                        <UsersAvatarGroup
                            users={task.members}
                            avatarProps={{ size: 25 }}
                        />
                    ) : (
                        <AssineeSelectorListProvider>
                            {(assignees) => (
                                <AssigneeSelector
                                    list={assignees}
                                    value={task.members.map(
                                        (assignee) => assignee.id,
                                    )}
                                    onValueChange={handleAssigneeChange}
                                >
                                    <span className="py-2 px-2 w-full flex items-center">
                                        <UsersAvatarGroup
                                            users={task.members}
                                            avatarProps={{ size: 25 }}
                                        />
                                    </span>
                                </AssigneeSelector>
                            )}
                        </AssineeSelectorListProvider>
                    )}
                </CustomTableCell>
            </>
        )
    },
)

const ListRow = ({ task, isOverlay, onDataChange }: BoardCardProps) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        } satisfies TaskDragData,
        attributes: {
            roleDescription: 'Task',
        },
    })

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    }

    return (
        <Table.Tr
            ref={setNodeRef}
            style={style}
            className={classNames(
                'group',
                isOverlay
                    ? 'ring-2 ring-primary'
                    : isDragging
                      ? 'ring-2 opacity-30'
                      : '',
            )}
            {...attributes}
            {...listeners}
        >
            <DraggablePresentation
                task={task}
                isOverlay={isOverlay}
                isDragging={isDragging}
                onDataChange={onDataChange}
            />
        </Table.Tr>
    )
}

export default ListRow
