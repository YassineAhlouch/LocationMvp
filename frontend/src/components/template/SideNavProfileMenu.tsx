import UserProfileDropdown from './UserProfileDropdown'
import { LiChevronUpDown } from '@/icons'
import { useThemeStore } from '@/store/themeStore'

const SideNavProfileMenu = () => {
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const direction = useThemeStore((state) => state.direction)

    const placement = direction === 'ltr' ? 'right-end' : 'left-end'

    return (
        <div className="h-full flex flex-col justify-center border-t border-gray-200 dark:border-gray-800 px-2">
            <UserProfileDropdown
                collapsed={sideNavCollapse}
                placement={placement}
                customTrigger={({ avatar, userName, email }) => (
                    <div className="cursor-pointer p-2 w-full rounded-lg flex items-center justify-between gap-2 hover:bg-gray-900/5 dark:hover:bg-gray-800 transition-colors duration-150">
                        <div className="flex items-center gap-2 ">
                            {avatar}
                            {!sideNavCollapse && (
                                <div>
                                    {userName}
                                    {email}
                                </div>
                            )}
                        </div>
                        <LiChevronUpDown className="heading-text" />
                    </div>
                )}
            />
        </div>
    )
}

export default SideNavProfileMenu
