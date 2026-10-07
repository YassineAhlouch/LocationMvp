import Tabs from '@/components/ui/Tabs'
import useMarketData from '../hooks/useMarketData'
import { LiGlobal, LiStatusUp, LiBarChart } from '@/icons'
import type { MarketType } from '../types'

const { TabNav, TabList } = Tabs

const MarketTab = () => {
    const { activeTab, setActiveTab } = useMarketData()

    const tabs = [
        {
            value: 'all' as MarketType,
            label: 'All Markets',
            icon: <LiGlobal className="text-base" />,
        },
        {
            value: 'spot' as MarketType,
            label: 'Spot',
            icon: <LiStatusUp className="text-base" />,
        },
        {
            value: 'futures' as MarketType,
            label: 'Futures',
            icon: <LiBarChart className="text-base" />,
        },
    ]

    return (
        <Tabs
            value={activeTab}
            onChange={(val) => setActiveTab(val as MarketType)}
            variant="underline"
        >
            <TabList>
                {tabs.map((tab) => (
                    <TabNav
                        key={tab.value}
                        value={tab.value}
                        icon={tab.icon}
                        className="sm:px-4 px-2"
                    >
                        {tab.label}
                    </TabNav>
                ))}
            </TabList>
        </Tabs>
    )
}

export default MarketTab
