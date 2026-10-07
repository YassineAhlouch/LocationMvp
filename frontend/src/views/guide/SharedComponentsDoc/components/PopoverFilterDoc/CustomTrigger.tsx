import { useState } from 'react'
import PopoverFilter from '@/components/shared/PopoverFilter'
import Tag from '@/components/ui/Tag'

const statusData = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
]

const CustomTrigger = () => {
    const [selected, setSelected] = useState<string[]>(['active'])

    return (
        <PopoverFilter
            data={statusData}
            value={selected}
            onChange={(data) => setSelected(data.map((d) => d.value))}
            title="Status"
            renderTrigger={
                <Tag className="cursor-pointer">
                    Status: {selected.length > 0 ? selected.join(', ') : 'All'}
                </Tag>
            }
        />
    )
}

export default CustomTrigger
