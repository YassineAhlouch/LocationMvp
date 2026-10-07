import Checkbox from '@/components/ui/Checkbox'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useCrmDashboardStore } from '@/views/apps/customers/CrmDashboard/store/crmDashboardStore'
import type { PipelineStages } from '../types'

const PIPELINE_STAGES: {
    key: keyof PipelineStages
    label: string
    color: string
}[] = [
    { key: 'prospecting', label: 'Prospecting', color: '#9ca3af' },
    { key: 'qualified', label: 'Qualified', color: '#286cf0' },
    { key: 'negotiation', label: 'Negotiation', color: '#3380fa' },
    { key: 'closedWon', label: 'Closed Won', color: '#00a85b' },
]

const PipelineSegmentation = () => {
    const { filters, togglePipelineStage } = useCrmDashboardStore()

    const handleToggle = (key: keyof PipelineStages) => {
        const selectedCount = Object.values(filters.pipelineStages).filter(
            Boolean,
        ).length

        if (filters.pipelineStages[key] && selectedCount <= 2) {
            toast.push(
                <Notification
                    type="warning"
                    title="Minimum Selection Required"
                    duration={3000}
                >
                    At least 2 pipeline stages must be selected
                </Notification>,
            )
            return
        }

        togglePipelineStage(key)
    }

    return (
        <div className="space-y-2">
            <div className="heading-text font-semibold">Pipeline Stages</div>

            <div className="space-y-2">
                {PIPELINE_STAGES.map((stage) => (
                    <div key={stage.key} className="flex items-center gap-2">
                        <Checkbox
                            checked={filters.pipelineStages[stage.key]}
                            onChange={() => handleToggle(stage.key)}
                        >
                            <span>{stage.label}</span>
                        </Checkbox>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PipelineSegmentation
