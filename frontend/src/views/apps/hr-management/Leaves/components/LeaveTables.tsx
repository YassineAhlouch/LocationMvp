import { Tabs } from '@/components/ui'
import { useLeavesStore } from '../store/leavesStore'
import LeavesTable from './LeavesTable'
import RequestedTable from './RequestedTable'

const LeaveTables = () => {
    const { selectedTab, setSelectedTab } = useLeavesStore()

    const tabItems = [
        {
            key: 'leaves',
            label: 'Leaves',
            children: <LeavesTable />,
        },
        {
            key: 'requested',
            label: 'Requested',
            children: <RequestedTable />,
        },
    ]

    return (
        <div className="space-y-4">
            <Tabs
                value={selectedTab}
                onChange={(key) =>
                    setSelectedTab(key as 'leaves' | 'requested')
                }
            >
                <Tabs.TabList>
                    {tabItems.map((tab) => (
                        <Tabs.TabNav key={tab.key} value={tab.key}>
                            {tab.label}
                        </Tabs.TabNav>
                    ))}
                </Tabs.TabList>

                {tabItems.map((tab) => (
                    <Tabs.TabContent key={tab.key} value={tab.key}>
                        {tab.children}
                    </Tabs.TabContent>
                ))}
            </Tabs>
        </div>
    )
}

export default LeaveTables
