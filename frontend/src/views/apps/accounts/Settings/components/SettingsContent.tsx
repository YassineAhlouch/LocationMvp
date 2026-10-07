import { lazy } from 'react'
import Container from '@/components/shared/Container'
import { Routes, Route, Navigate } from 'react-router'

const Profile = lazy(() => import('./Profile'))
const Appearance = lazy(() => import('./Appearance'))
const Security = lazy(() => import('./Security'))
const Notification = lazy(() => import('./Notification'))
const Billing = lazy(() => import('./Billing'))
const Integrations = lazy(() => import('./Integrations'))

const SettingsContent = () => {
    return (
        <Container size="md" className="p-4">
            <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/appearance" element={<Appearance />} />
                <Route path="/security" element={<Security />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route
                    path="*"
                    element={
                        <Navigate
                            replace
                            to="/apps/accounts/settings/profile"
                        />
                    }
                />
            </Routes>
        </Container>
    )
}

export default SettingsContent
