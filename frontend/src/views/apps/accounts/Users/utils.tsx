import React from 'react'
import {
    LiSetting2,
    LiDesktop,
    LiHeadphone,
    LiShield,
    LiSetting3,
    LiUser,
    LiProfiles,
    LiZap,
    LiGlobal,
    LiGraduationCap,
    LiMessagesContent,
    LiCoin,
    LiStar,
    LiLock,
    LiBarChartUpDown,
    LiFolder,
    LiBriefcase,
    LiFileCode,
    LiSearch,
    LiServer,
    LiCloud,
    LiMail,
    LiEye,
    LiKey,
} from '@/icons'
import { colors } from '@/constants/colors.constant'
import type { PermissionGroup, Permission } from './types'

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-success'
        case 'inactive':
            return 'bg-warning'
        case 'suspended':
            return 'bg-error'
        case 'pending':
            return 'bg-warning'
        case 'approved':
            return 'bg-success'
        case 'rejected':
            return 'bg-error'
        default:
            return 'bg-gray-100 text-gray-600'
    }
}

export const roleColorMap: Record<
    string,
    { iconClass: string; bgClass: string }
> = {
    emerald: {
        iconClass: `${colors.emerald.iconBg} ${colors.emerald.iconText}`,
        bgClass: colors.emerald.bg,
    },
    rose: {
        iconClass: `${colors.rose.iconBg} ${colors.rose.iconText}`,
        bgClass: colors.rose.bg,
    },
    blue: {
        iconClass: `${colors.blue.iconBg} ${colors.blue.iconText}`,
        bgClass: colors.blue.bg,
    },
    cyan: {
        iconClass: `${colors.cyan.iconBg} ${colors.cyan.iconText}`,
        bgClass: colors.cyan.bg,
    },
    orange: {
        iconClass: `${colors.orange.iconBg} ${colors.orange.iconText}`,
        bgClass: colors.orange.bg,
    },
    red: {
        iconClass: `${colors.red.iconBg} ${colors.red.iconText}`,
        bgClass: colors.red.bg,
    },
    purple: {
        iconClass: `${colors.purple.iconBg} ${colors.purple.iconText}`,
        bgClass: colors.purple.bg,
    },
    yellow: {
        iconClass: `${colors.yellow.iconBg} ${colors.yellow.iconText}`,
        bgClass: colors.yellow.bg,
    },
    gray: {
        iconClass: `${colors.gray.iconBg} ${colors.gray.iconText}`,
        bgClass: colors.gray.bg,
    },
}

export const roleIconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    setting: LiSetting2,
    shield: LiShield,
    userGroup: LiProfiles,
    user: LiUser,
    education: LiGraduationCap,
    coin: LiCoin,
    zap: LiZap,
    lock: LiLock,
    star: LiStar,
    chart: LiBarChartUpDown,
    folder: LiFolder,
    briefcase: LiBriefcase,
    code: LiFileCode,
    search: LiSearch,
    database: LiServer,
    cloud: LiCloud,
    desktop: LiDesktop,
    chat: LiMessagesContent,
    mail: LiMail,
    headphones: LiHeadphone,
    globe: LiGlobal,
    key: LiKey,
    tool: LiSetting3,
    eye: LiEye,
}

export const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' },
    { value: 'support', label: 'Support' },
    { value: 'developer', label: 'Developer' },
    { value: 'compliance', label: 'Compliance' },
]

export const filterPermissions = (
    permissions: PermissionGroup[],
    searchTerm: string,
): PermissionGroup[] => {
    if (!searchTerm.trim()) {
        return permissions
    }

    const normalizedSearch = searchTerm.toLowerCase().trim()

    return permissions
        .map((group) => {
            // Filter permissions within the group
            const filteredPermissions = group.permissions.filter((permission) =>
                matchesSearchTerm(permission, normalizedSearch),
            )

            // Only return the group if it has matching permissions
            if (filteredPermissions.length > 0) {
                return {
                    ...group,
                    permissions: filteredPermissions,
                }
            }

            return null
        })
        .filter((group): group is PermissionGroup => group !== null)
}

const matchesSearchTerm = (
    permission: Permission,
    searchTerm: string,
): boolean => {
    const name = permission.name.toLowerCase()
    const description = permission.description.toLowerCase()

    return name.includes(searchTerm) || description.includes(searchTerm)
}

export const getSearchStats = (
    originalPermissions: PermissionGroup[],
    filteredPermissions: PermissionGroup[],
) => {
    const originalCount = originalPermissions.reduce(
        (total, group) => total + group.permissions.length,
        0,
    )

    const filteredCount = filteredPermissions.reduce(
        (total, group) => total + group.permissions.length,
        0,
    )

    return {
        totalPermissions: originalCount,
        matchingPermissions: filteredCount,
        groupsWithMatches: filteredPermissions.length,
        totalGroups: originalPermissions.length,
    }
}
