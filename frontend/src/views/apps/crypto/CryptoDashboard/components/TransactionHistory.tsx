import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import {
    LiSwapHorizontal,
    LiShoppingCart,
    LiMoneyRecive,
    LiMoneySend,
} from '@/icons'
import classNames from '@/utils/classNames'
import type { DashboardTransaction } from '../types'

type TransactionHistoryProps = {
    transactions: DashboardTransaction[]
}

const typeConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
> = {
    receive: {
        label: 'Receive',
        color: `text-success`,
        icon: <LiMoneyRecive />,
    },
    send: { label: 'Send', color: `text-error`, icon: <LiMoneySend /> },
    sell: { label: 'Sell', color: `text-primary`, icon: <LiSwapHorizontal /> },
    buy: { label: 'Buy', color: `text-primary`, icon: <LiShoppingCart /> },
}

const TransactionItem = ({
    transaction,
}: {
    transaction: DashboardTransaction
}) => {
    const config = typeConfig[transaction.type] || {
        label: transaction.type,
        color: '',
        icon: null,
    }
    const isPositive =
        transaction.type === 'receive' || transaction.type === 'buy'

    return (
        <div className="flex items-center justify-between py-2.25">
            <div className="flex items-center gap-2">
                <div
                    className={classNames(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-lg border border-gray-200 dark:border-gray-700',
                        config.color,
                    )}
                >
                    <span>{config.icon}</span>
                </div>
                <div>
                    <div className="font-medium heading-text flex flex-col">
                        <span className="flex items-center gap-2">
                            {/* <img 
                                src={transaction.assetIcon}
                                alt={transaction.assetName}
                                className="w-6 h-6"
                            /> */}
                            {config.label} {transaction.assetName}
                        </span>
                        <div></div>
                    </div>
                </div>
            </div>
            <div className="ltr:text-right rtl:text-left">
                <div className={classNames('font-medium heading-text')}>
                    {isPositive ? '+' : '-'}
                    {transaction.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                    })}{' '}
                    {transaction.assetSymbol}
                </div>
                <div className="text-xs">{transaction.date}</div>
            </div>
        </div>
    )
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
    const navigate = useNavigate()

    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
    }, [transactions])

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h5>Recent Transactions</h5>
                <Button onClick={() => navigate('/apps/crypto/assets')}>
                    View All
                </Button>
            </div>
            <div>
                {recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                        No recent transactions
                    </div>
                ) : (
                    recentTransactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                        />
                    ))
                )}
            </div>
        </Card>
    )
}

export default TransactionHistory
