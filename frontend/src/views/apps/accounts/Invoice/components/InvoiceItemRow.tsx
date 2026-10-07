import { useState, useMemo, useRef, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import InputGroup from '@/components/ui/InputGroup'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import NumericInput from '@/components/shared/NumericInput'
import FormFieldWrapper from './FormFieldWrapper'
import { apiGetProductList } from '@/services/SalesService'
import useSWR from 'swr'
import useDebounce from '@/utils/hooks/useDebounce'
import formatCurrency from '@/utils/formatCurrency'
import { LiMinus, LiAdd, LiTrash } from '@/icons'
import { RiDraggable } from 'react-icons/ri'
import { Controller } from 'react-hook-form'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Control, UseFormWatch, FieldErrors } from 'react-hook-form'
import type {
    GetProductsListResponse,
    InvoiceFormData,
    InvoiceItem,
} from '../types'

type ProductOption = {
    value: string
    label: string
    price: number
    description: string
    img: string
    disabled?: boolean
}

type InvoiceItemRowProps = {
    item: InvoiceItem
    index: number
    currency: string
    control: Control<InvoiceFormData>
    errors: FieldErrors<InvoiceFormData>
    watch?: UseFormWatch<InvoiceFormData>
    onUpdateItem: (updatedItem: Partial<InvoiceItem>) => void
    onRemove: () => void
    showLabels: boolean
}

