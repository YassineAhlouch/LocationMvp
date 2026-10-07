import { useState } from 'react'
import { Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SectionCard from './SectionCard'
import FormFieldWrapper from './FormFieldWrapper'
import classNames from '@/utils/classNames'
import { orderStatusOptions } from '../utils/constants'
import type { StatusSectionProps } from '../types'

const StatusSection = ({
    control,
    errors,
    watch,
    setValue,
}: StatusSectionProps) => {
    const [showWarningDialog, setShowWarningDialog] = useState(false)
    const [pendingStatusChange, setPendingStatusChange] = useState<
        string | null
    >(null)

    const watchedStatus = watch?.('status')

    const statusOptions = orderStatusOptions.map((status) => ({
        value: status.value,
        label: status.label,
        description: status.description,
        color: status.color,
    }))

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === 'cancelled') {
            setPendingStatusChange(newStatus)
            setShowWarningDialog(true)
            return
        }

        // Apply the status change
        setValue?.(
            'status',
            newStatus as
                | 'pending'
                | 'confirmed'
                | 'processing'
                | 'shipped'
                | 'delivered'
                | 'cancelled',
        )
    }

    const confirmStatusChange = () => {
        if (pendingStatusChange && setValue) {
            setValue(
                'status',
                pendingStatusChange as
                    | 'pending'
                    | 'confirmed'
                    | 'processing'
                    | 'shipped'
                    | 'delivered'
                    | 'cancelled',
            )
        }
        setShowWarningDialog(false)
        setPendingStatusChange(null)
    }

    const cancelStatusChange = () => {
        setShowWarningDialog(false)
        setPendingStatusChange(null)
    }

    const requiresTrackingInfo = watchedStatus === 'shipped'
    const requiresCancellationReason = watchedStatus === 'cancelled'

    return (
        <>
            <SectionCard
                title="Order Status"
                description="Track order progress and manage status changes"
            >
                <FormFieldWrapper
                    label="Order Status"
                    error={errors.status?.message}
                    required
                    description="Current order status in the fulfillment process"
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={statusOptions}
                                value={statusOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    handleStatusChange(
                                        option?.value || 'pending',
                                    )
                                }
                                placeholder="Select order status"
                                customInputDisplay={(selectedItem) => (
                                    <SelectInputWithPrefix
                                        label={selectedItem?.label}
                                        prefix={
                                            selectedItem && (
                                                <span
                                                    className={classNames(
                                                        'h-3 w-3 rounded-sm',
                                                        selectedItem.color,
                                                    )}
                                                ></span>
                                            )
                                        }
                                    />
                                )}
                                customOption={({
                                    option,
                                    selected,
                                    CheckIcon,
                                }) => (
                                    <SelectOptionWithPrefix
                                        label={option.label}
                                        prefix={
                                            <span
                                                className={classNames(
                                                    'h-3 w-3 rounded-sm',
                                                    option.color,
                                                )}
                                            ></span>
                                        }
                                        selected={selected}
                                        checkIcon={CheckIcon}
                                    />
                                )}
                            />
                        )}
                    />
                </FormFieldWrapper>

                <div className="flex flex-col md:flex-row gap-4">
                    {(watchedStatus === 'shipped' ||
                        watchedStatus === 'delivered') && (
                        <div className="flex-1">
                            <FormFieldWrapper
                                label={
                                    watchedStatus === 'shipped'
                                        ? 'Ship Date'
                                        : 'Delivery Date'
                                }
                                error={errors.statusDate?.message}
                                required={watchedStatus === 'shipped'}
                                description={`Date when order was ${watchedStatus}`}
                            >
                                <Controller
                                    name="statusDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select date"
                                        />
                                    )}
                                />
                            </FormFieldWrapper>
                        </div>
                    )}
                    {requiresTrackingInfo && (
                        <div className="flex-1">
                            <FormFieldWrapper
                                label="Tracking Number"
                                error={errors.trackingNumber?.message}
                                required
                                description="Shipping carrier tracking number"
                            >
                                <Controller
                                    name="trackingNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter tracking number"
                                        />
                                    )}
                                />
                            </FormFieldWrapper>
                        </div>
                    )}
                </div>

                {requiresCancellationReason && (
                    <div className="mt-4">
                        <FormFieldWrapper
                            label="Cancellation Reason"
                            error={errors.cancellationReason?.message}
                            required
                            description="Reason for order cancellation"
                        >
                            <Controller
                                name="cancellationReason"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        textArea
                                        rows={3}
                                        placeholder="Enter reason for cancellation"
                                    />
                                )}
                            />
                        </FormFieldWrapper>
                    </div>
                )}
            </SectionCard>
            <ConfirmDialog
                isOpen={showWarningDialog}
                onClose={cancelStatusChange}
                onCancel={cancelStatusChange}
                onConfirm={confirmStatusChange}
                type="danger"
                title="Confirm to cancel paid order?"
                cancelText="Keep Current Status"
                confirmText="Cancel Order Anyway"
                confirmButtonProps={{ color: 'red' }}
            >
                <p className="mb-4">
                    The order has been marked as paid. Please ensure this action
                    has been properly reviewed. Cancelling a paid order may
                    require:
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Processing a refund</li>
                    <li>Updating payment records</li>
                    <li>Notifying the customer</li>
                    <li>Inventory adjustments</li>
                </ul>
            </ConfirmDialog>
        </>
    )
}

export default StatusSection
