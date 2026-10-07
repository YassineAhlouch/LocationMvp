import formatCurrency from '@/utils/formatCurrency'

export function formatPercentage(value: number, decimals: number = 2): string {
    const formatted = value.toFixed(decimals)
    return `${value >= 0 ? '+' : ''}${formatted}%`
}

export function formatPrice(value: number): string {
    if (value >= 1) {
        return formatCurrency(value)
    } else if (value >= 0.01) {
        return formatCurrency(value)
    } else {
        return `$${value.toFixed(6)}`
    }
}
