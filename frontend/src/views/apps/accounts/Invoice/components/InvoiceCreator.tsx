import { useState, useCallback, useMemo } from 'react'
import { Form } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import Alert from '@/components/ui/Alert'
import PreviewToggle from './PreviewToggle'
import InvoiceDetailsSection from './InvoiceDetailsSection'
import CustomerSection from './CustomerSection'
import AddressSection from './AddressSection'
import InvoiceItemsSection from './InvoiceItemsSection'
import CalculationSection from './CalculationSection'
import NotesSection from './NotesSection'
import InvoicePreview from './InvoicePreview'
import { useInvoiceForm } from '../hooks/useInvoiceForm'
import { getCurrencyByCode } from '../utils'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { LiSend } from '@/icons'
import { LuSave } from 'react-icons/lu'
import type { InvoiceFormData } from '../types'

const InvoiceCreator = ({ mode }: { mode: 'create' | 'edit' }) => {
    const [showPreview, setShowPreview] = useState(true)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        errors,
        isSubmitting,
        calculations,
        addItem,
        removeItem,
        updateItem,
        reorderItems,
        formData,
    } = useInvoiceForm()

    const currency = useMemo(
        () => getCurrencyByCode(formData.currency),
        [formData.currency],
    )

    const hasValidationErrors = useMemo(
        () => Object.keys(errors).length > 0,
        [errors],
    )

    const handleSaveDraft = useCallback(async (data: InvoiceFormData) => {
        try {
            setSubmitError(null)
            setSubmitSuccess(null)

            await sleep(1000) // Simulate API call

            setSubmitSuccess('Invoice saved as draft successfully!')
            console.log('Invoice saved as draft:', data)
        } catch (error) {
            console.error('Error saving invoice:', error)
            setSubmitError('Failed to save invoice. Please try again.')
        }
    }, [])

    const handleSendInvoice = useCallback(async (data: InvoiceFormData) => {
        try {
            setSubmitError(null)
            setSubmitSuccess(null)

            if (!data.customerId) {
                setSubmitError(
                    'Please select a customer before sending the invoice.',
                )
                return
            }

            if (
                !data.items ||
                data.items.length === 0 ||
                !data.items.some((item) => item.name)
            ) {
                setSubmitError(
                    'Please add at least one item before sending the invoice.',
                )
                return
            }

            await sleep(1000)

            setSubmitSuccess('Invoice sent successfully!')
        } catch (error) {
            console.error('Error sending invoice:', error)
            setSubmitError('Failed to send invoice. Please try again.')
        }
    }, [])

    const clearMessages = useCallback(() => {
        setSubmitError(null)
        setSubmitSuccess(null)
    }, [])

    return (
        <Container className="p-4">
            <div className="py-6">
                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4>
                            {mode === 'create'
                                ? 'Create New Invoice'
                                : 'Edit Invoice'}
                        </h4>
                        <p className="mt-1">
                            {mode === 'create'
                                ? 'Create a new invoice for your customer'
                                : 'Update invoice details and information'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:justify-end">
                        <PreviewToggle
                            onToggle={setShowPreview}
                            initialVisible={showPreview}
                            className="hidden sm:block"
                        />

                        <Button
                            variant="subtle"
                            onClick={handleSubmit(handleSaveDraft)}
                            loading={isSubmitting}
                            icon={<LuSave className="text-base" />}
                            type="button"
                        >
                            Save as Draft
                        </Button>

                        <Button
                            variant="solid"
                            onClick={handleSubmit(handleSendInvoice)}
                            loading={isSubmitting}
                            icon={<LiSend className="text-base" />}
                            type="button"
                        >
                            Send Invoice
                        </Button>
                    </div>
                </div>
                {submitError && (
                    <div className="mb-6">
                        <Alert
                            type="danger"
                            showIcon
                            closable
                            onClose={clearMessages}
                        >
                            {submitError}
                        </Alert>
                    </div>
                )}

                {submitSuccess && (
                    <div className="mb-6">
                        <Alert
                            type="success"
                            showIcon
                            closable
                            onClose={clearMessages}
                        >
                            {submitSuccess}
                        </Alert>
                    </div>
                )}

                {hasValidationErrors && (
                    <div className="mb-6">
                        <Alert
                            type="danger"
                            showIcon
                            title="Form Validation Errors"
                        >
                            Please fix the validation errors below before
                            sending the invoice.
                        </Alert>
                    </div>
                )}

                <div
                    className={classNames(
                        'grid gap-6',
                        showPreview
                            ? 'grid-cols-1 lg:grid-cols-2'
                            : 'grid-cols-1',
                    )}
                >
                    <div role="main" aria-label="Invoice form">
                        <Form>
                            <div>
                                <InvoiceDetailsSection
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                />
                                <CustomerSection
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                />
                                {formData.customerId && (
                                    <AddressSection
                                        control={control}
                                        errors={errors}
                                        watch={watch}
                                        setValue={setValue}
                                    />
                                )}
                                <InvoiceItemsSection
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                    addItem={addItem}
                                    removeItem={removeItem}
                                    updateItem={updateItem}
                                    reorderItems={reorderItems}
                                    currency={formData.currency}
                                />
                                <CalculationSection
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                    calculations={calculations}
                                    currency={formData.currency}
                                />
                                <NotesSection
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                />
                            </div>
                        </Form>
                    </div>
                    {showPreview && (
                        <div
                            className="lg:sticky lg:top-6 lg:h-fit"
                            role="complementary"
                            aria-label="Invoice preview"
                        >
                            <InvoicePreview
                                data={formData}
                                currency={currency}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}

export default InvoiceCreator
