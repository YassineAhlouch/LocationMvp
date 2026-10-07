import { Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import FormFieldWrapper from './FormFieldWrapper'
import SectionCard from './SectionCard'
import { LiAlertCircle } from '@/icons'
import type { NotesSectionProps } from '../types'

const CharacterCount = ({
    current,
    limit,
    isError,
}: {
    current: number
    limit: number
    isError: boolean
}) => (
    <div
        className={`text-xs mt-1 ${isError ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
    >
        {current}/{limit} characters
    </div>
)

const NotesSection = ({ control, errors, watch }: NotesSectionProps) => {
    const watchedInternalNotes = watch?.('internalNotes') || ''
    const watchedCustomerNotes = watch?.('customerNotes') || ''

    const INTERNAL_NOTES_LIMIT = 1000
    const CUSTOMER_NOTES_LIMIT = 500

    const internalNotesCount = watchedInternalNotes.length
    const customerNotesCount = watchedCustomerNotes.length

    return (
        <SectionCard
            title="Notes & Comments"
            description="Add internal notes for staff and customer-visible comments"
            border={false}
        >
            <div className="space-y-6">
                <FormFieldWrapper
                    label="Internal Notes"
                    error={errors.internalNotes?.message}
                    description="These notes are only visible to staff members and will not appear on customer-facing documents"
                >
                    <div>
                        <Controller
                            name="internalNotes"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    textArea
                                    rows={4}
                                    placeholder="Add internal notes for staff reference..."
                                    className="resize-none"
                                    invalid={Boolean(errors.internalNotes)}
                                />
                            )}
                        />
                        <CharacterCount
                            current={internalNotesCount}
                            limit={INTERNAL_NOTES_LIMIT}
                            isError={internalNotesCount > INTERNAL_NOTES_LIMIT}
                        />
                    </div>
                </FormFieldWrapper>

                <FormFieldWrapper
                    label={
                        <span className="flex items-center gap-1">
                            <span className="lead-none">Customer Notes</span>
                            <Tooltip
                                title="This notes will be visible to the customer"
                                className="text-center"
                            >
                                <LiAlertCircle />
                            </Tooltip>
                        </span>
                    }
                    error={errors.customerNotes?.message}
                    description="These notes will be visible to customers on invoices, emails, and other customer-facing documents"
                >
                    <div>
                        <Controller
                            name="customerNotes"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    textArea
                                    rows={3}
                                    placeholder="Add notes that will be visible to the customer..."
                                    className="resize-none"
                                    invalid={Boolean(errors.customerNotes)}
                                />
                            )}
                        />
                        <div className="flex items-center">
                            <CharacterCount
                                current={customerNotesCount}
                                limit={CUSTOMER_NOTES_LIMIT}
                                isError={
                                    customerNotesCount > CUSTOMER_NOTES_LIMIT
                                }
                            />
                        </div>
                    </div>
                </FormFieldWrapper>
            </div>
        </SectionCard>
    )
}

export default NotesSection
