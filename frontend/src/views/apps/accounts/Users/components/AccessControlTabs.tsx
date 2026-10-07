import OverflowTabs from '@/components/shared/OverflowTabs'
import { useAccessControlStore } from '../store/accessControlStore'
import { LiUser, LiStatus, LiShieldCircle } from '@/icons'

const tabList = [
    {
        value: 'user',
        label: (
            <span className="flex items-center gap-2">
                <LiUser className="text-lg" />
                <span>Users</span>
            </span>
        ),
    },
    {
        value: 'pending',
        label: (
            <span className="flex items-center gap-2">
                <LiStatus className="text-lg" />
                <span>Pending</span>
            </span>
        ),
    },
    {
        value: 'roleGroups',
        label: (
            <span className="flex items-center gap-2">
                <LiShieldCircle className="text-lg" />
                <span>Role & Permissions</span>
            </span>
        ),
    },
]

const AccessControlTabs = () => {
    const currentTab = useAccessControlStore((state) => state.currentTab)
    const setCurrentTab = useAccessControlStore((state) => state.setCurrentTab)

    return (
        <OverflowTabs
            tabList={tabList}
            value={currentTab}
            onChange={setCurrentTab}
            tabListClass="px-4"
        />
    )
}

export default AccessControlTabs
