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

const Size = () => {
    return (
        <div>
            <Select
                size="sm"
                className="mb-4"
                placeholder="Please Select"
                options={colourOptions}
            ></Select>
            <Select
                className="mb-4"
                placeholder="Please Select"
                options={colourOptions}
            ></Select>
            <Select
                size="lg"
                placeholder="Please Select"
                options={colourOptions}
            ></Select>
        </div>
    )
}

export default Size
