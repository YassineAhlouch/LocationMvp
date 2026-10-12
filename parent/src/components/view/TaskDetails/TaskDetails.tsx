import { Fragment, useMemo } from 'react'
import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Card from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import Tabs from '@/components/ui/Tabs'
import Scroll from '@/components/ui/Scroll'
import CommentInput from '@/components/view/CommentInput'
import FileIcon from '@/components/shared/FileIcon'
import Divider from '@/components/shared/Divider'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import EmptyState from '@/components/shared/EmptyState'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { apiGetProjectTask } from '@/services/ProjectService'
import PrioritySelector from './components/PrioritySelector'
import DuedateSelector from './components/DueDateSelector'
import AssigneeSelector from './components/AssigneeSelector'
import TagsSelector from './components/TagsSelector'
import SubjectEdtitor from './components/SubjectEditor'
import classNames from '@/utils/classNames'
import useSWR from 'swr'
import dayjs from 'dayjs'
import ReactHtmlParser from 'html-react-parser'
import {
    LiClock,
    LiBookmark,
    LiArrowUpDown,
    LiUser,
    LiTag,
    LiCalendar,
    LiMessageCross,
    LiDocument,
    LiTaskSquare,
    LiDownload,
} from '@/icons'
import type { ComponentProps, ReactNode, Dispatch, SetStateAction } from 'react'

type Member = {
    id: string
    name: string
    email: string
    img: string
    permissionRole: string
    status: string
}

export interface Task {
    id: string
    subject: string
    columnId: string
    description: string
    cover: string
    members: Member[]
    tags: string[]
    priority: string
    attachmentCount: number
    taskCount: number
    commentCount: number
    dueDate: string
    attachments: {
        id: string
        name: string
        src: string
        size: string
        type: string
    }[]
    comments: {
        id: string
        name: string
        src: string
        message: string
        date: string
    }[]
    subtasks: {
        id: string
        title: string
        description: string
        status: string
        assignee: {
            id: string
            name: string
            email: string
            img: string
        }[]
        priority: string
        dueDate: string
        checked: boolean
    }[]
}

type TaskDetailsProps = {
    taskId?: string
    cornerContent?: ReactNode
    priorityList: Record<string, { color: string }>
    assigneeList: Array<{
        id: string
        name: string
        img: string
    }>
    tagsList: Record<string, { color: string }>
    onCancel?: () => void
    onSave?: (
        payload: Pick<
            Task,
            | 'subject'
            | 'description'
            | 'members'
            | 'tags'
            | 'priority'
            | 'dueDate'
        >,
        setter: Dispatch<SetStateAction<boolean>>,
    ) => void
}

type FieldProps = ComponentProps<'div'> & { label: string; icon: ReactNode }

const Field = ({ label, icon, children }: FieldProps) => {
    return (
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 min-w-[120px] sm:min-w-[150px] font-medium">
                <span className="text-base">{icon}</span>
                <span>{label}:</span>
            </span>
            <div className="heading-text flex items-center">{children}</div>
        </div>
    )
}

const SelectorWraper = ({
    children,
    editable = true,
    className,
    ...rest
}: ComponentProps<'span'> & { editable?: boolean }) => {
    return (
        <span
            className={classNames(
                'py-1 px-2 rounded-lg sm:min-w-[250px] inline-flex items-center flex-nowrap max-w-[450px] h-full min-h-[40px] gap-2',
                editable &&
                    'hover:bg-gray-100 focus-within:bg-gray-100 cursor-pointer',
                className,
            )}
            {...rest}
        >
            {children}
        </span>
    )
}

