import { lazy } from 'react'
import OverflowTabs from '@/components/shared/OverflowTabs'
import Loading from '@/components/shared/Loading'
import { Routes, Route, useNavigate } from 'react-router'
import type { Lead } from '../types'

const LeadOverview = lazy(() => import('./LeadOverview'))
const LeadDeals = lazy(() => import('./LeadDeals'))
const LeadNotes = lazy(() => import('./LeadNotes'))
const LeadActivity = lazy(() => import('./LeadActivity'))

const tabList = [
    { label: 'Overview', value: 'overview' },
    { label: 'Deals', value: 'deals' },
    { label: 'Notes', value: 'notes' },
    { label: 'Activity', value: 'activity' },
]

type LeadTabsProps = {
    data?: Lead
    isLoading: boolean
    leadId: string
    path: string
}

const LeadTabs = ({ data, isLoading, leadId, path }: LeadTabsProps) => {
    const navigate = useNavigate()

    const handleTabChange = (tab: string) => {
        navigate(`/apps/customers/leads/${leadId}/${tab}`)
    }

    return (
        <Loading loading={isLoading}>
            <OverflowTabs
                tabList={tabList}
                value={path}
                onChange={handleTabChange}
            />
            <div className="mt-4">
                <Routes>
                    <Route
                        path="/overview"
                        element={<LeadOverview data={data} />}
                    />
                    <Route
                        path="/deals"
                        element={<LeadDeals leadId={leadId} />}
                    />
                    <Route
                        path="/activity"
                        element={<LeadActivity leadId={leadId} />}
                    />
                    <Route
                        path="/notes"
                        element={<LeadNotes leadId={leadId} />}
                    />
                </Routes>
            </div>
        </Loading>
    )
}

export default LeadTabs
