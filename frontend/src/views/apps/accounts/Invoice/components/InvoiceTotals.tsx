import { memo } from 'react'
import formatCurrency from '@/utils/formatCurrency'
import type { InvoiceFormData } from '../types'

type InvoiceTotalsProps = {
    data: InvoiceFormData
}

const InvoiceTotals = ({ data }: InvoiceTotalsProps) => {
    return (
        <div className="mb-8">
            <div className="flex justify-end">
                <div className="w-full max-w-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>
                                {formatCurrency(
                                    data.subtotal || 0,
                                    data.currency,
                                )}
                            </span>
                        </div>
                        {data.taxRate > 0 && (
                            <div className="flex justify-between py-2">
                                <span>Tax ({data.taxRate}%):</span>
                                <span>
                                    {formatCurrency(
                                        data.taxAmount || 0,
                                        data.currency,
                                    )}
                                </span>
                            </div>
                        )}
                        {data.discountValue > 0 && (
                            <div className="flex justify-between py-2">
                                <span>
                                    Discount (
                                    {data.discountType === 'percentage'
                                        ? `${data.discountValue}%`
                                        : 'Fixed'}
                                    ):
                                </span>
                                <span>
                                    -
                                    {formatCurrency(
                                        data.discountAmount || 0,
                                        data.currency,
                                    )}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between py-3 border-t border-gray-200 dark:border-gray-700 font-medium heading-text text-lg">
                            <span>Total:</span>
                            <span className="font-bold">
                                {formatCurrency(data.total || 0, data.currency)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {(data.notes || data.terms) && (
                <div className="mt-8 space-y-4">
                    {data.notes && (
                        <div>
                            <h5 className="heading-text mb-2">Notes:</h5>
                            <p className="text-sm">{data.notes}</p>
                        </div>
                    )}

                    {data.terms && (
                        <div>
                            <h5 className="heading-text mb-2">
                                Terms & Conditions:
                            </h5>
                            <p className="text-sm">{data.terms}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default memo(InvoiceTotals)
