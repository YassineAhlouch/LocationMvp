import Checkbox from '@/components/ui/Checkbox'
import { useCrmDashboardStore } from '@/views/apps/customers/CrmDashboard/store/crmDashboardStore'

const ViewPreferences = () => {
    const { filters, setViewPreference } = useCrmDashboardStore()

    return (
        <div className="space-y-2">
            <div className="heading-text font-semibold">View Preferences</div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={
                            filters.viewPreferences.applyProbabilityWeighting
                        }
                        onChange={(checked) =>
                            setViewPreference(
                                'applyProbabilityWeighting',
                                checked,
                            )
                        }
                    >
                        <span>Apply Probability Weighting</span>
                    </Checkbox>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={filters.viewPreferences.highlightStalledDeals}
                        onChange={(checked) =>
                            setViewPreference('highlightStalledDeals', checked)
                        }
                    >
                        <span>Highlight Stalled Deals</span>
                    </Checkbox>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={filters.viewPreferences.currency === 'EUR'}
                        onChange={(checked) =>
                            setViewPreference(
                                'currency',
                                checked ? 'EUR' : 'USD',
                            )
                        }
                    >
                        <span>EUR Currency</span>
                    </Checkbox>
                </div>
            </div>
        </div>
    )
}

export default ViewPreferences
