import { useEffect, useMemo, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Scroll from '@/components/ui/Scroll'
import DebouceInput from '@/components/shared/DebouceInput'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { LuSearch } from 'react-icons/lu'
import { LiCross } from '@/icons'
import {
    apiGetPermissionCatalog,
    apiUpdateRole,
} from '@/services/LocationService'
import type { PermissionModule, Role } from '@/@types/location'
import PermissionChecklist, { hasStarPermission } from './PermissionChecklist'
import { apiErrorMessage } from './shared'

type ManagePermissionsDialogProps = {
    isOpen: boolean
    role: Role | null
    onClose: () => void
    onSaved: () => void
}

const ManagePermissionsDialog = ({
    isOpen,
    role,
    onClose,
    onSaved,
}: ManagePermissionsDialogProps) => {
    const [catalog, setCatalog] = useState<PermissionModule[]>([])
    const [permissions, setPermissions] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [saving, setSaving] = useState(false)

    const isMaster = hasStarPermission(role?.permissions ?? [])

    useEffect(() => {
        if (isOpen && role) {
            setPermissions(role.permissions ?? [])
            setSearch('')
            apiGetPermissionCatalog()
                .then((res) => setCatalog(res ?? []))
                .catch(() => setCatalog([]))
        }
    }, [isOpen, role])

    const changed = useMemo(() => {
        if (!role) {
            return false
        }
        const current = [...permissions].sort().join('|')
        const original = [...(role.permissions ?? [])].sort().join('|')
        return current !== original
    }, [permissions, role])

    const handleSave = async () => {
        if (!role || permissions.length === 0) {
            return
        }
        setSaving(true)
        try {
            await apiUpdateRole(role.id, { permissions })
            toast.push(
                <Notification type="success" title="Permissions updated!" />,
            )
            onSaved()
            onClose()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        'Could not update permissions',
                    )}
                />,
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} closable={false} width={900}>
            {role && (
                <div className="flex flex-col">
                    <div className="flex items-center justify-between p-4">
                        <div className="min-w-0">
                            <h5 className="truncate">
                                Manage Permissions for “{role.name}”
                            </h5>
                            <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                Grant or revoke actions per module. Changes are
                                saved for the whole agency at once.
                            </p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-2">
                            <Button
                                onClick={() =>
                                    setPermissions(role.permissions ?? [])
                                }
                                disabled={!changed || saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleSave}
                                loading={saving}
                                disabled={!changed || permissions.length === 0}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="subtle"
                                size="sm"
                                onClick={onClose}
                                icon={<LiCross className="text-2xl" />}
                            />
                        </div>
                    </div>
                    <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
                        <div className="px-4">
                            <DebouceInput
                                placeholder="Search permissions…"
                                prefix={<LuSearch className="text-lg" />}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {permissions.length} grant(s) selected
                                </span>
                                {isMaster && (
                                    <span className="text-xs text-primary">
                                        Full access (*)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Scroll.FlexSize
                        edgeShadow
                        className="max-h-[calc(100vh-250px)] px-4"
                    >
                        <PermissionChecklist
                            catalog={catalog}
                            permissions={permissions}
                            onChange={setPermissions}
                            search={search}
                            locked={isMaster}
                        />
                    </Scroll.FlexSize>
                </div>
            )}
        </Dialog>
    )
}

export default ManagePermissionsDialog
