import { colors } from '@/constants/colors.constant'

export const statusMap: Record<string, { color: string; label: string }> = {
    active: {
        label: 'Active',
        color: 'bg-info',
    },
    onHold: {
        label: 'On Hold',
        color: 'bg-error',
    },
    archived: {
        label: 'Archived',
        color: 'bg-warning',
    },
    completed: {
        label: 'Completed',
        color: 'bg-success',
    },
}

export const projectTypeMap: Record<string, { color: string; label: string }> =
    {
        web: {
            color: `${colors.blue.iconBg} ${colors.blue.iconText}`,
            label: 'Web',
        },
        mobile: {
            color: `${colors.emerald.iconBg} ${colors.emerald.iconText}`,
            label: 'Mobile',
        },
        data: {
            color: `${colors.purple.iconBg} ${colors.purple.iconText}`,
            label: 'Data',
        },
    }
