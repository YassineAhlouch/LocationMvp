// Utility functions for Analytics Dashboard

/**
 * Format currency values
 */
export const formatCurrency = (value: number, compact = false): string => {
    if (compact) {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}k`
        }
        return `$${value.toFixed(0)}`
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals = 1): string => {
    return `${value.toFixed(decimals)}%`
}

/**
 * Calculate ARR change
 */
export const calculateArrChange = (current: number, previous: number) => {
    const amount = current - previous
    const percentage = (amount / previous) * 100
    return {
        amount,
        percentage: Math.round(percentage * 100) / 100,
    }
}

/**
 * Calculate goal progress
 */
export const calculateGoalProgress = (
    current: number,
    goal: number,
): number => {
    return Math.round((current / goal) * 100)
}

/**
 * Calculate forecast variance
 */
export const calculateForecastVariance = (
    projected: number,
    target: number,
): number => {
    return projected - target
}

/**
 * Calculate conversion rate
 */
export const calculateConversionRate = (
    converted: number,
    total: number,
): number => {
    if (total === 0) return 0
    return Math.round((converted / total) * 100 * 10) / 10
}

/**
 * Calculate win rate
 */
export const calculateWinRate = (won: number, lost: number): number => {
    const total = won + lost
    if (total === 0) return 0
    return Math.round((won / total) * 100 * 10) / 10
}

/**
 * Determine win rate color
 */
export const getWinRateColor = (
    winRate: number,
    target: number,
): 'success' | 'warning' | 'error' => {
    if (winRate > target) return 'success'
    if (Math.abs(winRate - target) < 5) return 'warning'
    return 'error'
}

/**
 * Determine runway status
 */
export const getRunwayStatus = (
    months: number,
): 'critical' | 'warning' | 'healthy' => {
    if (months < 6) return 'critical'
    if (months < 12) return 'warning'
    return 'healthy'
}

/**
 * Calculate team average
 */
export const calculateTeamAverage = (values: number[]): number => {
    if (values.length === 0) return 0
    const sum = values.reduce((acc, val) => acc + val, 0)
    return Math.round((sum / values.length) * 10) / 10
}

/**
 * Currency conversion
 */
export const convertCurrency = (
    value: number,
    exchangeRate: number,
): number => {
    return Math.round(value * exchangeRate * 100) / 100
}
