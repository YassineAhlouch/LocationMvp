import { useState } from 'react'
import Select from '@/components/ui/Select'
import type { SingleOption } from '@/components/ui/Select/types'

type ColorOption = {
    value: string
    label: string
    color: string
}

const Creatable = () => {
    const [singleOptions, setSingleOptions] = useState<ColorOption[]>([
        { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
        { value: 'blue', label: 'Blue', color: '#0052CC' },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
        { value: 'red', label: 'Red', color: '#FF5630' },
        { value: 'orange', label: 'Orange', color: '#FF8B00' },
        { value: 'yellow', label: 'Yellow', color: '#FFC400' },
        { value: 'green', label: 'Green', color: '#36B37E' },
        { value: 'forest', label: 'Forest', color: '#00875A' },
        { value: 'slate', label: 'Slate', color: '#253858' },
        { value: 'silver', label: 'Silver', color: '#666666' },
    ])

    const [selectedSingle, setSelectedSingle] =
        useState<SingleOption<ColorOption>>()

    const [multiOptions, setMultiOptions] = useState<ColorOption[]>([
        { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
        { value: 'blue', label: 'Blue', color: '#0052CC' },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
        { value: 'red', label: 'Red', color: '#FF5630' },
        { value: 'orange', label: 'Orange', color: '#FF8B00' },
        { value: 'yellow', label: 'Yellow', color: '#FFC400' },
        { value: 'green', label: 'Green', color: '#36B37E' },
        { value: 'forest', label: 'Forest', color: '#00875A' },
        { value: 'slate', label: 'Slate', color: '#253858' },
        { value: 'silver', label: 'Silver', color: '#666666' },
    ])

    const [selectedMulti, setSelectedMulti] = useState<
        SingleOption<ColorOption>[]
    >([])

    const generateRandomColor = () => {
        const colors = [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#DDA0DD',
            '#98D8C8',
            '#F7DC6F',
            '#BB8FCE',
            '#85C1E9',
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const handleSingleChange = (selected: SingleOption<ColorOption> | null) => {
        if (selected) {
            const exists = singleOptions.some(
                (option) => option.value === selected.value,
            )
            if (!exists) {
                const newOption: ColorOption = {
                    value: selected.value,
                    label: selected.label,
                    color: generateRandomColor(),
                }
                setSingleOptions((prevOptions) => [...prevOptions, newOption])
            }
        }
        if (selected) {
            setSelectedSingle(selected)
        }
    }

    const handleMultiChange = (selected: SingleOption<ColorOption>[]) => {
        const newOptionsToAdd: ColorOption[] = []

        selected.forEach((selectedOption) => {
            const exists = multiOptions.some(
                (option) => option.value === selectedOption.value,
            )
            if (!exists) {
                const newOption: ColorOption = {
                    value: selectedOption.value,
                    label: selectedOption.label,
                    color: generateRandomColor(),
                }
                newOptionsToAdd.push(newOption)
            }
        })

        if (newOptionsToAdd.length > 0) {
            setMultiOptions((prevOptions) => [
                ...prevOptions,
                ...newOptionsToAdd,
            ])
        }

        setSelectedMulti(selected)
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <div className="font-medium">Single Select</div>
                <Select<ColorOption>
                    isCreatable
                    isSearchable
                    placeholder="Select or create a color..."
                    searchInputProps={{
                        placeholder: 'Type to search or create...',
                    }}
                    value={selectedSingle}
                    onChange={handleSingleChange}
                    options={singleOptions}
                />
            </div>
            <div className="space-y-1">
                <div className="font-medium">Multi Select</div>
                <Select.Multi<ColorOption>
                    isCreatable
                    isSearchable
                    placeholder="Select or create multiple colors..."
                    searchInputProps={{
                        placeholder: 'Type to search or create...',
                    }}
                    value={selectedMulti}
                    onChange={handleMultiChange}
                    options={multiOptions}
                    showClearAllButton
                />
            </div>
        </div>
    )
}

export default Creatable
