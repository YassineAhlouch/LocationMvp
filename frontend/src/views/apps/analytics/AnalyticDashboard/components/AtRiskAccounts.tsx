import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import type { AtRiskAccountsData } from '../types'

type AtRiskAccountsProps = {
    data: AtRiskAccountsData
    isLoading?: boolean
}

const AtRiskAccounts = ({ data, isLoading }: AtRiskAccountsProps) => {
    if (isLoading) {
        return (
            <Card>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

    const { accounts } = data

    const formatCurrency = (value: number) => `${(value / 1000).toFixed(0)}k`

    return (
        <Card>
            <div className="mb-4">
                <h5>At Risk Accounts</h5>
            </div>
            <Table hoverable={false} bordered={false} compact>
                <Table.THead>
                    <Table.Tr className="bg-transparent">
                        <Table.Th>Customer</Table.Th>
                        <Table.Th className="text-right text-nowrap">
                            Health
                        </Table.Th>
                    </Table.Tr>
                </Table.THead>
                <Table.TBody>
                    {accounts.map((account) => {
                        const getStatusColors = () => {
                            if (account.riskLevel === 'critical') {
                                return 'bg-error'
                            } else if (account.riskLevel === 'warning') {
                                return 'bg-warning'
                            } else {
                                return 'bg-success'
                            }
                        }

                        const getStatusText = () => {
                            if (account.riskLevel === 'critical') {
                                return 'Critical'
                            } else if (account.riskLevel === 'warning') {
                                return 'At Risk'
                            } else {
                                return 'Active'
                            }
                        }

                        return (
                            <Table.Tr key={account.id}>
                                <Table.Td className="w-full">
                                    <div className="flex items-center gap-4 py-1">
                                        <img
                                            className="bg-transparent h-7"
                                            src={account.avatar}
                                            alt={account.companyName}
                                        />
                                        <div className="flex-1">
                                            <div className="heading-text font-medium">
                                                {account.companyName}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    ARR:{' '}
                                                    <span className="font-medium">
                                                        {formatCurrency(
                                                            account.arr,
                                                        )}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Table.Td>
                                <Table.Td className="text-right">
                                    <div className="text-right">
                                        <Tag className="bg-transparent gap-1">
                                            <Badge
                                                className={getStatusColors()}
                                            />
                                            <span>{getStatusText()}</span>
                                        </Tag>
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        )
                    })}
                </Table.TBody>
            </Table>
        </Card>
    )
}

export default AtRiskAccounts
