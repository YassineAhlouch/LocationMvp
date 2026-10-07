import { useState } from 'react'
import StickyRegion from '@/components/shared/StickyRegion'

const WithOffset = () => {
    const [isSticky, setIsSticky] = useState(false)

    return (
        <div className="h-64 overflow-auto border border-gray-200 dark:border-gray-700 rounded">
            <div className="p-4">
                <p className="mb-4">
                    This sticky region has a custom offset and callback.
                </p>
                <StickyRegion
                    offsetTop={10}
                    shadow={true}
                    onStickyChange={setIsSticky}
                    className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800"
                    stickyClassName="rounded-b"
                >
                    <h5>{isSticky ? 'Now Sticky!' : 'Not Sticky Yet'}</h5>
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

export default WithOffset
