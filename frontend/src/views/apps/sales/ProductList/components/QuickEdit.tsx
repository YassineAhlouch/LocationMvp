import { useMemo, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Upload from '@/components/ui/Upload'
import Radio from '@/components/ui/Radio'
import Collapsible from '@/components/ui/Collapsible'
import { FormItem, Form } from '@/components/ui/Form'
import Divider from '@/components/shared/Divider'
import NumericInput from '@/components/shared/NumericInput'
import { useProductListStore } from '../store/productListStore'
import useProductListData from '../hooks/useProductListData'
import { categoryMap } from '../utils'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { LuX, LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type Image = {
    id: string
    name: string
    src: string
}

type FormSchema = {
    name: string
    description: string
    productCode: string
    bulkDiscountPrice?: number
    costPerItem: number
    taxRate: number
    category: string
    imgList: Image[]
    brand: string
    price: number
    stock: number
    lowStockThreshold: number
    allowBackorder: string
}

const validationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    productCode: z.string().min(1, 'SKU is required'),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    price: z.number().min(1, 'Price is required'),
    costPerItem: z.number().min(1, 'Cost is required'),
    stock: z.number().min(1, 'Quantity is required'),
    taxRate: z.number().min(1, 'Tax Rate is required'),
    lowStockThreshold: z.number().min(0, 'Low Stock Threshold is required'),
    allowBackorder: z.string().min(1, 'Allow Backorder is required'),
    imgList: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                src: z.string(),
            }),
        )
        .min(1, { message: 'At least 1 image required!' }),
})

const backOrderOptions: { label: string; value: string }[] = [
    { label: 'No', value: 'no' },
    { label: 'Allow', value: 'allow' },
    { label: 'Allow with notice', value: 'allowWithNotice' },
]

const CollapsibleSection = ({
    title,
    children,
    defaultOpen = true,
    showDivider = true,
}: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    showDivider?: boolean
}) => {
    const buttonClass =
        'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200/60 dark:group-hover:bg-gray-700 text-gray-900 dark:text-gray-100 h-6 w-6'

    return (
        <Collapsible defaultOpen={defaultOpen}>
            <Collapsible.Trigger>
                {({ isOpen, toggle }) => (
                    <div
                        className="flex items-center justify-between gap-2 py-1 cursor-pointer group"
                        onClick={toggle}
                        role="button"
                    >
                        <h6 className="font-medium heading-text">{title}</h6>
                        <div className="flex items-center">
                            <Button
                                variant="subtle"
                                size="sm"
                                className={() => buttonClass}
                                type="button"
                                icon={
                                    isOpen ? <LuChevronDown /> : <LuChevronUp />
                                }
                            />
                        </div>
                    </div>
                )}
            </Collapsible.Trigger>

            <Collapsible.Content
                className="mt-2 p-0.5"
                defaultOverflowHidden={false}
            >
                {children}
            </Collapsible.Content>
            {showDivider && <Divider />}
        </Collapsible>
    )
}

