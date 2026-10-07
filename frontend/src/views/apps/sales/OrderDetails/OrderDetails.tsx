import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import OrderDetailsHeader from './components/OrderDetailsHeader'
import OrderForm from './components/OrderForm'
import OrderFooter from './components/OrderFooter'
import useResponsive from '@/utils/hooks/useResponsive'
import { apiGetOrder } from '@/services/SalesService'
import { LiTrash } from '@/icons'
import sleep from '@/utils/sleep'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'
import type {
    FormMode,
    OrderFormData,
    Order,
    GetOrderDetailsResponse,
} from './types'

const OrderDetails = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()

    const mode: FormMode = orderId ? 'edit' : 'create'

    const { larger } = useResponsive()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDraftSaving, setIsDraftSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [orderData, setOrderData] = useState<Order | null>(null)

    const { data, isLoading } = useSWR(
        orderId ? [`/api/orders/${orderId}`] : null,
        () => {
            if (orderId) {
                return apiGetOrder<GetOrderDetailsResponse, { id: string }>({
                    id: orderId as string,
                })
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    useEffect(() => {
        if (data && mode === 'edit') {
            setOrderData(data)
        }
    }, [data, mode])

    const handleSubmit = async (formData: OrderFormData) => {
        setIsSubmitting(true)

        try {
            if (mode === 'create') {
                await sleep(1000)
                toast.push(
                    <Notification
                        type="success"
                        title={'Order created successfully'}
                    />,
                )
                console.log('formData', formData)
                navigate('/apps/sales/orders')
            } else if (mode === 'edit' && orderId) {
                await sleep(1000)
                toast.push(
                    <Notification
                        type="success"
                        title={'Order updated successfully'}
                    />,
                )
            }
        } catch (error) {
            console.error('Error submitting order:', error)
            toast.push(
                <Notification
                    type="danger"
                    title={
                        error instanceof Error
                            ? error.message
                            : 'Failed to save order'
                    }
                />,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveDraft = async (formData: OrderFormData) => {
        setIsDraftSaving(true)
        try {
            await sleep(1000)
            toast.push(
                <Notification
                    type="success"
                    title="Draft saved successfully"
                />,
            )
            console.log('formData', formData)
        } catch (error) {
            console.error('Error saving draft:', error)
            toast.push(
                <Notification
                    type="danger"
                    title={
                        error instanceof Error
                            ? error.message
                            : 'Failed to save draft'
                    }
                />,
            )
        } finally {
            setIsDraftSaving(false)
        }
    }

    const handleDelete = async () => {
        if (mode === 'edit' && orderId) {
            setIsDeleting(true)
        } else {
            navigate('/apps/sales/orders')
        }
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    if (mode === 'edit' && isLoading) {
        return <Loading loading />
    }

    return (
        <div className="h-full">
            <div className="flex flex-col h-[calc(100%-100px)]">
                <OrderDetailsHeader
                    mode={mode}
                    data={
                        orderData
                            ? { id: orderData.orderNumber || orderData.id }
                            : undefined
                    }
                />
                <Container size="md" className="p-4">
                    <OrderForm
                        mode={mode}
                        orderId={orderId}
                        onSubmit={handleSubmit}
                        onSaveDraft={handleSaveDraft}
                        initialData={orderData}
                    />
                </Container>
            </div>
            <OrderFooter containerSize="md">
                <div className="flex items-center justify-between gap-2 px-4">
                    <div>
                        <Button
                            className="text-error hover:text-error font-semibold"
                            icon={<LiTrash />}
                            onClick={() => setDeleteConfirmationOpen(true)}
                            loading={isDeleting}
                        >
                            {larger.sm && (
                                <span>
                                    {mode === 'edit' ? 'Delete' : 'Discard'}
                                </span>
                            )}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button loading={isDraftSaving} disabled={isSubmitting}>
                            Save Draft
                        </Button>
                        <Button
                            variant="solid"
                            form="order-form"
                            loading={isSubmitting}
                            disabled={isDraftSaving}
                        >
                            {mode === 'edit' ? 'Save Order' : 'Create Order'}
                        </Button>
                    </div>
                </div>
            </OrderFooter>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title={mode === 'edit' ? 'Delete Order' : 'Discard Changes'}
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleDelete}
            >
                <p>
                    {mode === 'edit'
                        ? 'Are you sure you want to delete this order? This action cannot be undone.'
                        : 'Are you sure you want to discard your changes? All unsaved data will be lost.'}
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default OrderDetails
