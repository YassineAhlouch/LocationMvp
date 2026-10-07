import { useEffect } from 'react'
import Drawer from '@/components/ui/Drawer'
import MarketList from './MarketList'
import MarketTrade from './MarketTrade'
import { useSpotTradingStore } from '../store/spotTradingStore'

interface SpotMarketDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const SpotMarketDrawer = ({ isOpen, onClose }: SpotMarketDrawerProps) => {
    const activePair = useSpotTradingStore((state) => state.activePair)

    // Auto-close drawer when pair changes (user selected a new pair)
    useEffect(() => {
        if (isOpen) {
            onClose()
        }
        // Only trigger on activePair change, not on isOpen change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePair])

    return (
        <Drawer
            isOpen={isOpen}
            width={330}
            placement="left"
            onClose={onClose}
            title="Markets"
        >
            <div className="flex flex-col h-full">
                <MarketList />
                <MarketTrade />
            </div>
        </Drawer>
    )
}

export default SpotMarketDrawer
