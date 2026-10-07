import { Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import SectionCard from './SectionCard'
import FormFieldWrapper from './FormFieldWrapper'
import type { FormSectionBaseProps } from '../types'

const AddressSection = ({ control, errors }: FormSectionBaseProps) => {
    return (
        <SectionCard
            title="Billing Address"
            description="Customer billing address information"
        >
            <div className="space-y-4">
                <FormFieldWrapper
                    label="Address Line 1"
                    error={errors.billingAddress?.addressLine1?.message}
                    required
                >
                    <Controller
                        name="billingAddress.addressLine1"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Street address"
                                autoComplete="address-line1"
                            />
                        )}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Address Line 2"
                    error={errors.billingAddress?.addressLine2?.message}
                >
                    <Controller
                        name="billingAddress.addressLine2"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Apartment, suite, etc. (optional)"
                                autoComplete="address-line2"
                            />
                        )}
                    />
                </FormFieldWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper
                        label="City"
                        error={errors.billingAddress?.city?.message}
                        required
                    >
                        <Controller
                            name="billingAddress.city"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="City"
                                    autoComplete="address-level2"
                                />
                            )}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="State/Province"
                        error={errors.billingAddress?.state?.message}
                        required
                    >
                        <Controller
                            name="billingAddress.state"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="State or Province"
                                    autoComplete="address-level1"
                                />
                            )}
                        />
                    </FormFieldWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper
                        label="Postal Code"
                        error={errors.billingAddress?.postalCode?.message}
                        required
                    >
                        <Controller
                            name="billingAddress.postalCode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Postal code"
                                    autoComplete="postal-code"
                                />
                            )}
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="Country"
                        error={errors.billingAddress?.country?.message}
                        required
                    >
                        <Controller
                            name="billingAddress.country"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Country"
                                    autoComplete="country"
                                />
                            )}
                        />
                    </FormFieldWrapper>
                </div>
            </div>
        </SectionCard>
    )
}

export default AddressSection
