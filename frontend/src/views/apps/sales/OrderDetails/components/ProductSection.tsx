import { useState, useCallback } from 'react'
import { useFieldArray } from 'react-hook-form'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import SectionCard from './SectionCard'
import Table from '@/components/ui/Table'
import ProductPicker from './ProductPicker'
import ProductListItem from './ProductListItem'
import FormFieldWrapper from './FormFieldWrapper'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import NumericInput from '@/components/shared/NumericInput'
import useResponsive from '@/utils/hooks/useResponsive'
import { NumericFormat } from 'react-number-format'
import classNames from '@/utils/classNames'
import { calculateProductTotal } from '../utils'
import { LiAdd, LiBox, LiMinus, LiTrash } from '@/icons'
import type { FormSectionBaseProps, Product, OrderProduct } from '../types'

export type ProductSectionProps = FormSectionBaseProps
const ProductSection = ({ control, watch }: ProductSectionProps) => {
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false)
    const [productToRemove, setProductToRemove] = useState<string | null>(null)

    const { larger } = useResponsive()

    const { append, remove, update } = useFieldArray({
        control,
        name: 'products',
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const watchedProducts = watch?.('products') || []

    const selectedProductIds = watchedProducts.map((p) => p.id)

    const handleProductsSelected = useCallback(
        (selectedProducts: Product[]) => {
            selectedProducts.forEach((product) => {
                const existingIndex = watchedProducts.findIndex(
                    (p) => p.id === product.id,
                )
                const productToOrderProduct = (
                    product: Product,
                    quantity: number = 1,
                ): OrderProduct => {
                    return {
                        id: product.id,
                        name: product.name,
                        img: product.img,
                        price: product.price,
                        quantity: quantity,
                        stock: product.stock,
                        total: product.price * quantity,
                        allowBackorder: product.allowBackorder || false,
                    }
                }

                if (existingIndex === -1) {
                    const orderProduct = productToOrderProduct(product, 1)
                    append(orderProduct)
                } else {
                    const existingProduct = watchedProducts[existingIndex]
                    const updatedProduct = {
                        ...existingProduct,
                        quantity: existingProduct.quantity + 1,
                        total: calculateProductTotal(
                            existingProduct.price,
                            existingProduct.quantity + 1,
                        ),
                    }
                    update(existingIndex, updatedProduct)
                }
            })
            setIsProductPickerOpen(false)
        },
        [watchedProducts, append, update],
    )

    const handleQuantityChange = useCallback(
        (productId: string, quantity: number) => {
            const productIndex = watchedProducts.findIndex(
                (p) => p.id === productId,
            )
            if (productIndex !== -1) {
                const product = watchedProducts[productIndex]
                const updatedProduct = {
                    ...product,
                    quantity,
                    total: calculateProductTotal(product.price, quantity),
                }
                update(productIndex, updatedProduct)
            }
        },
        [watchedProducts, update],
    )

    const handleRemoveProduct = useCallback((productId: string) => {
        setProductToRemove(productId)
    }, [])

    const confirmRemoveProduct = useCallback(() => {
        if (productToRemove) {
            const productIndex = watchedProducts.findIndex(
                (p) => p.id === productToRemove,
            )
            if (productIndex !== -1) {
                remove(productIndex)
            }
            setProductToRemove(null)
        }
    }, [productToRemove, watchedProducts, remove])

    const cancelRemoveProduct = useCallback(() => {
        setProductToRemove(null)
    }, [])

    const productToRemoveName = productToRemove
        ? watchedProducts.find((p) => p.id === productToRemove)?.name ||
          'Unknown Product'
        : ''
    return (
        <SectionCard title="Products" description="Add products to this order">
            <FormFieldWrapper description="Select products and adjust quantities as needed">
                <div className="space-y-4">
                    {watchedProducts.length === 0 ? (
                        <div
                            className={classNames(
                                'flex flex-col items-center justify-center py-8 text-center border border-gray-200 dark:border-gray-800 rounded-lg',
                            )}
                        >
                            <EmptyState
                                variant="dots"
                                size={200}
                                illustration={
                                    <IconFrame variant="thick" size={48}>
                                        <LiBox className="text-2xl heading-text" />
                                    </IconFrame>
                                }
                            >
                                <div className="px-4">
                                    <h5 className="text-lg font-medium heading-text mb-1 -mt-10">
                                        Add Products
                                    </h5>
                                    <p className="mb-6 max-w-sm">
                                        Click 'Add Products' to select products
                                        for this order
                                    </p>
                                    <Button
                                        variant="solid"
                                        type="button"
                                        onClick={() =>
                                            setIsProductPickerOpen(true)
                                        }
                                    >
                                        Add Products
                                    </Button>
                                </div>
                            </EmptyState>
                        </div>
                    ) : larger.md ? (
                        <Table hoverable={false}>
                            <Table.THead>
                                <Table.Tr>
                                    <Table.Th>Product</Table.Th>
                                    <Table.Th>Quantity</Table.Th>
                                    <Table.Th className="lg:w-[250px]">
                                        Price
                                    </Table.Th>
                                    <Table.Th className="lg:w-[250px]">
                                        Total
                                    </Table.Th>
                                    <Table.Th className="w-[100px]"></Table.Th>
                                </Table.Tr>
                            </Table.THead>
                            <Table.TBody>
                                {watchedProducts.map(
                                    (product: OrderProduct, index: number) => (
                                        <ProductListItem
                                            key={`${product.id}-${index}`}
                                            product={product}
                                            onQuantityChange={
                                                handleQuantityChange
                                            }
                                            onRemove={handleRemoveProduct}
                                        />
                                    ),
                                )}
                            </Table.TBody>
                        </Table>
                    ) : (
                        <div className="space-y-3">
                            {watchedProducts.map(
                                (product: OrderProduct, index: number) => (
                                    <Card
                                        key={`${product.id}-${index}`}
                                        bodyClass="p-3"
                                    >
                                        <div className="flex gap-3">
                                            <Avatar
                                                size={50}
                                                src={product.img}
                                                alt={product.name}
                                                className="shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <div className="font-medium heading-text truncate">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs mt-0.5">
                                                            Stock:{' '}
                                                            {product.stock}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        type="button"
                                                        className="text-error hover:text-error shrink-0"
                                                        onClick={() =>
                                                            handleRemoveProduct(
                                                                product.id,
                                                            )
                                                        }
                                                        icon={<LiTrash />}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            icon={<LiMinus />}
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    product.id,
                                                                    product.quantity -
                                                                        1,
                                                                )
                                                            }
                                                        />
                                                        <NumericInput
                                                            value={
                                                                product.quantity
                                                            }
                                                            onValueChange={({
                                                                floatValue,
                                                            }) =>
                                                                handleQuantityChange(
                                                                    product.id,
                                                                    floatValue ||
                                                                        1,
                                                                )
                                                            }
                                                            min={1}
                                                            className="w-14 text-center"
                                                            size="sm"
                                                        />
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            icon={<LiAdd />}
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    product.id,
                                                                    product.quantity +
                                                                        1,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs">
                                                            <NumericFormat
                                                                fixedDecimalScale
                                                                prefix="$"
                                                                displayType="text"
                                                                value={
                                                                    product.price
                                                                }
                                                                decimalScale={2}
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
                                                                fixedDecimalScale
                                                                prefix="$"
                                                                displayType="text"
                                                                value={
                                                                    product.total
                                                                }
                                                                decimalScale={2}
                                                                thousandSeparator={
                                                                    true
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ),
                            )}
                        </div>
                    )}

                    {watchedProducts.length > 0 && (
                        <div className="flex justify-between items-center">
                            <Button
                                type="button"
                                onClick={() => setIsProductPickerOpen(true)}
                                icon={<LiAdd />}
                            >
                                Add More
                            </Button>
                            <span className="flex items-center gap-2">
                                <span>Subtotal: </span>
                                <NumericFormat
                                    className="font-semibold text-base heading-text"
                                    fixedDecimalScale
                                    prefix="$"
                                    displayType="text"
                                    value={watchedProducts.reduce(
                                        (sum, p) => sum + p.total,
                                        0,
                                    )}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                />
                            </span>
                        </div>
                    )}
                    {watchedProducts.some((p) => p.quantity > p.stock) && (
                        <Alert
                            showIcon
                            type="warning"
                            title="Stock Level Warning"
                        >
                            Some products have quantities that exceed available
                            stock. Please verify availability or enable
                            backorder if supported.
                        </Alert>
                    )}
                </div>
            </FormFieldWrapper>
            <ProductPicker
                isOpen={isProductPickerOpen}
                onClose={() => setIsProductPickerOpen(false)}
                onProductsSelected={handleProductsSelected}
                selectedProducts={selectedProductIds}
            />
            <ConfirmDialog
                isOpen={!!productToRemove}
                type="danger"
                title="Remove Product"
                onClose={cancelRemoveProduct}
                onCancel={cancelRemoveProduct}
                onConfirm={confirmRemoveProduct}
            >
                <p>
                    Are you sure you want to remove{' '}
                    <span className="heading-text font-medium">
                        "{productToRemoveName}"
                    </span>{' '}
                    from this order? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </SectionCard>
    )
}

export default ProductSection
