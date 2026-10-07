import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import acronym from '@/utils/acronym'
import { PendingUser } from '../types'

const SelectedPendingUsersList = ({ users }: { users: PendingUser[] }) => {
    return (
        <Card bodyClass="p-0 divide-y divide-gray-200">
            {users.map((user: PendingUser) => (
                <div
                    key={user.id}
                    className="flex items-center justify-between px-4 py-2 gap-2"
                >
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-shrink-0">
                            <Avatar
                                shape="circle"
                                size="sm"
                                className="heading-text text-xs"
                                src={user.img}
                            >
                                {acronym(user.name)}
                            </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="heading-text font-medium truncate">
                                {user.name}
                            </div>
                            <div className="truncate">{user.email}</div>
                        </div>
                    </div>
                    <div className="flex gap-1 ">
                        {user.requestedRole.map((role) => (
                            <Tag key={role} className="capitalize text-xs">
                                {role}
                            </Tag>
                        ))}
                    </div>
                </div>
            ))}
        </Card>
    )
}

export default SelectedPendingUsersList
