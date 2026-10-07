/* eslint-disable @typescript-eslint/no-explicit-any */
import { userDetailData } from './usersData'
type DateRange = {
    startDate: Date
    endDate: Date
}

type ScenarioType = 'best-case' | 'expected' | 'worst-case'

class SeededRandom {
    private seed: number

    constructor(seed: number) {
        this.seed = seed
    }

    next(): number {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296
        return this.seed / 4294967296
    }

    range(min: number, max: number): number {
        return min + this.next() * (max - min)
    }

    int(min: number, max: number): number {
        return Math.floor(this.range(min, max + 1))
    }
}

const createSeededRandom = (
    baseString: string,
    additionalSeed: string = '',
): SeededRandom => {
    let hash = 0
    const fullString = baseString + additionalSeed
    for (let i = 0; i < fullString.length; i++) {
        const char = fullString.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    return new SeededRandom(Math.abs(hash))
}

const generateMonthRange = (dateRange: DateRange): string[] => {
    const months = []
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)

    const current = new Date(start.getFullYear(), start.getMonth(), 1)

    while (current <= end) {
        months.push(current.toISOString().split('T')[0])
        current.setMonth(current.getMonth() + 1)
    }

    return months
}

const generateDateRange = (dateRange: DateRange): string[] => {
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const dates = []

    if (timeRangeInDays <= 31) {
        const current = new Date(startDate)
        while (current <= endDate) {
            dates.push(current.toISOString().split('T')[0])
            current.setDate(current.getDate() + 1)
        }
    } else if (timeRangeInDays <= 90) {
        const current = new Date(startDate)
        const dayOfWeek = current.getDay()
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        current.setDate(current.getDate() - daysToMonday)

        while (current <= endDate) {
            dates.push(current.toISOString().split('T')[0])
            current.setDate(current.getDate() + 7)
        }
    } else {
        const monthsToGenerate = Math.round(timeRangeInDays / 30)

        const current = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1,
        )

        for (let i = 0; i < monthsToGenerate; i++) {
            const monthDate = new Date(current)
            monthDate.setMonth(current.getMonth() + i)
            dates.push(monthDate.toISOString().split('T')[0])
        }
    }

    return dates
}

const getScenarioMultiplier = (scenario: ScenarioType) => {
    switch (scenario) {
        case 'best-case':
            return { growth: 1.3, retention: 1.2, revenue: 1.25 }
        case 'expected':
            return { growth: 1.0, retention: 1.0, revenue: 1.0 }
        case 'worst-case':
            return { growth: 0.7, retention: 0.8, revenue: 0.75 }
    }
}

export const generateRevenueData = (
    dateRange: DateRange,
    scenario: ScenarioType,
) => {
    const months = generateMonthRange(dateRange)
    const multiplier = getScenarioMultiplier(scenario)

    const seedString = `revenue-${dateRange.startDate.toISOString()}-${dateRange.endDate.toISOString()}-${scenario}`
    const rng = createSeededRandom(seedString)

    const baseStartingMRR = 183570
    const baseGrowth = 8230
    const baseChurn = 155030

    const startingMRR = Math.round(baseStartingMRR * multiplier.revenue)
    const revenueGrowth = Math.round(baseGrowth * multiplier.growth)
    const revenueChurn = Math.round(baseChurn * multiplier.retention)

    const chartData = months.map((month) => {
        const baseNewMRR = revenueGrowth + Math.round(revenueGrowth * 0.3)
        const newMRR = Math.round(baseNewMRR * rng.range(0.9, 1.1))

        const baseChurnedMRR = Math.round(revenueChurn * 0.1)
        const churnedMRR = Math.round(baseChurnedMRR * rng.range(0.8, 1.2))

        return {
            month,
            newMRR,
            churnedMRR,
        }
    })

    const totalNetGrowth = chartData.reduce(
        (acc, data) => acc + (data.newMRR - data.churnedMRR),
        0,
    )
    const finalValue = startingMRR + totalNetGrowth

    return {
        primaryMetric: {
            value: finalValue,
            label: 'Monthly Recurring Revenue',
            period: 'IN ONE YEAR',
        },
        chartData,
        parameters: {
            startingMRR,
            netNewMRR: revenueGrowth,
            churnRate:
                Math.round((revenueChurn / startingMRR) * 100 * 100) / 100,
            expansionMRR: Math.round(revenueGrowth * 0.3),
        },
        description: `In a year with $${revenueGrowth.toLocaleString()} linear growth and ${(
            (revenueChurn / startingMRR) *
            100
        ).toFixed(1)}% churn your MRR will be $${finalValue.toLocaleString()}.`,
    }
}

export const generateUserGrowthData = (
    dateRange: DateRange,
    scenario: ScenarioType,
) => {
    const months = generateMonthRange(dateRange)
    const multiplier = getScenarioMultiplier(scenario)

    const seedString = `userGrowth-${dateRange.startDate.toISOString()}-${dateRange.endDate.toISOString()}-${scenario}`
    const rng = createSeededRandom(seedString)

    const baseStartingUsers = 786
    const baseGrowthRate = 4.2
    const baseChurnRate = 2.6

    const startingUsers = Math.round(baseStartingUsers * multiplier.growth)
    const userGrowth = baseGrowthRate * multiplier.growth
    const userChurn = baseChurnRate * multiplier.retention

    const chartData = months.map((month) => {
        const baseNewUsers = Math.round(startingUsers * (userGrowth / 100))
        const newUsers = Math.round(baseNewUsers * rng.range(0.9, 1.2))

        const baseChurnedUsers = Math.round(startingUsers * (userChurn / 100))
        const churnedUsers = Math.round(baseChurnedUsers * rng.range(0.8, 1.1))

        return {
            month,
            newUsers,
            churnedUsers,
        }
    })

    const totalNetGrowth = chartData.reduce(
        (acc, data) => acc + (data.newUsers - data.churnedUsers),
        0,
    )
    const finalValue = startingUsers + totalNetGrowth

    const avgNewUsersExact =
        chartData.reduce((acc, data) => acc + data.newUsers, 0) /
        chartData.length
    const avgChurnedUsersExact =
        chartData.reduce((acc, data) => acc + data.churnedUsers, 0) /
        chartData.length

    const avgNewUsers = Math.round(avgNewUsersExact)

    const churnedUsersPercent =
        Math.round((avgChurnedUsersExact / startingUsers) * 100 * 100) / 100

    const netNewUsers = Math.round(avgNewUsersExact - avgChurnedUsersExact)

    return {
        primaryMetric: {
            value: finalValue,
            label: 'Total Users',
            period: 'IN ONE YEAR',
        },
        chartData,
        parameters: {
            startingUsers,
            newUsers: avgNewUsers,
            churnedUsersRate: churnedUsersPercent,
            netNewUsers,
        },
        description: `With ${avgNewUsers} new users and ${churnedUsersPercent}% churn rate monthly, you'll have ${finalValue.toLocaleString()} total users.`,
    }
}

