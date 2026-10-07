import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import OpenOrdersTable from './OpenOrdersTable'
import OrderHistoryTable from './OrderHistoryTable'
import TradeHistoryTable from './TradeHistoryTable'
import type { OrdersPanelTab } from '../types'

const OrdersPanel = () => {
    const [activeTab, setActiveTab] = useState<OrdersPanelTab>('open')

    return (
        <div className="min-h-100">
            <Tabs
                value={activeTab}
                onChange={(tab) => setActiveTab(tab as OrdersPanelTab)}
            >
                <Tabs.TabList>
                    <Tabs.TabNav
                        value="open"
                        className="text-xs sm:text-sm px-2 sm:px-4"
                    >
                        Open Orders
                    </Tabs.TabNav>
                    <Tabs.TabNav
                        value="history"
                        className="text-xs sm:text-sm px-2 sm:px-4"
                    >
                        Order History
                    </Tabs.TabNav>
                    <Tabs.TabNav
                        value="trades"
                        className="text-xs sm:text-sm px-2 sm:px-4"
                    >
                        Trade History
                    </Tabs.TabNav>
                </Tabs.TabList>
            </Tabs>

            <div className="flex-1 overflow-hidden">
                {activeTab === 'open' && <OpenOrdersTable />}
                {activeTab === 'history' && <OrderHistoryTable />}
                {activeTab === 'trades' && <TradeHistoryTable />}
            </div>
        </div>
    )
}

export default OrdersPanel
