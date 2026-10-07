import Card from '@/components/ui/Card'
import { PieChart } from '@/components/shared/Chart'
import Table from '@/components/ui/Table'
import { colors } from '@/constants/colors.constant'
import type { CommonProps } from '@/components/ui/@types/common'

const { Tr, Th, Td, THead, TBody } = Table

export type CategorySalesData = {
    name: string
    value: number
    color?: string
}

type TopSellingCategoriesProps = CommonProps & {
    data: CategorySalesData[]
    loading?: boolean
}

const getCategoryColor = (index: number) => {
    const categoryColors = [
        colors.blue.chart,
        colors.cyan.chart,
        colors.emerald.chart,
        colors.purple.chart,
    ]
    return categoryColors[index % categoryColors.length]
}

const TopSellingCategories = ({
    data,
    className,
}: TopSellingCategoriesProps) => {
    const getCategoryRevenue = (name: string, sales: number) => {
        const avgPrices: Record<string, number> = {
            electronics: 450,
            watches: 320,
            gadgets: 65,
            others: 150,
        }
        return sales * (avgPrices[name.toLowerCase()] || 100)
    }

    const dataWithColors = data.map((item, index) => ({
        ...item,
        color: item.color || getCategoryColor(index),
    }))

    return (
        <Card className={className} bodyClass="flex flex-col h-full">
            <div className="mb-4">
                <h5>Top Selling Categories</h5>
            </div>

            <div className="flex justify-center mb-4">
                <PieChart
                    data={dataWithColors.map((item) => ({
                        name: item.name,
                        value: item.value,
                    }))}
                    height={200}
                    pieConfig={{
                        dataKey: 'value',
                        nameKey: 'name',
                        cx: '50%',
                        cy: '50%',
                        innerRadius: 65,
                        outerRadius: 85,
                        paddingAngle: 2,
                        cornerRadius: 4,
                    }}
                    cellConfig={dataWithColors.map((item) => ({
                        fill: item.color,
                    }))}
                />
            </div>

            <div className="flex-1">
                <Table compact overflow={false} hoverable={false}>
                    <THead>
                        <Tr className="bg-transparent">
                            <Th>Category</Th>
                            <Th className="text-right">Sales</Th>
                            <Th className="text-right">Revenue</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {dataWithColors.map((item, index) => (
                            <Tr key={index}>
                                <Td>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                        <span className="font-medium capitalize">
                                            {item.name}
                                        </span>
                                    </div>
                                </Td>
                                <Td className="text-right">
                                    <span className="font-medium heading-text">
                                        {item.value.toLocaleString()}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <span className="font-medium heading-text">
                                        $
                                        {getCategoryRevenue(
                                            item.name,
                                            item.value,
                                        ).toLocaleString()}
                                    </span>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
        </Card>
    )
}

export default TopSellingCategories
