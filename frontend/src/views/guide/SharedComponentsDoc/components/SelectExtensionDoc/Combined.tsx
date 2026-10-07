import { useState } from 'react'
import Select from '@/components/ui/Select'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { LuUser, LuSettings, LuBell, LuShield } from 'react-icons/lu'

type Option = {
    value: string
    label: string
    icon: React.ReactNode
}

const options: Option[] = [
    {
        value: 'profile',
        label: 'Profile',
        icon: <LuUser className="text-lg" />,
    },
    {
        value: 'settings',
        label: 'Settings',
        icon: <LuSettings className="text-lg" />,
    },
    {
        value: 'notifications',
        label: 'Notifications',
        icon: <LuBell className="text-lg" />,
    },
    {
        value: 'security',
        label: 'Security',
        icon: <LuShield className="text-lg" />,
    },
]

const Combined = () => {
    const [value, setValue] = useState<Option | null>(null)

    return (
        <Select<Option>
            value={value}
            placeholder="Select an option"
            options={options}
            onChange={(option) => setValue(option)}
            customInputDisplay={(option) => (
                <SelectInputWithPrefix
                    prefix={option?.icon}
                    label={option?.label || ''}
                />
            )}
            customOption={({ option, selected, CheckIcon }) => (
                <SelectOptionWithPrefix
                    prefix={option.icon}
                    label={option.label}
                    selected={selected}
                    checkIcon={CheckIcon}
                />
            )}
        />
    )
}

export default Combined
