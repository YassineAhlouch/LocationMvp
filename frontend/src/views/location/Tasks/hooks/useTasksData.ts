import { apiGetTasks, apiUpdateTask } from '@/services/TaskService'
import useSWR from 'swr'
import { useTasksStore } from '../store/tasksStore'
import type {
    GetTasksResponse,
    Task,
    Group,
    ProjectMeta,
    Member,
} from '../types'

/** Fire-and-forget persistence of inline edits; local state already reflects them. */
const persistTask = (payload: { key: string; value: string; id: string }) => {
    if (payload.key === 'priority' || payload.key === 'subject') {
        apiUpdateTask({ id: payload.id, [payload.key]: payload.value }).catch(
            () => {},
        )
    }

    if (payload.key === 'dueDate') {
        apiUpdateTask({ id: payload.id, due_date: payload.value }).catch(
            () => {},
        )
    }

    if (payload.key === 'tags') {
        apiUpdateTask({ id: payload.id, tags: [payload.value] }).catch(
            () => {},
        )
    }

    if (payload.key === 'assignee') {
        apiUpdateTask({
            id: payload.id,
            user_ids: payload.value ? [Number(payload.value)] : [],
            visibility: payload.value ? 'private' : 'shared',
        }).catch(() => {})
    }
}

const useTasksData = () => {
    const setAllMembers = useTasksStore((state) => state.setAllMembers)

    const { data, isLoading, mutate } = useSWR(
        [`/api/v1/tasks`],
        () => apiGetTasks<GetTasksResponse>(),
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                if (data) {
                    setAllMembers(data.projectMeta.allMembers)
                }
            },
        },
    )

    const setGroups = (callback: (data: Group[]) => Group[]) => {
        if (data) {
            const groups = callback(data.groups)
            mutate(
                {
                    ...data,
                    groups,
                },
                false,
            )
        }
    }

    const setTasks = (callback: (data: Task[]) => Task[]) => {
        if (data) {
            const tasks = callback(data.tasks)
            mutate(
                {
                    ...data,
                    tasks,
                },
                false,
            )
        }
    }
    const setProjectMeta = (callback: (data: ProjectMeta) => ProjectMeta) => {
        if (data) {
            const projectMeta = callback(data.projectMeta)
            mutate(
                {
                    ...data,
                    projectMeta,
                },
                false,
            )
        }
    }

    const setData = (payload: { key: string; value: string; id: string }) => {
        if (data) {
            const hanging = (
                task: Task,
            ): Task => {
                if (task.id !== payload.id) {
                    return task
                }

                if (payload.key === 'priority') {
                    persistTask(payload)
                    return {
                        ...task,
                        priority: payload.value,
                    }
                }

                if (payload.key === 'dueDate') {
                    persistTask(payload)
                    return {
                        ...task,
                        dueDate: payload.value,
                    }
                }

                if (payload.key === 'subject') {
                    persistTask(payload)
                    return {
                        ...task,
                        subject: payload.value,
                    }
                }

                if (payload.key === 'assignee') {
                    const allMembers = data.projectMeta.allMembers
                    const hasMember = task.members.some(
                        (member) => member.id === payload.value,
                    )
                    const members: Member[] = []

                    if (hasMember) {
                        members.push(
                            ...task.members.filter(
                                (member) => member.id !== payload.value,
                            ),
                        )
                    } else {
                        members.push(...task.members)
                        members.push(
                            allMembers.find(
                                (member) => member.id === payload.value,
                            ) as Member,
                        )
                    }

                    persistTask({
                        ...payload,
                        value: hasMember ? '' : payload.value,
                    })

                    return {
                        ...task,
                        members,
                    }
                }

                if (payload.key === 'tags') {
                    const tags: string[] = []

                    if (task.tags.includes(payload.value)) {
                        tags.push(
                            ...task.tags.filter(
                                (tag) => tag !== payload.value,
                            ),
                        )
                    } else {
                        tags.push(...task.tags)
                        tags.push(payload.value)
                    }

                    persistTask(payload)

                    return {
                        ...task,
                        tags,
                    }
                }

                return task
            }

            const tasks = data.tasks.map(hanging)

            mutate(
                {
                    ...data,
                    tasks,
                },
                false,
            )
        }
    }

    return {
        groups: data?.groups || [],
        tasks: data?.tasks || [],
        projectMeta: data?.projectMeta,
        setGroups,
        setTasks,
        setData,
        setProjectMeta,
        isLoading,
        mutate,
    }
}

export default useTasksData
