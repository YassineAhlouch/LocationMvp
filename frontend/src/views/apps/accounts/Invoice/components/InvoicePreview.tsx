import { memo } from 'react'
import InvoiceHeader from './InvoiceHeader'
import InvoiceCustomerInfo from './InvoiceCustomerInfo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceTotals from './InvoiceTotals'
import type { InvoicePreviewProps } from '../types'

const InvoicePreview = ({ data }: InvoicePreviewProps) => {
    return (
        <div className="border border-gray-200 dark:border-gray-800 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
                <InvoiceHeader data={data} />
                <InvoiceCustomerInfo data={data} />
                <InvoiceItemsTable data={data} />
                <InvoiceTotals data={data} />
            </div>
        </div>
    )
}

export default memo(InvoicePreview)
