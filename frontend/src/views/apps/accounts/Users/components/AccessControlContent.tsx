import UserTable from './UserTable'
import UserTableTools from './UserTableTools'
import RoleGroups from './RoleGroups'
import PendingUsers from './PendingUsersTable'
import PendingUsersTableTools from './PendingUsersTableTools'
import { useAccessControlStore } from '../store/accessControlStore'

const AccessControlContent = () => {
    const currentTab = useAccessControlStore((state) => state.currentTab)

    return (
        <div>
            {currentTab === 'user' && (
                <div className="space-y-4 mt-4">
                    <UserTableTools />
                    <UserTable />
                </div>
            )}
            {currentTab === 'pending' && (
                <div className="space-y-4 mt-4">
                    <PendingUsersTableTools />
                    <PendingUsers />
                </div>
            )}
            {currentTab === 'roleGroups' && <RoleGroups />}
        </div>
    )
}

export default AccessControlContent
