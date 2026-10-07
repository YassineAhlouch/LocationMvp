import Button from '@/components/ui/Button'
import RoleCard from './RoleCard'
import RoleDialog from './RoleDialog'
import DeleteRoleDialog from './DeleteRoleDialog'
import PermissionManagementPanel from './PermissionDialog'
import { useAccessControlStore } from '../store/accessControlStore'
import useAccessControlData from '../hooks/useAccessControlData'
import sleep from '@/utils/sleep'
import type { Role } from '../types'

const RoleGroups = () => {
    const { roles, setRolesData } = useAccessControlData()

    const setPermissionDialogOpen = useAccessControlStore(
        (state) => state.setPermissionDialogOpen,
    )
    const selectedRole = useAccessControlStore((state) => state.selectedRole)
    const setSelectedRole = useAccessControlStore(
        (state) => state.setSelectedRole,
    )
    const openRoleModal = useAccessControlStore((state) => state.openRoleModal)
    const openDeleteModal = useAccessControlStore(
        (state) => state.openDeleteModal,
    )

    const handleEditRole = (role: Role) => {
        openRoleModal('edit', role)
    }

    const handleDeleteRole = (role: Role) => {
        openDeleteModal(role)
    }

    const handleCloneRole = (role: Role) => {
        setRolesData((prev) => [
            ...prev,
            { ...role, id: `role-${Date.now()}`, members: [], memberCount: 0 },
        ])
    }

    const handleSelectRole = async (role: Role) => {
        if (selectedRole?.id === role.id) {
            setPermissionDialogOpen(false)
            await sleep(300)
            setSelectedRole(null)
        } else {
            setPermissionDialogOpen(true)
            setSelectedRole(role)
        }
    }

    const handleClosePermissionPanel = async () => {
        setPermissionDialogOpen(false)
        await sleep(300)
        setSelectedRole(null)
    }

    return (
        <div className="p-4">
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h5>Role Management</h5>
                    <p>Manage roles and permissions</p>
                </div>
                <Button onClick={() => openRoleModal('create')}>
                    Add New Role
                </Button>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roles &&
                        roles.map((role) => (
                            <RoleCard
                                key={role.id}
                                role={role}
                                isSelected={selectedRole?.id === role.id}
                                onEdit={handleEditRole}
                                onDelete={handleDeleteRole}
                                onClone={handleCloneRole}
                                onSelect={handleSelectRole}
                            />
                        ))}
                </div>
                <PermissionManagementPanel
                    isVisible={selectedRole !== null}
                    onClose={handleClosePermissionPanel}
                />
            </div>
            <RoleDialog />
            <DeleteRoleDialog />
        </div>
    )
}

export default RoleGroups