const TaskDetails = ({
    taskId,
    cornerContent,
    onCancel,
    onSave,
    priorityList,
    assigneeList,
    tagsList,
}: TaskDetailsProps) => {
    const { data, mutate } = useSWR(
        [`/api/project/tasks/${taskId}`, { id: taskId }],
        ([, params]) => {
            if (taskId) {
                return apiGetProjectTask<Task, { id?: string }>(params)
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [isSaving, setIsSaving] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [editedDescription, setEditedDescription] = useState('')

    const priorityOptions = useMemo(() => {
        return Object.entries(priorityList).map(([key, value]) => ({
            label: key,
            value: key,
            indicator: (
                <span
                    className={classNames(
                        'h-2.5 w-2.5 rounded-xs',
                        value.color,
                    )}
                ></span>
            ),
        }))
    }, [priorityList])

    const assigneeOptions = useMemo(() => {
        return assigneeList.map((assignee) => ({
            label: assignee.name,
            value: assignee.id,
            indicator: <Avatar src={assignee.img} shape="circle" size={25} />,
        }))
    }, [assigneeList])

    const tagOptions = useMemo(() => {
        return Object.entries(tagsList).map(([key]) => {
            return {
                value: key,
                label: key,
            }
        })
    }, [tagsList])

    const handleCommentSubmit = ({ message }: { message: string }) => {
        if (data) {
            mutate(
                {
                    ...data,
                    comments: [
                        ...data.comments,
                        {
                            id: '1',
                            name: 'Angelina Gotelli',
                            src: '/img/avatars/thumb-1.jpg',
                            message,
                            date: dayjs().format('DD MMM YYYY'),
                        },
                    ],
                },
                false,
            )
        }
    }

    const handleSave = () => {
        if (data && onSave) {
            onSave(
                {
                    subject: data.subject,
                    description: data.description,
                    members: data.members,
                    tags: data.tags,
                    priority: data.priority,
                    dueDate: data.dueDate,
                },
                setIsSaving,
            )
        }
    }

    const handleSubTaskCheck = (id: string, checked: boolean) => {
        if (data) {
            mutate(
                {
                    ...data,
                    subtasks: data.subtasks.map((subtask) => {
                        if (subtask.id === id) {
                            return {
                                ...subtask,
                                checked,
                            }
                        }
                        return subtask
                    }),
                },
                false,
            )
        }
    }

    const handleMutate = (payload: { key: string; value: string }) => {
        if (data) {
            if (payload.key === 'priority') {
                mutate(
                    {
                        ...data,
                        priority: payload.value,
                    },
                    false,
                )
            }

            if (payload.key === 'dueDate') {
                mutate(
                    {
                        ...data,
                        dueDate: payload.value,
                    },
                    false,
                )
            }

            if (payload.key === 'assignee') {
                const hasMember = data.members.some(
                    (member) => member.id === payload.value,
                )
                const members: Member[] = []

                if (hasMember) {
                    members.push(
                        ...data.members.filter(
                            (member) => member.id !== payload.value,
                        ),
                    )
                } else {
                    members.push(...data.members)
                    members.push(
                        assigneeList.find(
                            (member) => member.id === payload.value,
                        ) as Member,
                    )
                }

                mutate(
                    {
                        ...data,
                        members,
                    },
                    false,
                )
            }

            if (payload.key === 'tags') {
                const hasTag = data.tags.some((tag) => tag === payload.value)
                const tags: string[] = []

                if (hasTag) {
                    tags.push(
                        ...data.tags.filter((tag) => tag !== payload.value),
                    )
                } else {
                    tags.push(...data.tags)
                    tags.push(payload.value)
                }

                mutate(
                    {
                        ...data,
                        tags,
                    },
                    false,
                )
            }

            if (payload.key === 'subject') {
                mutate(
                    {
                        ...data,
                        subject: payload.value,
                    },
                    false,
                )
            }

            if (payload.key === 'description') {
                mutate(
                    {
                        ...data,
                        description: payload.value,
                    },
                    false,
                )
            }
        }
    }

    return (
        <div>
            {data && (
                <div className="min-h-[400px] py-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center gap-6 px-4">
                            <h4 className="w-full -ml-2">
                                <SelectorWraper className="w-full max-w-auto">
                                    <SubjectEdtitor
                                        className="flex-1"
                                        value={data.subject}
                                        onValueChange={(value) =>
                                            handleMutate({
                                                key: 'subject',
                                                value,
                                            })
                                        }
                                    />
                                </SelectorWraper>
                            </h4>
                            <div>{cornerContent}</div>
                        </div>
                        <div className="px-4">
                            <Field label="Ticket" icon={<LiBookmark />}>
                                <SelectorWraper editable={false}>
                                    {data.id}
                                </SelectorWraper>
                            </Field>
                            <Field label="Priority" icon={<LiArrowUpDown />}>
                                <PrioritySelector
                                    value={data.priority}
                                    list={priorityOptions}
                                    onValueChange={(value) =>
                                        handleMutate({ key: 'priority', value })
                                    }
                                >
                                    <SelectorWraper>
                                        <Tag
                                            className="gap-1 inline-flex items-center bg-transparent py-0.5 px-1.5"
                                            prefix={
                                                <span
                                                    className={classNames(
                                                        'h-2.5 w-2.5 rounded-xs',
                                                        priorityList[
                                                            data.priority
                                                        ].color,
                                                    )}
                                                ></span>
                                            }
                                        >
                                            {data.priority}
                                        </Tag>
                                    </SelectorWraper>
                                </PrioritySelector>
                            </Field>
                            <Field label="Due date" icon={<LiClock />}>
                                <DuedateSelector
                                    value={data.dueDate}
                                    onValueChange={(value) =>
                                        handleMutate({ key: 'dueDate', value })
                                    }
                                >
                                    <SelectorWraper>
                                        {dayjs(data.dueDate).format(
                                            'DD MMM YYYY',
                                        )}
                                    </SelectorWraper>
                                </DuedateSelector>
                            </Field>
                            <Field label="Assigned to" icon={<LiUser />}>
                                <AssigneeSelector
                                    list={assigneeOptions}
                                    value={data.members.map(
                                        (assignee) => assignee.id,
                                    )}
                                    onValueChange={(value) =>
                                        handleMutate({ key: 'assignee', value })
                                    }
                                >
                                    <SelectorWraper>
                                        {data.members.length > 1 ? (
                                            <UsersAvatarGroup
                                                users={data.members}
                                                avatarProps={{ size: 25 }}
                                            />
                                        ) : (
                                            <>
                                                {data.members.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Avatar
                                                            size={22}
                                                            shape="circle"
                                                            src={member.img}
                                                            alt={member.name}
                                                        />
                                                        <div>{member.name}</div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </SelectorWraper>
                                </AssigneeSelector>
                            </Field>
                            <Field label="Tags" icon={<LiTag />}>
                                <TagsSelector
                                    list={tagOptions}
                                    value={data.tags}
                                    onValueChange={(value) =>
                                        handleMutate({ key: 'tags', value })
                                    }
                                >
                                    <SelectorWraper>
                                        {data.tags.map((tag) => (
                                            <Tag
                                                className="py-0.5 px-1.5"
                                                key={tag}
                                            >
                                                {tag}
                                            </Tag>
                                        ))}
                                    </SelectorWraper>
                                </TagsSelector>
                            </Field>
                        </div>
                        <div className="px-4">
                            {isEditingDescription ? (
                                <>
                                    <h6 className="mb-1">Description</h6>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <RichTextEditor
                                            content={editedDescription}
                                            onChange={({ html }) =>
                                                setEditedDescription(html)
                                            }
                                        />
                                        <div className="flex justify-end gap-2 mt-3">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setIsEditingDescription(
                                                        false,
                                                    )
                                                    setEditedDescription('')
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="solid"
                                                onClick={() => {
                                                    handleMutate({
                                                        key: 'description',
                                                        value: editedDescription,
                                                    })
                                                    setIsEditingDescription(
                                                        false,
                                                    )
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Card
                                    className={classNames(
                                        'bg-gray-100 dark:bg-gray-700',
                                        !isEditingDescription &&
                                            'cursor-pointer hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-500 transition-all',
                                    )}
                                    onClick={() => {
                                        if (!isEditingDescription) {
                                            setEditedDescription(
                                                data.description,
                                            )
                                            setIsEditingDescription(true)
                                        }
                                    }}
                                >
                                    <h6 className="mb-1">Description</h6>
                                    <p
                                        className={classNames(
                                            !data.description && 'italic',
                                        )}
                                    >
                                        {ReactHtmlParser(data.description) ||
                                            'Click to add description...'}
                                    </p>
                                </Card>
                            )}
                        </div>
                        <div>
                            <Tabs defaultValue="comments">
                                <Tabs.TabList className="px-4">
                                    <Tabs.TabNav value="comments">
                                        Comments
                                    </Tabs.TabNav>
                                    <Tabs.TabNav value="subtasks">
                                        Subtasks
                                    </Tabs.TabNav>
                                    <Tabs.TabNav value="attachments">
                                        Attachments
                                    </Tabs.TabNav>
                                </Tabs.TabList>
                                <Scroll.FlexSize className="max-h-[600px]">
                                    <div className="py-4 px-6">
                                        <Tabs.TabContent value="comments">
                                            <div>
                                                {data.comments.map(
                                                    (comment, index) => (
                                                        <Fragment
                                                            key={comment.id}
                                                        >
                                                            <div className="flex gap-2 py-4">
                                                                <div>
                                                                    <Avatar
                                                                        shape="circle"
                                                                        src={
                                                                            comment.src
                                                                        }
                                                                        size={
                                                                            30
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="rounded-sm">
                                                                    <div className="flex items-center mb-1">
                                                                        <span className="font-medium heading-text">
                                                                            {
                                                                                comment.name
                                                                            }
                                                                        </span>
                                                                        <span className="mx-1">
                                                                            {' '}
                                                                            •{' '}
                                                                        </span>
                                                                        <span className="text-xs">
                                                                            {dayjs(
                                                                                comment.date,
                                                                            ).format(
                                                                                'hh:mm A',
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <div className="mb-0 prose text-sm prose-p:text-sm prose-p:leading-normal">
                                                                        {ReactHtmlParser(
                                                                            comment.message,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {index !==
                                                                data.comments
                                                                    .length -
                                                                    1 && (
                                                                <Divider className="dark:bg-gray-700" />
                                                            )}
                                                        </Fragment>
                                                    ),
                                                )}
                                                {data.comments.length === 0 && (
                                                    <div className="flex-1 flex flex-col items-center justify-center">
                                                        <EmptyState
                                                            variant="dots"
                                                            size={180}
                                                            offset={-20}
                                                            illustration={
                                                                <Avatar
                                                                    className="bg-white heading-text ring-1 ring-gray-200"
                                                                    icon={
                                                                        <LiMessageCross className="text-xl" />
                                                                    }
                                                                />
                                                            }
                                                        >
                                                            <div className="text-center">
                                                                <h5>
                                                                    No comment
                                                                    yet
                                                                </h5>
                                                                <p className="max-w-[400px]">
                                                                    Be the first
                                                                    one to
                                                                    comment
                                                                </p>
                                                            </div>
                                                        </EmptyState>
                                                    </div>
                                                )}
                                                <div className="mt-8">
                                                    <CommentInput
                                                        onSubmit={
                                                            handleCommentSubmit
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </Tabs.TabContent>
                                        <Tabs.TabContent value="subtasks">
                                            {data.subtasks.length === 0 && (
                                                <div className="flex-1 flex flex-col items-center justify-center">
                                                    <EmptyState
                                                        variant="dots"
                                                        size={180}
                                                        offset={-20}
                                                        illustration={
                                                            <Avatar
                                                                className="bg-white heading-text ring-1 ring-gray-200"
                                                                icon={
                                                                    <LiTaskSquare className="text-xl" />
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <div className="text-center">
                                                            <h5>No subtasks</h5>
                                                        </div>
                                                    </EmptyState>
                                                </div>
                                            )}
                                            <div>
                                                {data.subtasks.map(
                                                    (subtask, index) => (
                                                        <Fragment
                                                            key={subtask.id}
                                                        >
                                                            <div
                                                                className="py-2 px-2 flex items-center justify-between cursor-pointer"
                                                                tabIndex={0}
                                                                role="button"
                                                                onClick={() =>
                                                                    handleSubTaskCheck(
                                                                        subtask.id,
                                                                        !subtask.checked,
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        checked={
                                                                            subtask.checked
                                                                        }
                                                                    />
                                                                    <div
                                                                        className={classNames(
                                                                            'font-medium leading-none',
                                                                            subtask.checked
                                                                                ? 'line-through'
                                                                                : 'heading-text',
                                                                        )}
                                                                    >
                                                                        {
                                                                            subtask.title
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center">
                                                                        <UsersAvatarGroup
                                                                            avatarProps={{
                                                                                size: 22,
                                                                            }}
                                                                            users={
                                                                                subtask.assignee
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center gap-1 min-w-[60px] font-medium">
                                                                        <LiCalendar className="text-lg" />
                                                                        <span className="text-xs">
                                                                            {dayjs(
                                                                                subtask.dueDate,
                                                                            ).format(
                                                                                'MMM DD',
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {index !==
                                                                data.subtasks
                                                                    .length -
                                                                    1 && (
                                                                <Divider />
                                                            )}
                                                        </Fragment>
                                                    ),
                                                )}
                                            </div>
                                        </Tabs.TabContent>
                                        <Tabs.TabContent value="attachments">
                                            {data.attachments.length === 0 ? (
                                                <div className="flex-1 flex flex-col items-center justify-center mb-4">
                                                    <EmptyState
                                                        variant="dots"
                                                        size={180}
                                                        offset={-20}
                                                        illustration={
                                                            <Avatar
                                                                className="bg-white dark:bg-gray-800 heading-text ring-1 ring-gray-200"
                                                                icon={
                                                                    <LiDocument className="text-xl" />
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <div className="text-center">
                                                            <h5>
                                                                No attachments
                                                            </h5>
                                                        </div>
                                                    </EmptyState>
                                                </div>
                                            ) : (
                                                <Card bodyClass="p-0 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {data.attachments.map(
                                                        (attachment) => (
                                                            <div
                                                                key={
                                                                    attachment.id
                                                                }
                                                                className="flex justify-between items-center p-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <FileIcon
                                                                        type={
                                                                            attachment.type
                                                                        }
                                                                        size={
                                                                            25
                                                                        }
                                                                    />
                                                                    <div className="heading-text font-medium">
                                                                        {
                                                                            attachment.name
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        icon={
                                                                            <LiDownload />
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </Card>
                                            )}
                                        </Tabs.TabContent>
                                    </div>
                                </Scroll.FlexSize>
                            </Tabs>
                        </div>
                        <div className="flex justify-end items-center gap-2 px-4">
                            <Button onClick={onCancel}>Cancel</Button>
                            <Button
                                variant="solid"
                                loading={isSaving}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskDetails
