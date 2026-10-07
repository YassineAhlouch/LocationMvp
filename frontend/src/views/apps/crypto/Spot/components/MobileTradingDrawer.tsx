import Drawer from '@/components/ui/Drawer'
import TradingPanel from './TradingPanel'
import type { TradingSide } from '../types'

interface MobileTradingDrawerProps {
    isOpen: boolean
    side: TradingSide | null
    onClose: () => void
}

const MobileTradingDrawer = ({
    isOpen,
    side,
    onClose,
}: MobileTradingDrawerProps) => {
    return (
        <Drawer
            isOpen={isOpen}
            placement="bottom"
            height="auto"
            onClose={onClose}
            title={side === 'buy' ? 'Buy Order' : 'Sell Order'}
            bodyClass="max-h-[80vh] overflow-auto"
        >
            <TradingPanel defaultSide={side || 'buy'} singleSideMode />
        </Drawer>
    )
}

export default MobileTradingDrawer
