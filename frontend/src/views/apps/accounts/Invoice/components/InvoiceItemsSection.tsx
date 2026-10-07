import Button from '@/components/ui/Button'
import SectionCard from './SectionCard'
import InvoiceItemRow from './InvoiceItemRow'
import { LiAdd } from '@/icons'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { FormSectionBaseProps, InvoiceItem } from '../types'

type InvoiceItemsSectionProps = FormSectionBaseProps & {
    addItem: () => void
    removeItem: (index: number) => void
    updateItem: (index: number, updatedItem: Partial<InvoiceItem>) => void
    reorderItems: (activeIndex: number, overIndex: number) => void
    currency: string
}

const InvoiceItemsSection = ({
    control,
    errors,
    watch,
    addItem,
    removeItem,
    updateItem,
    reorderItems,
    currency,
}: InvoiceItemsSectionProps) => {
    const items = watch?.('items') || []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const activeIndex = items.findIndex((item) => item.id === active.id)
            const overIndex = items.findIndex((item) => item.id === over.id)

            if (activeIndex !== -1 && overIndex !== -1) {
                reorderItems(activeIndex, overIndex)
            }
        }
    }

    return (
        <SectionCard
            title="Invoice Items"
            description="Add products or services to this invoice"
            extra={
                <Button
                    variant="subtle"
                    onClick={addItem}
                    icon={<LiAdd />}
                    type="button"
                    aria-label="Add new invoice item"
                >
                    Add Item
                </Button>
            }
        >
            <div className="space-y-4 mt-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item, index) => (
                            <InvoiceItemRow
                                key={item.id}
                                item={item}
                                index={index}
                                currency={currency}
                                control={control}
                                errors={errors}
                                watch={watch}
                                onUpdateItem={(updatedItem) =>
                                    updateItem(index, updatedItem)
                                }
                                onRemove={() => removeItem(index)}
                                showLabels={index === 0}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                {items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>
                            No items added yet. Click "Add Item" to get started.
                        </p>
                    </div>
                )}
            </div>
        </SectionCard>
    )
}

export default InvoiceItemsSection
