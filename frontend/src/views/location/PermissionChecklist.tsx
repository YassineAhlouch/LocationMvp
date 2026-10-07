import { useMemo } from 'react'
import Checkbox from '@/components/ui/Checkbox'
import type { PermissionModule } from '@/@types/location'

// Grant helpers shared by the role dialog and the manage-permissions dialog.
// The backend stores grants as JSON: exact 'module.verb', a module wildcard
// 'module.*', or '*' for the master role. A wildcard/star locks its verbs so
// the checklist stays predictable: uncheck "All" first to edit individual
// verbs.

export const hasStarPermission = (permissions: string[]) =>
    permissions.includes('*')

export const hasModuleWildcard = (permissions: string[], module: string) =>
    permissions.includes(`${module}.*`)

export const isVerbGranted = (
    permissions: string[],
    module: string,
    verb: string,
) =>
    permissions.includes(`${module}.${verb}`) ||
    hasModuleWildcard(permissions, module) ||
    hasStarPermission(permissions)

export const toggleVerbGrant = (
    permissions: string[],
    module: string,
    verb: string,
    check: boolean,
): string[] => {
    if (
        hasStarPermission(permissions) ||
        hasModuleWildcard(permissions, module)
    ) {
        return permissions // locked by a wildcard/star
    }
    const grant = `${module}.${verb}`
    return check
        ? permissions.includes(grant)
            ? permissions
            : [...permissions, grant]
        : permissions.filter((permission) => permission !== grant)
}

export const toggleModuleAll = (
    permissions: string[],
    module: string,
    check: boolean,
): string[] => {
    if (hasStarPermission(permissions)) {
        return permissions
    }
    const wildcard = `${module}.*`
    if (check) {
        return [
            ...permissions.filter(
                (permission) =>
                    permission !== wildcard &&
                    !permission.startsWith(`${module}.`),
            ),
            wildcard,
        ]
    }
    return permissions.filter((permission) => permission !== wildcard)
}

export const formatModuleName = (module: string) => module.replace(/_/g, ' ')

type PermissionChecklistProps = {
    catalog: PermissionModule[]
    permissions: string[]
    onChange: (permissions: string[]) => void
    search?: string
    /** Master role ('*') — every grant is implied, nothing can be toggled. */
    locked?: boolean
}

const PermissionChecklist = ({
    catalog,
    permissions,
    onChange,
    search = '',
    locked = false,
}: PermissionChecklistProps) => {
    const filteredCatalog = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) {
            return catalog
        }
        return catalog
            .map((group) => ({
                ...group,
                actions: group.actions.filter((action) =>
                    action.toLowerCase().includes(term),
                ),
            }))
            .filter(
                (group) =>
                    group.module.toLowerCase().includes(term) ||
                    group.actions.length > 0,
            )
    }, [catalog, search])

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCatalog.map((group) => {
                const allChecked =
                    hasModuleWildcard(permissions, group.module) || locked
                const wildcard = hasModuleWildcard(permissions, group.module)

                return (
                    <div key={group.module} className="py-3">
                        <div className="flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2">
                                <Checkbox
                                    checked={allChecked}
                                    disabled={locked}
                                    onChange={() =>
                                        onChange(
                                            toggleModuleAll(
                                                permissions,
                                                group.module,
                                                !allChecked,
                                            ),
                                        )
                                    }
                                />
                                <span className="font-medium capitalize">
                                    {formatModuleName(group.module)}
                                </span>
                            </label>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {group.actions.length} action(s)
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 ltr:pl-7 rtl:pr-7">
                            {group.actions.map((action) => (
                                <Checkbox
                                    key={`${group.module}.${action}`}
                                    checked={isVerbGranted(
                                        permissions,
                                        group.module,
                                        action,
                                    )}
                                    disabled={locked || wildcard}
                                    onChange={() =>
                                        onChange(
                                            toggleVerbGrant(
                                                permissions,
                                                group.module,
                                                action,
                                                !isVerbGranted(
                                                    permissions,
                                                    group.module,
                                                    action,
                                                ),
                                            ),
                                        )
                                    }
                                >
                                    {action}
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                )
            })}
            {filteredCatalog.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                    No permissions match “{search.trim()}”
                </p>
            )}
        </div>
    )
}

export default PermissionChecklist