export const generateChurnRetentionData = (
    dateRange: DateRange,
    scenario: ScenarioType,
) => {
    const months = generateMonthRange(dateRange)
    const multiplier = getScenarioMultiplier(scenario)

    const seedString = `churnRetention-${dateRange.startDate.toISOString()}-${dateRange.endDate.toISOString()}-${scenario}`
    const rng = createSeededRandom(seedString)

    const baseRetention = 85
    const targetRetention = Math.round(baseRetention * multiplier.retention)

    const cohortData: Record<
        string,
        {
            size: number
            periods: Array<{ percentage: number; value: number } | null>
        }
    > = {}

    months.forEach((month, cohortIndex) => {
        const initialUsers = Math.round(800 + rng.next() * 400)
        const retentionDecay =
            scenario === 'best-case'
                ? 0.92
                : scenario === 'worst-case'
                  ? 0.85
                  : 0.88

        const periods: Array<{ percentage: number; value: number } | null> = []

        for (let period = 0; period < 12; period++) {
            if (cohortIndex + period >= months.length) {
                periods.push(null)
            } else {
                const retentionRate =
                    period === 0
                        ? 100
                        : Math.max(
                              10,
                              baseRetention *
                                  Math.pow(retentionDecay, period) *
                                  rng.range(0.9, 1.1),
                          )
                const retainedUsers = Math.round(
                    initialUsers * (retentionRate / 100),
                )

                periods.push({
                    percentage: Math.round(retentionRate * 100) / 100,
                    value: retainedUsers,
                })
            }
        }

        cohortData[month] = {
            size: initialUsers,
            periods,
        }
    })

    return {
        primaryMetric: {
            value: targetRetention,
            label: 'Retention Rate',
            period: 'PREDICTED',
        },
        chartData: cohortData,
        parameters: {
            currentRetention: baseRetention,
            targetRetention,
            churnTrend:
                scenario === 'best-case'
                    ? 'improving'
                    : scenario === 'worst-case'
                      ? 'declining'
                      : 'stable',
        },
        description: `Based on current trends, your retention rate is expected to ${
            scenario === 'best-case'
                ? 'improve to'
                : scenario === 'worst-case'
                  ? 'decline to'
                  : 'stabilize at'
        } ${targetRetention}%.`,
    }
}

export const generateSubscriptionData = (
    dateRange: DateRange,
    scenario: ScenarioType,
) => {
    const months = generateMonthRange(dateRange)
    const multiplier = getScenarioMultiplier(scenario)

    const seedString = `subscription-${dateRange.startDate.toISOString()}-${dateRange.endDate.toISOString()}-${scenario}`
    const rng = createSeededRandom(seedString)

    const baseConversion = 15
    const baseUpgrade = 8
    const baseDowngrade = 3

    const conversionRate =
        Math.round(baseConversion * multiplier.growth * 100) / 100
    const upgradeRate = Math.round(baseUpgrade * multiplier.revenue * 100) / 100
    const downgradeRate =
        Math.round((baseDowngrade / multiplier.retention) * 100) / 100

    const chartData = months.map((month, index) => {
        const baseUsers = 1000 + index * 100 * multiplier.growth
        const totalUsers = Math.round(baseUsers * rng.range(0.95, 1.05))

        return {
            month,
            free: Math.round(totalUsers * 0.6),
            pro: Math.round(totalUsers * 0.3),
            enterprise: Math.round(totalUsers * 0.1),
        }
    })

    const finalTotal = chartData[chartData.length - 1]
    const totalSubscriptions =
        finalTotal.free + finalTotal.pro + finalTotal.enterprise

    return {
        primaryMetric: {
            value: totalSubscriptions,
            label: 'Total Subscriptions',
            period: 'IN ONE YEAR',
        },
        chartData,
        parameters: {
            conversionRate,
            upgradeRate,
            downgradeRate,
            planMix: {
                free: Math.round((finalTotal.free / totalSubscriptions) * 100),
                pro: Math.round((finalTotal.pro / totalSubscriptions) * 100),
                enterprise: Math.round(
                    (finalTotal.enterprise / totalSubscriptions) * 100,
                ),
            },
        },
        description: `With ${conversionRate}% conversion rate and ${upgradeRate}% upgrade rate, you'll have ${totalSubscriptions.toLocaleString()} total subscriptions.`,
    }
}

export const generateRevenueTrendsData = (
    dateRange: DateRange,
    metric: 'mrr' | 'arr' | 'activeSubscriptions' | 'netRevenue' = 'mrr',
    includeComparison: boolean = false,
    comparisonType: 'previousPeriod' | 'sameLastYear' = 'previousPeriod',
) => {
    const dates = generateDateRange(dateRange)

    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const seedString = `${timeRangeInDays}d-${metric}-${comparisonType}-${includeComparison}`
    const rng = createSeededRandom(seedString)

    const baseValues = {
        mrr: 125000,
        arr: 1500000,
        activeSubscriptions: 2070,
        netRevenue: 142000,
    }

    const growthRates = {
        mrr: 0.08,
        arr: 0.12,
        activeSubscriptions: 0.05,
        netRevenue: 0.07,
    }

    const baseValue = baseValues[metric]
    const growthRate = growthRates[metric]

    let periodGrowthRate = growthRate

    if (timeRangeInDays <= 31) {
        periodGrowthRate = growthRate / 30
    } else if (timeRangeInDays <= 90) {
        periodGrowthRate = growthRate / 4
    }

    const chartData = dates.map((date, index) => {
        const variation = rng.range(0.95, 1.05)
        const value = Math.round(
            baseValue * Math.pow(1 + periodGrowthRate, index) * variation,
        )

        let previousValue: number | undefined
        if (includeComparison) {
            if (comparisonType === 'sameLastYear') {
                const comparisonVariation = rng.range(0.95, 1.05)
                previousValue = Math.round(value * 0.8 * comparisonVariation)
            } else {
                if (index > 0) {
                    const prevVariation = rng.range(0.95, 1.05)
                    previousValue = Math.round(
                        baseValue *
                            Math.pow(1 + periodGrowthRate, index - 1) *
                            prevVariation,
                    )
                } else {
                    previousValue = Math.round(baseValue * 0.95)
                }
            }
        }

        return {
            date,
            value,
            previousValue,
        }
    })

    const currentValue = chartData[chartData.length - 1]?.value || baseValue
    const previousValue = chartData[chartData.length - 2]?.value || baseValue
    const growth = ((currentValue - previousValue) / previousValue) * 100

    return {
        metrics: {
            [metric]: chartData,
        },
        summary: {
            [`current${metric.charAt(0).toUpperCase() + metric.slice(1)}`]:
                currentValue,
            [`${metric}Growth`]: Math.round(growth * 100) / 100,
        },
    }
}

