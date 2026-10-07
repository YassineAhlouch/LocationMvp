import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router'

const General = lazy(() => import('./General'))
const TeamAccess = lazy(() => import('./TeamAccess'))
const Security = lazy(() => import('./Security'))
const ConnectedApps = lazy(() => import('./ConnectedApps'))
const Notification = lazy(() => import('./Notification'))
const BillingAndUsage = lazy(() => import('./BillingAndUsage'))
const AuditLog = lazy(() => import('./AuditLog'))

const SettingsContent = () => {
    return (
        <div className="pb-4 md:px-4 max-w-[900px] mx-auto flex-1">
            <Routes>
                <Route path="/general" element={<General />} />
                <Route path="/team-access" element={<TeamAccess />} />
                <Route path="/security" element={<Security />} />
                <Route path="/connected-apps" element={<ConnectedApps />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/billing" element={<BillingAndUsage />} />
                <Route path="/audit-log" element={<AuditLog />} />
                <Route
                    path="*"
                    element={
                        <Navigate
                            replace
                            to="/apps/projects/settings/general"
                        />
                    }
                />
            </Routes>
        </div>
    )
}

export default SettingsContent
