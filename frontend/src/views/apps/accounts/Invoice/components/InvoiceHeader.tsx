import { memo } from 'react'
import Logo from '@/components/template/Logo'
import { getCurrencyByCode } from '../utils'
import { useThemeStore } from '@/store/themeStore'
import dayjs from 'dayjs'
import type { InvoiceFormData } from '../types'

type InvoiceHeaderProps = {
    data: InvoiceFormData
}

const InvoiceHeader = ({ data }: InvoiceHeaderProps) => {
    const currency = getCurrencyByCode(data.currency)

    const mode = useThemeStore((state) => state.mode)

    return (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-start gap-8 mb-8">
            <div>
                <h3 className="mb-2">Invoice</h3>
                <div className="space-y-1">
                    <p>
                        <span className="font-medium">Invoice Number:</span>{' '}
                        {data.invoiceNumber || 'Not set'}
                    </p>
                    <p>
                        <span className="font-medium">Issue Date:</span>{' '}
                        {data.issueDate
                            ? dayjs(data.issueDate).format('MMMM DD YYYY')
                            : 'Not set'}
                    </p>
                    <p>
                        <span className="font-medium">Due Date:</span>{' '}
                        {data.dueDate
                            ? dayjs(data.dueDate).format('MMMM DD YYYY')
                            : 'Not set'}
                    </p>
                    <p>
                        <span className="font-medium">Currency:</span>{' '}
                        {currency.name} ({currency.code})
                    </p>
                </div>
            </div>
            <Logo logoWidth={120} mode={mode} />
        </div>
    )
}

export default memo(InvoiceHeader)
