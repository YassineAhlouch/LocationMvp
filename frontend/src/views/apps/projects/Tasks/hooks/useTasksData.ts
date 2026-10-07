import { apiGetProjectTasks } from '@/services/ProjectService'
import useSWR from 'swr'
import { useTasksStore } from '../store/tasksStore'
import type {
    GetTasksResponse,
    Task,
    Group,
    ProjectMeta,
    Member,
} from '../types'

const useTasksData = () => {
    const setAllMembers = useTasksStore((state) => state.setAllMembers)

    const { data, isLoading, mutate } = useSWR(
        [`/api/projects/tasks`],
        () => apiGetProjectTasks<GetTasksResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
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
            if (payload.key === 'priority') {
                const tasks = data.tasks.map((task) => {
                    if (task.id === payload.id) {
                        return {
                            ...task,
                            priority: payload.value,
                        }
                    }
                    return task
                })
                mutate(
                    {
                        ...data,
                        tasks,
                    },
                    false,
                )
            }

            if (payload.key === 'dueDate') {
                const tasks = data.tasks.map((task) => {
                    if (task.id === payload.id) {
                        return {
                            ...task,
                            dueDate: payload.value,
                        }
                    }
                    return task
                })
                mutate(
                    {
                        ...data,
                        tasks,
                    },
                    false,
                )
            }

            if (payload.key === 'subject') {
                const tasks = data.tasks.map((task) => {
                    if (task.id === payload.id) {
                        return {
                            ...task,
                            subject: payload.value,
                        }
                    }
                    return task
                })
                mutate(
                    {
                        ...data,
                        tasks,
                    },
                    false,
                )
            }

            if (payload.key === 'assignee') {
                const tasks = data.tasks.map((task) => {
                    if (task.id === payload.id) {
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

                        return {
                            ...task,
                            members,
                        }
                    }
                    return task
                })
                mutate(
                    {
                        ...data,
                        tasks,
                    },
                    false,
                )
            }

            if (payload.key === 'tags') {
                const tasks = data.tasks.map((task) => {
                    if (task.id === payload.id) {
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

                        return {
                            ...task,
                            tags,
                        }
                    }
                    return task
                })
                mutate(
                    {
                        ...data,
                        tasks,
                    },
                    false,
                )
            }
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