const QuickEdit = () => {
    const quickEditDrawer = useProductListStore(
        (state) => state.quickEditDrawer,
    )
    const setQuickEditDrawer = useProductListStore(
        (state) => state.setQuickEditDrawer,
    )

    const { setData } = useProductListData()

    const {
        getValues,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: '',
            description: '',
            imgList: [],
            category: '',
            price: 0,
            stock: 0,
            lowStockThreshold: 0,
            allowBackorder: 'No',
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (quickEditDrawer.product) {
            const values = getValues()
            reset({
                ...values,
                ...quickEditDrawer.product,
            })
        }
    }, [getValues, quickEditDrawer.product, reset])

    const handleClose = () => {
        setQuickEditDrawer({
            open: false,
            product: null,
        })
        reset()
    }

    const handleFormSubmit = async (data: FormSchema) => {
        await sleep(1000)
        setData((prev) => {
            const products = prev.list.map((product) => {
                if (product.id === quickEditDrawer.product?.id) {
                    return {
                        ...product,
                        ...data,
                    }
                }
                return product
            })
            return {
                ...prev,
                list: products,
            }
        })
        handleClose()
        reset()
    }

    const handleUpload = (
        onChange: (images: Image[]) => void,
        originalImageList: Image[] = [],
        files: File[],
    ) => {
        let imageId = '1-img-0'
        const latestUpload = files.length - 1
        if (originalImageList.length > 0) {
            const prevImgId = originalImageList[originalImageList.length - 1].id
            const splitImgId = prevImgId.split('-')
            const newIdNumber = parseInt(splitImgId[splitImgId.length - 1]) + 1
            splitImgId.pop()
            const newIdArr = [...splitImgId, ...[newIdNumber]]
            imageId = newIdArr.join('-')
        }
        const image = {
            id: imageId,
            name: files[latestUpload].name,
            src: URL.createObjectURL(files[latestUpload]),
        }
        const imageList = [...originalImageList, ...[image]]
        onChange(imageList)
    }

    const handleImageDelete = (
        onChange: (images: Image[]) => void,
        originalImageList: Image[] = [],
        deletedImg: Image,
    ) => {
        let imgList = structuredClone(originalImageList)
        imgList = imgList.filter((img) => img.id !== deletedImg.id)
        onChange(imgList)
    }

    const categoryOptions = useMemo(
        () =>
            Object.entries(categoryMap).map(([key, value]) => ({
                label: value.label,
                value: key,
            })),
        [],
    )

    function stripHTML(html: string): string {
        return html.replace(/<[^>]*>/g, '')
    }

    return (
        <Drawer
            isOpen={quickEditDrawer.open}
            onClose={handleClose}
            title="Edit"
            footer={
                <div className="flex items-center justify-end gap-2 w-full">
                    <Button size="sm" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                        onClick={handleSubmit(handleFormSubmit)}
                    >
                        Update
                    </Button>
                </div>
            }
        >
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <CollapsibleSection title="General">
                    <FormItem
                        label="Name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </FormItem>
                    <FormItem
                        label="Description"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    {...field}
                                    value={stripHTML(field.value)}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="SKU"
                        invalid={Boolean(errors.productCode)}
                        errorMessage={errors.productCode?.message}
                    >
                        <Controller
                            name="productCode"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </FormItem>
                    <FormItem
                        label="Category"
                        invalid={Boolean(errors.category)}
                        errorMessage={errors.category?.message}
                    >
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={categoryOptions}
                                    value={categoryOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                    placeholder="Select status"
                                />
                            )}
                        />
                    </FormItem>
                </CollapsibleSection>
                <CollapsibleSection title="Media">
                    <FormItem
                        invalid={Boolean(errors.imgList)}
                        errorMessage={errors.imgList?.message}
                        className="mb-4"
                    >
                        <Controller
                            name="imgList"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Upload
                                        draggable
                                        className="min-h-fit"
                                        showList={false}
                                        onChange={(_, files) =>
                                            handleUpload(
                                                field.onChange,
                                                field.value,
                                                files,
                                            )
                                        }
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center min-h-[130px]">
                                            <div className="text-[50px]">
                                                {/* <PiImagesThin /> */}
                                            </div>
                                            <p className="text-center mt-1 text-xs">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your image here, or{' '}
                                                    {''}
                                                </span>
                                                <span className="text-primary">
                                                    Click to browse
                                                </span>
                                            </p>
                                        </div>
                                    </Upload>
                                    <div
                                        className={classNames('space-y-2', {
                                            'mt-2': field.value.length > 0,
                                        })}
                                    >
                                        {field.value.map((img) => (
                                            <div
                                                key={img.id}
                                                className="border border-gray-200 dark:border-gray-600 p-2 rounded-md flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        className="rounded-md max-w-[40px] mx-auto dark:bg-transparent"
                                                        src={img.src}
                                                        alt={img.name}
                                                    />
                                                    <p className="font-medium heading-text truncate max-w-[250px]">
                                                        {img.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <button
                                                        className="opacity-50 hover:opacity-100 heading-text cursor-pointer p-1.5"
                                                        onClick={() =>
                                                            handleImageDelete(
                                                                field.onChange,
                                                                field.value,
                                                                img,
                                                            )
                                                        }
                                                    >
                                                        <LuX />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        />
                    </FormItem>
                </CollapsibleSection>
                <CollapsibleSection title="Pricing" defaultOpen={false}>
                    <FormItem
                        label="Price"
                        invalid={Boolean(errors.price)}
                        errorMessage={errors.price?.message}
                    >
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    thousandSeparator
                                    type="text"
                                    inputPrefix="$"
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Cost price"
                        invalid={Boolean(errors.costPerItem)}
                        errorMessage={errors.costPerItem?.message}
                    >
                        <Controller
                            name="costPerItem"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    thousandSeparator
                                    type="text"
                                    inputPrefix="$"
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Bulk discount price"
                        invalid={Boolean(errors.bulkDiscountPrice)}
                        errorMessage={errors.bulkDiscountPrice?.message}
                        className="w-full"
                    >
                        <Controller
                            name="bulkDiscountPrice"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    thousandSeparator
                                    type="text"
                                    inputPrefix="$"
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Tax rate(%)"
                        invalid={Boolean(errors.taxRate)}
                        errorMessage={errors.taxRate?.message}
                        className="w-full"
                    >
                        <Controller
                            name="taxRate"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="0"
                                    value={field.value}
                                    isAllowed={(values) => {
                                        const { floatValue } = values
                                        return (floatValue || 0) <= 100
                                    }}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                </CollapsibleSection>
                <CollapsibleSection title="Inventory" defaultOpen={false}>
                    <FormItem
                        label="Quantity"
                        invalid={Boolean(errors.stock)}
                        errorMessage={errors.stock?.message}
                        className="w-full"
                    >
                        <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Low stock threshold"
                        invalid={Boolean(errors.lowStockThreshold)}
                        errorMessage={errors.lowStockThreshold?.message}
                        className="w-full"
                    >
                        <Controller
                            name="lowStockThreshold"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Low stock alert"
                        invalid={Boolean(errors.allowBackorder)}
                        errorMessage={errors.allowBackorder?.message}
                        className="w-full"
                    >
                        <Controller
                            name="allowBackorder"
                            control={control}
                            render={({ field }) => (
                                <Radio.Group vertical {...field}>
                                    {backOrderOptions.map((option) => (
                                        <Radio
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            )}
                        />
                    </FormItem>
                </CollapsibleSection>
            </Form>
        </Drawer>
    )
}

export default QuickEdit
