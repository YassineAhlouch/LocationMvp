import PayrollChart from './PayrollChart'
import TotalPaidCard from './TotalPaidCard'
import { colors } from '@/constants/colors.constant'
import type {
    PayrollChartData,
    PayrollMetrics as PayrollMetricsType,
} from '../types'

interface PayrollMetricsProps {
    metrics?: PayrollMetricsType | null
    loading?: boolean
}

const PayrollMetrics = ({
    metrics = null,
    loading = false,
}: PayrollMetricsProps) => {
    const chartData: PayrollChartData = metrics
        ? [
              {
                  name: 'Base Salary',
                  value: metrics.breakdown.baseSalary,
                  percentage: Math.round(
                      (metrics.breakdown.baseSalary /
                          (metrics.totalPaid + metrics.breakdown.deductions)) *
                          100,
                  ),
                  color: colors.blue.chart,
              },
              {
                  name: 'Bonuses',
                  value: metrics.breakdown.bonuses,
                  percentage: Math.round(
                      (metrics.breakdown.bonuses /
                          (metrics.totalPaid + metrics.breakdown.deductions)) *
                          100,
                  ),
                  color: colors.emerald.chart,
              },
              {
                  name: 'Overtime',
                  value: metrics.breakdown.overtime,
                  percentage: Math.round(
                      (metrics.breakdown.overtime /
                          (metrics.totalPaid + metrics.breakdown.deductions)) *
                          100,
                  ),
                  color: colors.yellow.chart,
              },
              {
                  name: 'Allowances',
                  value: metrics.breakdown.allowances,
                  percentage: Math.round(
                      (metrics.breakdown.allowances /
                          (metrics.totalPaid + metrics.breakdown.deductions)) *
                          100,
                  ),
                  color: colors.purple.chart,
              },
              {
                  name: 'Deductions',
                  value: metrics.breakdown.deductions,
                  percentage: Math.round(
                      (metrics.breakdown.deductions /
                          (metrics.totalPaid + metrics.breakdown.deductions)) *
                          100,
                  ),
                  color: colors.red.chart,
              },
          ]
        : []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <PayrollChart data={chartData} loading={loading} />
            <TotalPaidCard
                totalAmount={metrics?.totalPaid || 0}
                breakdown={
                    metrics?.summary || {
                        deductions: 0,
                        extras: 0,
                        retentions: 0,
                        additions: 0,
                    }
                }
                loading={loading}
            />
        </div>
    )
}

export default PayrollMetrics
