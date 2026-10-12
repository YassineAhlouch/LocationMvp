import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { useSessionUser } from '@/store/authStore'
import { LiUserCircle, LiSetting4, LiActivity, LiUser, LiLogout } from '@/icons'
import { Link } from 'react-router'
import { useAuth } from '@/auth'
import type { Placement } from '@floating-ui/react'
import type { JSX, ReactNode } from 'react'

type UserProfileDropdownProps = {
    collapsed?: boolean
    placement?: Placement
    customTrigger?: (payload: {
        avatar: ReactNode
        userName: ReactNode
        email: ReactNode
    }) => ReactNode
}

const dropdownItemList: Array<{
    label: string
    path: string
    icon: JSX.Element
}> = [
    {
        label: 'Profile',
        path: '/apps/accounts/settings/profile',
        icon: <LiUserCircle />,
    },
    {
        label: 'Account Setting',
        path: '/apps/accounts/settings/profile',
        icon: <LiSetting4 />,
    },
    {
        label: 'Activity Log',
        path: '/apps/accounts/activity',
        icon: <LiActivity />,
    },
]

const UserProfileDropdown = ({
    collapsed = true,
    customTrigger,
    placement = 'bottom-end',
}: UserProfileDropdownProps) => {
    const { avatar, userName, email } = useSessionUser((state) => state.user)

    const { signOut } = useAuth()

    const handleSignOut = () => {
        signOut()
    }

    const avatarProps = {
        ...(avatar ? { src: avatar } : { icon: <LiUser /> }),
    }

    const avatarElement = (
        <Badge innerClass="bg-success -bottom-1 ltr:right-1 rtl:left-1 top-auto">
            <Avatar size={32} shape="circle" {...avatarProps} />
        </Badge>
    )
    const userNameElement = (
        <div className="font-semibold heading-text">
            {userName || 'Anonymous'}
        </div>
    )
    const emailElement = (
        <div className="text-xs heading-text">
            {email || 'No email available'}
        </div>
    )

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                customTrigger ? (
                    customTrigger({
                        avatar: avatarElement,
                        userName: userNameElement,
                        email: emailElement,
                    })
                ) : (
                    <>
                        <div className="cursor-pointer flex items-center gap-2">
                            {avatarElement}
                            {!collapsed && (
                                <div>
                                    {userNameElement}
                                    {emailElement}
                                </div>
                            )}
                        </div>
                    </>
                )
            }
            placement={placement}
        >
            <Dropdown.Item variant="header">
                <div className="p-2 flex items-center gap-3">
                    {avatarElement}
                    <div>
                        {userNameElement}
                        {emailElement}
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-lg text-gray-500">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item variant="divider" />
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-lg text-gray-500">
                    <LiLogout />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

export default UserProfileDropdown
