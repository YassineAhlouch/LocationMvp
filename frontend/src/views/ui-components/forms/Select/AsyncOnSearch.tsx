import { useState, useRef } from 'react'
import Select from '@/components/ui/Select'
import useDebounce from '@/utils/hooks/useDebounce'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const colourOptions = [
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
]

const filter = (inputValue: string) => {
    if (inputValue === '') {
        return []
    }

    return colourOptions.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase()),
    )
}

const AsyncOnSearch = () => {
    const [options, setOptions] = useState<
        {
            value: string
            label: string
            color: string
        }[]
    >([])

    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState<{
        value: string
        label: string
        color: string
    }>()
    const latestInputRef = useRef('')

    const debouncedSearch = useDebounce(async () => {
        try {
            // Simulate an API call
            await sleep(1000)
            const inputValue = latestInputRef.current
            setOptions(filter(inputValue))
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }, 1000)

    const handleInputChange = (value: string) => {
        setLoading(true)
        latestInputRef.current = value
        debouncedSearch()
    }

    return (
        <Select<{ color: string }>
            isSearchable
            isLoading={loading}
            placeholder="Please Select"
            noOptionsMessage={loading ? 'Loading...' : 'No options'}
            options={options}
            onInputChange={handleInputChange}
            filter={({ options }) => {
                return options
            }}
            value={value}
            onChange={setValue}
        />
    )
}

export default AsyncOnSearch
