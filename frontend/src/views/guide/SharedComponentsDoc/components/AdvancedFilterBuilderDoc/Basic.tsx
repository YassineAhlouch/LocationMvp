import { useState } from 'react'
import AdvancedFilterBuilder from '@/components/shared/AdvancedFilterBuilder'
import type { FilterTree } from '@/components/shared/AdvancedFilterBuilder/types'

const Basic = () => {
    const [queryString, setQueryString] = useState('')
    const [filterTree, setFilterTree] = useState<FilterTree | null>(null)

    const handleApply = (tree: FilterTree, query: string) => {
        setQueryString(query)
        setFilterTree(tree)
    }

    const handleReset = () => {
        setQueryString('')
        setFilterTree(null)
    }

    return (
        <div className="w-full">
            <AdvancedFilterBuilder
                onApply={handleApply}
                onReset={handleReset}
            />
            {queryString && (
                <div className="mt-4 p-4 space-y-4">
                    <div>
                        <div className="heading-text font-medium mb-2">
                            Generated Query:
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <code className="text-xs break-all">
                                {queryString}
                            </code>
                        </div>
                    </div>
                    <div>
                        <div className="heading-text font-medium mb-2">
                            Filter Tree Object:
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <pre className="text-xs overflow-auto max-h-64">
                                {JSON.stringify(filterTree, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Basic
