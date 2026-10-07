import type {
    Control,
    FieldErrors,
    UseFormWatch,
    UseFormSetValue,
    UseFormReturn,
} from 'react-hook-form'
import { Ref } from 'react'
export type Image = {
    id: string
    name: string
    src: string
}

export type Variant = {
    attribute: string
    values: Array<string>
}

export type VariantCombination = {
    combination: string
    price: number
    sku: string
    stock: number
}

export type Product = {
    id: string
    name: string
    productCode: string
    description: string
    slug: string
    img: string
    imgList: Image[]
    category: string
    price: number
    stock: number
    status: string
    sales: number
    stockPercentage: number
    variantOptions?: Array<Variant>
    variantCombinations?: Array<VariantCombination>
    taxRate: number
    costPerItem: number
    bulkDiscountPrice: number
    stockStatus: string
    warehouse: string
    allowBackorder: boolean
    weight: number
    length: number
    height: number
    weightUnit: string
    dimensionUnit: string
    shippingClass: string
    freeShipping: boolean
    visibility: string
}

export type BasicInfoFields = {
    name: string
    productCode: string
    slug: string
    description: string
    visibility: string
    category: string
    status: string
    imgList: {
        id: string
        name: string
        src: string
    }[]
}

export type PricingFields = {
    price: number
    costPerItem: number
    bulkDiscountPrice: number
    taxRate: number
    variantOptions?: Array<Variant>
    variantCombinations?: Array<VariantCombination>
}

export type InventoryFields = {
    sku: string
    stock: number
    stockStatus: string
    warehouse: string
    allowBackorder: boolean
    weight: number
    length: number
    height: number
    weightUnit: string
    dimensionUnit: string
    shippingClass: string
    freeShipping: boolean
}

export type ProductFormSchema = BasicInfoFields &
    PricingFields &
    Partial<InventoryFields>

export type FormSectionBaseProps = {
    control: Control<ProductFormSchema>
    errors: FieldErrors<ProductFormSchema>
    watch: UseFormWatch<ProductFormSchema>
    setValue: UseFormSetValue<ProductFormSchema>
}

export type ProductFormHandle = {
    onSubmit: (data: ProductFormSchema) => void
    onBeforeSubmit: (invalidFields: string[]) => void
}

export type ProductFormData = {
    data?: Product
}

export type FormRefMethod = {
    getForm: () => UseFormReturn<ProductFormSchema>
}

export type ProductFormRef = {
    ref?: Ref<FormRefMethod>
}

export type GetProductResponse = Product

export type FormMode = 'create' | 'edit'
