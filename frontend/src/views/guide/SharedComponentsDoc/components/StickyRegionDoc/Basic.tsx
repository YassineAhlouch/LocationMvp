import StickyRegion from '@/components/shared/StickyRegion'

const Basic = () => {
    return (
        <div className="h-64 overflow-auto border border-gray-200 dark:border-gray-700 rounded">
            <div className="p-4">
                <p className="mb-4">
                    Scroll down to see the sticky header in action.
                </p>
                <StickyRegion className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                    <h5>Sticky Header</h5>
                </StickyRegion>
                <div className="space-y-4 mt-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <p
                            key={i}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                            Content item {i + 1}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Basic
