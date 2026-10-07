import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import FormFieldWrapper from './FormFieldWrapper'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CreditCardForm from '@/components/view/CreditCardForm'
import { apiGetAccountBillingSettings } from '@/services/AccountService'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import { LiAdd, LiTrash, LiClock, LiTick, LiCross, LiDownload } from '@/icons'
import ImposibleCube from '@/components/svg/icons/ImposibleCube'
import ImposibleSphere from '@/components/svg/icons/ImposibleSphere'
import ImposibleTriangle from '@/components/svg/icons/ImposibleTriangle'
import type {
    GetSettingsBillingResponse,
    SubscriptionPlan,
    PaymentMethod,
    BillingHistoryItem,
} from '../types'
import type { CreditCard as BaseCreditCard } from '@/components/view/CreditCardForm'

type CreditCard = BaseCreditCard & {
    id?: string
}

const PlanIcon = ({ planId }: { planId: string }) => {
    const entity = (() => {
        switch (planId) {
            case 'basic':
                return {
                    icon: <ImposibleSphere pathClass="stroke-16" />,
                    className: 'bg-primary',
                }
            case 'business':
                return {
                    icon: <ImposibleTriangle pathClass="stroke-16" />,
                    className: 'bg-yellow-500',
                }
            case 'enterprise':
                return {
                    icon: <ImposibleCube pathClass="stroke-16" />,
                    className: 'bg-purple-500',
                }
            default:
                return {
                    icon: <ImposibleSphere pathClass="stroke-16" />,
                    className: 'bg-primary',
                }
        }
    })()

    if (!entity) {
        return null
    }

    return (
        <div
            className={classNames(
                'flex items-center justify-center text-white h-8 w-8 p-1 rounded-lg',
                entity.className,
            )}
        >
            {entity.icon}
        </div>
    )
}

interface PlanCardProps {
    plan: SubscriptionPlan
    isActive: boolean
    onSelect?: (planId: string) => void
}

