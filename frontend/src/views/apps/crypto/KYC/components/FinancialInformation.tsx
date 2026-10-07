import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import { useKYCStore } from '../store/kycStore'
import { financialInfoSchema } from '../utils/validationSchemas'
import {
    EMPLOYMENT_STATUS_OPTIONS,
    SOURCE_OF_FUNDS_OPTIONS,
    ANNUAL_INCOME_RANGE_OPTIONS,
} from '../utils/constants'
import { LiAlertCircle } from '@/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IndividualFinancial } from '../types'

const FinancialInformation = () => {
    const { individualData, updateIndividualData } = useKYCStore()

    const {
        control,
        formState: { errors },
        watch,
    } = useForm<IndividualFinancial>({
        resolver: zodResolver(financialInfoSchema),
        defaultValues: individualData.financial,
        mode: 'onChange',
    })

    const sourceOfFunds = watch('sourceOfFunds')

    useEffect(() => {
        const subscription = watch((value) => {
            updateIndividualData('financial', value)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateIndividualData])

    return (
        <div>
            <div className="mb-8 -mt-4">
                <p>
                    Please provide your financial information for compliance
                    purposes.
                </p>
            </div>
            <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <FormItem
                        label="Employment Status"
                        invalid={Boolean(errors.employmentStatus)}
                        errorMessage={errors.employmentStatus?.message}
                        asterisk
                    >
                        <Controller
                            name="employmentStatus"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select your employment status"
                                    options={EMPLOYMENT_STATUS_OPTIONS}
                                    value={EMPLOYMENT_STATUS_OPTIONS.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Source of Funds"
                        invalid={Boolean(errors.sourceOfFunds)}
                        errorMessage={errors.sourceOfFunds?.message}
                        asterisk
                    >
                        <Controller
                            name="sourceOfFunds"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select your source of funds"
                                    options={SOURCE_OF_FUNDS_OPTIONS}
                                    value={SOURCE_OF_FUNDS_OPTIONS.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Annual Income Range"
                        invalid={Boolean(errors.annualIncomeRange)}
                        errorMessage={errors.annualIncomeRange?.message}
                        asterisk
                    >
                        <Controller
                            name="annualIncomeRange"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select your annual income range"
                                    options={ANNUAL_INCOME_RANGE_OPTIONS}
                                    value={ANNUAL_INCOME_RANGE_OPTIONS.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Tax Identification Number (Optional)"
                        invalid={Boolean(errors.taxId)}
                        errorMessage={errors.taxId?.message}
                    >
                        <Controller
                            name="taxId"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter your tax ID (if applicable)"
                                />
                            )}
                        />
                    </FormItem>

                    {sourceOfFunds === 'other' && (
                        <FormItem
                            label="Please Specify Source of Funds"
                            invalid={Boolean(errors.sourceOfFundsOther)}
                            errorMessage={errors.sourceOfFundsOther?.message}
                            asterisk
                            className="col-span-2"
                        >
                            <Controller
                                name="sourceOfFundsOther"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        textArea
                                        placeholder="Please specify your source of funds"
                                    />
                                )}
                            />
                        </FormItem>
                    )}
                </div>
                <Card>
                    <div className="flex gap-4">
                        <div className="mt-0.5">
                            <LiAlertCircle className="heading-text text-lg" />
                        </div>
                        <div>
                            <h6 className="mb-2 font-semibold">
                                Important Information:
                            </h6>
                            <ul className="space-y-1">
                                <li>
                                    - All information provided must be accurate
                                    and truthful
                                </li>
                                <li>
                                    - This information helps us comply with
                                    anti-money laundering regulations
                                </li>
                                <li>
                                    - Your financial information is kept
                                    strictly confidential
                                </li>
                                <li>
                                    - You may be required to provide additional
                                    documentation to verify your source of funds
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </Form>
        </div>
    )
}

export default FinancialInformation
