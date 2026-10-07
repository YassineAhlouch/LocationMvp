import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import {
    LuCaseSensitive,
    LuLetterText,
    LuEllipsis,
    LuMic,
    LuCircleCheckBig,
    LuLanguages,
    LuArrowRightToLine,
    LuArrowLeftToLine,
} from 'react-icons/lu'

type QuickPromptDropdownProps = {
    onSelect: (props: { value: string; label: string }) => void
}

const quickPrompts = [
    {
        value: 'improveThis',
        label: 'Improve this',
        icon: <LuCircleCheckBig />,
        child: [],
    },
    {
        value: 'fixSpelling',
        label: 'Fix spelling',
        icon: <LuCaseSensitive />,
        child: [],
    },
    {
        value: 'fixGrammar',
        label: 'Fix grammar',
        icon: <LuLetterText />,
        child: [],
    },
    {
        value: 'makeShorter',
        label: 'Make shorter',
        icon: <LuArrowLeftToLine />,
        child: [],
    },
    {
        value: 'makeLonger',
        label: 'Make longer',
        icon: <LuArrowRightToLine />,
        child: [],
    },
    {
        value: 'summarize',
        label: 'Summarize',
        icon: <LuEllipsis />,
        child: [],
    },
    {
        value: 'tones',
        label: 'Tones',
        icon: <LuMic />,
        child: [
            {
                value: 'formal',
                label: 'Formal',
            },
            {
                value: 'casual',
                label: 'Casual',
            },
            {
                value: 'confident',
                label: 'Confident',
            },
            {
                value: 'excited',
                label: 'Excited',
            },
            {
                value: 'friendly',
                label: 'Friendly',
            },
            {
                value: 'sincere',
                label: 'Sincere',
            },
            {
                value: 'humorous',
                label: 'Humorous',
            },
        ],
    },
    {
        value: 'translate',
        label: 'Translate',
        icon: <LuLanguages />,
        child: [
            {
                value: 'en',
                label: 'English',
            },
            {
                value: 'es',
                label: 'Spanish',
            },
            {
                value: 'fr',
                label: 'French',
            },
            {
                value: 'de',
                label: 'German',
            },
            {
                value: 'it',
                label: 'Italian',
            },
            {
                value: 'pt',
                label: 'Portuguese',
            },
            {
                value: 'ru',
                label: 'Russian',
            },
            {
                value: 'zh',
                label: 'Chinese',
            },
        ],
    },
]

const QuickPromptDropdown = ({ onSelect }: QuickPromptDropdownProps) => {
    const handleSelect = (value: string, label: string) => {
        onSelect({ value, label })
    }

    const renderDropdownItem = () => {
        return quickPrompts.map((item) => {
            if (item.child.length > 0) {
                return (
                    <Dropdown.Menu
                        key={item.value}
                        renderTitle={
                            <span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            </span>
                        }
                    >
                        {item.child.map((child) => (
                            <Dropdown.Item
                                key={child.value}
                                onClick={() =>
                                    handleSelect(child.value, child.label)
                                }
                            >
                                {child.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                )
            }
            return (
                <Dropdown.Item
                    key={item.value}
                    onClick={() => handleSelect(item.value, item.label)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                </Dropdown.Item>
            )
        })
    }

    return (
        <Dropdown
            renderTitle={
                <Button icon={<LuEllipsis />} variant="ghost" size="sm" />
            }
        >
            {renderDropdownItem()}
        </Dropdown>
    )
}

export default QuickPromptDropdown
