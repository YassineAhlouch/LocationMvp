import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ProductDetailsHeader from './components/ProductDetailsHeader'
import ProductFooter from './components/ProductFooter'
import ProductDetailContent from './components/ProductDetailContent'
import { useProductDetailsStore } from './store/productDetailsStore'
import { apiGetProduct } from '@/services/SalesService'
import { LiTrash } from '@/icons'
import sleep from '@/utils/sleep'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import type {
    GetProductResponse,
    ProductFormSchema,
    FormRefMethod,
    FormMode,
} from './types'

const ProductDetails = () => {
    const { productId } = useParams()

    const formRef = useRef<FormRefMethod>(null)

    const navigate = useNavigate()

    const mode: FormMode = productId ? 'edit' : 'create'

    const setInvalidFields = useProductDetailsStore(
        (state) => state.setInvalidFields,
    )

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const { data, isLoading } = useSWR(
        [`/api/products/${productId}`],
        () => {
            if (productId) {
                return apiGetProduct<GetProductResponse, { id: string }>({
                    id: productId as string,
                })
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const handleSave = async (values: ProductFormSchema) => {
        setInvalidFields([])
        setIsSubmitting(true)
        await sleep(1000)
        toast.push(
            <Notification type="success">
                <span className="font-medium heading-text">
                    {mode === 'create'
                        ? 'Product created!'
                        : 'Product updated!'}
                </span>
            </Notification>,
            { placement: 'top-center' },
        )
        console.log('submitted', values)
        setIsSubmitting(false)
    }

    const handleBeforeSubmit = (invalidFields: string[]) => {
        setInvalidFields(invalidFields)
        toast.push(
            <Notification type="danger">
                <span className="font-medium heading-text">
                    Please fill in all the required fields
                </span>
            </Notification>,
            { placement: 'top-center' },
        )
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    const handleSaveDraft = async () => {
        setIsSaving(true)
        if (formRef.current) {
            const form = formRef.current.getForm()
            console.log('Saved draft', form.getValues())
            await sleep(1000)
            toast.push(
                <Notification type="success">
                    <span className="font-medium heading-text">
                        Draft saved!
                    </span>
                </Notification>,
                { placement: 'top-center' },
            )
        }
        setIsSaving(false)
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        setDeleteConfirmationOpen(true)
        toast.push(
            <Notification type="success">
                <span className="font-medium heading-text">
                    {mode === 'create'
                        ? 'Record discarded!'
                        : 'Product deleted!'}
                </span>
            </Notification>,
            { placement: 'top-center' },
        )
        await sleep(1000)
        setIsDeleting(false)
        navigate('/apps/sales/products')
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            <div className="h-full">
                <div className="flex flex-col h-[calc(100%-100px)]">
                    <ProductDetailsHeader
                        data={
                            mode === 'edit' && data
                                ? {
                                      id: data.id,
                                      name: data.name,
                                      productCode: data.productCode,
                                      img: data.imgList[0],
                                  }
                                : undefined
                        }
                        mode={mode}
                        isLoading={isLoading}
                    />
                    <div>
                        <ProductDetailContent
                            onSubmit={handleSave}
                            onBeforeSubmit={handleBeforeSubmit}
                            data={data}
                            ref={formRef}
                        />
                    </div>
                </div>
                <ProductFooter>
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <Button
                                className="text-error hover:text-error font-semibold"
                                icon={<LiTrash />}
                                onClick={() => setDeleteConfirmationOpen(true)}
                            >
                                {mode === 'edit' ? 'Delete' : 'Discard'}
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleSaveDraft}
                                loading={isSaving}
                            >
                                Save Draft
                            </Button>
                            <Button
                                variant="solid"
                                form="product-form"
                                loading={isSubmitting}
                            >
                                {mode === 'edit' ? 'Save' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </ProductFooter>
            </div>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title={mode === 'edit' ? 'Delete Product' : 'Discard Changes'}
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{
                    loading: isDeleting,
                }}
            >
                <p>
                    {mode === 'edit'
                        ? `Are you sure you want to remove this product? This action can't be undo.`
                        : `Are you sure you want to discard this creation? This action can't be undo.`}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProductDetails
