import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { useCrmDashboardStore } from '@/views/apps/customers/CrmDashboard/store/crmDashboardStore'
import type { TimeHorizon } from '../types'

const TIME_HORIZONS: { value: TimeHorizon; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
]

const TimeHorizonFilter = () => {
    const { filters, setTimeHorizon } = useCrmDashboardStore()

    return (
        <div className="space-y-2">
            <div className="heading-text font-semibold">Time Horizon</div>
            <InputGroup className="flex">
                {TIME_HORIZONS.map((horizon) => (
                    <Button
                        key={horizon.value}
                        active={filters.timeHorizon === horizon.value}
                        className="flex-1"
                        onClick={() => setTimeHorizon(horizon.value)}
                    >
                        {horizon.label}
                    </Button>
                ))}
            </InputGroup>
        </div>
    )
}

export default TimeHorizonFilter
