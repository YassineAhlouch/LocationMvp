import { useEffect, useImperativeHandle } from 'react'
import { Form } from '@/components/ui/Form'
import SectionContainer from './SectionContainer'
import BasicInfoSection from './BasicInfoSection'
import PricingInventorySection from './PricingSection'
import InventorySection from './InventorySection'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type {
    ProductFormSchema,
    ProductFormHandle,
    ProductFormData,
    ProductFormRef,
} from '../types'

type ProductFormProps = ProductFormHandle &
    ProductFormRef & {
        selectedSection: string
    }

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Product name required!' }),
    productCode: z.string().min(1, { message: 'Produc code required!' }),
    description: z.string().min(1, { message: 'Produc description required!' }),
    price: z.number().min(0, { message: 'Product price required!' }),
    taxRate: z.number().min(0, { message: 'Tax rate required!' }),
    costPerItem: z.number().min(0, { message: 'Cost per item required!' }),
    bulkDiscountPrice: z
        .number()
        .min(0, { message: 'Bulk discount price required!' }),
    imgList: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                src: z.string(),
            }),
        )
        .min(1, { message: 'At least 1 image required!' }),
    category: z.string().min(1, { message: 'Product category required!' }),
    status: z.string().min(1, { message: 'Product status required!' }),
    slug: z.string().min(1, { message: 'Slug required!' }),
    visibility: z.string().min(1, { message: 'Visibility required!' }),
})

const defaultValues = {
    visibility: 'public',
    variantOptions: [{ attribute: '', values: [] }],
    variantCombinations: [],
    weightUnit: 'kg',
    dimensionUnit: 'cm',
}

const ProductForm = ({
    selectedSection,
    onBeforeSubmit,
    onSubmit,
    data,
    ref,
}: ProductFormProps & ProductFormData) => {
    const form = useForm<ProductFormSchema>({
        defaultValues,
        resolver: zodResolver(validationSchema),
    })

    const handleSubmit = form.handleSubmit
    const formState = form.formState
    const errors = formState.errors
    const control = form.control
    const watch = form.watch
    const setValue = form.setValue
    const reset = form.reset

    useEffect(() => {
        if (data) {
            reset({
                ...defaultValues,
                name: data.name,
                productCode: data.productCode,
                slug: data.slug,
                description: data.description,
                visibility: data.visibility,
                category: data.category,
                status: data.status,
                imgList: data.imgList,
                variantOptions: data.variantOptions,
                variantCombinations: data.variantCombinations,
                price: data.price,
                taxRate: data.taxRate,
                costPerItem: data.costPerItem,
                bulkDiscountPrice: data.bulkDiscountPrice,
                stock: data.stock,
                stockStatus: data.stockStatus,
                warehouse: data.warehouse,
                allowBackorder: data.allowBackorder,
                weight: data.weight,
                length: data.length,
                height: data.height,
                weightUnit: data.weightUnit,
                dimensionUnit: data.dimensionUnit,
                shippingClass: data.shippingClass,
                freeShipping: data.freeShipping,
            })
        } else {
            reset(defaultValues)
        }
    }, [data, reset])

    useImperativeHandle(ref, () => ({
        getForm: () => form,
    }))

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit, (errors) =>
                onBeforeSubmit(Object.keys(errors)),
            )}
            id={'product-form'}
        >
            <SectionContainer show={selectedSection === 'basicInfo'}>
                <BasicInfoSection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                />
            </SectionContainer>
            <SectionContainer show={selectedSection === 'pricing'}>
                <PricingInventorySection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                />
            </SectionContainer>
            <SectionContainer show={selectedSection === 'inventory'}>
                <InventorySection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                />
            </SectionContainer>
        </Form>
    )
}

export default ProductForm
