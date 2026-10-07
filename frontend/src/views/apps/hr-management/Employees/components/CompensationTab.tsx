import Card from '@/components/ui/Card'
import StatisticCard from '@/components/shared/StatisticCard'
import IconFrame from '@/components/shared/IconFrame'
import formatCurrency from '@/utils/formatCurrency'
import {
    LiReceiptAdd,
    LiDollarCircle,
    LiMoneyRecive,
    LiGift,
    LiWalletAdd,
    LiMath,
} from '@/icons'
import dayjs from 'dayjs'
import type { Employee } from '../types'

type CompensationTabProps = {
    employee: Employee
}

const CompensationTab = ({ employee }: CompensationTabProps) => {
    const compensation = employee.compensation

    if (!compensation) {
        return null
    }

    const totalCompensation =
        compensation.baseSalary +
        (compensation.bonus || 0) +
        (compensation.allowances || 0)
    const netCompensation = totalCompensation - (compensation.deductions || 0)
    const currency = compensation.currency || 'USD'

    // Overview cards
    const overviewCards = [
        {
            id: 'total-annual',
            title: 'Total Annual',
            amount: totalCompensation,
            subtitle: `Effective from ${dayjs(compensation.effectiveDate).format('MMM DD, YYYY')}`,
            icon: LiReceiptAdd,
            gradient: 'from-primary to-primary-mild',
        },
        {
            id: 'net-annual',
            title: 'Net Annual',
            amount: netCompensation,
            subtitle: 'After deductions',
            icon: LiDollarCircle,
            gradient: 'from-success to-success-mild',
        },
    ]

    // Compensation breakdown items
    const compensationItems = [
        {
            id: 'base-salary',
            label: 'Base Salary',
            description: 'Annual base compensation',
            amount: compensation.baseSalary,
            icon: LiMoneyRecive,
            showMonthly: true,
            prefix: '',
        },
        {
            id: 'bonus',
            label: 'Annual Bonus',
            description: 'Performance-based bonus',
            amount: compensation.bonus || 0,
            icon: LiGift,
            showMonthly: false,
            prefix: '+',
            condition: compensation.bonus && compensation.bonus > 0,
        },
        {
            id: 'allowances',
            label: 'Allowances',
            description: 'Additional allowances',
            amount: compensation.allowances || 0,
            icon: LiWalletAdd,
            showMonthly: false,
            prefix: '+',
            condition: compensation.allowances && compensation.allowances > 0,
        },
        {
            id: 'deductions',
            label: 'Deductions',
            description: 'Tax and other deductions',
            amount: compensation.deductions || 0,
            icon: LiMath,
            showMonthly: false,
            prefix: '-',
            condition: compensation.deductions && compensation.deductions > 0,
        },
    ].filter((item) => item.condition !== false)

    return (
        <div className="py-4 space-y-4">
            {/* Compensation Overview */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {overviewCards.map((card) => {
                        const Icon = card.icon
                        return (
                            <StatisticCard key={card.id}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="heading-text">
                                        {card.title}
                                    </div>
                                    <Icon className="text-xl" />
                                </div>
                                <h5>{formatCurrency(card.amount, currency)}</h5>
                                <p className="text-xs">{card.subtitle}</p>
                            </StatisticCard>
                        )
                    })}
                </div>
            </div>

            <div>
                <Card
                    bodyClass="p-0 divide-y divide-gray-200 dark:divide-gray-700"
                    className="mt-2"
                >
                    {compensationItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.id}
                                className="flex justify-between items-center px-2 py-4"
                            >
                                <div className="flex items-center gap-2">
                                    <IconFrame size={32} variant="layered">
                                        <Icon className="text-base heading-text" />
                                    </IconFrame>
                                    <div>
                                        <div className="font-medium heading-text">
                                            {item.label}
                                        </div>
                                        <p className="text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-medium heading-text">
                                        {item.prefix}
                                        {formatCurrency(item.amount, currency)}
                                    </div>
                                    {item.showMonthly && (
                                        <div className="text-xs">
                                            {formatCurrency(
                                                item.amount / 12,
                                                currency,
                                            )}
                                            /month
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </Card>
            </div>
        </div>
    )
}

export default CompensationTab
