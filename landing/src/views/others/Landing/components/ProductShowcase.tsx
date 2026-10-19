import { TbCarSuv, TbChartBar } from 'react-icons/tb'
import type { LandingShowcase, LandingShowcaseStatus } from '../types'

const STATUS_STYLES: Record<LandingShowcaseStatus, string> = {
    confirmed:
        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    pickedUp:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    paid: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    pending:
        'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    returned:
        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300',
    available:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    onRent:
        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    maintenance:
        'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
}

const StatusPill = ({
    status,
    label,
}: {
    status: LandingShowcaseStatus
    label: string
}) => (
    <span
        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
        {label}
    </span>
)

const PanelHeader = ({
    eyebrow,
    title,
    badge,
}: {
    eyebrow: string
    title: string
    badge: string
}) => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {eyebrow}
            </p>
            <p className="mt-1 text-lg font-semibold heading-text">{title}</p>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {badge}
        </span>
    </div>
)

const Stat = ({
    label,
    value,
    hint,
}: {
    label: string
    value: string
    hint: string
}) => (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 text-lg font-semibold heading-text">{value}</p>
        <p className="text-xs text-emerald-600 dark:text-emerald-400">{hint}</p>
    </div>
)

const ReservationsPanel = ({ content }: { content: LandingShowcase }) => (
    <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8">
        <PanelHeader
            eyebrow={content.reservations.eyebrow}
            title={content.reservations.title}
            badge={content.reservations.badge}
        />
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="hidden grid-cols-12 gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-gray-400 sm:grid dark:border-gray-700 dark:bg-gray-800/60">
                <span className="col-span-3">
                    {content.reservations.columns.reference}
                </span>
                <span className="col-span-3">
                    {content.reservations.columns.customer}
                </span>
                <span className="col-span-3">
                    {content.reservations.columns.vehicle}
                </span>
                <span className="col-span-2">
                    {content.reservations.columns.dates}
                </span>
                <span className="col-span-1 text-end">
                    {content.reservations.columns.status}
                </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {content.reservations.rows.map((reservation) => (
                    <div
                        key={reservation.id}
                        className="grid grid-cols-1 gap-2 px-3 py-2.5 text-sm sm:grid-cols-12 sm:items-center"
                    >
                        <span className="col-span-3 font-medium heading-text">
                            {reservation.id}
                        </span>
                        <span className="col-span-3 text-gray-500 dark:text-gray-400">
                            {reservation.customer}
                        </span>
                        <span className="col-span-3 text-gray-500 dark:text-gray-400">
                            {reservation.vehicle}
                        </span>
                        <span className="col-span-2 text-gray-500 dark:text-gray-400">
                            {reservation.dates}
                        </span>
                        <span className="col-span-1 sm:text-end">
                            <StatusPill
                                status={reservation.status}
                                label={content.statuses[reservation.status]}
                            />
                        </span>
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-auto hidden grid-cols-3 gap-3 pt-4 sm:grid">
            {content.reservations.stats.map((stat) => (
                <Stat
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    hint={stat.hint}
                />
            ))}
        </div>
    </div>
)

const FleetPanel = ({ content }: { content: LandingShowcase }) => (
    <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8">
        <PanelHeader
            eyebrow={content.fleet.eyebrow}
            title={content.fleet.title}
            badge={content.fleet.badge}
        />
        <div className="mt-4 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            {content.fleet.items.map((vehicle) => (
                <div
                    key={vehicle.plate}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                            <TbCarSuv size={22} />
                        </div>
                        <StatusPill
                            status={vehicle.status}
                            label={content.statuses[vehicle.status]}
                        />
                    </div>
                    <p className="mt-3 font-semibold heading-text">
                        {vehicle.name}
                    </p>
                    <p className="text-xs text-gray-400">
                        {vehicle.plate} · {vehicle.fuel}
                    </p>
                    <div className="mt-3 flex items-end justify-between">
                        <span className="text-sm font-semibold heading-text">
                            {vehicle.rate}
                        </span>
                        <span className="text-xs text-gray-400">
                            {content.fleet.title}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

const PaymentsPanel = ({ content }: { content: LandingShowcase }) => (
    <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8">
        <PanelHeader
            eyebrow={content.payments.eyebrow}
            title={content.payments.title}
            badge={content.payments.badge}
        />
        <div className="mt-4 grid grid-cols-3 gap-3">
            {content.payments.stats.map((stat) => (
                <Stat
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    hint={stat.hint}
                />
            ))}
        </div>
        <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/60">
                <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {content.payments.columns.recent}
                </span>
                <span className="text-xs text-gray-400">
                    {content.payments.columns.period}
                </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {content.payments.rows.map((payment) => (
                    <div
                        key={payment.id}
                        className="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium heading-text">
                                {payment.customer}
                            </p>
                            <p className="text-xs text-gray-400">
                                {payment.id} · {payment.method}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold heading-text">
                                {payment.amount}
                            </span>
                            <StatusPill
                                status={payment.status}
                                label={content.statuses[payment.status]}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

const ReportsPanel = ({ content }: { content: LandingShowcase }) => (
    <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8">
        <PanelHeader
            eyebrow={content.reports.eyebrow}
            title={content.reports.title}
            badge={content.reports.badge}
        />
        <div className="mt-4 grid grid-cols-3 gap-3">
            {content.reports.stats.map((stat) => (
                <Stat
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    hint={stat.hint}
                />
            ))}
        </div>
        <div className="mt-4 flex flex-1 flex-col rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium heading-text">
                    {content.reports.chart.title}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <TbChartBar size={14} /> {content.reports.chart.trend}
                </span>
            </div>
            <div className="mt-4 flex flex-1 items-end gap-2 sm:gap-3">
                {content.reports.months.map((month, index) => (
                    <div
                        key={month}
                        className="flex flex-1 flex-col items-center gap-2"
                    >
                        <div className="flex h-full w-full items-end">
                            <div
                                className="w-full rounded-t-md bg-primary"
                                style={{ height: `${REPORT_BARS[index]}%` }}
                            />
                        </div>
                        <span className="text-[11px] text-gray-400">{month}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

const REPORT_BARS = [42, 58, 51, 74, 66, 88]

const ProductShowcase = ({
    tab,
    content,
}: {
    tab: string
    content: LandingShowcase
}) => {
    let panel = <ReservationsPanel content={content} />

    if (tab === 'fleet') {
        panel = <FleetPanel content={content} />
    } else if (tab === 'payments') {
        panel = <PaymentsPanel content={content} />
    } else if (tab === 'reports') {
        panel = <ReportsPanel content={content} />
    }

    return (
        <div className="h-full w-full overflow-auto bg-white dark:bg-gray-900">
            {panel}
        </div>
    )
}

export default ProductShowcase