const InvoiceItemRow = ({
    item,
    index,
    currency,
    control,
    errors,
    onUpdateItem,
    onRemove,
    showLabels,
}: InvoiceItemRowProps) => {
    const [productQuery, setProductQuery] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<
        ProductOption | undefined
    >(undefined)
    const latestInputRef = useRef('')

    // Sortable functionality
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const { data: productsData, isLoading } = useSWR(
        [`/api/products/search/${productQuery}`, { query: productQuery }],
        ([, params]) => {
            return apiGetProductList<
                GetProductsListResponse,
                { query: string }
            >(params)
        },
        {
            revalidateOnFocus: false,
        },
    )

    // Independent debounced search function
    const debouncedProductSearch = useDebounce(async () => {
        setProductQuery(latestInputRef.current)
    }, 500)

    const handleProductInputChange = (value: string) => {
        latestInputRef.current = value
        debouncedProductSearch()
    }

    // Independent product options memoization
    const productOptions = useMemo(() => {
        if (!productsData || !productsData.list) return []
        return productsData.list.map((product) => ({
            value: product.id,
            label: product.name,
            price: product.price,
            img: product.img || '',
            description: product.description || '',
        }))
    }, [productsData])

    console.log('productsData.list', productOptions)

    useEffect(() => {
        if (item.productId && item.name) {
            setSelectedProduct({
                value: item.productId,
                label: item.name,
                price: item.unitPrice,
                img: item.img || '',
                description: item.description || '',
            })
        } else {
            setSelectedProduct(undefined)
        }
    }, [item.productId, item.name, item.unitPrice, item.description, item.img])

    const handleProductSelect = (option: ProductOption | undefined) => {
        setSelectedProduct(option)

        if (option) {
            onUpdateItem({
                name: option.label,
                description: option.description,
                unitPrice: option.price,
                productId: option.value,
            })
        } else {
            onUpdateItem({
                name: '',
                description: '',
                unitPrice: 0,
                productId: '',
            })
        }
    }

    const handleQuantityChange = (quantity: number) => {
        onUpdateItem({ quantity })
    }

    return (
        <div ref={setNodeRef} style={style}>
            <div className="sm:hidden p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        Item {index + 1}
                    </span>
                    <Button
                        onClick={onRemove}
                        icon={<LiTrash className="text-base" />}
                        className="text-error hover:text-error-deep"
                        type="button"
                        aria-label={`Remove item ${index + 1}`}
                    />
                </div>
                <FormFieldWrapper label="Product/Service">
                    <Select
                        options={productOptions}
                        value={selectedProduct}
                        onChange={handleProductSelect}
                        onInputChange={handleProductInputChange}
                        placeholder="Search products"
                        isSearchable
                        isLoading={isLoading}
                        noOptionsMessage={(ListElement) => (
                            <ListElement className="justify-center">
                                {isLoading ? 'Loading...' : 'No products found'}
                            </ListElement>
                        )}
                        customOption={({ option }) => (
                            <div className="flex items-center gap-2">
                                <Avatar
                                    src={option.img}
                                    size={30}
                                    alt="Product Image"
                                />
                                <div>
                                    <div className="font-medium heading-text">
                                        {option.label}
                                    </div>
                                    <div className="text-xs">
                                        {formatCurrency(option.price, currency)}
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </FormFieldWrapper>
                <div className="grid grid-cols-2 gap-4">
                    <FormFieldWrapper
                        label="Quantity"
                        error={errors.items?.[index]?.quantity?.message}
                        className="mb-0"
                    >
                        <Controller
                            name={`items.${index}.quantity`}
                            control={control}
                            render={({ field }) => (
                                <InputGroup>
                                    <Button
                                        className="min-w-9"
                                        icon={<LiMinus className="text-base" />}
                                        type="button"
                                        onClick={() => {
                                            const newValue = Math.max(
                                                1,
                                                (field.value || 1) - 1,
                                            )
                                            field.onChange(newValue)
                                            handleQuantityChange(newValue)
                                        }}
                                    />
                                    <NumericInput
                                        {...field}
                                        min={1}
                                        placeholder="1"
                                        onValueChange={({ floatValue }) => {
                                            field.onChange(floatValue)
                                            handleQuantityChange(
                                                floatValue || 1,
                                            )
                                        }}
                                        className="text-center"
                                    />
                                    <Button
                                        className="min-w-9"
                                        icon={<LiAdd className="text-base" />}
                                        type="button"
                                        onClick={() => {
                                            const newValue =
                                                (field.value || 0) + 1
                                            field.onChange(newValue)
                                            handleQuantityChange(newValue)
                                        }}
                                    />
                                </InputGroup>
                            )}
                        />
                    </FormFieldWrapper>
                    <FormFieldWrapper
                        label="Unit Price"
                        error={errors.items?.[index]?.unitPrice?.message}
                        className="mb-0"
                    >
                        <Controller
                            name={`items.${index}.unitPrice`}
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    {...field}
                                    thousandSeparator
                                    inputPrefix={
                                        currency === 'USD' ? '$' : currency
                                    }
                                    placeholder="0.00"
                                    readOnly
                                />
                            )}
                        />
                    </FormFieldWrapper>
                </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <div className={showLabels ? 'mt-6' : ''}>
                    <button
                        className="flex items-center justify-center w-4 h-9 cursor-grab active:cursor-grabbing"
                        aria-label={`Drag to reorder item ${index + 1}`}
                        type="button"
                        {...attributes}
                        {...listeners}
                    >
                        <RiDraggable className="text-base" />
                    </button>
                </div>
                <FormFieldWrapper
                    label={showLabels ? 'Product/Service' : ''}
                    className="min-w-[300px] lg:min-w-[150px] xl:min-w-[180px] 2xl:min-w-[350px] mb-0"
                >
                    <Select
                        options={productOptions}
                        value={selectedProduct}
                        onChange={handleProductSelect}
                        onInputChange={handleProductInputChange}
                        placeholder="Search products"
                        isSearchable
                        isLoading={isLoading}
                        noOptionsMessage={(ListElement) => (
                            <ListElement className="justify-center">
                                {isLoading ? 'Loading...' : 'No products found'}
                            </ListElement>
                        )}
                        customOption={({ option }) => (
                            <div className="flex items-center gap-2">
                                <Avatar
                                    src={option.img}
                                    size={30}
                                    alt="Product Image"
                                />
                                <div>
                                    <div className="font-medium heading-text">
                                        {option.label}
                                    </div>
                                    <div className="text-xs">
                                        {formatCurrency(option.price, currency)}
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </FormFieldWrapper>
                <FormFieldWrapper
                    label={showLabels ? 'Quantity' : ''}
                    error={errors.items?.[index]?.quantity?.message}
                    className="mb-0"
                >
                    <Controller
                        name={`items.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                            <InputGroup>
                                <Button
                                    className="min-w-9"
                                    icon={<LiMinus className="text-base" />}
                                    type="button"
                                    onClick={() => {
                                        const newValue = Math.max(
                                            1,
                                            (field.value || 1) - 1,
                                        )
                                        field.onChange(newValue)
                                        handleQuantityChange(newValue)
                                    }}
                                />
                                <NumericInput
                                    {...field}
                                    min={1}
                                    placeholder="1"
                                    onValueChange={({ floatValue }) => {
                                        field.onChange(floatValue)
                                        handleQuantityChange(floatValue || 1)
                                    }}
                                    className="text-center"
                                />
                                <Button
                                    className="min-w-9"
                                    icon={<LiAdd className="text-base" />}
                                    type="button"
                                    onClick={() => {
                                        const newValue = (field.value || 0) + 1
                                        field.onChange(newValue)
                                        handleQuantityChange(newValue)
                                    }}
                                />
                            </InputGroup>
                        )}
                    />
                </FormFieldWrapper>
                <FormFieldWrapper
                    label={showLabels ? 'Unit Price' : ''}
                    error={errors.items?.[index]?.unitPrice?.message}
                    className="mb-0"
                >
                    <Controller
                        name={`items.${index}.unitPrice`}
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                {...field}
                                thousandSeparator
                                inputPrefix={
                                    currency === 'USD' ? '$' : currency
                                }
                                placeholder="0.00"
                                readOnly
                            />
                        )}
                    />
                </FormFieldWrapper>
                <div className={showLabels ? 'mt-6' : ''}>
                    <Button
                        variant="subtle"
                        onClick={onRemove}
                        icon={<LiTrash className="text-base" />}
                        className="text-error hover:text-error-deep"
                        type="button"
                        aria-label={`Remove item ${index + 1}`}
                    />
                </div>
            </div>
        </div>
    )
}

export default InvoiceItemRow
