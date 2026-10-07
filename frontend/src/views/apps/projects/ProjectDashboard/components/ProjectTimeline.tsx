import { useState, useMemo, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Popover from '@/components/ui/Popover'
import Gantt from '@/components/shared/Gantt'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import { LiTick } from '@/icons'
import { ViewMode } from '@/components/shared/Gantt/constants'
import classNames from '@/utils/classNames'
import { LiSetting4, LiTextAlignJustifyLeft } from '@/icons'
import useDirection from '@/utils/hooks/useDirection'
import type { Columns, Task } from '@/components/shared/Gantt/types'
import type { TimelineData, TimelineTask, TaskMeta } from '../types'

type TimelineSectionProps = {
    data: TimelineData
}

const ProjectTimeline = ({ data }: TimelineSectionProps) => {
    const [selectedProjects, setSelectedProjects] = useState<string[]>([
        'proj-001',
        'proj-006',
    ])
    const [direction] = useDirection()
    const allTasks = useMemo(
        () =>
            (data?.tasks || []).map((task) => ({
                ...task,
                start: new Date(task.start),
                end: new Date(task.end),
            })),
        [data?.tasks],
    )

    const projects = useMemo(
        () => allTasks.filter((task) => task.type === 'project'),
        [allTasks],
    )

    const [hideChildrenState, setHideChildrenState] = useState<
        Record<string, boolean>
    >({})

    const tasks = useMemo(
        () =>
            allTasks
                .filter((task) => {
                    if (task.type === 'project') {
                        return selectedProjects.includes(task.id)
                    }
                    return (
                        task.project && selectedProjects.includes(task.project)
                    )
                })
                .map((task) => ({
                    ...task,
                    hideChildren:
                        hideChildrenState[task.id] ?? task.hideChildren,
                })),
        [allTasks, selectedProjects, hideChildrenState],
    )

    const handleExpanderClick = useCallback((task: Task<TaskMeta>) => {
        setHideChildrenState((prev) => ({
            ...prev,
            [task.id]: !task.hideChildren,
        }))
    }, [])

    const handleProjectToggle = (projectId: string) => {
        setSelectedProjects((prev) =>
            prev.includes(projectId)
                ? prev.filter((id) => id !== projectId)
                : [...prev, projectId],
        )
    }
    const columns: Columns<TaskMeta>[] = useMemo(
        () => [
            {
                header: 'Task',
                cell: (task) => {
                    return task.expander ? (
                        <button
                            className="flex items-center gap-2 px-2 heading-text absolute left-0 top-0 h-full w-full"
                            onClick={() => handleExpanderClick(task)}
                        >
                            {task.expander}
                            <span className="font-medium">{task.name}</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-2">
                            <span className="font-medium ltr:pl-4 rtl:pr-4">
                                {task.name}
                            </span>
                        </div>
                    )
                },
                width: 250,
            },
            {
                header: 'Assignee',
                cell: (task) => {
                    const timelineTask = tasks.find(
                        (t) => t.id === task.id,
                    ) as TimelineTask
                    const assignees = timelineTask?.meta?.assignee || []

                    return (
                        <div className="flex items-center gap-1 px-2">
                            <UsersAvatarGroup
                                users={assignees}
                                avatarProps={{ size: 25, shape: 'circle' }}
                            />
                        </div>
                    )
                },
                width: 180,
            },
        ],
        [handleExpanderClick, tasks],
    )

    return (
        <Card
            bodyClass="p-0"
            header={{
                content: (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="border border-gray-300 rounded-lg p-0.5 inline-flex">
                                <div className="h-8 w-8 flex items-center justify-center heading-text border border-gray-300 rounded-lg">
                                    <LiTextAlignJustifyLeft className="text-xl" />
                                </div>
                            </div>
                            <div>
                                <h6 className="font-semibold">
                                    Project Timeline
                                </h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Popover
                                placement="bottom-end"
                                width={250}
                                trigger="click"
                                renderTrigger={
                                    <Button
                                        variant="default"
                                        icon={<LiSetting4 />}
                                    >
                                        Filter ({selectedProjects.length})
                                    </Button>
                                }
                                className="p-2"
                            >
                                <div>
                                    {projects.map((project) => (
                                        <button
                                            key={project.id}
                                            onClick={() =>
                                                handleProjectToggle(project.id)
                                            }
                                            role="checkbox"
                                            className="p-2 rounded-lg hover:bg-gray-100 hover:dark:bg-gray-700 w-full"
                                        >
                                            <span className="flex items-center justify-between heading-text">
                                                <span>{project.name}</span>
                                                {selectedProjects.includes(
                                                    project.id,
                                                ) && (
                                                    <LiTick className="text-xl" />
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </Popover>
                        </div>
                    </div>
                ),
            }}
        >
            <>
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <LiSetting4 className="text-4xl heading-text mb-2" />
                        <p className="font-medium">No projects selected</p>
                        <p className=" mt-1">
                            Use the filter to select projects to display
                        </p>
                    </div>
                ) : (
                    <Gantt<TaskMeta>
                        tasks={tasks as unknown as Task<TaskMeta>[]}
                        columns={columns}
                        viewMode={ViewMode.Day}
                        headerHeight={70}
                        rowHeight={50}
                        gridColumnsWidth={100}
                        handleWidth={8}
                        rtl={direction === 'rtl'}
                        onExpanderClick={handleExpanderClick}
                        todayColor="rgba(40, 108, 240, 0.1)"
                        barWrapperClass="stroke-gray-300 dark:stroke-gray-700 fill-gray-100 dark:fill-gray-900 shadow"
                        barProgressClass="fill-white stroke-gray-300 dark:stroke-gray-700 dark:fill-gray-600"
                        customBarContent={(task) => {
                            return (
                                <div className="flex items-center gap-1">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                task.styles.indicatorColor,
                                        }}
                                    ></span>
                                    <div
                                        className={classNames(
                                            'font-medium heading-text text-nowrap text-xs truncate select-none heading-text',
                                        )}
                                    >
                                        {task.name}
                                    </div>
                                </div>
                            )
                        }}
                    />
                )}
            </>
        </Card>
    )
}

export default ProjectTimeline
