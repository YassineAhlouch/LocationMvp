import { memo } from 'react'
import formatCurrency from '@/utils/formatCurrency'
import type { InvoiceFormData } from '../types'

type InvoiceItemsTableProps = {
    data: InvoiceFormData
}

const InvoiceItemsTable = ({ data }: InvoiceItemsTableProps) => {
    const hasItems =
        data.items &&
        data.items.length > 0 &&
        data.items.some((item) => item.name)

    return (
        <div className="mb-8">
            <h5 className="mb-4">Items</h5>
            {hasItems ? (
                <div className="overflow-x-auto">
                    <table
                        className="w-full border-collapse"
                        role="table"
                        aria-label="Invoice items"
                    >
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th
                                    className="text-left py-3 px-2 font-semibold"
                                    scope="col"
                                >
                                    Description
                                </th>
                                <th
                                    className="text-center py-3 px-2 font-semibold w-20"
                                    scope="col"
                                >
                                    Qty
                                </th>
                                <th
                                    className="text-right py-3 px-2 font-semibold w-24"
                                    scope="col"
                                >
                                    Unit Price
                                </th>
                                <th
                                    className="text-right py-3 px-2 font-semibold w-24"
                                    scope="col"
                                >
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {data.items
                                .filter((item) => item.name)
                                .map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-2">
                                            <div className="font-medium heading-text">
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            {formatCurrency(
                                                item.unitPrice,
                                                data.currency,
                                            )}
                                        </td>
                                        <td className="py-4 px-2 text-right font-medium">
                                            {formatCurrency(
                                                item.total,
                                                data.currency,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p>No items added to this invoice yet.</p>
                </div>
            )}
        </div>
    )
}

export default memo(InvoiceItemsTable)
