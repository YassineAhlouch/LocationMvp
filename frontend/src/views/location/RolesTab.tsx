import { useCallback, useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import Tag from '@/components/ui/Tag'
import Skeleton from '@/components/ui/Skeleton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { LuEllipsis } from 'react-icons/lu'
import { LiAdd, LiEdit, LiCopy, LiTrash } from '@/icons'
import classNames from '@/utils/classNames'
import {
    apiCreateRole,
    apiGetRoles,
    apiGetUsers,
    apiUpdateRole,
} from '@/services/LocationService'
import type { Role } from '@/@types/location'
import RoleDialog from './RoleDialog'
import ManagePermissionsDialog from './ManagePermissionsDialog'
import { getRoleColor, getRoleIcon } from './roleMeta'
import { apiErrorMessage, tagToneClass } from './shared'
import useTranslation from '@/utils/hooks/useTranslation'

/** Member preview handed to UsersAvatarGroup (imgKey='avatar', nameKey='name'). */
type RoleMember = { name: string; avatar: string }

type RoleCardProps = {
    role: Role
    members?: RoleMember[]
    onEdit: (role: Role) => void
    onClone: (role: Role) => void
    onToggleActive: (role: Role) => void
    onManage: (role: Role) => void
}

const RoleCard = ({
    role,
    members = [],
    onEdit,
    onClone,
    onToggleActive,
    onManage,
}: RoleCardProps) => {
    const { t } = useTranslation()
    const IconComponent = getRoleIcon(role.icon)
    const color = getRoleColor(role.color)

    return (
        <Card
            className="transition-all duration-200"
            bodyClass="flex flex-col justify-between h-full"
        >
            <div>
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar
                            icon={<IconComponent className="text-xl" />}
                            size="sm"
                            className={classNames('border-0', color.iconClass)}
                        />
                        <div>
                            <div className="heading-text font-semibold">
                                {role.name}
                            </div>
                            <Tag
                                className={classNames(
                                    'mt-1 capitalize',
                                    role.is_active
                                        ? tagToneClass.success
                                        : tagToneClass.warning,
                                )}
                            >
                                {role.is_active ? 'Active' : 'Inactive'}
                            </Tag>
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
                        <Dropdown.Item
                            eventKey="edit"
                            onClick={() => onEdit(role)}
                        >
                            <div className="flex items-center gap-2">
                                <LiEdit className="text-base" />
                                {t('roles.actions.edit', 'Edit')}
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="clone"
                            onClick={() => onClone(role)}
                        >
                            <div className="flex items-center gap-2">
                                <LiCopy className="text-base" />
                                {t('roles.actions.clone', 'Clone')}
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="toggle"
                            onClick={() => onToggleActive(role)}
                        >
                            <div
                                className={classNames(
                                    'flex items-center gap-2',
                                    role.is_active && 'text-error',
                                )}
                            >
                                <LiTrash className="text-base" />
                                {role.is_active
                                    ? t(
                                          'roles.actions.deactivate',
                                          'Deactivate',
                                      )
                                    : t(
                                          'roles.actions.reactivate',
                                          'Reactivate',
                                      )}
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {role.description ??
                        t('roles.noDescription', 'No description provided.')}
                </p>
            </div>
            <div className="flex items-center justify-between">
                <Button variant="subtle" onClick={() => onManage(role)}>
                    {t('roles.actions.manage', 'Manage')}
                </Button>
                {members.length > 0 && (
                    <UsersAvatarGroup
                        users={members}
                        nameKey="name"
                        imgKey="avatar"
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
                )}
            </div>
        </Card>
    )
}

const RolesTab = () => {
    const { t } = useTranslation()
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [membersByRole, setMembersByRole] = useState<
        Record<number, RoleMember[]>
    >({})

    const [roleDialogOpen, setRoleDialogOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [managingRole, setManagingRole] = useState<Role | null>(null)
    const [togglingRole, setTogglingRole] = useState<Role | null>(null)

    const fetchRoles = useCallback(() => {
        setLoading(true)
        apiGetRoles({ per_page: 100 })
            .then((res) => setRoles(res.data ?? []))
            .catch(() => setRoles([]))
            .finally(() => setLoading(false))
    }, [])

    /** Group staff members by their role so each card can show avatars. */
    const fetchMembers = useCallback(() => {
        apiGetUsers({ per_page: 100 })
            .then((res) => {
                const map: Record<number, RoleMember[]> = {}
                for (const user of res.data) {
                    if (!user.role) {
                        continue
                    }
                    if (!map[user.role.id]) {
                        map[user.role.id] = []
                    }
                    map[user.role.id].push({
                        name: user.full_name,
                        avatar: user.avatar ?? '',
                    })
                }
                setMembersByRole(map)
            })
            .catch(() => setMembersByRole({}))
    }, [])

    useEffect(() => {
        fetchRoles()
        fetchMembers()
    }, [fetchRoles, fetchMembers])

    const handleCreate = () => {
        setEditingRole(null)
        setRoleDialogOpen(true)
    }

    const handleEdit = (role: Role) => {
        setEditingRole(role)
        setRoleDialogOpen(true)
    }

    const handleManage = (role: Role) => setManagingRole(role)

    const handleClone = async (role: Role) => {
        try {
            await apiCreateRole({
                name: `${role.name} (copy)`,
                description: role.description ?? null,
                icon: role.icon ?? null,
                color: role.color ?? null,
                permissions: role.permissions ?? [],
                is_active: true,
            })
            toast.push(
                <Notification
                    type="success"
                    title={t('roles.toast.cloned', 'Role cloned!')}
                />,
            )
            fetchRoles()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        t('roles.toast.cloneError', 'Could not clone role'),
                    )}
                />,
            )
        }
    }

    const handleToggleActive = async () => {
        if (!togglingRole) {
            return
        }
        try {
            await apiUpdateRole(togglingRole.id, {
                is_active: !togglingRole.is_active,
            })
            toast.push(
                <Notification
                    type="success"
                    title={
                        togglingRole.is_active
                            ? t(
                                  'roles.toast.deactivated',
                                  'Role deactivated!',
                              )
                            : t(
                                  'roles.toast.reactivated',
                                  'Role reactivated!',
                              )
                    }
                />,
            )
            setTogglingRole(null)
            fetchRoles()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        t('roles.toast.updateError', 'Could not update role'),
                    )}
                />,
            )
        }
    }

    return (
        <div className="p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h5>{t('roles.title', 'Role Management')}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            'roles.subtitle',
                            'Create roles and control what each one can do across the agency.',
                        )}
                    </p>
                </div>
                <Button
                    variant="solid"
                    icon={<LiAdd className="text-lg" />}
                    onClick={handleCreate}
                >
                    {t('roles.addRole', 'Add New Role')}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-44" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {roles.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            members={membersByRole[role.id]}
                            onEdit={handleEdit}
                            onClone={handleClone}
                            onToggleActive={setTogglingRole}
                            onManage={handleManage}
                        />
                    ))}
                    {roles.length === 0 && (
                        <p className="col-span-full py-10 text-center text-gray-400 dark:text-gray-500">
                            {t('roles.empty', 'No roles yet — create the first one.')}
                        </p>
                    )}
                </div>
            )}

            <RoleDialog
                isOpen={roleDialogOpen}
                role={editingRole}
                onClose={() => {
                    setRoleDialogOpen(false)
                    setEditingRole(null)
                }}
                onSaved={fetchRoles}
            />

            <ManagePermissionsDialog
                isOpen={Boolean(managingRole)}
                role={managingRole}
                onClose={() => setManagingRole(null)}
                onSaved={fetchRoles}
            />

            <ConfirmDialog
                isOpen={Boolean(togglingRole)}
                type={togglingRole?.is_active ? 'danger' : 'info'}
                title={
                    togglingRole?.is_active
                        ? t(
                              'roles.deactivateDialog.title',
                              'Deactivate role',
                          )
                        : t(
                              'roles.reactivateDialog.title',
                              'Reactivate role',
                          )
                }
                onClose={() => setTogglingRole(null)}
                onCancel={() => setTogglingRole(null)}
                onConfirm={handleToggleActive}
                confirmText={
                    togglingRole?.is_active
                        ? t('roles.actions.deactivate', 'Deactivate')
                        : t('roles.actions.reactivate', 'Reactivate')
                }
                cancelText={t('common.cancel', 'Cancel')}
                confirmButtonProps={{
                    children: togglingRole?.is_active
                        ? t('roles.actions.deactivate', 'Deactivate')
                        : t('roles.actions.reactivate', 'Reactivate'),
                }}
            >
                <p>
                    {togglingRole?.is_active
                        ? t(
                              'roles.deactivateDialog.message',
                              'Deactivate {{name}}? It will no longer be assignable to users until reactivated.',
                              { name: togglingRole.name },
                          )
                        : t(
                              'roles.reactivateDialog.message',
                              'Reactivate {{name}}? It will become assignable to users again.',
                              { name: togglingRole?.name },
                          )}
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default RolesTab
