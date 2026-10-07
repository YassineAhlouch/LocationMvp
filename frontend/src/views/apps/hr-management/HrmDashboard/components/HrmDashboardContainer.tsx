import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

type HrmDashboardContainerProps = {
    turnoverWidget: ReactNode
    jobLevelWidget: ReactNode
    payrollWidget: ReactNode
    employeeQualityWidget: ReactNode
    complianceWidget: ReactNode
    eventsWidget: ReactNode
}

const HrmDashboardContainer = ({
    turnoverWidget,
    jobLevelWidget,
    payrollWidget,
    employeeQualityWidget,
    complianceWidget,
    eventsWidget,
}: HrmDashboardContainerProps) => {
    return (
        <Container>
            <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-3 gap-4">
                    <div className="lg:col-span-7 xl:col-span-2">
                        {turnoverWidget}
                    </div>
                    <div className="lg:col-span-5 xl:col-span-1">
                        {jobLevelWidget}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {payrollWidget}
                            {employeeQualityWidget}
                        </div>
                        {complianceWidget}
                    </div>
                    <div className="lg:col-span-2 xl:col-span-1 min-w-0">
                        {eventsWidget}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default HrmDashboardContainer
