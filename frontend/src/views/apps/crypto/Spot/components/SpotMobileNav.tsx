import classNames from '@/utils/classNames'
import { useSpotTradingStore, type MobileTab } from '../store/spotTradingStore'

// Reduced tabs - Trade is now in bottom drawer, Orders always visible
const tabs: { id: MobileTab; label: string }[] = [
    { id: 'chart', label: 'Chart' },
    { id: 'book', label: 'Book' },
]

const SpotMobileNav = () => {
    const activeTab = useSpotTradingStore((state) => state.mobileActiveTab)
    const setActiveTab = useSpotTradingStore(
        (state) => state.setMobileActiveTab,
    )

    return (
        <div
            className="sticky top-0 z-10 flex bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
            role="tablist"
            aria-label="Mobile navigation"
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    className={classNames(
                        'flex-1 py-3 text-center text-sm font-medium transition-colors',
                        activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                    )}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export default SpotMobileNav
