import Collapsible from '@/components/ui/Collapsible'
import Skeleton from '@/components/ui/Skeleton'
import Avatar from '@/components/ui/Avatar'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import { apiGetOrder } from '@/services/SalesService'
import useResponsive from '@/utils/hooks/useResponsive'
import {
    LiChevronLeft,
    LiBox,
    LiPhone,
    LiTruck,
    LiDollarCircle,
    LiDownload,
    LiPrinter,
    LiMail,
} from '@/icons'
import { NumericFormat } from 'react-number-format'
import useSWR from 'swr'
import type { GetOrderDetailsResponse } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

type Address = {
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postalCode: string
    country: string
}

type ExpandableOrderDetailsProps = {
    orderId: string
    expand: boolean
    onExpand: () => void
}

const formatAddress = (address: Address): string => {
    const parts = [
        address.addressLine1,
        address.addressLine2,
        `${address.city}, ${address.state} ${address.postalCode}`,
        address.country,
    ].filter(Boolean)

    return parts.join('\n')
}

const ExpandableOrderDetails = ({
    orderId,
    expand,
    onExpand,
}: ExpandableOrderDetailsProps) => {
    const { data, isLoading } = useSWR(
        orderId ? `/api/orders/${orderId}` : null,
        () =>
            apiGetOrder<GetOrderDetailsResponse, { id: string }>({
                id: orderId,
            }),
    )

    const { larger } = useResponsive()

    const handleDownload = () => {
        if (!data) return
        const orderData = {
            orderId: data.id,
            customer: data.customer,
            date: data.date,
            items: data.products,
            total: data.paymentSummary?.total,
        }

        const dataStr = JSON.stringify(orderData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Order-${data.id}-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <Collapsible open={expand}>
            <div
                className="flex justify-between px-4 py-2.5 group cursor-pointer"
                role="toggle"
                onClick={onExpand}
            >
                <span className="heading-text font-medium group-hover:text-primary">
                    {expand ? 'Hide Details' : 'Show Details'}
                </span>
                <LiChevronLeft
                    className={`text-lg transition-transform group-hover:text-primary ${expand ? '-rotate-90' : ''}`}
                />
            </div>
            <Collapsible.Content>
                <div>
                    {isLoading && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-3/4" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {data && !isLoading && (
                        <div className="p-4 space-y-8">
                            <div className="flex justify-end items-center mb-6 print:hidden">
                                <Tooltip title="Download Order Details">
                                    <Button
                                        size="sm"
                                        variant="link"
                                        icon={
                                            <LiDownload className="text-lg" />
                                        }
                                        onClick={handleDownload}
                                    />
                                </Tooltip>
                                <Tooltip title="Print Order Details">
                                    <Button
                                        size="sm"
                                        variant="link"
                                        icon={<LiPrinter className="text-lg" />}
                                        onClick={handlePrint}
                                    />
                                </Tooltip>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="font-semibold heading-text uppercase tracking-wide">
                                        Contact Information
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <div className="flex items-center gap-2">
                                                <LiMail className="text-base" />
                                                <span className="font-medium">
                                                    Email Address:
                                                </span>
                                            </div>
                                            <span className="heading-text font-medium sm:ml-0 ml-6">
                                                {data.customer.email}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <div className="flex items-center gap-2">
                                                <LiPhone className="text-base" />
                                                <span className="font-medium">
                                                    Phone Number:
                                                </span>
                                            </div>
                                            <span className="heading-text font-medium sm:ml-0 ml-6">
                                                {data.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="font-semibold heading-text uppercase tracking-wide">
                                        Payment & Shipping
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <div className="flex items-center gap-2">
                                                <LiDollarCircle className="text-base" />
                                                <span className="font-medium">
                                                    Payment Method:
                                                </span>
                                            </div>
                                            <span className="heading-text font-medium flex items-center gap-1 sm:ml-0 ml-6">
                                                <img
                                                    className="h-6"
                                                    src={`/img/thumbs/payment/${data.paymentMethod}.png`}
                                                    alt={data.paymentMethod}
                                                />
                                                <span>
                                                    {data.paymentIdentifier}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <div className="flex items-center gap-2">
                                                <LiTruck className="text-base" />
                                                <span className="font-medium">
                                                    Shipping Method:
                                                </span>
                                            </div>
                                            <span className="heading-text font-medium sm:ml-0 ml-6">
                                                {data.shippingMethod}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="font-semibold heading-text uppercase tracking-wide flex items-center gap-2">
                                        Shipping Address
                                    </div>
                                    <div>
                                        <p className="whitespace-pre-line font-medium">
                                            {formatAddress(
                                                data.shippingAddress,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="font-semibold heading-text uppercase tracking-wide flex items-center gap-2">
                                        Billing Address
                                    </div>
                                    <div>
                                        <p className="whitespace-pre-line font-medium">
                                            {formatAddress(data.billingAddress)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="font-semibold heading-text uppercase tracking-wide flex items-center gap-2">
                                    <LiBox className="text-base" />
                                    Order Items ({data.products?.length || 0})
                                </div>
                                {larger.md ? (
                                    <Table hoverable overflow={false}>
                                        <THead>
                                            <Tr>
                                                <Th>Product</Th>
                                                <Th>Code</Th>
                                                <Th className="text-center">
                                                    Quantity
                                                </Th>
                                                <Th className="text-right">
                                                    Price
                                                </Th>
                                                <Th className="text-right">
                                                    Total
                                                </Th>
                                            </Tr>
                                        </THead>
                                        <TBody>
                                            {data.products?.map((product) => (
                                                <Tr key={product.id}>
                                                    <Td>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                size={40}
                                                                src={
                                                                    product.img
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="rounded-lg"
                                                            />
                                                            <div className="min-w-0">
                                                                <div className="font-medium heading-text truncate">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Td>
                                                    <Td>
                                                        <span>
                                                            {
                                                                product.productCode
                                                            }
                                                        </span>
                                                    </Td>
                                                    <Td className="text-center">
                                                        <span className="font-medium">
                                                            {product.quantity}
                                                        </span>
                                                    </Td>
                                                    <Td className="text-right">
                                                        <NumericFormat
                                                            displayType="text"
                                                            value={
                                                                product.price
                                                            }
                                                            prefix="$"
                                                            decimalScale={2}
                                                            thousandSeparator={
                                                                true
                                                            }
                                                            className="font-medium"
                                                        />
                                                    </Td>
                                                    <Td className="text-right">
                                                        <NumericFormat
                                                            displayType="text"
                                                            value={
                                                                product.price *
                                                                product.quantity
                                                            }
                                                            prefix="$"
                                                            decimalScale={2}
                                                            thousandSeparator={
                                                                true
                                                            }
                                                            className="font-semibold heading-text"
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </TBody>
                                    </Table>
                                ) : (
                                    <div className="space-y-3">
                                        {data.products?.map((product) => (
                                            <Card
                                                key={product.id}
                                                bodyClass="p-3"
                                            >
                                                <div className="flex gap-3">
                                                    <Avatar
                                                        size={50}
                                                        src={product.img}
                                                        alt={product.name}
                                                        className="rounded-lg shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium heading-text truncate">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs mt-0.5">
                                                            {
                                                                product.productCode
                                                            }
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="text-sm">
                                                                <NumericFormat
                                                                    displayType="text"
                                                                    value={
                                                                        product.price
                                                                    }
                                                                    prefix="$"
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    thousandSeparator={
                                                                        true
                                                                    }
                                                                />
                                                                <span className="mx-1">
                                                                    ×
                                                                </span>
                                                                <span>
                                                                    {
                                                                        product.quantity
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="font-semibold heading-text">
                                                                <NumericFormat
                                                                    displayType="text"
                                                                    value={
                                                                        product.price *
                                                                        product.quantity
                                                                    }
                                                                    prefix="$"
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                    thousandSeparator={
                                                                        true
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="font-semibold heading-text uppercase tracking-wide flex items-center gap-2">
                                    <LiDollarCircle className="text-base" />
                                    Payment Summary
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                            Subtotal
                                        </span>
                                        <span className="font-medium heading-text">
                                            <NumericFormat
                                                displayType="text"
                                                value={
                                                    data.paymentSummary
                                                        ?.subTotal || 0
                                                }
                                                prefix="$"
                                                decimalScale={2}
                                                fixedDecimalScale
                                                thousandSeparator={true}
                                            />
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Tax</span>
                                        <span className="font-medium heading-text">
                                            <NumericFormat
                                                displayType="text"
                                                value={
                                                    data.paymentSummary?.tax ||
                                                    0
                                                }
                                                prefix="$"
                                                decimalScale={2}
                                                fixedDecimalScale
                                                thousandSeparator={true}
                                            />
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                            Delivery Fees
                                        </span>
                                        <span className="font-medium heading-text">
                                            <NumericFormat
                                                displayType="text"
                                                value={
                                                    data.paymentSummary
                                                        ?.deliveryFees || 0
                                                }
                                                prefix="$"
                                                decimalScale={2}
                                                fixedDecimalScale
                                                thousandSeparator={true}
                                            />
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-semibold heading-text">
                                                Total
                                            </span>
                                            <span className="text-base font-bold heading-text">
                                                <NumericFormat
                                                    displayType="text"
                                                    value={
                                                        data.paymentSummary
                                                            ?.total || 0
                                                    }
                                                    prefix="$"
                                                    decimalScale={2}
                                                    thousandSeparator={true}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Collapsible.Content>
        </Collapsible>
    )
}

export default ExpandableOrderDetails
