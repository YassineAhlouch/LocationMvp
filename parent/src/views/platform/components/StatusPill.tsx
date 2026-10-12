type StatusPillProps = {
    active: boolean
    activeLabel?: string
    inactiveLabel?: string
}

const StatusPill = ({
    active,
    activeLabel = 'Active',
    inactiveLabel = 'Inactive',
}: StatusPillProps) => {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                active
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200'
            }`}
        >
            {active ? activeLabel : inactiveLabel}
        </span>
    )
}

export default StatusPill
