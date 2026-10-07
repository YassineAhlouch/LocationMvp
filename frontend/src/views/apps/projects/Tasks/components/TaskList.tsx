import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Table from '@/components/ui/Table'
import ListGroup from './ListGroup'
import ListRow from './ListRow'
import ListContainer from './ListContainer'
import useTasksData from '../hooks/useTasksData'
import { useTasksStore } from '../store/tasksStore'
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    KeyboardSensor,
    TouchSensor,
    MouseSensor,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { hasDraggableData, coordinateGetter } from '../utils'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { Task, Group, GroupId } from '../types'

const TaskList = () => {
    const { groups, tasks, setGroups, setTasks, setData } = useTasksData()

    const setTaskDialog = useTasksStore((state) => state.setTaskDialog)

    const groupId = useMemo(() => groups.map((group) => group.id), [groups])

    const [activeGroup, setActiveGroup] = useState<Group | null>(null)

    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        }),
    )

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return
        const data = event.active.data.current
        if (data?.type === 'Group') {
            setActiveGroup(data.group)
            return
        }

        if (data?.type === 'Task') {
            setActiveTask(data.task)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveGroup(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (!hasDraggableData(active)) return

        const activeData = active.data.current

        if (activeId === overId) return

        const isActiveAGroup = activeData?.type === 'Group'
        if (!isActiveAGroup) return

        setGroups((columns) => {
            const activeGroupIndex = columns.findIndex(
                (col) => col.id === activeId,
            )

            const overGroupIndex = columns.findIndex((col) => col.id === overId)

            return arrayMove(columns, activeGroupIndex, overGroupIndex)
        })
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        if (!hasDraggableData(active) || !hasDraggableData(over)) return

        const activeData = active.data.current
        const overData = over.data.current

        const isActiveATask = activeData?.type === 'Task'
        const isOverATask = overData?.type === 'Task'

        if (!isActiveATask) return

        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)
                const overIndex = tasks.findIndex((t) => t.id === overId)
                const activeTask = tasks[activeIndex]
                const overTask = tasks[overIndex]
                if (
                    activeTask &&
                    overTask &&
                    activeTask.columnId !== overTask.columnId
                ) {
                    activeTask.columnId = overTask.columnId
                    return arrayMove(tasks, activeIndex, overIndex - 1)
                }

                return arrayMove(tasks, activeIndex, overIndex)
            })
        }

        const isOverAGroup = overData?.type === 'Group'

        if (isActiveATask && isOverAGroup) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)
                const activeTask = tasks[activeIndex]
                if (activeTask) {
                    activeTask.columnId = overId as GroupId
                    return arrayMove(tasks, activeIndex, activeIndex)
                }
                return tasks
            })
        }
    }

    const handleDataChange = (payload: {
        key: string
        value: string
        id: string
    }) => {
        if (payload.key === 'ticket') {
            setTaskDialog({
                open: true,
                id: payload.id,
            })
            return
        }
        setData(payload)
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <Table
                compact
                hoverable={false}
                className="border-b border-gray-200 dark:border-gray-800"
                verticalDivider={{
                    head: true,
                    body: true,
                }}
            >
                <ListContainer>
                    <SortableContext
                        items={groupId}
                        strategy={verticalListSortingStrategy}
                    >
                        {groups.map((col) => (
                            <ListGroup
                                key={col.id}
                                group={col}
                                tasks={tasks.filter(
                                    (task) => task.columnId === col.id,
                                )}
                                onDataChange={handleDataChange}
                            />
                        ))}
                    </SortableContext>
                </ListContainer>
            </Table>
            {'document' in window &&
                createPortal(
                    <DragOverlay>
                        <Table overflow={false} compact>
                            {activeGroup && (
                                <ListGroup
                                    isOverlay
                                    group={activeGroup}
                                    tasks={tasks.filter(
                                        (task) =>
                                            task.columnId === activeGroup.id,
                                    )}
                                />
                            )}

                            {activeTask && (
                                <Table.TBody>
                                    <ListRow task={activeTask} isOverlay />
                                </Table.TBody>
                            )}
                        </Table>
                    </DragOverlay>,
                    document.body,
                )}
        </DndContext>
    )
}

export default TaskList
