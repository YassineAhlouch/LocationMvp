import Tag from '@/components/ui/Tag'
import { LiArrowUp } from '@/icons'
import { ParametersListProps } from '../types'

const ParametersList = ({ parameters }: ParametersListProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatParameterValue = (key: string, value: any) => {
        if (typeof value === 'number') {
            if (
                key.toLowerCase().includes('rate') ||
                key.toLowerCase().includes('growth')
            ) {
                if (
                    key.toLowerCase().includes('churn') ||
                    key.toLowerCase().includes('downgrade')
                ) {
                    return (
                        <Tag className="bg-transparent text-error">
                            {value}%
                        </Tag>
                    )
                }

                return (
                    <Tag className="bg-transparent text-success">
                        <LiArrowUp />
                        <span>{value}%</span>
                    </Tag>
                )
            }
            if (
                key.toLowerCase().includes('mrr') ||
                key.toLowerCase().includes('revenue') ||
                key.toLowerCase().includes('churn')
            ) {
                return `$${value.toLocaleString()}`
            }
            return value.toLocaleString()
        }
        return value
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderParameterValue = (key: string, value: any) => {
        if (key === 'churnTrend') {
            const trendColors = {
                improving: 'text-success',
                stable: 'text-indigo-500',
                declining: 'text-error',
            }
            return (
                <span
                    className={`text-sm font-medium capitalize ${trendColors[value as keyof typeof trendColors] || ''}`}
                >
                    {value}
                </span>
            )
        }

        if (key === 'planMix' && typeof value === 'object') {
            return <></>
        }

        return (
            <span className="font-medium heading-text">
                {formatParameterValue(key, value)}
            </span>
        )
    }

    const getParameterLabel = (key: string) => {
        const labels: Record<string, string> = {
            startingMRR: 'Starting MRR',
            netNewMRR: 'Net New MRR',
            expansionMRR: 'Expansion MRR',
            growthType: 'Growth Type',
            revenueGrowth: 'Revenue Growth',
            revenueChurn: 'Revenue Churn',
            startingUsers: 'Starting Users',
            userGrowth: 'User Growth',
            userChurn: 'User Churn',
            currentRetention: 'Current Retention',
            targetRetention: 'Target Retention',
            churnTrend: 'Churn Trend',
            conversionRate: 'Conversion Rate',
            upgradeRate: 'Upgrade Rate',
            downgradeRate: 'Downgrade Rate',
            planMix: 'Plan Mix',
        }
        return (
            labels[key] ||
            key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())
        )
    }

    return (
        <div className="space-y-3">
            {Object.entries(parameters).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                    <span className="heading-text">
                        {getParameterLabel(key)}
                    </span>
                    {renderParameterValue(key, value)}
                </div>
            ))}
        </div>
    )
}

export default ParametersList
