import { useState } from 'react'
import OverflowTabs from '@/components/shared/OverflowTabs'

const tabList = [
    { label: 'Overview', value: 'overview' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Reports', value: 'reports' },
    { label: 'Notifications', value: 'notifications' },
    { label: 'Settings', value: 'settings' },
    { label: 'Integrations', value: 'integrations' },
    { label: 'Security', value: 'security' },
    { label: 'Billing', value: 'billing' },
]

const Example = () => {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="w-full">
            <OverflowTabs
                tabList={tabList}
                value={activeTab}
                onChange={setActiveTab}
            />
            <div className="p-4">
                <p>Active tab: {activeTab}</p>
            </div>
        </div>
    )
}

export default Example
