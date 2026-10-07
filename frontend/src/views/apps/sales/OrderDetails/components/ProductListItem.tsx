import { useState } from 'react'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar/Avatar'
import NumericInput from '@/components/shared/NumericInput'
import { NumericFormat } from 'react-number-format'
import { LiAdd, LiMinus, LiTrash } from '@/icons'
import { TbAlertTriangleFilled, TbXboxXFilled } from 'react-icons/tb'
import type { OrderProduct } from '../types'

type ProductListItemProps = {
    product: OrderProduct
    onQuantityChange: (productId: string, quantity: number) => void
    onRemove: (productId: string) => void
    className?: string
}

const validateStockAvailability = (
    quantity: number,
    stockLevel: number,
    allowBackorder: boolean = false,
): {
    isValid: boolean
    warning?: string
    error?: string
} => {
    if (quantity <= 0) {
        return {
            isValid: false,
            error: 'Quantity must be greater than 0',
        }
    }

    if (quantity > stockLevel) {
        if (allowBackorder) {
            return {
                isValid: true,
                warning: `Only ${stockLevel} items in stock. This will create a backorder.`,
            }
        } else {
            return {
                isValid: false,
                error: `Only ${stockLevel} items available in stock`,
            }
        }
    }

    return { isValid: true }
}

const ProductListItem = ({
    product,
    onQuantityChange,
    onRemove,
}: ProductListItemProps) => {
    const [tempQuantity, setTempQuantity] = useState(product.quantity)

    const stockValidation = validateStockAvailability(
        product.quantity,
        product.stock,
        true,
    )
    const handleQuantityChange = (value: number) => {
        setTempQuantity(value)
        onQuantityChange(product.id, value)
    }

    const handleRemove = () => {
        onRemove(product.id)
    }

    return (
        <Table.Tr>
            <Table.Td>
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                        <Avatar src={product.img} alt={product.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium heading-text truncate">
                            {product.name}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">
                                Stock: {product.stock}
                            </span>
                            {stockValidation.warning && (
                                <TbAlertTriangleFilled className="text-warning" />
                            )}
                            {stockValidation.error && (
                                <TbXboxXFilled className="text-error" />
                            )}
                        </div>
                    </div>
                </div>
            </Table.Td>
            <Table.Td>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        icon={<LiMinus />}
                        onClick={() => handleQuantityChange(tempQuantity - 1)}
                    />
                    <NumericInput
                        value={tempQuantity}
                        onValueChange={({ floatValue }) =>
                            handleQuantityChange(floatValue || 1)
                        }
                        min={1}
                        className="w-20 text-center"
                    />
                    <Button
                        type="button"
                        icon={<LiAdd />}
                        onClick={() => handleQuantityChange(tempQuantity + 1)}
                    />
                </div>
            </Table.Td>
            <Table.Td>
                <NumericFormat
                    className="font-medium"
                    fixedDecimalScale
                    prefix="$"
                    displayType="text"
                    value={product.price}
                    decimalScale={2}
                    thousandSeparator={true}
                />
            </Table.Td>
            <Table.Td>
                <NumericFormat
                    className="font-medium"
                    fixedDecimalScale
                    prefix="$"
                    displayType="text"
                    value={product.total}
                    decimalScale={2}
                    thousandSeparator={true}
                />
            </Table.Td>
            <Table.Td>
                <Button
                    variant="ghost"
                    type="button"
                    className="text-error hover:text-error"
                    onClick={handleRemove}
                    icon={<LiTrash />}
                />
            </Table.Td>
        </Table.Tr>
    )
}

export default ProductListItem
