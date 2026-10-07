import { useState, useEffect, useMemo } from 'react'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { apiGetProductList } from '@/services/SalesService'
import { NumericFormat } from 'react-number-format'
import { LiSearch, LiBox, LiElementPlus, LiCross, LiTick } from '@/icons'
import {
    TbCircleCheckFilled,
    TbAlertTriangleFilled,
    TbCircleXFilled,
} from 'react-icons/tb'
import useSWR from 'swr'
import type { Product, GetProductsResponse } from '../types'
import classNames from '@/utils/classNames'

type ProductItemProps = {
    product: Product
    isSelected: boolean
    onToggle: () => void
}

export interface ProductPickerProps {
    isOpen: boolean
    onClose: () => void
    onProductsSelected: (products: Product[]) => void
    selectedProducts: string[]
}

const ProductItem = ({ product, isSelected, onToggle }: ProductItemProps) => {
    const isOutOfStock = product.stock === 0
    const isLowStock = product.stock > 0 && product.stock <= 5
    const disable = isOutOfStock && !product.allowBackorder

    const handleToggle = () => {
        if (!disable) {
            onToggle()
        }
    }

    return (
        <div
            className={classNames(
                'flex items-center justify-between gap-4 border p-2 rounded-lg cursor-pointer transition-colors',
                disable
                    ? 'cursor-not-allowed opacity-40'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                isSelected
                    ? 'border-primary bg-primary-subtle hover:bg-primary-subtle'
                    : 'border-transparent',
            )}
            onClick={handleToggle}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-center gap-2 ">
                <div
                    className={classNames(
                        'h-5 w-5 flex items-center justify-center heading-text border border-gray-300 dark:border-gray-700 rounded-md',
                        isSelected ? 'bg-primary text-white' : '',
                    )}
                >
                    {isSelected && <LiTick className="text-xs" />}
                </div>
                <div className="flex-shrink-0">
                    <Avatar size="sm" src={product.img} alt={product.name} />
                </div>

                <div>
                    <div className="font-medium heading-text truncate flex items-center gap-1">
                        <span>{product.name}</span>
                        {isOutOfStock ? (
                            <span className=" flex items-center gap-1">
                                <TbCircleXFilled className="text-error" />
                            </span>
                        ) : isLowStock ? (
                            <span className="flex items-center gap-1">
                                <TbAlertTriangleFilled className="text-warning" />
                            </span>
                        ) : (
                            <span className=" flex items-center gap-1">
                                <TbCircleCheckFilled className="text-success" />
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {isOutOfStock ? (
                            <span className="text-xs flex items-center gap-1">
                                Out of Stock
                            </span>
                        ) : isLowStock ? (
                            <span className="text-xs flex items-center gap-1">
                                Low Stock ({product.stock})
                            </span>
                        ) : (
                            <span className="text-xs flex items-center gap-1">
                                In Stock ({product.stock})
                            </span>
                        )}
                        {product.allowBackorder && isOutOfStock && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                • Backorder Available
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="">
                <span className="font-medium heading-text">
                    <NumericFormat
                        fixedDecimalScale
                        prefix="$"
                        displayType="text"
                        value={product.price}
                        decimalScale={2}
                        thousandSeparator={true}
                    />
                </span>
            </div>
        </div>
    )
}

const ProductPicker = ({
    isOpen,
    onClose,
    onProductsSelected,
    selectedProducts = [],
}: ProductPickerProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [localSelectedProducts, setLocalSelectedProducts] =
        useState<string[]>(selectedProducts)

    const { data, isLoading } = useSWR(
        [`/api/products/${searchQuery}`, { query: searchQuery }],
        ([, params]) =>
            apiGetProductList<GetProductsResponse, { query: string }>({
                ...params,
            }),
        {
            revalidateOnFocus: false,
        },
    )

    const products = useMemo(() => {
        if (!data) return []
        return data.list || []
    }, [data])

    const categoryOptions = useMemo(
        () => [
            { value: '', label: 'All' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'shoes', label: 'Shoes' },
            { value: 'accessories', label: 'Accessories' },
            { value: 'watches', label: 'Watches' },
            { value: 'beauty', label: 'Beauty' },
            { value: 'bags', label: 'Bags' },
            { value: 'music', label: 'Instruments' },
        ],
        [],
    )

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    const handleCategoryChange = (
        option: { value: string; label: string } | null,
    ) => {
        const category = option?.value || 'all'
        setSelectedCategory(category)
    }

    const handleProductToggle = (productId: string) => {
        setLocalSelectedProducts((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId)
            } else {
                return [...prev, productId]
            }
        })
    }

    const handleConfirm = () => {
        const selectedProductObjects = products.filter((p) =>
            localSelectedProducts.includes(p.id),
        )
        onProductsSelected(selectedProductObjects)
        onClose()
    }

    const handleCancel = () => {
        setLocalSelectedProducts(selectedProducts)
        setSearchQuery('')
        setSelectedCategory('')
        onClose()
    }

    // Reset local selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalSelectedProducts(selectedProducts)
        }
    }, [isOpen, selectedProducts])

    const selectedCount = localSelectedProducts.length

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleCancel}
            className="p-0"
            closable={false}
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame variant="layered">
                        <LiElementPlus className="text-xl heading-text" />
                    </IconFrame>
                    <div>
                        <h5>Select Products</h5>
                        <p className="pr-12 hidden md:block">
                            Select products to add to the order
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="subtle"
                    icon={<LiCross className="text-2xl" />}
                    type="button"
                    onClick={handleCancel}
                />
            </div>
            <div className="flex flex-col h-[600px]">
                <div className="flex-shrink-0 space-y-4">
                    <div className="flex gap-2 p-4">
                        <div className="flex-1">
                            <Input
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search products..."
                                prefix={<LiSearch className="text-base" />}
                            />
                        </div>
                        <div className="w-40">
                            <Select
                                value={categoryOptions.find(
                                    (opt) => opt.value === selectedCategory,
                                )}
                                onChange={handleCategoryChange}
                                options={categoryOptions}
                                placeholder="Category"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading && (
                        <div className="space-y-4">
                            <div className="space-y-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-4 p-2 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-5 rounded-md" />
                                            <div className="flex items-center gap-2 ">
                                                <div>
                                                    <Skeleton
                                                        height={35}
                                                        width={35}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2 w-[150px]">
                                                    <Skeleton height={10} />
                                                    <Skeleton
                                                        height={10}
                                                        width="60%"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Skeleton height={10} width={40} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!isLoading && products.length > 0 && (
                        <div className="space-y-2">
                            {products.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    isSelected={localSelectedProducts.includes(
                                        product.id,
                                    )}
                                    onToggle={() =>
                                        handleProductToggle(product.id)
                                    }
                                />
                            ))}
                        </div>
                    )}
                    {!isLoading && products.length === 0 && (
                        <div
                            className={classNames(
                                'flex flex-col items-center justify-center py-12 px-4 text-center',
                            )}
                        >
                            <EmptyState
                                variant="dots"
                                size={200}
                                offset={-40}
                                illustration={
                                    <IconFrame variant="thick">
                                        <LiBox className="text-xl heading-text" />
                                    </IconFrame>
                                }
                            >
                                <div>
                                    <h5 className="mb-1">No Products Found</h5>
                                    <p className="mb-6 max-w-sm">
                                        {searchQuery
                                            ? `No products match "${searchQuery}"`
                                            : 'No products available'}
                                    </p>
                                </div>
                            </EmptyState>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <span className="hidden md:block">
                            {selectedCount} product
                            {selectedCount !== 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="subtle" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleConfirm}
                            disabled={selectedCount === 0}
                        >
                            Add Selected Products
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ProductPicker
