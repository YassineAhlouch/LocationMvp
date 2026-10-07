import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import { roleColorMap, roleIconMap } from '../utils'
import { LiUser, LiEdit, LiCopy, LiTrash } from '@/icons'
import { LuEllipsis } from 'react-icons/lu'
import classNames from '@/utils/classNames'
import type { Role } from '../types'
import type { SyntheticEvent } from 'react'

type RoleCardProps = {
    role: Role
    isSelected?: boolean
    onEdit: (role: Role) => void
    onDelete: (role: Role) => void
    onClone: (role: Role) => void
    onSelect: (role: Role) => void
    className?: string
}

const RoleCard = ({
    role,
    onEdit,
    onDelete,
    onClone,
    onSelect,
    className,
}: RoleCardProps) => {
    const handleCardClick = () => {
        onSelect(role)
    }

    const handleEdit = (e: SyntheticEvent<Element, Event>) => {
        e.stopPropagation()
        onEdit(role)
    }

    const handleClone = (e: SyntheticEvent<Element, Event>) => {
        e.stopPropagation()
        onClone(role)
    }

    const handleDelete = (e: SyntheticEvent<Element, Event>) => {
        e.stopPropagation()
        onDelete(role)
    }

    const IconComponent = roleIconMap[role.icon] || LiUser

    return (
        <Card
            className={classNames('transition-all duration-200', className)}
            bodyClass="flex flex-col justify-between h-full"
        >
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar
                            icon={<IconComponent className="text-xl" />}
                            size="sm"
                            className={classNames(
                                'border-0',
                                roleColorMap[role.color]?.iconClass,
                            )}
                        />
                        <div>
                            <div className="heading-text font-semibold">
                                {role.name}
                            </div>
                            <span className="text-xs">
                                {role.isDefault
                                    ? 'Default Role'
                                    : 'Custom Role'}
                            </span>
                        </div>
                    </div>

                    <Dropdown
                        placement="bottom-end"
                        renderTitle={
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<LuEllipsis className="text-base" />}
                            />
                        }
                    >
                        <Dropdown.Item eventKey="edit" onClick={handleEdit}>
                            <div className="flex items-center gap-2">
                                <LiEdit className="text-base" />
                                Edit
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="clone" onClick={handleClone}>
                            <div className="flex items-center gap-2">
                                <LiCopy className="text-base" />
                                Clone
                            </div>
                        </Dropdown.Item>
                        {!role.isDefault && (
                            <Dropdown.Item
                                eventKey="delete"
                                onClick={handleDelete}
                            >
                                <div className="flex items-center gap-2 text-error">
                                    <LiTrash className="text-base" />
                                    Delete
                                </div>
                            </Dropdown.Item>
                        )}
                    </Dropdown>
                </div>
                <p className="mb-4 line-clamp-2">{role.description}</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {role.memberCount > 0 ? (
                        <UsersAvatarGroup
                            users={role.members}
                            imgKey="img"
                            nameKey="name"
                            avatarProps={{
                                size: 28,
                                shape: 'circle',
                                className: 'border-2 border-white',
                            }}
                            avatarGroupProps={{
                                maxCount: 3,
                                chained: true,
                                omittedAvatarTooltip: true,
                            }}
                        />
                    ) : (
                        <span className="font-medium">No members</span>
                    )}
                </div>
                <Button variant="subtle" onClick={handleCardClick}>
                    Manage
                </Button>
            </div>
        </Card>
    )
}

export default RoleCard
