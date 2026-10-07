import { useState } from 'react'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import useCrmDashboard from './hooks/useCrmDashboard'
import CrmDashboardContent from './components/CrmDashboardContent'
import ConfigurationPanel from './components/ConfigurationPanel'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiSetting4 } from '@/icons'

const CrmDashboard = () => {
    const { dashboardData, isLoading } = useCrmDashboard()
    const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false)

    const { larger, smaller } = useResponsive()

    return (
        <div className="h-full">
            <Container className="h-full p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4>CRM Dashboard</h4>
                        <p>Real-time insights into sales and summary</p>
                    </div>
                    {larger.lg && (
                        <Button
                            icon={<LiSetting4 />}
                            onClick={() => setIsConfigDrawerOpen(true)}
                        >
                            Configure
                        </Button>
                    )}
                    {smaller.lg && (
                        <Button
                            icon={<LiSetting4 />}
                            onClick={() => setIsConfigDrawerOpen(true)}
                        />
                    )}
                </div>
                <CrmDashboardContent
                    data={dashboardData}
                    isLoading={isLoading}
                />
            </Container>

            <Drawer
                title="Configuration"
                isOpen={isConfigDrawerOpen}
                onClose={() => setIsConfigDrawerOpen(false)}
                placement="right"
                bodyClass="p-0"
            >
                <ConfigurationPanel />
            </Drawer>
        </div>
    )
}

export default CrmDashboard