export const generateAllRevenueTrendsData = (
    dateRange: DateRange,
    includeComparison: boolean = false,
    comparisonType: 'previousPeriod' | 'sameLastYear' = 'previousPeriod',
) => {
    const dates = generateDateRange(dateRange)

    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const seedString = `${timeRangeInDays}d-${comparisonType}-${includeComparison}`

    const baseValues = {
        mrr: 125000,
        arr: 1500000,
        activeSubscriptions: 2070,
        netRevenue: 142000,
    }

    const growthRates = {
        mrr: 0.08,
        arr: 0.12,
        activeSubscriptions: 0.05,
        netRevenue: 0.07,
    }

    let periodMultiplier = 1
    if (timeRangeInDays <= 31) {
        periodMultiplier = 1 / 30
    } else if (timeRangeInDays <= 90) {
        periodMultiplier = 1 / 4
    }

    const allMetrics = Object.keys(baseValues) as Array<keyof typeof baseValues>
    const metrics: Record<
        string,
        Array<{ date: string; value: number; previousValue?: number }>
    > = {}
    const summary: Record<string, number> = {}

    allMetrics.forEach((metric) => {
        const baseValue = baseValues[metric]
        const growthRate = growthRates[metric]
        const periodGrowthRate = growthRate * periodMultiplier

        const rng = createSeededRandom(seedString, metric)

        const chartData = dates.map((date, index) => {
            const baseGrowth = baseValue * Math.pow(1 + periodGrowthRate, index)

            const progress = index / (dates.length - 1)

            let shapeMultiplier = 1

            if (progress < 0.15) {
                shapeMultiplier = 0.85 + progress * 0.3 + rng.range(-0.05, 0.05)
            } else if (progress < 0.4) {
                const localProgress = (progress - 0.15) / 0.25
                shapeMultiplier =
                    0.9 + localProgress * 0.25 + rng.range(-0.08, 0.12)
            } else if (progress < 0.7) {
                const localProgress = (progress - 0.4) / 0.3
                shapeMultiplier =
                    1.15 + localProgress * 0.3 + rng.range(-0.1, 0.15)
            } else {
                const localProgress = (progress - 0.7) / 0.3
                shapeMultiplier =
                    1.45 + localProgress * 0.15 + rng.range(-0.12, 0.08)
            }

            const microFluctuation = rng.range(-0.03, 0.03)

            let momentum = 0
            if (index > 1) {
                const recentTrend = rng.range(-0.02, 0.04)
                momentum = recentTrend
            }

            const finalMultiplier =
                shapeMultiplier + microFluctuation + momentum
            const value = Math.round(baseGrowth * finalMultiplier)

            let previousValue: number | undefined
            if (includeComparison) {
                if (comparisonType === 'sameLastYear') {
                    const comparisonVariation = rng.range(0.95, 1.05)
                    previousValue = Math.round(
                        value * 0.8 * comparisonVariation,
                    )
                } else {
                    if (index > 0) {
                        const prevVariation = rng.range(0.95, 1.05)
                        const prevBaseGrowth =
                            baseValue *
                            Math.pow(1 + periodGrowthRate, index - 1)
                        const prevWaveEffect =
                            Math.sin(
                                ((index - 1) * 2 * Math.PI) /
                                    (dates.length * 0.7),
                            ) *
                                0.15 +
                            Math.sin(
                                ((index - 1) * 4 * Math.PI) / dates.length,
                            ) *
                                0.08 +
                            Math.sin(
                                ((index - 1) * 6 * Math.PI) / dates.length,
                            ) *
                                0.04
                        const prevTotalVariation =
                            1 + prevWaveEffect + (prevVariation - 1) * 0.1
                        previousValue = Math.round(
                            prevBaseGrowth * prevTotalVariation,
                        )
                    } else {
                        previousValue = Math.round(baseValue * 0.95)
                    }
                }
            }

            return {
                date,
                value,
                previousValue,
            }
        })

        const currentValue = chartData[chartData.length - 1]?.value || baseValue
        const previousValueForGrowth =
            chartData[chartData.length - 2]?.value || baseValue
        const growth =
            ((currentValue - previousValueForGrowth) / previousValueForGrowth) *
            100

        metrics[metric] = chartData
        summary[`current${metric.charAt(0).toUpperCase() + metric.slice(1)}`] =
            currentValue
        summary[`${metric}Growth`] = Math.round(growth * 100) / 100
    })

    return {
        metrics,
        summary,
    }
}

