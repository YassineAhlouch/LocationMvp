import { useMemo, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import BoardCard from './BoardCard'
import BoardColumn from './BoardColumn'
import BoardContainer from './BoardContainer'
import useScrumboardData from '../hooks/useScrumboardData'
import { useScrumboardStore } from '../store/scrumboardStore'
import { coordinateGetter, hasDraggableData } from '../utils'
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    KeyboardSensor,
    TouchSensor,
    MouseSensor,
    PointerSensor,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { Task, Column, ColumnId } from '../types'

const Board = () => {
    const { columns, setColumns, tasks, setTasks } = useScrumboardData()

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

    const setSelectedColumn = useScrumboardStore(
        (state) => state.setSelectedColumn,
    )
    const setAddTaskDialogOpen = useScrumboardStore(
        (state) => state.setAddTaskDialogOpen,
    )
    const setColumnDialog = useScrumboardStore((state) => state.setColumnDialog)
    const setDeleteColumnDialogOpen = useScrumboardStore(
        (state) => state.setDeleteColumnDialogOpen,
    )
    const query = useScrumboardStore((state) => state.query)
    const displayedColumns = useScrumboardStore(
        (state) => state.displayedColumns,
    )

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)

    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const dragTimeoutRef = useRef<NodeJS.Timeout>(null)

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        }),
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )

    function handleDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return
        const data = event.active.data.current
        if (data?.type === 'Column') {
            setActiveColumn(data.column)
            return
        }

        if (data?.type === 'Task') {
            setActiveTask(data.task)
            return
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (!hasDraggableData(active)) return

        const activeData = active.data.current

        if (activeId === overId) return

        const isActiveAColumn = activeData?.type === 'Column'
        if (!isActiveAColumn) return

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(
                (col) => col.id === activeId,
            )

            const overColumnIndex = columns.findIndex(
                (col) => col.id === overId,
            )

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }

    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
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

            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current)
            }

            dragTimeoutRef.current = setTimeout(() => {
                if (isActiveATask && isOverATask) {
                    setTasks((tasks) => {
                        const activeIndex = tasks.findIndex(
                            (t) => t.id === activeId,
                        )
                        const overIndex = tasks.findIndex(
                            (t) => t.id === overId,
                        )
                        const activeTask = tasks[activeIndex]
                        const overTask = tasks[overIndex]

                        if (
                            activeTask &&
                            overTask &&
                            activeTask.columnId !== overTask.columnId
                        ) {
                            activeTask.columnId = overTask.columnId
                            return arrayMove(
                                tasks,
                                activeIndex,
                                Math.max(0, overIndex - 1),
                            )
                        }
                        return arrayMove(tasks, activeIndex, overIndex)
                    })
                }

                const isOverAColumn = overData?.type === 'Column'
                if (isActiveATask && isOverAColumn) {
                    setTasks((tasks) => {
                        const activeIndex = tasks.findIndex(
                            (t) => t.id === activeId,
                        )
                        const activeTask = tasks[activeIndex]
                        if (activeTask && activeTask.columnId !== overId) {
                            activeTask.columnId = overId as ColumnId
                            return arrayMove(tasks, activeIndex, activeIndex)
                        }
                        return tasks
                    })
                }
            }, 1)
        },
        [setTasks],
    )

    const handleAddTask = (columnId: string) => {
        setSelectedColumn(columnId)
        setAddTaskDialogOpen(true)
    }

    const handleConfigColumn = (columnId: string) => {
        setSelectedColumn(columnId)
        setColumnDialog({
            open: true,
            type: 'edit',
        })
    }

    const handleDeleteColumn = (columnId: string) => {
        setDeleteColumnDialogOpen(true)
        setSelectedColumn(columnId)
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <BoardContainer>
                <SortableContext items={columnsId}>
                    {columns
                        .filter((col) => displayedColumns.includes(col.id))
                        .map((col) => (
                            <BoardColumn
                                key={col.id}
                                column={col}
                                tasks={tasks.filter(
                                    (task) =>
                                        task.columnId === col.id &&
                                        task.subject
                                            .toLocaleLowerCase()
                                            .includes(query.toLowerCase()),
                                )}
                                onAddTask={handleAddTask}
                                onEditColumn={handleConfigColumn}
                                onDeleteColumn={handleDeleteColumn}
                            />
                        ))}
                </SortableContext>
            </BoardContainer>

            {'document' in window &&
                createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                isOverlay
                                column={activeColumn}
                                tasks={tasks.filter(
                                    (task) => task.columnId === activeColumn.id,
                                )}
                            />
                        )}
                        {activeTask && (
                            <BoardCard task={activeTask} isOverlay />
                        )}
                    </DragOverlay>,
                    document.body,
                )}
        </DndContext>
    )
}

export default Board
