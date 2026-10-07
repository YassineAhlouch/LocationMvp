import { useMemo } from 'react'
import { countryList } from '@/constants/countries.constant'
import type { InvoiceFormData } from '../types'

type InvoiceCustomerInfoProps = {
    data: InvoiceFormData
}

const InvoiceCustomerInfo = ({ data }: InvoiceCustomerInfoProps) => {
    const countryName = useMemo(() => {
        if (!data.billingAddress.country) return ''

        return (
            countryList.find(
                (country) => country.value === data.billingAddress.country,
            )?.label || ''
        )
    }, [data.billingAddress.country])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
                <h5 className="mb-3">Bill From:</h5>
                <div className="space-y-1">
                    <p className="font-medium">Theme Nate</p>
                    <p>123 Business Street</p>
                    <p>Business City, State 12345</p>
                    <p>Country</p>
                    <p>contact@yourcompany.com</p>
                    <p>+1 (555) 123-4567</p>
                </div>
            </div>
            <div>
                <h5 className="mb-3">Bill To:</h5>
                <div className="space-y-1">
                    {data.customerName ? (
                        <>
                            <p className="font-medium">{data.customerName}</p>
                            {data.customerEmail && <p>{data.customerEmail}</p>}
                            {data.customerPhone && <p>{data.customerPhone}</p>}
                            {data.billingAddress.addressLine1 && (
                                <div className="mt-2">
                                    <p>{data.billingAddress.addressLine1}</p>
                                    {data.billingAddress.addressLine2 && (
                                        <p>
                                            {data.billingAddress.addressLine2}
                                        </p>
                                    )}
                                    {data.billingAddress.city && (
                                        <p>
                                            {data.billingAddress.city}
                                            {data.billingAddress.state &&
                                                `, ${data.billingAddress.state}`}
                                            {data.billingAddress.postalCode &&
                                                ` ${data.billingAddress.postalCode}`}
                                        </p>
                                    )}
                                    {countryName && <p>{countryName}</p>}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-500 italic">
                            No customer selected
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InvoiceCustomerInfo
