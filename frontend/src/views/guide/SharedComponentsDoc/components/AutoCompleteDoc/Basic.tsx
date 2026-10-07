import { useState } from 'react'
import AutoComplete from '@/components/shared/AutoComplete'

type Country = {
    name: string
    code: string
}

const countries: Country[] = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'China', code: 'CN' },
    { name: 'India', code: 'IN' },
    { name: 'Brazil', code: 'BR' },
]

const Basic = () => {
    const [value, setValue] = useState('')
    const [selected, setSelected] = useState<Country | null>(null)

    return (
        <div className="w-full max-w-xs">
            <AutoComplete
                data={countries}
                optionKey={(country) => country.name}
                value={value}
                onInputChange={setValue}
                onOptionSelected={setSelected}
                renderOption={(country) => (
                    <div
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer mx-1"
                        role="button"
                    >
                        <span className="font-medium heading-text">
                            {country.name}
                        </span>
                        <span>({country.code})</span>
                    </div>
                )}
                placeholder="Search countries..."
            />
            {selected && (
                <p className="mt-2 text-sm text-gray-500">
                    Selected: {selected.name}
                </p>
            )}
        </div>
    )
}

export default Basic
