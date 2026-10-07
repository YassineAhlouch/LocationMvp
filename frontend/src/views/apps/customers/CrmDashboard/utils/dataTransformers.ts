import type { Currency, TimeHorizon, RevenueDataPoint } from '../types'

// Currency conversion rates
const CURRENCY_RATES = {
    USD: 1,
    EUR: 0.92,
}

/**
 * Convert currency amount from USD to target currency
 */
export const convertCurrency = (
    amount: number,
    targetCurrency: Currency,
): number => {
    return amount * CURRENCY_RATES[targetCurrency]
}

/**
 * Format currency with proper symbol and decimals
 */
export const formatCurrency = (
    amount: number,
    currency: Currency = 'USD',
): string => {
    const symbols = {
        USD: '$',
        EUR: '€',
    }

    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)

    return `${symbols[currency]}${formatted}`
}

/**
 * Format percentage with specified decimal places
 */
export const formatPercentage = (
    value: number,
    decimals: number = 1,
): string => {
    return `${value.toFixed(decimals)}%`
}

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
    current: number,
    previous: number,
): number => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
}

/**
 * Format date based on time horizon
 */
export const formatDateByHorizon = (
    date: Date,
    horizon: TimeHorizon,
): string => {
    switch (horizon) {
        case 'week':
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
            }).format(date)
        case 'month':
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
            }).format(date)
        case 'quarter':
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
            }).format(date)
        default:
            return date.toLocaleDateString()
    }
}

/**
 * Filter revenue data by time horizon
 * Note: The data generator already creates the correct data points for each horizon,
 * so this function simply returns all data
 */
export const filterRevenueByHorizon = (
    data: RevenueDataPoint[],
): RevenueDataPoint[] => {
    return data
}

/**
 * Calculate conversion rate between two stages
 */
export const calculateConversionRate = (
    currentCount: number,
    nextCount: number,
): number => {
    if (currentCount === 0) return 0
    return (nextCount / currentCount) * 100
}

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B'
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

/**
 * Calculate days overdue from due date
 */
export const calculateOverdueDays = (dueDate: string): number => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = now.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
}

/**
 * Get priority color class
 */
export const getPriorityColor = (
    priority: 'urgent' | 'medium' | 'low',
): string => {
    const colors = {
        urgent: 'border-error',
        medium: 'border-warning',
        low: 'border-success',
    }
    return colors[priority]
}

/**
 * Get win rate color based on performance
 */
export const getWinRateColor = (
    winRate: number,
    target: number,
): { fill: string; text: string } => {
    if (winRate >= target) {
        return { fill: 'stroke-success', text: 'text-success' }
    }
    if (winRate >= target * 0.9) {
        return { fill: 'stroke-warning', text: 'text-warning' }
    }
    return { fill: 'stroke-error', text: 'text-error' }
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}