const PlanCard = ({ plan, isActive, onSelect }: PlanCardProps) => {
    return (
        <div
            className={classNames(
                'border border-gray-200 dark:border-gray-800 rounded-lg relative p-4 cursor-pointer transition-all duration-200 hover:bg-primary-subtle',
                isActive
                    ? 'border-primary ring-1 ring-primary'
                    : 'hover:border-primary dark:hover:primary',
            )}
            onClick={() => onSelect?.(plan.id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect?.(plan.id)
                }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={isActive}
            aria-label={`Select ${plan.name} plan for ${plan.price}`}
        >
            {isActive && (
                <div className="absolute top-7 right-4" aria-hidden="true">
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <LiTick className="text-white text-xs" />
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
                <div>
                    <PlanIcon planId={plan.id} />
                </div>
                <div>
                    <div className="flex items-center gap-1 heading-text font-medium">
                        <span>{plan.name}</span>
                        <span>-</span>
                        <span className="font-bold">{plan.price}</span>
                    </div>

                    <p>{plan.description}</p>
                </div>
            </div>
        </div>
    )
}

type PaymentMethodCardProps = {
    paymentMethod: PaymentMethod
    onEdit?: (paymentMethod: PaymentMethod) => void
    onRemove?: (methodId: string) => void
}

const PaymentMethodCard = ({
    paymentMethod,
    onEdit,
    onRemove,
}: PaymentMethodCardProps) => {
    return (
        <div className={classNames('p-4 transition-all duration-200')}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <img
                            className="h-6"
                            src={`/img/thumbs/payment/${paymentMethod.type}.png`}
                            alt={paymentMethod.type}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium heading-text">
                                {paymentMethod.type.charAt(0).toUpperCase() +
                                    paymentMethod.type.slice(1)}{' '}
                                •••• {paymentMethod.lastFour}
                            </span>
                            {paymentMethod.isPrimary && (
                                <Tag className="bg-primary-subtle text-primary border-0">
                                    Primary
                                </Tag>
                            )}
                        </div>
                        <span>Expiry {paymentMethod.expiryDate}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                    {!paymentMethod.isPrimary && (
                        <Button
                            variant="ghost"
                            onClick={() => onRemove?.(paymentMethod.id)}
                            className=" hover:text-error hover:bg-error-subtle dark:hover:bg-error-subtle"
                            icon={<LiTrash />}
                        />
                    )}
                    <Button onClick={() => onEdit?.(paymentMethod)}>
                        Edit
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Billing = () => {
    const [deletePaymentMethodDialog, setDeletePaymentMethodDialog] = useState<{
        open: boolean
        methodId: string
    }>({
        open: false,
        methodId: '',
    })

    const [creditCardFormDialog, setCreditCardFormDialog] = useState<{
        open: boolean
        type: 'add' | 'edit' | ''
        card?: CreditCard
    }>({
        open: false,
        type: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isDeletePaymentMethodLoading, setIsDeletePaymentMethodLoading] =
        useState(false)

    const { data, mutate } = useSWR(
        [`/api/settings/billing`],
        () => apiGetAccountBillingSettings<GetSettingsBillingResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const handlePlanSelect = (planId: string) => {
        if (data) {
            mutate(
                {
                    ...data,
                    currentPlan: data.availablePlans.find(
                        (plan) => plan.id === planId,
                    ) as SubscriptionPlan,
                    availablePlans: data.availablePlans.map((plan) =>
                        plan.id === planId
                            ? { ...plan, isActive: true }
                            : { ...plan, isActive: false },
                    ),
                },
                false,
            )
        }
    }

    const handleDeletePaymentMethod = (methodId: string) => {
        setDeletePaymentMethodDialog({
            open: true,
            methodId,
        })
    }

    const handleDeletePaymentMethodConfirm = async () => {
        if (data) {
            setIsDeletePaymentMethodLoading(true)
            await sleep(1000)
            mutate(
                {
                    ...data,
                    paymentMethods: data.paymentMethods.filter(
                        (method) =>
                            method.id !== deletePaymentMethodDialog.methodId,
                    ),
                },
                false,
            )
            setDeletePaymentMethodDialog({
                open: false,
                methodId: '',
            })
            setIsDeletePaymentMethodLoading(false)
        }
    }

    const handleDeletePaymentMethodCancel = () => {
        setDeletePaymentMethodDialog({
            open: false,
            methodId: '',
        })
    }

    const handleCloseCreditCardFormDialog = () => {
        setCreditCardFormDialog({
            open: false,
            type: '',
        })
    }

    const handleAddPaymentMethod = () => {
        setCreditCardFormDialog({
            open: true,
            type: 'add',
        })
    }

    const handleAddPaymentMethodConfirm = async (card: CreditCard) => {
        if (data) {
            await sleep(1000)

            const newPaymentMethod: PaymentMethod = {
                id: `card-${Date.now()}`,
                type: card.ccNumber?.startsWith('4')
                    ? 'visa'
                    : card.ccNumber?.startsWith('5')
                      ? 'master'
                      : 'visa',
                lastFour: card.ccNumber?.slice(-4) || '0000',
                expiryDate: card.cardExpiry || '',
                cardHolderName: card.cardHolderName || '',
                isPrimary: card.isPrimary || false,
            }

            // If setting as primary, make all others non-primary
            const updatedPaymentMethods = card.isPrimary
                ? data.paymentMethods.map((method) => ({
                      ...method,
                      isPrimary: false,
                  }))
                : data.paymentMethods

            mutate(
                {
                    ...data,
                    paymentMethods: [
                        ...updatedPaymentMethods,
                        newPaymentMethod,
                    ],
                },
                false,
            )

            setCreditCardFormDialog({
                open: false,
                type: '',
            })
        }
    }

    const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
        setCreditCardFormDialog({
            open: true,
            type: 'edit',
            card: {
                cardExpiry: paymentMethod.expiryDate.replace('/20', '/'),
                cardHolderName: paymentMethod.cardHolderName,
                isPrimary: paymentMethod.isPrimary,
                id: paymentMethod.id,
            },
        })
    }

    const handleEditPaymentMethodConfirm = async (card: CreditCard) => {
        if (data) {
            setIsSubmitting(true)
            await sleep(1000)

            const newPaymentMethod = data.paymentMethods

            if (card.isPrimary) {
                newPaymentMethod.forEach((method) => {
                    if (method.id !== card.id) {
                        method.isPrimary = false
                    }
                })
            }

            const updatedPaymentMethods = newPaymentMethod.map((method) => {
                if (method.id === card.id) {
                    return {
                        ...method,
                        lastFour: card.ccNumber?.slice(-4) || method.lastFour,
                        cardHolderName:
                            card.cardHolderName || method.cardHolderName,
                        expiryDate: card.cardExpiry || method.expiryDate,
                        isPrimary: card.isPrimary || method.isPrimary,
                    }
                }
                return method
            })

            mutate(
                {
                    ...data,
                    paymentMethods: updatedPaymentMethods,
                },
                false,
            )

            setCreditCardFormDialog({
                open: false,
                type: '',
            })

            setIsSubmitting(false)
        }
    }

    const downloadTextFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    const handleDownloadInvoice = (invoiceId: string) => {
        const invoice = data?.billingHistory?.find(
            (item) => item.id === invoiceId,
        )
        if (invoice) {
            const filename = `invoice-${invoice.date.replace(' ', '-').toLowerCase()}.txt`
            const content = `Invoice Details
================

Invoice ID: ${invoice.id}
Date: ${invoice.date}
Status: ${invoice.status}
Amount: ${invoice.amount}
Plan: ${invoice.plan}
`

            downloadTextFile(content, filename)
        }
    }

    const handleDownloadAll = () => {
        if (data?.billingHistory) {
            const content = `Billing History Report
=====================

Generated on: ${new Date().toLocaleDateString()}

${data.billingHistory
    .map(
        (invoice) => `
Invoice: ${invoice.date}
Status: ${invoice.status}
Amount: ${invoice.amount}
Plan: ${invoice.plan}
-------------------`,
    )
    .join('\n')}

Total Invoices: ${data.billingHistory.length}
Thank you for your business!`

            downloadTextFile(content, 'billing-history.txt')
        }
    }

    const getStatusBadge = (status: BillingHistoryItem['status']) => {
        switch (status) {
            case 'paid':
                return (
                    <Tag className="bg-success-subtle text-success border-0">
                        <LiTick className="mr-1" />
                        Paid
                    </Tag>
                )
            case 'pending':
                return (
                    <Badge className="bg-warning text-white">
                        <LiClock className="mr-1" />
                        Pending
                    </Badge>
                )
            case 'failed':
                return (
                    <Badge className="bg-error text-white">
                        <LiCross className="mr-1" />
                        Failed
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <div className="space-y-4">
            {data && (
                <>
                    <FormFieldWrapper
                        label="Current plan"
                        description="We'll credit your account if you need to downgrade during the billing cycle."
                        labelClass="max-w-[350px]"
                        border={true}
                    >
                        <div className="flex flex-col gap-4">
                            {data?.availablePlans?.map((plan) => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    isActive={plan.isActive || false}
                                    onSelect={handlePlanSelect}
                                />
                            ))}
                        </div>
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="Payment methods"
                        description="Update or remove your payment methods."
                        labelClass="max-w-[350px]"
                        border={true}
                    >
                        <div className="space-y-4">
                            <div className="border border-gray-200 dark:border-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-800">
                                {data?.paymentMethods
                                    ?.sort(
                                        (a, b) =>
                                            (b.isPrimary ? 1 : 0) -
                                            (a.isPrimary ? 1 : 0),
                                    )
                                    ?.map((method) => (
                                        <PaymentMethodCard
                                            key={method.id}
                                            paymentMethod={method}
                                            onEdit={handleEditPaymentMethod}
                                            onRemove={() =>
                                                handleDeletePaymentMethod(
                                                    method.id,
                                                )
                                            }
                                        />
                                    ))}
                            </div>

                            <div>
                                <Button
                                    variant="link"
                                    onClick={handleAddPaymentMethod}
                                    icon={<LiAdd />}
                                    className="px-0"
                                >
                                    Add payment method
                                </Button>
                            </div>
                        </div>
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="Billing history"
                        description={
                            <div className="space-y-4">
                                <div>
                                    Preview and download your billing history.
                                    Please reach out to our team with questions.
                                </div>
                                <Button
                                    onClick={handleDownloadAll}
                                    icon={<LiDownload />}
                                >
                                    Download all
                                </Button>
                            </div>
                        }
                        labelClass="max-w-[350px]"
                        border={false}
                    >
                        <div className="overflow-x-auto">
                            <Table hoverable={false}>
                                <Table.THead>
                                    <Table.Tr>
                                        <Table.Th>Invoice</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Amount</Table.Th>
                                        <Table.Th>Plan</Table.Th>
                                        <Table.Th className="text-right">
                                            Action
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.THead>
                                <Table.TBody>
                                    {data?.billingHistory?.map((item) => (
                                        <Table.Tr key={item.id}>
                                            <Table.Td className="font-medium heading-text">
                                                {item.date}
                                            </Table.Td>
                                            <Table.Td>
                                                {getStatusBadge(item.status)}
                                            </Table.Td>
                                            <Table.Td className="font-medium">
                                                {item.amount}
                                            </Table.Td>
                                            <Table.Td>{item.plan}</Table.Td>
                                            <Table.Td className="text-right">
                                                <Button
                                                    variant="link"
                                                    onClick={() =>
                                                        handleDownloadInvoice(
                                                            item.id,
                                                        )
                                                    }
                                                    className="px-0"
                                                >
                                                    Download
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.TBody>
                            </Table>
                        </div>
                    </FormFieldWrapper>
                </>
            )}
            <ConfirmDialog
                isOpen={deletePaymentMethodDialog.open}
                type="danger"
                title="Delete payment method?"
                onClose={handleDeletePaymentMethodCancel}
                onCancel={handleDeletePaymentMethodCancel}
                onConfirm={handleDeletePaymentMethodConfirm}
                confirmButtonProps={{ loading: isDeletePaymentMethodLoading }}
            >
                <p>
                    {' '}
                    Are you sure you want to delete this payment method? This
                    action can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
            <Dialog
                isOpen={creditCardFormDialog.open}
                onClose={handleCloseCreditCardFormDialog}
            >
                <div className="mb-4">
                    <h5>
                        {creditCardFormDialog.type === 'add'
                            ? 'Add payment method'
                            : 'Edit payment method'}
                    </h5>
                </div>
                <CreditCardForm
                    onSubmit={
                        creditCardFormDialog.type === 'edit'
                            ? handleEditPaymentMethodConfirm
                            : handleAddPaymentMethodConfirm
                    }
                    defaultValues={
                        (creditCardFormDialog.type === 'edit'
                            ? creditCardFormDialog.card
                            : {
                                  cardHolderName: '',
                                  ccNumber: '',
                                  cardExpiry: '',
                                  code: '',
                              }) as CreditCard
                    }
                    isSubmitting={isSubmitting}
                    showSetPrimaryCheckbox={true}
                />
            </Dialog>
        </div>
    )
}

export default Billing
