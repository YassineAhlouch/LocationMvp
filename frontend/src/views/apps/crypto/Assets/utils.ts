import { colors } from '@/constants/colors.constant'

export const tradeTypeColors: Record<string, { label: string; color: string }> =
    {
        buy: { label: 'Buy', color: colors.emerald.bg },
        sell: { label: 'Sell', color: colors.red.bg },
        swap: { label: 'Swap', color: colors.blue.bg },
    }

export const transactionTypeColors: Record<
    string,
    { label: string; color: string }
> = {
    deposit: { label: 'Deposit', color: colors.emerald.bg },
    withdraw: { label: 'Withdraw', color: colors.red.bg },
}

export const statusColors: Record<string, { label: string; color: string }> = {
    pending: {
        label: 'Pending',
        color: `${colors.yellow.iconBg} ${colors.yellow.iconText}`,
    },
    completed: {
        label: 'Completed',
        color: `${colors.emerald.iconBg} ${colors.emerald.iconText}`,
    },
    failed: {
        label: 'Failed',
        color: `${colors.red.iconBg} ${colors.red.iconText}`,
    },
}
