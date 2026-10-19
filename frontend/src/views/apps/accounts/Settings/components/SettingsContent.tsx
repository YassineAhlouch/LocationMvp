import { lazy } from 'react'
import Container from '@/components/shared/Container'
import { Routes, Route, Navigate } from 'react-router'

const Profile = lazy(() => import('./Profile'))
const Security = lazy(() => import('./Security'))

const SettingsContent = () => {
    return (
        <Container size="md" className="p-4">
            <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/security" element={<Security />} />
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
