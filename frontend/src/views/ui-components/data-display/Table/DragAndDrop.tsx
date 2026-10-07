import { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { MdDragIndicator } from 'react-icons/md'
import { data10 } from './data'
import type { Person } from './data'
import type { ColumnDef, Row } from '@tanstack/react-table'
import type {
    DragEndEvent,
    DragStartEvent,
    UniqueIdentifier,
} from '@dnd-kit/core'

const { Tr, Th, Td, THead, TBody } = Table

interface SortableRowProps {
    row: Row<Person>
}

const SortableRow = ({ row }: SortableRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(row.original.id) })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Tr
            ref={setNodeRef}
            style={style}
            className={
                isDragging ? 'opacity-50 bg-gray-100 dark:bg-gray-700' : ''
            }
        >
            <Td className="w-10">
                <span
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center"
                >
                    <MdDragIndicator className="text-lg" />
                </span>
            </Td>
            {row
                .getVisibleCells()
                .filter((cell) => cell.column.id !== 'dragger')
                .map((cell) => (
                    <Td key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                        )}
                    </Td>
                ))}
        </Tr>
    )
}

interface DragOverlayRowProps {
    row: Row<Person>
}

const DragOverlayRow = ({ row }: DragOverlayRowProps) => {
    return (
        <Table className="w-full">
            <TBody>
                <Tr className="bg-white dark:bg-gray-800 border border-primary">
                    <Td className="w-10">
                        <span className="cursor-grabbing inline-flex items-center justify-center">
                            <MdDragIndicator />
                        </span>
                    </Td>
                    {row
                        .getVisibleCells()
                        .filter((cell) => cell.column.id !== 'dragger')
                        .map((cell) => (
                            <Td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            </Td>
                        ))}
                </Tr>
            </TBody>
        </Table>
    )
}

const DragAndDrop = () => {
    const [data, setData] = useState(data10)
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (over && active.id !== over.id) {
            setData((items) => {
                const oldIndex = items.findIndex(
                    (item) => String(item.id) === active.id,
                )
                const newIndex = items.findIndex(
                    (item) => String(item.id) === over.id,
                )
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    const columns: ColumnDef<Person>[] = useMemo(
        () => [
            {
                id: 'dragger',
                header: '',
                size: 40,
            },
            { header: 'First Name', accessorKey: 'firstName' },
            { header: 'Last Name', accessorKey: 'lastName' },
            { header: 'Email', accessorKey: 'email' },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => String(row.id),
    })

    const activeRow = activeId
        ? table.getRowModel().rows.find((row) => row.id === activeId)
        : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[restrictToVerticalAxis]}
        >
            <Table className="w-full">
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className={
                                        header.id === 'dragger' ? 'w-10' : ''
                                    }
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <SortableContext
                    items={data.map((item) => String(item.id))}
                    strategy={verticalListSortingStrategy}
                >
                    <TBody>
                        {table.getRowModel().rows.map((row) => (
                            <SortableRow key={row.id} row={row} />
                        ))}
                    </TBody>
                </SortableContext>
            </Table>
            <DragOverlay
                dropAnimation={{
                    duration: 200,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}
            >
                {activeRow ? <DragOverlayRow row={activeRow} /> : null}
            </DragOverlay>
        </DndContext>
    )
}

export default DragAndDrop
