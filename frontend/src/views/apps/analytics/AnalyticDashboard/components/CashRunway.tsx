import Card from '@/components/ui/Card'
import Divider from '@/components/shared/Divider'
import { BarChart } from '@/components/shared/Chart'
import { colors } from '@/constants/colors.constant'
import classNames from '@/utils/classNames'
import type { CashRunwayData } from '../types'

type CashRunwayProps = {
    data: CashRunwayData
}

const CashRunway = ({ data }: CashRunwayProps) => {
    const { cashOnHand, runway, cashChartData, runwayChartData } = data

    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`
        }
        return `${(value / 1000).toFixed(0)}k`
    }

    const formatShortCurrency = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`
        }
        return `${(value / 1000).toFixed(0)}k`
    }

    const formatRunway = (value: number) => {
        return value.toFixed(1)
    }

    const lastPeriodCash =
        cashChartData && cashChartData.length > 1
            ? cashChartData[cashChartData.length - 2].value
            : cashOnHand
    const cashChange = cashOnHand - lastPeriodCash
    const cashChangeFormatted = formatShortCurrency(Math.abs(cashChange))

    const lastPeriodRunway =
        runwayChartData && runwayChartData.length > 1
            ? runwayChartData[runwayChartData.length - 2].value
            : runway
    const runwayChange = runway - lastPeriodRunway
    const runwayChangeFormatted = Math.abs(runwayChange).toFixed(1)

    return (
        <Card bodyClass="flex flex-col gap-4 h-full">
            <div className="mb-4">
                <h5>Cash & Runway</h5>
            </div>

            <div className="flex flex-col justify-between flex-1">
                <div className="flex gap-4">
                    <div className="flex flex-col justify-center w-64 xl:w-40 2xl:w-64">
                        <h4>{formatCurrency(cashOnHand)}</h4>
                        <div className="mb-2">Cash on hand (7 days)</div>
                        <div>
                            Balance{' '}
                            {cashChange >= 0 ? 'increased' : 'decreased'} by{' '}
                            <span
                                className={classNames(
                                    'font-semibold',
                                    cashChange >= 0
                                        ? 'text-success'
                                        : 'text-error',
                                )}
                            >
                                {cashChangeFormatted}
                            </span>{' '}
                            this week compared to last week.
                        </div>
                    </div>

                    <div className="flex-1">
                        {cashChartData && cashChartData.length > 0 && (
                            <BarChart
                                data={cashChartData}
                                height={160}
                                barConfig={[
                                    {
                                        dataKey: 'value',
                                        radius: [4, 4, 0, 0],
                                        fill: colors.emerald.chart,
                                    },
                                ]}
                                xAxisConfig={{
                                    dataKey: 'label',
                                }}
                                yAxisConfig={{
                                    hide: true,
                                }}
                            />
                        )}
                    </div>
                </div>
                <Divider />
                <div className="flex gap-4">
                    <div className="flex flex-col justify-center w-64 xl:w-40 2xl:w-64">
                        <h4>{formatRunway(runway)}</h4>
                        <div className="mb-2">Months runway (7 days)</div>
                        <div>
                            Runway{' '}
                            {runwayChange >= 0 ? 'increased' : 'decreased'} by{' '}
                            <span
                                className={classNames(
                                    'font-semibold',
                                    runwayChange >= 0
                                        ? 'text-success'
                                        : 'text-error',
                                )}
                            >
                                {runwayChangeFormatted} months
                            </span>{' '}
                            this week compared to last week.
                        </div>
                    </div>

                    <div className="flex-1">
                        {runwayChartData && runwayChartData.length > 0 && (
                            <BarChart
                                data={runwayChartData}
                                height={160}
                                barConfig={[
                                    {
                                        dataKey: 'value',
                                        radius: [4, 4, 0, 0],
                                        fill: colors.cyan.chart,
                                    },
                                ]}
                                xAxisConfig={{
                                    dataKey: 'label',
                                }}
                                yAxisConfig={{
                                    hide: true,
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CashRunway
