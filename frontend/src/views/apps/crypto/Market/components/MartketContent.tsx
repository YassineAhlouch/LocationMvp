import { useMemo } from 'react'
import MarketTableSpot from './MarketTableSpot'
import MarketTableFutures from './MarketTableFutures'
import MarketTableAll from './MarketTableAll'
import useMarketData from '../hooks/useMarketData'

const MarketContent = () => {
    const { activeTab } = useMarketData()

    // Render the appropriate table component based on active tab
    const renderTable = useMemo(() => {
        switch (activeTab) {
            case 'all':
                return <MarketTableAll />
            case 'spot':
                return <MarketTableSpot />
            case 'futures':
                return <MarketTableFutures />
            default:
                return <MarketTableAll />
        }
    }, [activeTab])

    return <div className="flex flex-col gap-4">{renderTable}</div>
}

export default MarketContent