export const generateRevenueBreakdownData = (dateRange: DateRange) => {
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const seedString = `breakdown-${timeRangeInDays}d`
    const rng = createSeededRandom(seedString)

    const byPlan = [
        {
            plan: 'Basic',
            customers: Math.round(1250 * rng.range(0.95, 1.05)),
            mrr: Math.round(25000 * rng.range(0.95, 1.05)),
            arr: Math.round(300000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(20 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(5 * rng.range(0.8, 1.2) * 10) / 10,
        },
        {
            plan: 'Pro',
            customers: Math.round(700 * rng.range(0.95, 1.05)),
            mrr: Math.round(45000 * rng.range(0.95, 1.05)),
            arr: Math.round(540000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(36 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(8 * rng.range(0.8, 1.2) * 10) / 10,
        },
        {
            plan: 'Enterprise',
            customers: Math.round(120 * rng.range(0.95, 1.05)),
            mrr: Math.round(55000 * rng.range(0.95, 1.05)),
            arr: Math.round(660000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(44 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(12 * rng.range(0.8, 1.2) * 10) / 10,
        },
    ]

    const byRegion = [
        {
            region: 'United States',
            customers: Math.round(1250 * rng.range(0.95, 1.05)),
            mrr: Math.round(65000 * rng.range(0.95, 1.05)),
            arr: Math.round(780000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(52 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(7 * rng.range(0.8, 1.2) * 10) / 10,
        },
        {
            region: 'Brazil',
            customers: Math.round(450 * rng.range(0.95, 1.05)),
            mrr: Math.round(28000 * rng.range(0.95, 1.05)),
            arr: Math.round(336000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(22 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(5 * rng.range(0.8, 1.2) * 10) / 10,
        },
        {
            region: 'India',
            customers: Math.round(370 * rng.range(0.95, 1.05)),
            mrr: Math.round(32000 * rng.range(0.95, 1.05)),
            arr: Math.round(384000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(26 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(9 * rng.range(0.8, 1.2) * 10) / 10,
        },
        {
            region: 'United Kingdom',
            customers: Math.round(100 * rng.range(0.95, 1.05)),
            mrr: Math.round(5000 * rng.range(0.95, 1.05)),
            arr: Math.round(60000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(4 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(3 * rng.range(0.8, 1.2) * 10) / 10,
        },
    ]

    const byPaymentMethod = [
        {
            paymentMethod: 'Credit Card',
            customers: Math.round(1680 * rng.range(0.95, 1.05)),
            mrr: Math.round(95000 * rng.range(0.95, 1.05)),
            arr: Math.round(1140000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(76 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(6 * rng.range(0.8, 1.2) * 10) / 10,
        },
        {
            paymentMethod: 'PayPal',
            customers: Math.round(280 * rng.range(0.95, 1.05)),
            mrr: Math.round(18000 * rng.range(0.95, 1.05)),
            arr: Math.round(216000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(14 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(4 * rng.range(0.8, 1.2) * 10) / 10,
        },
        {
            paymentMethod: 'Bank Transfer',
            customers: Math.round(110 * rng.range(0.95, 1.05)),
            mrr: Math.round(12000 * rng.range(0.95, 1.05)),
            arr: Math.round(144000 * rng.range(0.95, 1.05)),
            percentageOfTotal: Math.round(10 * rng.range(0.9, 1.1)),
            growthMoM: Math.round(8 * rng.range(0.8, 1.2) * 10) / 10,
        },
    ]

    const totals = {
        totalCustomers: byPlan.reduce((sum, item) => sum + item.customers, 0),
        totalMRR: byPlan.reduce((sum, item) => sum + item.mrr, 0),
        totalARR: byPlan.reduce((sum, item) => sum + item.arr, 0),
        overallGrowthMoM: 7.2,
    }

    return {
        byPlan,
        byRegion,
        byPaymentMethod,
        totals,
    }
}

export const generateSubscriberTrendsData = (dateRange: DateRange) => {
    const dates = generateDateRange(dateRange)

    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const seedString = `subscriber-trends-${timeRangeInDays}d`
    const rng = createSeededRandom(seedString)

    const baseNewSubscribers = 150
    const baseUnsubscribers = 25
    const growthTrend = 0.02

    const chartData = dates.map((date, index) => {
        const trendMultiplier = 1 + index * growthTrend
        const seasonalMultiplier = rng.range(0.8, 1.2)

        const newSubscribers = Math.round(
            baseNewSubscribers * trendMultiplier * seasonalMultiplier,
        )
        const unsubscribers = -Math.round(
            baseUnsubscribers * seasonalMultiplier,
        )

        return {
            date,
            newSubscribers,
            unsubscribers,
            netGrowth: newSubscribers - unsubscribers,
        }
    })

    const totalNewSubscribers = chartData.reduce(
        (sum, data) => sum + data.newSubscribers,
        0,
    )
    const totalUnsubscribers = chartData.reduce(
        (sum, data) => sum + data.unsubscribers,
        0,
    )
    const totalNetGrowth = totalNewSubscribers - totalUnsubscribers
    const totalSubscribers = 5380 + totalNetGrowth

    const avgMonthlyGrowth =
        chartData.length > 0
            ? (totalNetGrowth / chartData.length / totalSubscribers) * 100
            : 0
    const churnRate =
        totalSubscribers > 0 ? (totalUnsubscribers / totalSubscribers) * 100 : 0
    const totalGrowth =
        totalSubscribers > 0 ? (totalNetGrowth / totalSubscribers) * 100 : 0

    return {
        trends: chartData,
        metrics: {
            totalSubscribers,
            totalGrowth: Math.round(totalGrowth * 100) / 100,
            avgMonthlyGrowth: Math.round(avgMonthlyGrowth * 100) / 100,
            churnRate: Math.round(churnRate * 100) / 100,
            activeSubscribers: {
                value: Math.round(totalSubscribers * 0.85),
                percentage: 85.0,
                total: totalSubscribers,
            },
            newSubscribers: {
                value: totalNewSubscribers,
                percentage:
                    Math.round(
                        (totalNewSubscribers / totalSubscribers) * 100 * 100,
                    ) / 100,
                total: totalSubscribers,
            },
            churnedSubscribers: {
                value: totalUnsubscribers,
                percentage:
                    Math.round(
                        (totalUnsubscribers / totalSubscribers) * 100 * 100,
                    ) / 100,
                total: totalSubscribers,
            },
        },
    }
}

export const generateLifecycleData = (dateRange: DateRange) => {
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const seedString = `lifecycle-${timeRangeInDays}d`
    const rng = createSeededRandom(seedString)

    const totalSubscribers = 5380

    const stages = [
        {
            stage: 'trial' as const,
            basePercentage: 15,
            trendOptions: ['up', 'neutral'] as const,
        },
        {
            stage: 'active' as const,
            basePercentage: 45,
            trendOptions: ['up', 'neutral'] as const,
        },
        {
            stage: 'engaged' as const,
            basePercentage: 25,
            trendOptions: ['up', 'neutral', 'down'] as const,
        },
        {
            stage: 'churned' as const,
            basePercentage: 10,
            trendOptions: ['down', 'neutral'] as const,
        },
        {
            stage: 'reactivated' as const,
            basePercentage: 5,
            trendOptions: ['up', 'neutral'] as const,
        },
    ]

    return stages.map(({ stage, basePercentage, trendOptions }) => {
        const variation = rng.range(0.8, 1.2)
        const percentage = Math.round(basePercentage * variation)
        const count = Math.round((totalSubscribers * percentage) / 100)
        const trend = trendOptions[rng.int(0, trendOptions.length - 1)]

        return {
            stage,
            count,
            percentage,
            trend,
        }
    })
}

export type UnifiedReportRow = {
    id: string
    plan?: string
    featureUsed?: string[]
    device?: string
    customer?: string
    email?: string
    amount?: number
    paymentMethod?: string
    status?: string
    country?: string
    countryCode?: string
    signupDate?: string
    lastActive?: string
    mrrRange?: string
    autoRenewal?: boolean
}

export const generateUnifiedReportData = (
    dateRange: DateRange,
): UnifiedReportRow[] => {
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const usersRng = createSeededRandom(`user-report-${timeRangeInDays}d`)
    const usageRng = createSeededRandom(`usage-report-${timeRangeInDays}d`)
    const revenueRng = createSeededRandom(`revenue-report-${timeRangeInDays}d`)

    const plans = ['Basic', 'Standard', 'Pro'] as const
    const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Stripe']
    const statuses = ['Paid', 'Pending', 'Failed', 'Refunded']
    const countries = [
        { name: 'United States', code: 'US' },
        { name: 'United Kingdom', code: 'UK' },
        { name: 'Canada', code: 'CA' },
        { name: 'Germany', code: 'DE' },
        { name: 'France', code: 'FR' },
        { name: 'Japan', code: 'JP' },
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'India', code: 'IN' },
        { name: 'Netherlands', code: 'NL' },
        { name: 'Sweden', code: 'SE' },
        { name: 'Spain', code: 'ES' },
    ]

    const users = (() => {
        const maxDaysAgoBase = Math.min(365, timeRangeInDays * 3)
        return userDetailData
            .map((user) => {
                const plan = plans[usersRng.int(0, plans.length - 1)]
                const maxDaysAgo = Math.max(1, maxDaysAgoBase)
                const signupDaysAgo = usersRng.int(1, maxDaysAgo)
                const signupDate = new Date()
                signupDate.setDate(signupDate.getDate() - signupDaysAgo)
                const lastActiveDaysAgo = usersRng.int(
                    0,
                    Math.min(30, signupDaysAgo),
                )
                const lastActiveDate = new Date()
                lastActiveDate.setDate(
                    lastActiveDate.getDate() - lastActiveDaysAgo,
                )
                const mrrRanges = {
                    Basic: ['$0-$50', '$50-$100', '$100-$200'],
                    Standard: ['$200-$500', '$500-$1000', '$1000-$2000'],
                    Pro: ['$2000-$5000', '$5000-$10000', '$10000+'],
                } as const
                const planRanges = mrrRanges[plan]
                const mrrRange =
                    planRanges[usersRng.int(0, planRanges.length - 1)]
                const autoRenewal = usersRng.next() > 0.2
                return {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    plan,
                    signupDate: signupDate.toISOString().split('T')[0],
                    lastActive: lastActiveDate.toISOString().split('T')[0],
                    mrrRange,
                    autoRenewal,
                }
            })
            .sort(
                (a, b) =>
                    new Date(b.signupDate).getTime() -
                    new Date(a.signupDate).getTime(),
            )
    })()

    const usage = (() => {
        const features = [
            'Dashboard View',
            'Report Generation',
            'Data Export',
            'User Management',
            'Analytics View',
            'File Upload',
            'API Access',
            'Custom Charts',
            'Team Collaboration',
            'Data Import',
            'Notification Settings',
            'Profile Update',
        ]

        const featureCombinations: Record<string, string[]> = {
            'Report Generation': [
                'Data Export',
                'Analytics View',
                'Custom Charts',
            ],
            'Dashboard View': ['Analytics View', 'Custom Charts'],
            'User Management': ['Team Collaboration', 'Notification Settings'],
            'File Upload': ['Data Import', 'Data Export'],
            'API Access': ['Data Export', 'Custom Charts'],
            'Analytics View': [
                'Report Generation',
                'Custom Charts',
                'Data Export',
            ],
            'Data Export': ['Report Generation', 'Analytics View'],
            'Custom Charts': [
                'Analytics View',
                'Report Generation',
                'Data Export',
            ],
            'Team Collaboration': ['User Management', 'Notification Settings'],
            'Data Import': ['File Upload', 'Data Export'],
            'Notification Settings': ['User Management', 'Profile Update'],
            'Profile Update': ['Notification Settings', 'User Management'],
        }

        const generateFeatureArray = (rng: SeededRandom): string[] => {
            const primaryFeature = features[rng.int(0, features.length - 1)]
            const featureArray = [primaryFeature]

            if (rng.next() < 0.6) {
                const relatedFeatures =
                    featureCombinations[primaryFeature] || []
                if (relatedFeatures.length > 0) {
                    const additionalCount = rng.int(
                        1,
                        Math.min(3, relatedFeatures.length),
                    )

                    const shuffledRelated = [...relatedFeatures].sort(
                        () => rng.next() - 0.5,
                    )
                    for (
                        let i = 0;
                        i < additionalCount && featureArray.length < 4;
                        i++
                    ) {
                        const feature = shuffledRelated[i]
                        if (!featureArray.includes(feature)) {
                            featureArray.push(feature)
                        }
                    }
                }
            }

            return featureArray
        }
        const devices = ['Desktop', 'Mobile', 'Tablet']
        const usageCount = Math.min(1000, Math.max(100, timeRangeInDays * 5))
        return Array.from({ length: usageCount }, (_, i) => {
            const userIndex = i % userDetailData.length
            const user = userDetailData[userIndex]
            const featuresUsed = generateFeatureArray(usageRng)
            const device = devices[usageRng.int(0, devices.length - 1)]
            const dayOffset = usageRng.int(0, Math.max(0, timeRangeInDays))
            const hour = usageRng.int(0, 23)
            const minute = usageRng.int(0, 59)
            const recordDate = new Date(startDate)
            recordDate.setDate(recordDate.getDate() + dayOffset)
            recordDate.setHours(hour, minute, 0, 0)
            return {
                userId: user.id,
                featureUsed: featuresUsed,
                device,
                timestamp: recordDate.toISOString(),
            }
        }).sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
        )
    })()

    const revenue = (() => {
        const recordCount = Math.min(500, Math.max(50, timeRangeInDays * 2))
        const data = Array.from({ length: recordCount }, (_, index) => {
            const userIndex = index % userDetailData.length
            const user = userDetailData[userIndex]
            const plan = plans[revenueRng.int(0, plans.length - 1)]
            const paymentMethod =
                paymentMethods[revenueRng.int(0, paymentMethods.length - 1)]
            const status = statuses[revenueRng.int(0, statuses.length - 1)]
            const country = countries[revenueRng.int(0, countries.length - 1)]
            let baseAmount = 0
            switch (plan) {
                case 'Basic':
                    baseAmount = 29
                    break
                case 'Standard':
                    baseAmount = 99
                    break
                case 'Pro':
                    baseAmount = 299
                    break
            }
            const amount = baseAmount + revenueRng.int(-5, 20)
            const dayOffset = revenueRng.int(0, Math.max(0, timeRangeInDays))
            const recordDate = new Date(startDate)
            recordDate.setDate(recordDate.getDate() + dayOffset)
            return {
                customer: user.name,
                plan,
                amount,
                paymentMethod,
                status,
                country: country.name,
                countryCode: country.code,
                date: recordDate.toISOString().split('T')[0],
            }
        })
        return data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
    })()

    const userIdToRow = new Map<string, UnifiedReportRow>()

    for (const u of users) {
        userIdToRow.set(u.userId, {
            id: u.userId,
            plan: u.plan,
            customer: u.name,
            email: u.email,
            signupDate: u.signupDate,
            lastActive: u.lastActive,
            mrrRange: u.mrrRange,
            autoRenewal: u.autoRenewal,
        })
    }

    const latestUsageByUser = new Map<
        string,
        { featureUsed: string[]; device: string; timestamp: string }
    >()
    for (const usg of usage) {
        const prev = latestUsageByUser.get(usg.userId)
        if (
            !prev ||
            new Date(usg.timestamp).getTime() >
                new Date(prev.timestamp).getTime()
        ) {
            latestUsageByUser.set(usg.userId, {
                featureUsed: usg.featureUsed,
                device: usg.device,
                timestamp: usg.timestamp,
            })
        }
    }
    for (const [userId, info] of latestUsageByUser) {
        const row = userIdToRow.get(userId)
        if (row) {
            row.featureUsed = info.featureUsed
            row.device = info.device
        }
    }

    const latestRevenueByCustomer = new Map<
        string,
        {
            amount: number
            paymentMethod: string
            status: string
            country: string
            countryCode: string
            date: string
        }
    >()
    for (const rev of revenue) {
        const prev = latestRevenueByCustomer.get(rev.customer)
        if (
            !prev ||
            new Date(rev.date).getTime() > new Date(prev.date).getTime()
        ) {
            latestRevenueByCustomer.set(rev.customer, {
                amount: rev.amount,
                paymentMethod: rev.paymentMethod,
                status: rev.status,
                country: rev.country,
                countryCode: rev.countryCode,
                date: rev.date,
            })
        }
    }
    for (const row of userIdToRow.values()) {
        const rev = latestRevenueByCustomer.get(row.customer || '')
        if (rev) {
            row.amount = rev.amount
            row.paymentMethod = rev.paymentMethod
            row.status = rev.status
            row.country = rev.country
            row.countryCode = rev.countryCode
        }
    }

    return Array.from(userIdToRow.values())
}

export const generateSubscriberPersonasData = (dateRange: DateRange) => {
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const timeRangeInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    const seedString = `personas-${timeRangeInDays}d`
    const rng = createSeededRandom(seedString)

    const plans = ['Basic', 'Standard', 'Pro'] as const
    const engagementLevels = ['low', 'medium', 'high'] as const

    const generatePersona = (
        user: any,
        isHighValue: boolean,
        isRecent: boolean,
    ) => {
        const plan = plans[rng.int(0, plans.length - 1)]
        const engagement =
            engagementLevels[rng.int(0, engagementLevels.length - 1)]

        const durationMonths = isRecent ? rng.int(1, 6) : rng.int(6, 36)
        const subscribeDuration =
            durationMonths === 1
                ? '1 month'
                : durationMonths < 12
                  ? `${durationMonths} months`
                  : `${Math.floor(durationMonths / 12)} year${
                        Math.floor(durationMonths / 12) > 1 ? 's' : ''
                    }`

        const planMultiplier = plan === 'Basic' ? 1 : plan === 'Pro' ? 2.5 : 5
        const baseMonthlyAmount = 29 * planMultiplier
        const accumulatedAmount = Math.round(
            baseMonthlyAmount * durationMonths * rng.range(0.8, 1.2),
        )

        const engagementMultiplier =
            engagement === 'low' ? 0.5 : engagement === 'medium' ? 1 : 2
        const avgPageViews = Math.round(
            150 * engagementMultiplier * rng.range(0.7, 1.3),
        )

        const joinDate = new Date()
        joinDate.setMonth(joinDate.getMonth() - durationMonths)

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            img: user.img,
            plan,
            subscribeDuration,
            accumulatedAmount,
            avgPageViews,
            engagement,
            joinDate: joinDate.toISOString(),
            lastActive: user.lastOnline,
            isHighValue,
            isRecent,
        }
    }

    const mockUsers = userDetailData

    const allUsers = [...mockUsers]

    const additionalUsers = Array.from({ length: 25 }, (_, i) => ({
        id: `${mockUsers.length + i + 1}`,
        name: `User ${mockUsers.length + i + 1}`,
        email: `user${mockUsers.length + i + 1}@example.com`,
        img: `/img/avatars/thumb-${(i % 15) + 1}.jpg`,
        lastOnline: new Date(
            Date.now() - rng.int(1, 30) * 24 * 60 * 60 * 1000,
        ).toISOString(),
    }))

    const extendedUsers = [...allUsers, ...additionalUsers]

    const recentSubscribers = extendedUsers
        .slice(0, 20)
        .map((user) => generatePersona(user, false, true))
    const highValueSubscribers = extendedUsers
        .slice(20, 40)
        .map((user) => generatePersona(user, true, false))

    return {
        recent: recentSubscribers,
        highValue: highValueSubscribers,
    }
}

export const generateMockForecastData = (
    dateRange: DateRange,
    scenario: ScenarioType,
) => {
    return {
        revenue: generateRevenueData(dateRange, scenario),
        userGrowth: generateUserGrowthData(dateRange, scenario),
        churnRetention: generateChurnRetentionData(dateRange, scenario),
        subscription: generateSubscriptionData(dateRange, scenario),
    }
}

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

const generateArrData = () => {
    const currentMrr = 145200
    const lastMonthMrr = 133793
    const currentArr = currentMrr * 12
    const lastYearArr = 1583000

    const mrrChangePercentage =
        ((currentMrr - lastMonthMrr) / lastMonthMrr) * 100
    const arrChangePercentage = ((currentArr - lastYearArr) / lastYearArr) * 100

    const rawData: Array<{
        date: string
        totalMrr: number
        netNewMrr: number
        churnContraction: number
    }> = []
    const today = new Date()
    const baseMrr = 120000

    for (let i = 89; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const progress = (90 - i) / 90

        const totalMrr =
            baseMrr +
            (currentMrr - baseMrr) * progress +
            seededRandom(i * 100) * 3000 -
            1500

        const baseNetNew = 280
        const dayIndex = 90 - i
        const sineWave = Math.sin(dayIndex / 15) * 15
        const tinyNoise = seededRandom(i * 200) * 4 - 2
        const netNewMrr = baseNetNew + sineWave + tinyNoise

        const churnContraction = -(100 + seededRandom(i * 300) * 200)

        rawData.push({
            date: date.toISOString().split('T')[0],
            totalMrr: Math.round(totalMrr),
            netNewMrr: netNewMrr,
            churnContraction: Math.round(churnContraction),
        })
    }

    const chartData = rawData.map((item, index) => {
        const windowSize = 3
        const start = Math.max(0, index - Math.floor(windowSize / 2))
        const end = Math.min(rawData.length, index + Math.ceil(windowSize / 2))
        const window = rawData.slice(start, end)
        const smoothedNetNewMrr =
            window.reduce((sum, d) => sum + d.netNewMrr, 0) / window.length

        return {
            ...item,
            netNewMrr: Math.round(smoothedNetNewMrr),
        }
    })

    return {
        current: currentArr,
        changeVsLastMonth: {
            amount: currentMrr - lastMonthMrr,
            percentage: Math.round(mrrChangePercentage * 10) / 10,
        },
        goalProgress: Math.round((currentArr / (currentArr * 1.1)) * 100),
        sparklineData: chartData,
        forecast: {
            eoyProjected: currentArr,
            eoyTarget: currentArr * 1.1,
            variance: currentArr - currentArr * 1.1,
        },
        currentMrr,
        mrrVsLastMonth: Math.round(mrrChangePercentage * 10) / 10,
        arrVsLastYear: Math.round(arrChangePercentage * 10) / 10,
        mrrMovers: {
            newSales: 25000,
            expansion: 10000,
            churn: -8000,
        },
    }
}

const generateChannelsData = () => {
    return {
        trafficDominance: 82,
        vsLastWeek: 2.1,
        channels: [
            { name: 'Organic Search' as const, percentage: 48 },
            { name: 'Social Media' as const, percentage: 37 },
            { name: 'Direct' as const, percentage: 15 },
        ],
        metrics: [
            {
                icon: 'LiChart',
                label: 'Acquisition',
                value: '$38.25',
                trend: 5.2,
            },
            {
                icon: 'LiClock',
                label: 'Conversion',
                value: '4.2 days',
                trend: -3.8,
            },
            {
                icon: 'LiTrendUp',
                label: 'ROI',
                value: '324%',
                trend: 4.5,
            },
            {
                icon: 'LiMouse',
                label: 'CPC',
                value: '$1.25',
                trend: -8,
            },
            {
                icon: 'LiMail',
                label: 'CPL',
                value: '$15.50',
                trend: 2,
            },
            {
                icon: 'LiMoney',
                label: 'Ad Spend',
                value: '$4,250',
                trend: 12,
            },
        ],
    }
}

const generateCashRunwayData = () => {
    const cashOnHand = 450000
    const burnRate = 35000
    const runway = cashOnHand / burnRate

    const cashChartData = []
    const today = new Date()
    const baseCash = 420000

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const progress = (7 - i) / 7
        const cashValue =
            baseCash +
            (cashOnHand - baseCash) * progress +
            seededRandom(i * 400) * 10000 -
            5000

        cashChartData.push({
            label: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
            value: Math.round(cashValue),
        })
    }

    const runwayChartData = []
    const baseRunway = 11.5

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const progress = (7 - i) / 7
        const runwayValue =
            baseRunway +
            (runway - baseRunway) * progress +
            seededRandom(i * 500) * 0.5 -
            0.25

        runwayChartData.push({
            label: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
            value: Math.round(runwayValue * 10) / 10,
        })
    }

    return {
        cashOnHand,
        burnRate,
        runway: Math.round(runway * 10) / 10,
        runwayStatus:
            runway < 6 ? 'critical' : runway < 12 ? 'warning' : 'healthy',
        cashChartData,
        runwayChartData,
    }
}

const generateNrrData = () => {
    const monthlyData = []
    const today = new Date()

    for (let i = 11; i >= 0; i--) {
        const month = new Date(today)
        month.setMonth(month.getMonth() - i)
        const baseNrr = 112
        const variance = seededRandom(i * 100) * 8 - 4
        monthlyData.push({
            month: month.toISOString().slice(0, 7),
            nrr: Math.round((baseNrr + variance) * 10) / 10,
        })
    }

    const currentNrr = monthlyData[monthlyData.length - 1].nrr
    const lastMonthNrr = monthlyData[monthlyData.length - 2].nrr
    const changeFromLastMonth = currentNrr - lastMonthNrr

    return {
        current: currentNrr,
        monthlyData,
        target: 100,
        changeFromLastMonth: Math.round(changeFromLastMonth * 10) / 10,
        breakdown: {
            startingArr: 2500000,
            expansion: 300000,
            contraction: -50000,
        },
    }
}

const generateChurnData = () => {
    return {
        logoChurn: 2.1,
        revenueChurn: 0.5,
        logoChurnTarget: 3.0,
        revenueChurnTarget: 1.0,
        logoChurnChange: 0.3,
        revenueChurnChange: -0.1,
        churnDrivers: [
            {
                reason: 'Missing Feature X',
                lostMrr: 5200,
                percentageOfTotal: 32,
            },
            {
                reason: 'Small Business Tier',
                lostMrr: 4100,
                percentageOfTotal: 25,
            },
            {
                reason: 'Competitor Switch',
                lostMrr: 2400,
                percentageOfTotal: 15,
            },
            {
                reason: 'Payment Failure (Dunning)',
                lostMrr: 2900,
                percentageOfTotal: 13,
            },
            {
                reason: 'Price Sensitivity',
                lostMrr: 1800,
                percentageOfTotal: 10,
            },
            {
                reason: 'No Longer Needed',
                lostMrr: 800,
                percentageOfTotal: 5,
            },
        ],
    }
}

const generatePlansData = () => {
    return {
        plans: [
            {
                name: 'Enterprise',
                monthlyPrice: 5000,
                revenuePercentage: 40,
                icon: 'cube',
            },
            {
                name: 'Pro',
                monthlyPrice: 99,
                revenuePercentage: 35,
                icon: 'triangle',
            },
            {
                name: 'Starter',
                monthlyPrice: 29,
                revenuePercentage: 25,
                icon: 'sphere',
            },
        ],
    }
}

const generateMrrWaterfallData = () => {
    const startingMrr = 98000
    const newSales = 12000
    const expansion = 5000
    const churn = -3000
    const contraction = -2000
    const netChange = newSales + expansion + churn + contraction

    return {
        startingMrr,
        newSales,
        expansion,
        churn,
        contraction,
        endingMrr: startingMrr + netChange,
        netChange,
    }
}

const generateAtRiskAccountsData = () => {
    const companies = [
        {
            name: 'Slack Technologies',
            logo: 'slack.png',
            arr: 120000,
            healthScore: 35,
            days: 45,
        },
        {
            name: 'Notion Labs',
            logo: 'notion.png',
            arr: 96000,
            healthScore: 42,
            days: 28,
        },
        {
            name: 'HubSpot Inc',
            logo: 'hubspot.png',
            arr: 84000,
            healthScore: 38,
            days: 52,
        },
        {
            name: 'Figma Design',
            logo: 'figma.png',
            arr: 72000,
            healthScore: 45,
            days: 21,
        },
        {
            name: 'Dropbox Inc',
            logo: 'dropbox.png',
            arr: 60000,
            healthScore: 40,
            days: 35,
        },
    ]

    return {
        accounts: companies.map((company, index) => ({
            id: `account-${index + 1}`,
            companyName: company.name,
            avatar: `/img/thumbs/brands/${company.logo}`,
            healthScore: company.healthScore,
            arr: company.arr,
            daysSinceLastLogin: company.days,
            riskLevel: company.healthScore < 40 ? 'critical' : 'warning',
        })),
    }
}

const generatePlatformStabilityData = () => {
    return {
        uptime: 99.97,
        errorRate: 0.18,
        totalRequests: 2.4,
        p95ResponseTime: 420,
        uptimeTrend: 0.02,
        errorImpact: -0.06,
        utilization: 68.4,
        requestBreakdown: {
            successful: { count: 1.15, percentage: 96 },
            clientErrors: { count: 0.045, percentage: 3.5 },
            serverErrors: { count: 0.005, percentage: 0.5 },
            totalRequests: 1.2,
        },
    }
}

const generateLtvCacData = () => {
    const monthlyData = []
    const today = new Date()

    for (let i = 11; i >= 0; i--) {
        const month = new Date(today)
        month.setMonth(month.getMonth() - i)
        const baseRatio = 3.4
        const variance = seededRandom(i * 200) * 0.8 - 0.4
        monthlyData.push({
            month: month.toISOString().slice(0, 7),
            ratio: Math.round((baseRatio + variance) * 10) / 10,
        })
    }

    return {
        current: monthlyData[monthlyData.length - 1].ratio,
        monthlyData,
        target: 3.0,
        explanation: 'It costs us $500 to acquire a customer worth $1,700',
    }
}

const generateTrialFunnelData = () => {
    const stages = [
        {
            name: 'Website' as const,
            count: 2500,
            color: '#286cf0',
            velocity: 0.41,
        },
        {
            name: 'Signup' as const,
            count: 500,
            color: '#00a85b',
            velocity: 0.3,
        },
        {
            name: 'Activated' as const,
            count: 200,
            color: '#f59e0b',
            velocity: 3.2,
        },
        {
            name: 'Conversion' as const,
            count: 80,
            color: '#8b5cf6',
            velocity: 1.15,
        },
    ]

    return {
        stages: stages.map((stage, index) => {
            const percentage =
                index === 0
                    ? 100
                    : Math.round(
                          (stage.count / stages[index - 1].count) * 100 * 10,
                      ) / 10
            const conversionRate =
                index < stages.length - 1
                    ? Math.round(
                          (stages[index + 1].count / stage.count) * 100 * 10,
                      ) / 10
                    : undefined
            const dropoffPercentage =
                index < stages.length - 1
                    ? Math.round(
                          (1 - stages[index + 1].count / stage.count) *
                              100 *
                              10,
                      ) / 10
                    : undefined

            return {
                ...stage,
                percentage,
                conversionRate,
                dropoffPercentage,
            }
        }),
    }
}

const generateLeadSourcesData = () => {
    const sources = [
        { channel: 'Organic Search', signups: 450, paidConversions: 54 },
        { channel: 'LinkedIn Ads', signups: 280, paidConversions: 42 },
        { channel: 'Referrals', signups: 320, paidConversions: 38 },
        { channel: 'Content Marketing', signups: 210, paidConversions: 21 },
        { channel: 'Direct', signups: 180, paidConversions: 14 },
    ]

    const totalConversions = sources.reduce(
        (sum, s) => sum + s.paidConversions,
        0,
    )
    const totalSignups = sources.reduce((sum, s) => sum + s.signups, 0)
    const avgConversionRate = (totalConversions / totalSignups) * 100

    return {
        sources: sources.map((source) => {
            const conversionRate =
                (source.paidConversions / source.signups) * 100
            const roundedRate = Math.round(conversionRate * 10) / 10

            return {
                ...source,
                conversionRate: roundedRate,
                status:
                    roundedRate > avgConversionRate
                        ? 'above_average'
                        : roundedRate < avgConversionRate * 0.8
                          ? 'below_average'
                          : 'average',
            }
        }),
        avgConversionRate: Math.round(avgConversionRate * 10) / 10,
    }
}

export const generateAnalyticDashboardData = () => {
    return {
        arr: generateArrData(),
        channels: generateChannelsData(),
        cashRunway: generateCashRunwayData(),
        nrr: generateNrrData(),
        churn: generateChurnData(),
        plans: generatePlansData(),
        mrrWaterfall: generateMrrWaterfallData(),
        atRiskAccounts: generateAtRiskAccountsData(),
        platformStability: generatePlatformStabilityData(),
        ltvCac: generateLtvCacData(),
        trialFunnel: generateTrialFunnelData(),
        leadSources: generateLeadSourcesData(),
    }
}

export const analyticDashboardData = generateAnalyticDashboardData()
