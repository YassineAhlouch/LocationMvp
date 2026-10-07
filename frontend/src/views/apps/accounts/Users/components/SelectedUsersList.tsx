import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { User } from '../types'
const SelectedUsersList = ({ users }: { users: User[] }) => {
    return (
        <Card bodyClass="p-0 divide-y divide-gray-200">
            {users.map((user: User) => (
                <div
                    key={user.id}
                    className="flex items-center px-4 py-2 gap-2"
                >
                    <div className="flex-shrink-0">
                        <Avatar shape="circle" size="sm" src={user.img} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="heading-text font-medium truncate">
                            {user.name}
                        </div>
                        <span className="truncate">{user.email}</span>
                    </div>
                </div>
            ))}
        </Card>
    )
}

export default SelectedUsersList
