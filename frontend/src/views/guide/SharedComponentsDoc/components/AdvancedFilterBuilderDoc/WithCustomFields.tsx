import { useState } from 'react'
import AdvancedFilterBuilder from '@/components/shared/AdvancedFilterBuilder'
import type {
    FilterTree,
    FieldConfig,
} from '@/components/shared/AdvancedFilterBuilder/types'

const customFields: FieldConfig[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'age', label: 'Age', type: 'number' },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' },
        ],
    },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
]

const WithCustomFields = () => {
    const [queryString, setQueryString] = useState('')

    const handleApply = (_tree: FilterTree, query: string) => {
        setQueryString(query)
    }

    return (
        <div className="w-full">
            <AdvancedFilterBuilder
                fields={customFields}
                onApply={handleApply}
            />
            {queryString && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-sm font-medium mb-2">Generated Query:</p>
                    <code className="text-xs break-all">{queryString}</code>
                </div>
            )}
        </div>
    )
}

export default WithCustomFields
