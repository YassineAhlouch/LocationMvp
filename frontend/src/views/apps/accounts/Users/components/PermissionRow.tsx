import { useCallback } from 'react'
import { Checkbox } from '@/components/ui'
import classNames from '@/utils/classNames'
import highlightSearchMatch from '@/utils/highlightSearchMatch'
import type { Permission, PermissionAction } from '../types'

type PermissionRowProps = {
    groupId: string
    permission: Permission
    selectedActions?: string[]
    onActionChange?: (permissionKey: string) => void
    onBulkSelect?: (permissionKeys: string[]) => void
    className?: string
    showBulkSelect?: boolean
    searchTerm?: string
}

const PermissionRow = ({
    permission,
    groupId,
    selectedActions = [],
    onActionChange,
    onBulkSelect,
    className,
    showBulkSelect = true,
    searchTerm = '',
}: PermissionRowProps) => {
    const allActionsSelected = permission.actions.every((action) =>
        selectedActions.includes(`${groupId}:${permission.id}:${action.id}`),
    )

    const someActionsSelected = permission.actions.some((action) =>
        selectedActions.includes(`${groupId}:${permission.id}:${action.id}`),
    )

    const handleActionChange = useCallback(
        (permissionKey: string) => {
            onActionChange?.(permissionKey)
        },
        [onActionChange],
    )

    const handleBulkSelect = useCallback(() => {
        const permissionKeys: string[] = []

        permission.actions.forEach((action) => {
            if (action.enabled) {
                permissionKeys.push(`${groupId}:${permission.id}:${action.id}`)
            }
        })
        onBulkSelect?.(permissionKeys)
    }, [permission.actions, permission.id, onBulkSelect, groupId])

    const getActionCheckboxProps = (action: PermissionAction) => {
        let isSelected = selectedActions.includes(
            `${groupId}:${permission.id}:${action.id || '*'}`,
        )

        if (selectedActions.includes('*')) {
            isSelected = true
        }

        return {
            checked: isSelected,
            onChange: () =>
                handleActionChange(
                    `${groupId}:${permission.id}:${action.id || '*'}`,
                ),
            disabled: !action.enabled,
        }
    }

    return (
        <div
            className={classNames(
                'flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-2 sm:py-2',
                className,
            )}
        >
            <div className="flex items-start gap-2 sm:items-center sm:flex-1 sm:min-w-0">
                {showBulkSelect && (
                    <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                        <Checkbox
                            checked={allActionsSelected || someActionsSelected}
                            indeterminate={
                                someActionsSelected && !allActionsSelected
                            }
                            onChange={handleBulkSelect}
                            className="text-xs"
                            checkboxClass={classNames(
                                'transition-colors duration-200',
                                (allActionsSelected || someActionsSelected) &&
                                    'text-blue-600',
                            )}
                            aria-label={`Select all actions for ${permission.name}`}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                        <div
                            className={classNames(
                                'font-medium transition-colors duration-200',
                                someActionsSelected
                                    ? 'text-gray-900 dark:text-gray-100'
                                    : 'text-gray-700 dark:text-gray-300',
                            )}
                        >
                            {highlightSearchMatch(permission.name, searchTerm)}
                        </div>
                        <p className="text-xs mt-0.5 line-clamp-2">
                            {highlightSearchMatch(
                                permission.description,
                                searchTerm,
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 ltr:pl-4 rtl:pr-4 sm:pl-0 sm:flex sm:items-center sm:gap-6 sm:flex-shrink-0">
                {permission.actions.map((action) => {
                    const checkboxProps = getActionCheckboxProps(action)
                    return (
                        <div
                            key={action.id}
                            className={classNames(
                                'flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px] transition-all duration-200',
                                !action.enabled &&
                                    'opacity-50 cursor-not-allowed',
                            )}
                        >
                            <Checkbox {...checkboxProps} />
                            <span
                                className={classNames(
                                    'mt-1 font-medium text-center text-xs sm:text-sm',
                                    checkboxProps.checked && 'heading-text',
                                    !action.enabled && 'opacity-50',
                                )}
                            >
                                {action.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PermissionRow
