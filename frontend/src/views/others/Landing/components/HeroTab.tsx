import classNames from '@/utils/classNames'
import { motion } from 'motion/react'

interface HeroTabProps {
    label: string
    value: string
    description: string
    isActive: boolean
    onClick: () => void
}

const HeroTab = ({ label, description, isActive, onClick }: HeroTabProps) => {
    return (
        <button
            className={classNames(
                'flex flex-col items-center py-6 flex-1 transition-colors relative',
                isActive ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-800',
            )}
            onClick={onClick}
        >
            <span
                className={classNames(
                    'text-base font-medium relative z-10',
                    isActive
                        ? 'heading-text'
                        : 'text-gray-600 dark:text-gray-400',
                )}
            >
                {label}
            </span>
            <span className="text-gray-600 dark:text-gray-400 relative z-10">
                {description}
            </span>
            {isActive && (
                <motion.div
                    layoutId="hero-tab-indicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-[10%] bg-primary rounded-lg"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                />
            )}
        </button>
    )
}

export default HeroTab
