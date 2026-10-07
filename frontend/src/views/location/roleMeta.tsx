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

/**
 * Role presentation metadata — icon keys and color keys stored on the
 * roles table by the API. Unknown/legacy keys fall back to a default so
 * a null or retired key still renders a sensible card.
 */

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

export const DEFAULT_ROLE_ICON = 'shield'

export const DEFAULT_ROLE_COLOR = 'blue'

export const getRoleIcon = (key?: string | null) =>
    roleIconMap[key ?? ''] ?? roleIconMap[DEFAULT_ROLE_ICON]

export const getRoleColor = (key?: string | null) =>
    roleColorMap[key ?? ''] ?? roleColorMap[DEFAULT_ROLE_COLOR]

export const roleIconOptions = Object.keys(roleIconMap)

export const roleColorOptions = Object.keys(roleColorMap)
