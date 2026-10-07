import Container from '@/components/shared/Container'
import OverflowTabs from '@/components/shared/OverflowTabs'
import {
    LiUserCircle,
    LiShieldCircle,
    LiPaintBucket,
    LiBell,
    LiReceiptItem,
    LiBlend2,
} from '@/icons'
import { useParams, useNavigate } from 'react-router'
import type { ReactNode } from 'react'

const menuList: Array<{
    label: string | ReactNode
    icon: ReactNode
    value: string
}> = [
    {
        label: 'Profile',
        icon: <LiUserCircle />,
        value: 'profile',
    },
    {
        label: 'Appearance',
        icon: <LiPaintBucket />,
        value: 'appearance',
    },
    {
        label: 'Security',
        icon: <LiShieldCircle />,
        value: 'security',
    },
    {
        label: 'Notifications',
        icon: <LiBell />,
        value: 'notifications',
    },
    {
        label: 'Billing',
        icon: <LiReceiptItem />,
        value: 'billing',
    },
    {
        label: 'Integrations',
        icon: <LiBlend2 />,
        value: 'integrations',
    },
]

const SettingsHeader = () => {
    const param = useParams()
    const pathSegment = param['*'] || ''

    const navigate = useNavigate()

    const handleTabChange = (value: string) => {
        navigate(`/apps/accounts/settings/${value}`)
    }

    return (
        <div className="pt-4 border-b border-gray-200 dark:border-gray-800">
            <Container size="md" className="px-4">
                <h4 className="font-semibold">Settings</h4>
                <div className="mt-4">
                    <OverflowTabs
                        value={pathSegment}
                        onChange={handleTabChange}
                        className="flex justify-between items-center"
                        tabListClass="md:border-0"
                        tabNavClass="min-w-[100px] text-center"
                        tabList={menuList.map((item) => {
                            return {
                                ...item,
                                label: (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {item.icon}
                                        </span>
                                        <span className="">{item.label}</span>
                                    </div>
                                ),
                            }
                        })}
                    ></OverflowTabs>
                </div>
            </Container>
        </div>
    )
}

export default SettingsHeader
