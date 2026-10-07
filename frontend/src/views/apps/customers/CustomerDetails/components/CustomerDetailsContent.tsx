import { lazy } from 'react'
import OverflowTabs from '@/components/shared/OverflowTabs'
import { Routes, Route, useNavigate } from 'react-router'
import type { KeyedMutator } from 'swr'
import type { Customer } from '../types'

const CustomerOverview = lazy(() => import('./CustomerOverview'))
const CustomerActivity = lazy(() => import('./CustomerActivity'))
const CustomerDeals = lazy(() => import('./CustomerDeals'))
const CustomerDocuments = lazy(() => import('./CustomerDocuments'))

type CustomerDetailsContentProps = {
    customerId: string
    path: string
    data: Customer
    mutate: KeyedMutator<Customer>
}

const CustomerDetailsContent = ({
    customerId,
    path,
    data,
    mutate,
}: CustomerDetailsContentProps) => {
    const navigate = useNavigate()

    const handleTabChange = (tab: string) => {
        navigate(`/apps/customers/${customerId}/${tab}`)
    }

    const tabList = [
        { label: 'Overview', value: 'overview' },
        { label: 'Activity', value: 'activity' },
        { label: 'Deals', value: 'deals' },
        { label: 'Documents', value: 'documents' },
    ]

    return (
        <div className="w-full flex-1">
            <OverflowTabs
                tabList={tabList}
                value={path}
                onChange={handleTabChange}
            />
            <div className="mt-4 h-full">
                <Routes>
                    <Route
                        path="/overview"
                        element={
                            <CustomerOverview data={data} mutate={mutate} />
                        }
                    />
                    <Route
                        path="/activity"
                        element={<CustomerActivity customerId={customerId} />}
                    />
                    <Route
                        path="/deals"
                        element={<CustomerDeals customerId={customerId} />}
                    />
                    <Route
                        path="/documents"
                        element={<CustomerDocuments customerId={customerId} />}
                    />
                </Routes>
            </div>
        </div>
    )
}

export default CustomerDetailsContent
