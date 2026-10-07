import { PrimaryMetricProps } from '../types'

const PrimaryMetric = ({
    value,
    label,
    format = 'number',
}: PrimaryMetricProps) => {
    const formatValue = (val: number | undefined) => {
        if (val === undefined) return '---'

        switch (format) {
            case 'currency':
                return `$${val.toLocaleString()}`
            case 'percentage':
                return `${val}%`
            case 'number':
            default:
                return val.toLocaleString()
        }
    }

    return (
        <div
            className="space-y-1"
            role="region"
            aria-labelledby={`metric-${label.replace(/\s+/g, '-').toLowerCase()}`}
        >
            <h4
                aria-label={`${label}: ${formatValue(value)}`}
                role="text"
                tabIndex={0}
            >
                {formatValue(value)}
            </h4>
            <div id={`metric-${label.replace(/\s+/g, '-').toLowerCase()}`}>
                {label}
            </div>
        </div>
    )
}

export default PrimaryMetric
