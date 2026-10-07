import { useState, useEffect, useCallback, useMemo } from 'react'
import { LiShield, LiCross, LiTick } from '@/icons'
import Button from '@/components/ui/Button'
import Scroll from '@/components/ui/Scroll'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar/Avatar'
import PermissionGroup from './PermissionGroup'
import PermissionRow from './PermissionRow'
import PermissionSearch from './PermissionSearch'
import EmptyState from '@/components/shared/EmptyState'
import useAccessControlData from '../hooks/useAccessControlData'
import { useAccessControlStore } from '../store/accessControlStore'
import { filterPermissions, getSearchStats } from '../utils'
import sleep from '@/utils/sleep'

type PermissionDialogProps = {
    isVisible: boolean
    onClose: () => void
    className?: string
}

const PermissionDialog = ({ onClose }: PermissionDialogProps) => {
    const permissionDialogOpen = useAccessControlStore(
        (state) => state.permissionDialogOpen,
    )
    const selectedRole = useAccessControlStore((state) => state.selectedRole)
    const setSelectedRole = useAccessControlStore(
        (state) => state.setSelectedRole,
    )
    const permissionSearch = useAccessControlStore(
        (state) => state.permissionSearch,
    )
    const loading = useAccessControlStore((state) => state.loading)
    const setPermissionSearch = useAccessControlStore(
        (state) => state.setPermissionSearch,
    )
    const setLoading = useAccessControlStore((state) => state.setLoading)
    const setError = useAccessControlStore((state) => state.setError)

    const { permissions, setRolesData } = useAccessControlData()

    const [localPermissions, setLocalPermissions] = useState<string[]>([])
    const [expandedGroups, setExpandedGroups] = useState<string[]>([])
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const filteredPermissions = useMemo(() => {
        if (permissions) {
            return filterPermissions(permissions, permissionSearch)
        }

        return []
    }, [permissions, permissionSearch])

    // Get search statistics
    const searchStats = useMemo(() => {
        return getSearchStats(
            permissions ? permissions : [],
            filteredPermissions,
        )
    }, [permissions, filteredPermissions])

    // Initialize local permissions when selected role changes
    useEffect(() => {
        if (selectedRole && permissions) {
            setLocalPermissions([...selectedRole.permissions])
            setHasUnsavedChanges(false)
            // Expand all groups by default, or filtered groups when searching
            const groupsToExpand = permissionSearch
                ? filteredPermissions.map((group) => group.id)
                : permissions.map((group) => group.id)
            setExpandedGroups(groupsToExpand)
        }
    }, [selectedRole, permissions, permissionSearch, filteredPermissions])

    // Auto-expand groups when searching
    useEffect(() => {
        if (permissionSearch && filteredPermissions.length > 0) {
            setExpandedGroups(filteredPermissions.map((group) => group.id))
        }
    }, [permissionSearch, filteredPermissions])

    // Check for unsaved changes
    useEffect(() => {
        if (selectedRole) {
            const hasChanges =
                JSON.stringify(localPermissions.sort()) !==
                JSON.stringify(selectedRole.permissions.sort())
            setHasUnsavedChanges(hasChanges)
        }
    }, [localPermissions, selectedRole])

    const handleActionChange = useCallback(
        (permissionKey: string) => {
            setLocalPermissions((prev) => {
                if (localPermissions.includes(permissionKey)) {
                    return prev.filter((p) => p !== permissionKey)
                } else {
                    return [...prev, permissionKey]
                }
            })
        },
        [localPermissions],
    )

    const handleBulkSelect = useCallback((permissionKeys: string[]) => {
        setLocalPermissions((prev) => {
            if (prev.some((p) => permissionKeys.includes(p))) {
                return prev.filter((p) => !permissionKeys.includes(p))
            } else {
                return [...prev, ...permissionKeys]
            }
        })
    }, [])

    const handleGroupToggle = useCallback((groupId: string) => {
        setExpandedGroups((prev) =>
            prev.includes(groupId)
                ? prev.filter((id) => id !== groupId)
                : [...prev, groupId],
        )
    }, [])

    const handleSave = async () => {
        if (!selectedRole) return

        setLoading(true)
        setError(null)

        try {
            // In a real app, you would also call the API here
            // await RBACService.updateRolePermissions(selectedRole.id, localPermissions)
            await sleep(1000)

            setRolesData((prev) => {
                return prev.map((role) => {
                    if (role.id === selectedRole.id) {
                        return {
                            ...role,
                            permissions: localPermissions,
                        }
                    }
                    return role
                })
            })

            setHasUnsavedChanges(false)
            setSelectedRole(null)
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to save permissions',
            )
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if (selectedRole) {
            setLocalPermissions([...selectedRole.permissions])
            setHasUnsavedChanges(false)
        }
    }

    const handleSearchChange = useCallback(
        (search: string) => {
            setPermissionSearch(search)
        },
        [setPermissionSearch],
    )

    const handleSearchClear = useCallback(() => {
        setPermissionSearch('')
    }, [setPermissionSearch])

    const handleClose = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                'You have unsaved changes. Are you sure you want to close without saving?',
            )
            if (!confirmed) return
        }
        onClose()
    }

    return (
        <Dialog
            className="p-0"
            isOpen={permissionDialogOpen}
            onClose={handleClose}
            closable={false}
            width={900}
        >
            {selectedRole && (
                <div className="flex flex-col">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="min-w-0">
                                <h5 className="truncate">
                                    Manage Permissions for "{selectedRole.name}"
                                </h5>
                                <p className="line-clamp-2">
                                    {selectedRole.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {hasUnsavedChanges && (
                                <>
                                    <Button
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="solid"
                                        onClick={handleSave}
                                        loading={loading}
                                        icon={<LiTick className="text-base" />}
                                    >
                                        <span className="hidden sm:inline">
                                            Save Changes
                                        </span>
                                        <span className="sm:hidden">Save</span>
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="subtle"
                                size="sm"
                                onClick={handleClose}
                                icon={<LiCross className="text-2xl" />}
                            />
                        </div>
                    </div>
                    <div className="flex-1 border-b border-gray-200 dark:border-gray-800 pb-4">
                        <div className="px-4">
                            <PermissionSearch
                                value={permissionSearch}
                                onChange={handleSearchChange}
                                loading={loading}
                            />
                            {permissionSearch && (
                                <div className="flex items-center justify-between mt-2">
                                    <div>
                                        {searchStats.matchingPermissions ===
                                        0 ? (
                                            <span>
                                                No permissions found for "
                                                {permissionSearch}"
                                            </span>
                                        ) : (
                                            <span>
                                                Found{' '}
                                                {
                                                    searchStats.matchingPermissions
                                                }{' '}
                                                permission
                                                {searchStats.matchingPermissions !==
                                                1
                                                    ? 's'
                                                    : ''}{' '}
                                                in{' '}
                                                {searchStats.groupsWithMatches}{' '}
                                                group
                                                {searchStats.groupsWithMatches !==
                                                1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        )}
                                    </div>
                                    {permissionSearch && (
                                        <button
                                            onClick={handleSearchClear}
                                            className="text-primary hover:text-primary-deep font-medium"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <Scroll.FlexSize
                        edgeShadow
                        className="max-h-[calc(100vh-250px)]"
                    >
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPermissions.map((group) => (
                                <PermissionGroup
                                    key={group.id}
                                    group={group}
                                    isExpanded={expandedGroups.includes(
                                        group.id,
                                    )}
                                    onToggle={handleGroupToggle}
                                >
                                    {group.permissions.map((permission) => (
                                        <PermissionRow
                                            key={permission.id}
                                            groupId={group.id}
                                            permission={permission}
                                            selectedActions={localPermissions}
                                            onActionChange={handleActionChange}
                                            onBulkSelect={handleBulkSelect}
                                            showBulkSelect={true}
                                            searchTerm={permissionSearch}
                                        />
                                    ))}
                                </PermissionGroup>
                            ))}
                        </div>
                        {filteredPermissions.length === 0 &&
                            permissionSearch && (
                                <div className="flex-1 flex flex-col items-center justify-center my-8">
                                    <EmptyState
                                        variant="dots"
                                        size={180}
                                        offset={-20}
                                        illustration={
                                            <Avatar
                                                className="heading-text ring-1 ring-gray-200"
                                                icon={
                                                    <LiShield className="text-2xl" />
                                                }
                                            />
                                        }
                                    >
                                        <div className="text-center">
                                            <h5>No permissions found</h5>
                                            <p className="max-w-[500px]">
                                                No permissions match your search
                                            </p>
                                            <div className="mt-4">
                                                <Button
                                                    onClick={handleSearchClear}
                                                >
                                                    Clear search
                                                </Button>
                                            </div>
                                        </div>
                                    </EmptyState>
                                </div>
                            )}
                        {permissions?.length === 0 && !permissionSearch && (
                            <div className="text-center py-12">
                                <div className="mb-2">
                                    <LiShield className="text-2xl" />
                                </div>
                                <p>No permissions available</p>
                            </div>
                        )}
                    </Scroll.FlexSize>
                </div>
            )}
        </Dialog>
    )
}

export default PermissionDialog
