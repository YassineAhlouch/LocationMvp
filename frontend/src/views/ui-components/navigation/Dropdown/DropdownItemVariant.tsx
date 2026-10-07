import Dropdown from '@/components/ui/Dropdown'
import {
    TbUser,
    TbSettings2,
    TbLicense,
    TbHeadphones,
    TbUsers,
    TbHome,
    TbLogout,
} from 'react-icons/tb'
import type { PropsWithChildren, ReactNode } from 'react'

const DropdownItemWrapper = ({
    children,
    icon,
    suffix,
}: PropsWithChildren<{
    icon: ReactNode
    suffix?: string | ReactNode
}>) => {
    return (
        <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
                <span className="text-lg text-gray-400 dark:text-gray-400">
                    {icon}
                </span>
                {children}
            </div>
            <span className="opacity-40">{suffix}</span>
        </div>
    )
}

const DropdownItemVariant = () => {
    return (
        <div>
            <Dropdown title="Click Me!">
                <Dropdown.Item variant="header">
                    <div className="px-2 py-1.5 text-sm font-bold heading-text">
                        My Account
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                <Dropdown.Item>
                    <DropdownItemWrapper icon={<TbUser />} suffix="⇧ ⌘ P">
                        <span>Profile</span>
                    </DropdownItemWrapper>
                </Dropdown.Item>
                <Dropdown.Item>
                    <DropdownItemWrapper icon={<TbSettings2 />} suffix="⌘ T">
                        <span>Setting</span>
                    </DropdownItemWrapper>
                </Dropdown.Item>
                <Dropdown.Item>
                    <DropdownItemWrapper icon={<TbLicense />} suffix="⌘ L">
                        <span>License</span>
                    </DropdownItemWrapper>
                </Dropdown.Item>
                <Dropdown.Item>
                    <DropdownItemWrapper icon={<TbHeadphones />} suffix="⌘ Y">
                        <span>Support</span>
                    </DropdownItemWrapper>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                <Dropdown.Item>
                    <DropdownItemWrapper icon={<TbUsers />}>
                        <span>Team</span>
                    </DropdownItemWrapper>
                </Dropdown.Item>
                <Dropdown.Item>
                    <DropdownItemWrapper icon={<TbHome />}>
                        <span>Company Profile</span>
                    </DropdownItemWrapper>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                <Dropdown.Item variant="custom">
                    <div
                        className="
							cursor-pointer 
							px-3 
							py-2 
                            rounded-lg
							font-semibold 
							hover:bg-gray-100 
							dark:hover:bg-black/20
                            text-red-400
						"
                    >
                        <DropdownItemWrapper icon={<TbLogout />}>
                            Logout
                        </DropdownItemWrapper>
                    </div>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default DropdownItemVariant
