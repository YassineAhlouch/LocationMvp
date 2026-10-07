import { useState } from 'react'
import Calendar from '@/components/ui/Calendar'

const MultipleSelection = () => {
    const [value, setValue] = useState<Date[]>([])

    return (
        <div className="md:w-[252px] max-w-[252px] mx-auto">
            <Calendar multipleSelection value={value} onChange={setValue} />
        </div>
    )
}

export default MultipleSelection
