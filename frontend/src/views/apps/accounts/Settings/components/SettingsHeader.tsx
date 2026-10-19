import Container from '@/components/shared/Container'
import OverflowTabs from '@/components/shared/OverflowTabs'
import { LiUserCircle, LiShieldCircle } from '@/icons'
import useTranslation from '@/utils/hooks/useTranslation'
import { useParams, useNavigate } from 'react-router'

const SettingsHeader = () => {
    const { t } = useTranslation()
    const param = useParams()
    const pathSegment = param['*'] || ''

    const navigate = useNavigate()

    const handleTabChange = (value: string) => {
        navigate(`/apps/accounts/settings/${value}`)
    }

    const menuList = [
        {
            label: t('settings.tabs.profile', 'Profile'),
            icon: <LiUserCircle />,
            value: 'profile',
        },
        {
            label: t('settings.tabs.security', 'Security'),
            icon: <LiShieldCircle />,
            value: 'security',
        },
    ]

    return (
        <div className="pt-4 border-b border-gray-200 dark:border-gray-800">
            <Container size="md" className="px-4">
                <h4 className="font-semibold">
                    {t('settings.title', 'Settings')}
                </h4>
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
