import Button from '@/components/ui/Button'
import type { TradingSide } from '../types'

interface MobileTradingFooterProps {
    onTradeClick: (side: TradingSide) => void
}

const MobileTradingFooter = ({ onTradeClick }: MobileTradingFooterProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 lg:hidden">
            <div className="flex gap-3">
                <Button
                    className="flex-1 bg-success hover:bg-success/90 text-white"
                    variant="solid"
                    onClick={() => onTradeClick('buy')}
                >
                    Buy
                </Button>
                <Button
                    className="flex-1 bg-error hover:bg-error/90 text-white"
                    variant="solid"
                    onClick={() => onTradeClick('sell')}
                >
                    Sell
                </Button>
            </div>
        </div>
    )
}

export default MobileTradingFooter
