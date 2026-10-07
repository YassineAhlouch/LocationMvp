import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { PieChart } from '@/components/shared/Chart'
import ImposibleCube from '@/components/svg/icons/ImposibleCube'
import ImposibleSphere from '@/components/svg/icons/ImposibleSphere'
import ImposibleTriangle from '@/components/svg/icons/ImposibleTriangle'
import { colors } from '@/constants/colors.constant'
import type { PlansData } from '../types'
import type { JSX } from 'react'

type RevenuePlanProps = {
    data: PlansData
}

const RevenuePlan = ({ data }: RevenuePlanProps) => {
    const { plans } = data

    const planIcon: {
        [key: string]: {
            icon: JSX.Element
            className: string
            chartColor: string
        }
    } = {
        Enterprise: {
            icon: (
                <ImposibleCube height={18} width={18} pathClass="stroke-10" />
            ),
            className: 'text-purple-500',
            chartColor: colors.purple.chart,
        },
        Pro: {
            icon: (
                <ImposibleTriangle
                    height={18}
                    width={18}
                    pathClass="stroke-10"
                />
            ),
            className: 'text-yellow-500',
            chartColor: colors.yellow.chart,
        },
        Starter: {
            icon: (
                <ImposibleSphere height={18} width={18} pathClass="stroke-10" />
            ),
            className: 'text-primary',
            chartColor: colors.blue.chart,
        },
    }

    const chartData = plans.map((plan) => ({
        name: plan.name,
        value: plan.revenuePercentage,
        fill: planIcon[plan.name]?.chartColor || colors.blue.chart,
        monthlyPrice: plan.monthlyPrice,
    }))

    return (
        <Card>
            <div className="mb-6">
                <h5>Revenue by Plan</h5>
            </div>

            <div className="mb-6">
                <PieChart
                    data={chartData}
                    height={240}
                    pieConfig={{
                        innerRadius: 70,
                        outerRadius: 90,
                        paddingAngle: 2,
                        dataKey: 'value',
                    }}
                    cellConfig={chartData.map((entry, index) => ({
                        key: `cell-${index}`,
                        fill: entry.fill,
                    }))}
                />
            </div>

            <Table hoverable={false} bordered={false} compact>
                <Table.THead>
                    <Table.Tr className="bg-transparent">
                        <Table.Th>Plan</Table.Th>
                        <Table.Th className="text-right">Revenue %</Table.Th>
                        <Table.Th className="text-right">Price</Table.Th>
                    </Table.Tr>
                </Table.THead>
                <Table.TBody>
                    {plans.map((plan, index) => (
                        <Table.Tr key={index}>
                            <Table.Td>
                                <div className="flex items-center gap-2 text-nowrap">
                                    <span
                                        className={
                                            planIcon[plan.name]?.className ||
                                            'text-primary'
                                        }
                                    >
                                        {planIcon[plan.name]?.icon ||
                                            planIcon['Starter'].icon}
                                    </span>
                                    <span className="font-medium heading-text">
                                        {plan.name}
                                    </span>
                                </div>
                            </Table.Td>
                            <Table.Td className="text-right">
                                <span className="heading-text font-medium">
                                    {plan.revenuePercentage}%
                                </span>
                            </Table.Td>
                            <Table.Td className="text-right">
                                <span className="heading-text font-medium">
                                    ${plan.monthlyPrice}/mo
                                </span>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.TBody>
            </Table>
        </Card>
    )
}

export default RevenuePlan
