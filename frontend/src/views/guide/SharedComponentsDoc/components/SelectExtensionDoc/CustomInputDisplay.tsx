import { useState } from 'react'
import Select from '@/components/ui/Select'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import { LuUser, LuMail, LuPhone } from 'react-icons/lu'

type Option = {
    value: string
    label: string
    icon: React.ReactNode
}

const options: Option[] = [
    { value: 'john', label: 'John Doe', icon: <LuUser className="text-lg" /> },
    {
        value: 'email',
        label: 'john@example.com',
        icon: <LuMail className="text-lg" />,
    },
    {
        value: 'phone',
        label: '+1 234 567 890',
        icon: <LuPhone className="text-lg" />,
    },
]

const CustomInputDisplay = () => {
    const [value, setValue] = useState<Option | null>(options[0])

    return (
        <Select<Option>
            value={value}
            options={options}
            onChange={(option) => setValue(option)}
            customInputDisplay={(option) => (
                <SelectInputWithPrefix
                    prefix={option?.icon}
                    label={option?.label || ''}
                />
            )}
        />
    )
}

export default CustomInputDisplay
