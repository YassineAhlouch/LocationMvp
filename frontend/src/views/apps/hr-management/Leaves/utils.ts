import { colors } from '@/constants/colors.constant'
export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'approved':
            return `${colors.emerald.bg}`
        case 'pending':
            return `${colors.yellow.bg}`
        case 'rejected':
            return `${colors.red.bg}`
        case 'cancelled':
            return `${colors.gray.bg}`
        default:
            return `${colors.gray.bg}`
    }
}

export const getEventColors = (type: string) => {
    switch (type) {
        case 'holiday':
            return `${colors.purple.bg}`
        case 'sickLeave':
            return `${colors.red.bg}`
        case 'annualLeave':
            return `${colors.emerald.bg}`
        case 'casualLeave':
            return `${colors.yellow.bg}`
        default:
            return `${colors.gray.bg}`
    }
}

export const getEventText = (type: string) => {
    switch (type) {
        case 'holiday':
            return 'Holiday'
        case 'sickLeave':
            return 'Sick Leave'
        case 'annualLeave':
            return 'Annual Leave'
        case 'casualLeave':
            return 'Casual Leave'
        default:
            return ''
    }
}
