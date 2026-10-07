import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import formatCurrencyCompact from '@/utils/formatCurrencyCompact'
import type { ChurnData } from '../types'

type ChurnMetricsProps = {
    data: ChurnData
}

const { Tr, Th, Td, THead, TBody } = Table

const ChurnMetrics = ({ data }: ChurnMetricsProps) => {
    const {
        logoChurn,
        revenueChurn,
        logoChurnChange,
        revenueChurnChange,
        churnDrivers,
    } = data

    return (
        <Card>
            <div className="mb-6">
                <h5>Churn Metrics</h5>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <div className="mb-2 font-medium">Logo Churn %</div>
                    <h4 className="mb-1">{logoChurn.toFixed(1)}%</h4>
                    <div className="flex flex-wrap items-center gap-1">
                        {logoChurnChange !== undefined && (
                            <GrowShrinkTag value={logoChurnChange} suffix="%" />
                        )}
                        <span>vs. Last Month</span>
                    </div>
                </div>

                <div>
                    <div className="mb-2 font-medium">Revenue Churn %</div>
                    <h4 className="mb-1">{revenueChurn.toFixed(1)}%</h4>
                    <div className="flex flex-wrap items-center gap-1">
                        {revenueChurnChange !== undefined && (
                            <GrowShrinkTag
                                value={revenueChurnChange}
                                suffix="%"
                            />
                        )}
                        <span>vs. Last Month</span>
                    </div>
                </div>
            </div>

            {churnDrivers && churnDrivers.length > 0 && (
                <div>
                    <h6 className="mb-4">Top Churn Drivers</h6>

                    <Table hoverable={false} bordered={false} compact>
                        <THead>
                            <Tr className="bg-transparent">
                                <Th>Reason</Th>
                                <Th className="text-right">Lost MRR</Th>
                                <Th className="text-right">Churn %</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {churnDrivers.map((driver, index) => (
                                <Tr key={index}>
                                    <Td className="heading-text">
                                        {driver.reason}
                                    </Td>
                                    <Td className="text-right font-medium heading-text">
                                        -{formatCurrencyCompact(driver.lostMrr)}
                                    </Td>
                                    <Td className="text-right font-medium heading-text">
                                        {driver.percentageOfTotal}%
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </div>
            )}
        </Card>
    )
}

export default ChurnMetrics
