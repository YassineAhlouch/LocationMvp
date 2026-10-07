import { useState } from 'react'
import PopoverFilter from '@/components/shared/PopoverFilter'
import Button from '@/components/ui/Button'
import { LuFilter } from 'react-icons/lu'

const filterData = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Garden', value: 'home' },
    { label: 'Sports', value: 'sports' },
    { label: 'Toys', value: 'toys' },
]

const Basic = () => {
    const [selected, setSelected] = useState<typeof filterData>([])

    return (
        <div>
            <PopoverFilter
                data={filterData}
                onChange={setSelected}
                title="Categories"
                renderTrigger={
                    <Button icon={<LuFilter />}>
                        Filter {selected.length > 0 && `(${selected.length})`}
                    </Button>
                }
            />
            {selected.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                    Selected: {selected.map((s) => s.label).join(', ')}
                </p>
            )}
        </div>
    )
}

export default Basic
