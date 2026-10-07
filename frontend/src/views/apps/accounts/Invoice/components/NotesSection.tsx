import { Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import SectionCard from './SectionCard'
import FormFieldWrapper from './FormFieldWrapper'
import type { FormSectionBaseProps } from '../types'

const NotesSection = ({ control }: FormSectionBaseProps) => {
    return (
        <SectionCard
            title="Additional Information"
            description="Notes and terms for this invoice"
            border={false}
        >
            <div className="space-y-4">
                <FormFieldWrapper
                    label="Notes"
                    description="Internal notes or special instructions"
                >
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                textArea
                                rows={3}
                                placeholder="Add any notes or special instructions..."
                            />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Terms & Conditions"
                    description="Payment terms and conditions"
                >
                    <Controller
                        name="terms"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                textArea
                                rows={3}
                                placeholder="Payment terms and conditions..."
                            />
                        )}
                    />
                </FormFieldWrapper>
            </div>
        </SectionCard>
    )
}

export default NotesSection
