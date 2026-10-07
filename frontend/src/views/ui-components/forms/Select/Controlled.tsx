import { useState } from 'react'
import Select from '@/components/ui/Select'

const colourOptions = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'forest', label: 'Forest' },
    { value: 'slate', label: 'Slate' },
    { value: 'silver', label: 'Silver' },
]

const Controlled = () => {
    const [singleSelectValue, setSingleSelectValue] = useState(colourOptions[1])
    const [multiSelectValue, setMultiSelectValue] = useState([
        colourOptions[2],
        colourOptions[3],
    ])

    return (
        <div className="flex flex-col gap-4">
            <Select
                placeholder="Please Select"
                value={singleSelectValue}
                onChange={setSingleSelectValue}
                options={colourOptions}
            />
            <Select.Multi
                placeholder="Please Select"
                value={multiSelectValue}
                onChange={setMultiSelectValue}
                options={colourOptions}
            />
        </div>
    )
}

export default Controlled
