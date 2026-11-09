import { useMemo } from 'react'
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import useDirection from '@/utils/hooks/useDirection'
import { money } from './shared'

/**
 * The stepped (step-after) financial chart shared by the dashboard's financial
 * overview card and the vehicle overview: monthly revenue versus expenses with
 * a lavender slice wherever expenses exceed revenue, a soft glow under each
 * line and a money axis that scales to the data. Colors are exported so the
 * surrounding cards keep their bars/legends in sync with the series.
 */

export const CHART_PURPLE = '#7C5CFC'
export const CHART_ORANGE = '#F97316'
const GRAY_TEXT = '#9CA3AF'

type TipEntry = { dataKey?: string | number; value?: number | string }
type TipProps = {
    active?: boolean
    payload?: TipEntry[]
    label?: string | number
    labels?: { revenue: string; expenses: string }
}

const ChartTip = ({ active, payload, label, labels }: TipProps) => {
    if (!active || !payload || payload.length === 0 || !labels) {
        return null
    }
    const get = (key: string) =>
        Number(payload.find((entry) => String(entry.dataKey) === key)?.value ?? NaN)
    const revenue = get('revenue')
    const expenses = get('expenses')
    return (
        <div className="rounded-lg px-3 py-2 text-xs shadow-md bg-gray-900/90 text-white backdrop-blur dark:bg-gray-900/95">
            <div className="mb-1 font-semibold">{label}</div>
            {Number.isFinite(expenses) && (
                <div className="flex items-center gap-2">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: CHART_PURPLE }}
                    />
                    {labels.expenses}: {money(expenses)}
                </div>
            )}
            {Number.isFinite(revenue) && (
                <div className="flex items-center gap-2">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: CHART_ORANGE }}
                    />
                    {labels.revenue}: {money(revenue)}
                </div>
            )}
        </div>
    )
}

/** Even, human step for the money axis (50k / 20k / 5k…). */
const niceStep = (max: number) => {
    if (!Number.isFinite(max) || max <= 0) return 10
    const raw = max / 5
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)))
    const normalized = raw / magnitude
    const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
    return factor * magnitude
}

export type FinancialChartData = {
    /** Pre-formatted month label ("Jan", "Feb"…). */
    month: string
    revenue: number
    expenses: number
}

type FinancialOverviewChartProps = {
    data: FinancialChartData[]
    height?: number
    /** Names shown in the tooltip (localize at the call site). */
    seriesLabels?: { revenue: string; expenses: string }
}

const FinancialOverviewChart = ({
    data,
    height = 190,
    seriesLabels = { revenue: 'Revenue', expenses: 'Expenses' },
}: FinancialOverviewChartProps) => {
    const [direction] = useDirection()

    const chartData = useMemo(
        () =>
            data.map((point) => ({
                ...point,
                aboveGap: Math.max(0, point.expenses - point.revenue),
            })),
        [data],
    )

    // Even ticks up to the loudest month (revenue or expenses).
    const axis = useMemo(() => {
        const max = Math.max(
            0,
            ...data.map((point) => point.revenue),
            ...data.map((point) => point.expenses),
        )
        const step = niceStep(max)
        const top = Math.ceil(max / step) * step
        const ticks: number[] = []
        for (let value = 0; value <= top; value += step) {
            ticks.push(value)
        }
        return { step, top, ticks }
    }, [data])

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart
                data={chartData}
                margin={{ top: 10, right: 4, left: -12, bottom: 0 }}
            >
                <XAxis
                    dataKey="month"
                    tick={{ fill: GRAY_TEXT, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tickMargin={10}
                />
                <YAxis
                    orientation={direction === 'rtl' ? 'right' : 'left'}
                    tick={{ fill: GRAY_TEXT, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    ticks={axis.ticks}
                    domain={[0, axis.top]}
                    tickFormatter={(value: number) => {
                        const thousands = value / 1000
                        return thousands >= 1 || value === 0
                            ? `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`
                            : `${Math.round(value)}`
                    }}
                    width={44}
                />
                {/* Soft glow duplicates under each line */}
                <Area
                    type="stepAfter"
                    dataKey="expenses"
                    stroke={CHART_PURPLE}
                    strokeWidth={7}
                    strokeOpacity={0.16}
                    fill="none"
                />
                <Area
                    type="stepAfter"
                    dataKey="revenue"
                    stroke={CHART_ORANGE}
                    strokeWidth={7}
                    strokeOpacity={0.16}
                    fill="none"
                />
                {/* Expenses: mauve fill, purple step line */}
                <Area
                    type="stepAfter"
                    dataKey="expenses"
                    stroke={CHART_PURPLE}
                    strokeWidth={2.5}
                    fill="#E8B4C0"
                    fillOpacity={0.35}
                />
                {/* Revenue: peach fill, orange step line, plus the
                    lavender slice where it sits below expenses */}
                <Area
                    type="stepAfter"
                    dataKey="revenue"
                    stackId="rev"
                    stroke={CHART_ORANGE}
                    strokeWidth={2.5}
                    fill={CHART_ORANGE}
                    fillOpacity={0.1}
                />
                <Area
                    type="stepAfter"
                    dataKey="aboveGap"
                    stackId="rev"
                    stroke="none"
                    fill="#EDE9FE"
                />
                <Tooltip
                    cursor={{
                        stroke: '#D1D5DB',
                        strokeDasharray: '4 4',
                    }}
                    content={<ChartTip labels={seriesLabels} />}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default FinancialOverviewChart
