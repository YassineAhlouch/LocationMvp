import {
    LiUser,
    LiChart,
    LiShield,
    LiChevronDown,
    LiCard,
    LiSetting2,
} from '@/icons'
import Collapsible from '@/components/ui/Collapsible'
import IconFrame from '@/components/shared/IconFrame'
import classNames from '@/utils/classNames'
import type { PermissionGroup as PermissionGroupType } from '../types'

type PermissionGroupProps = {
    group: PermissionGroupType
    isExpanded?: boolean
    onToggle?: (groupId: string) => void
    className?: string
    children?: React.ReactNode
}

const iconMap = {
    UserIcon: LiUser,
    CreditCardIcon: LiCard,
    ChartIcon: LiChart,
    Settings02Icon: LiSetting2,
    ShieldIcon: LiShield,
}

const PermissionGroup = ({
    group,
    isExpanded = false,
    onToggle,
    className,
    children,
}: PermissionGroupProps) => {
    const IconComponent = iconMap[group.icon as keyof typeof iconMap] || LiUser

    const handleToggle = () => {
        onToggle?.(group.id)
    }

    return (
        <div className={classNames(className)}>
            <Collapsible open={isExpanded} onOpenChange={handleToggle}>
                <Collapsible.Trigger className="w-full">
                    {({ isOpen, toggle }) => (
                        <button
                            onClick={toggle}
                            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            aria-expanded={isOpen}
                            type="button"
                        >
                            <div className="flex items-center gap-2">
                                <IconFrame variant="layered" size={32}>
                                    <IconComponent className="text-lg heading-text" />
                                </IconFrame>
                                <div>
                                    <div className="heading-text font-semibold">
                                        {group.name}
                                    </div>
                                    <span className="hidden sm:block">
                                        {group.description}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-medium hidden sm:block">
                                    {group.permissions.length} permissions
                                </span>
                                <LiChevronDown
                                    className={classNames(
                                        'text-lg transition-transform duration-200',
                                        isOpen && 'rotate-180',
                                    )}
                                />
                            </div>
                        </button>
                    )}
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <div className="pb-4">{children}</div>
                </Collapsible.Content>
            </Collapsible>
        </div>
    )
}

export default PermissionGroup
