import classNames from '@/utils/classNames'
import { useParams, Link } from 'react-router'
import {
    LiSetting2,
    LiProfiles,
    LiShieldCircle,
    LiElement3,
    LiBell,
    LiReceiptMinus,
    LiBook,
} from '@/icons'

const category = [
    {
        name: 'Project',
        key: 'project-settings',
    },
    {
        name: 'Account & Admin',
        key: 'account-and-admin',
    },
]

const menuList = [
    {
        name: 'General',
        icon: <LiSetting2 />,
        path: 'general',
        category: 'project-settings',
    },
    {
        name: 'Team & Access',
        icon: <LiProfiles />,
        path: 'team-access',
        category: 'project-settings',
    },
    {
        name: 'Security',
        icon: <LiShieldCircle />,
        path: 'security',
        category: 'project-settings',
    },
    {
        name: 'Connected Apps',
        icon: <LiElement3 />,
        path: 'connected-apps',
        category: 'project-settings',
    },
    {
        name: 'Notifications',
        icon: <LiBell />,
        path: 'notifications',
        category: 'project-settings',
    },
    {
        name: 'Billing & Usage',
        icon: <LiReceiptMinus />,
        path: 'billing',
        category: 'account-and-admin',
    },
    {
        name: 'Audit Log',
        icon: <LiBook />,
        path: 'audit-log',
        category: 'account-and-admin',
    },
]

const BASE_PATH = '/apps/projects/settings'

const SettingsMenu = () => {
    const param = useParams()
    const pathSegment = param['*'] || ''

    return (
        <div className="lg:w-[220px]">
            <h4 className="mb-4 hidden lg:block">Settings</h4>
            {category.map((item) => (
                <div className="mb-4" key={item.key}>
                    <div className="text-xs uppercase font-semibold mb-2">
                        {item.name}
                    </div>
                    <ul>
                        {menuList.map(
                            (menu) =>
                                menu.category === item.key && (
                                    <li
                                        key={menu.name}
                                        role="menuitem"
                                        tabIndex={-1}
                                    >
                                        <Link
                                            to={`${BASE_PATH}/${menu.path}`}
                                            className={classNames(
                                                'h-[36px] flex flex-auto items-center gap-2 px-2 rounded-md heading-text font-medium',
                                                pathSegment === menu.path
                                                    ? 'bg-gray-100 dark:bg-gray-800 font-semibold'
                                                    : 'hover:bg-gray-50 hover:dark:bg-gray-800',
                                            )}
                                        >
                                            <span className="text-lg">
                                                {menu.icon}
                                            </span>
                                            <span>{menu.name}</span>
                                        </Link>
                                    </li>
                                ),
                        )}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default SettingsMenu
