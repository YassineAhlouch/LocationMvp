import classNames from '@/utils/classNames'
import ViteLogo from '@/components/svg/logos/Vite'
import NextJsLogo from '@/components/svg/logos/NextJs'
import type { Framework } from '../types'

const FrameworkSwitcher = ({
    framework,
    onChange,
}: {
    framework: Framework
    onChange: (f: Framework) => void
}) => {
    const items = [
        {
            value: 'vite' as const,
            label: 'Vite',
            Icon: ViteLogo,
            iconClass: '',
        },
        {
            value: 'next' as const,
            label: 'Next.js',
            Icon: NextJsLogo,
            iconClass: 'dark:invert',
        },
    ]
    const activeIndex = items.findIndex((i) => i.value === framework)

    return (
        <div className="inline-grid grid-flow-col auto-cols-[1fr] items-stretch rounded-full p-1 relative min-w-max isolate bg-gray-100 dark:bg-gray-800">
            {items.map(({ value, label, Icon, iconClass }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={classNames(
                        'relative z-10 flex items-center justify-center gap-1.5 px-2 h-7 font-medium cursor-pointer select-none outline-none transition-colors duration-100',
                        framework === value
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
                    )}
                >
                    <Icon width={16} height={16} className={iconClass} />
                    <span>{label}</span>
                </button>
            ))}
            <div
                className="absolute z-[-1] top-0 left-0 h-full w-1/2 pointer-events-none transition-transform duration-200 ease-[cubic-bezier(0.445,0.05,0.55,0.95)]"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
            >
                <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-600 shadow-sm ring-1 ring-gray-200 dark:ring-gray-500" />
            </div>
        </div>
    )
}

export default FrameworkSwitcher
