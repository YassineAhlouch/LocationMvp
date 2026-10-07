import {
    closestCorners,
    getFirstCollision,
    KeyboardCode,
    DroppableContainer,
    KeyboardCoordinateGetter,
    Active,
    DataRef,
    Over,
} from '@dnd-kit/core'
import type { ColumnDragData, TaskDragData } from './types'

const directions: string[] = [
    KeyboardCode.Down,
    KeyboardCode.Right,
    KeyboardCode.Up,
    KeyboardCode.Left,
]

export const coordinateGetter: KeyboardCoordinateGetter = (
    event,
    { context: { active, droppableRects, droppableContainers, collisionRect } },
) => {
    if (directions.includes(event.code)) {
        event.preventDefault()

        if (!active || !collisionRect) {
            return
        }

        const filteredContainers: DroppableContainer[] = []

        droppableContainers.getEnabled().forEach((entry) => {
            if (!entry || entry?.disabled) {
                return
            }

            const rect = droppableRects.get(entry.id)

            if (!rect) {
                return
            }

            const data = entry.data.current

            if (data) {
                const { type, children } = data

                if (type === 'Column' && children?.length > 0) {
                    if (active.data.current?.type !== 'Column') {
                        return
                    }
                }
            }

            switch (event.code) {
                case KeyboardCode.Down:
                    if (active.data.current?.type === 'Column') {
                        return
                    }
                    if (collisionRect.top < rect.top) {
                        // find all droppable areas below
                        filteredContainers.push(entry)
                    }
                    break
                case KeyboardCode.Up:
                    if (active.data.current?.type === 'Column') {
                        return
                    }
                    if (collisionRect.top > rect.top) {
                        // find all droppable areas above
                        filteredContainers.push(entry)
                    }
                    break
                case KeyboardCode.Left:
                    if (collisionRect.left >= rect.left + rect.width) {
                        // find all droppable areas to left
                        filteredContainers.push(entry)
                    }
                    break
                case KeyboardCode.Right:
                    // find all droppable areas to right
                    if (collisionRect.left + collisionRect.width <= rect.left) {
                        filteredContainers.push(entry)
                    }
                    break
            }
        })
        const collisions = closestCorners({
            active,
            collisionRect: collisionRect,
            droppableRects,
            droppableContainers: filteredContainers,
            pointerCoordinates: null,
        })
        const closestId = getFirstCollision(collisions, 'id')

        if (closestId != null) {
            const newDroppable = droppableContainers.get(closestId)
            const newNode = newDroppable?.node.current
            const newRect = newDroppable?.rect.current

            if (newNode && newRect) {
                return {
                    x: newRect.left,
                    y: newRect.top,
                }
            }
        }
    }

    return undefined
}

type DraggableData = ColumnDragData | TaskDragData

export function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined,
): entry is T & {
    data: DataRef<DraggableData>
} {
    if (!entry) {
        return false
    }

    const data = entry.data.current

    if (data?.type === 'Column' || data?.type === 'Task') {
        return true
    }

    return false
}

export const priorityMap: Record<string, { color: string }> = {
    Low: {
        color: 'bg-success',
    },
    Medium: {
        color: 'bg-warning',
    },
    High: {
        color: 'bg-error',
    },
}

export const columnColorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
}

export const tagsMap: Record<string, { color: string }> = {
    Design: {
        color: '',
    },
    Development: {
        color: '',
    },
    Bug: {
        color: '',
    },
    Documentation: {
        color: '',
    },
    DevOps: {
        color: '',
    },
    Research: {
        color: '',
    },
    Performance: {
        color: '',
    },
    Refactor: {
        color: '',
    },
}

export const permissionRoleMap: Record<string, string> = {
    owner: 'Owner',
    viewer: 'Viewer',
    editor: 'Editor',
}
