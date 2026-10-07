import { useState, useMemo } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem, Form } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import { countryList } from '@/constants/countries.constant'
import { LiUserAdd } from '@/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    phoneNumber: string
    dialCode: string
    address?: {
        addressLine1: string
        addressLine2?: string
        city: string
        state: string
        postalCode: string
        country: string
    }
}

export type CustomerFormSchema = z.infer<typeof customerFormValidationSchema>

const addressSchema = z.object({
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
})

const customerFormValidationSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email({ message: 'Invalid email format' }),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    dialCode: z.string().min(1, 'Country code is required'),
    address: addressSchema,
})

export type CreateCustomerDialogProps = {
    isOpen: boolean
    onClose: () => void
    onCreate: (customer: Customer) => void
}

const CreateCustomerDialog = ({
    isOpen,
    onClose,
    onCreate,
}: CreateCustomerDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        getValues,
        reset,
        formState: { errors, isValid },
    } = useForm<CustomerFormSchema>({
        resolver: zodResolver(customerFormValidationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dialCode: '+1',
            address: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'United States',
            },
        },
    })

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<{
            value: string
            dialCode: string
            label: string
        }> = JSON.parse(JSON.stringify(countryList))

        return newCountryList.map((country) => ({
            value: country.dialCode,
            label: country.dialCode,
            img: country.value,
        }))
    }, [])

    const countryListOptions = useMemo(() => {
        return countryList.map((country) => ({
            value: country.value,
            label: country.label,
            img: country.value,
        }))
    }, [])

    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit = async (data: CustomerFormSchema) => {
        setIsSubmitting(true)

        const newCustomer: Customer = {
            ...data,
            id: `customer_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            name: `${data.firstName} ${data.lastName}`,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            img: '',
            phoneNumber: data.phoneNumber,
            dialCode: data.dialCode,
            address: {
                addressLine1: data.address.addressLine1,
                addressLine2: data.address.addressLine2,
                city: data.address.city,
                state: data.address.state,
                postalCode: data.address.postalCode,
                country: data.address.country,
            },
        }
        onCreate(newCustomer)
        setIsSubmitting(false)
        reset()
        handleClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            width={600}
            closable={!isSubmitting}
            shouldCloseOnOverlayClick={!isSubmitting}
            shouldCloseOnEsc={!isSubmitting}
        >
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <IconFrame variant="layered">
                        <LiUserAdd className="text-xl heading-text" />
                    </IconFrame>
                    <div>
                        <h5 className="heading-text">Add New Customer</h5>
                        <p className="ltr:pr-8 rtl:pl-8">
                            Create a new customer profile for this order
                        </p>
                    </div>
                </div>
                <Form>
                    <div className="grid grid-cols-2 gap-4">
                        <FormItem
                            label="First Name"
                            invalid={Boolean(errors.firstName)}
                            errorMessage={errors.firstName?.message}
                            asterisk
                        >
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter first name"
                                        disabled={isSubmitting}
                                        invalid={Boolean(errors.firstName)}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Last Name"
                            invalid={Boolean(errors.lastName)}
                            errorMessage={errors.lastName?.message}
                            asterisk
                        >
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter last name"
                                        disabled={isSubmitting}
                                        invalid={Boolean(errors.lastName)}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <FormItem
                        label="Email Address"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                        asterisk
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter email address"
                                    disabled={isSubmitting}
                                    invalid={Boolean(errors.email)}
                                />
                            )}
                        />
                    </FormItem>

                    <div className="grid grid-cols-3 gap-4">
                        <FormItem
                            label="Country Code"
                            invalid={Boolean(errors.dialCode)}
                            errorMessage={errors.dialCode?.message}
                            asterisk
                        >
                            <Controller
                                name="dialCode"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isSearchable
                                        options={dialCodeList}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                        value={dialCodeList.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        placeholder="Dial code"
                                        customInputDisplay={(selectedItem) => (
                                            <SelectInputWithPrefix
                                                label={selectedItem?.label}
                                                showPrefix={Boolean(
                                                    selectedItem?.value,
                                                )}
                                                prefix={
                                                    selectedItem && (
                                                        <img
                                                            src={`/img/countries/${selectedItem?.img}.png`}
                                                            className="w-4 h-4 rounded-full"
                                                            alt={
                                                                selectedItem?.label
                                                            }
                                                        />
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
                                                selected={selected}
                                                checkIcon={CheckIcon}
                                                label={option?.label}
                                                prefix={
                                                    <img
                                                        src={`/img/countries/${option?.img}.png`}
                                                        className="w-4 h-4 rounded-full"
                                                        alt={option?.label}
                                                    />
                                                }
                                            />
                                        )}
                                    />
                                )}
                            />
                        </FormItem>

                        <div className="col-span-2">
                            <FormItem
                                label="Phone Number"
                                invalid={Boolean(errors.phoneNumber)}
                                errorMessage={errors.phoneNumber?.message}
                                asterisk
                            >
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter phone number"
                                            disabled={isSubmitting}
                                            invalid={Boolean(
                                                errors.phoneNumber,
                                            )}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>

                    <div>
                        <FormItem
                            label="Address Line 1"
                            invalid={Boolean(errors.address?.addressLine1)}
                            errorMessage={errors.address?.addressLine1?.message}
                            asterisk
                        >
                            <Controller
                                name="address.addressLine1"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter street address"
                                        disabled={isSubmitting}
                                        invalid={Boolean(
                                            errors.address?.addressLine1,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Address Line 2"
                            invalid={Boolean(errors.address?.addressLine2)}
                            errorMessage={errors.address?.addressLine2?.message}
                        >
                            <Controller
                                name="address.addressLine2"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Apartment, suite, etc. (optional)"
                                        disabled={isSubmitting}
                                        invalid={Boolean(
                                            errors.address?.addressLine2,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem
                                label="City"
                                invalid={Boolean(errors.address?.city)}
                                errorMessage={errors.address?.city?.message}
                                asterisk
                            >
                                <Controller
                                    name="address.city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter city"
                                            disabled={isSubmitting}
                                            invalid={Boolean(
                                                errors.address?.city,
                                            )}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="State/Province"
                                invalid={Boolean(errors.address?.state)}
                                errorMessage={errors.address?.state?.message}
                                asterisk
                            >
                                <Controller
                                    name="address.state"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter state/province"
                                            disabled={isSubmitting}
                                            invalid={Boolean(
                                                errors.address?.state,
                                            )}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem
                                label="Postal Code"
                                invalid={Boolean(errors.address?.postalCode)}
                                errorMessage={
                                    errors.address?.postalCode?.message
                                }
                                asterisk
                            >
                                <Controller
                                    name="address.postalCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter postal code"
                                            disabled={isSubmitting}
                                            invalid={Boolean(
                                                errors.address?.postalCode,
                                            )}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Country"
                                invalid={Boolean(errors.address?.country)}
                                errorMessage={errors.address?.country?.message}
                                asterisk
                            >
                                <Controller
                                    name="address.country"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            isSearchable
                                            options={countryListOptions}
                                            onChange={(option) =>
                                                field.onChange(option?.value)
                                            }
                                            value={countryListOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            )}
                                            placeholder="Choose country"
                                            customInputDisplay={(
                                                selectedItem,
                                            ) => (
                                                <SelectInputWithPrefix
                                                    label={selectedItem?.label}
                                                    showPrefix={Boolean(
                                                        selectedItem?.value,
                                                    )}
                                                    prefix={
                                                        selectedItem && (
                                                            <img
                                                                src={`/img/countries/${selectedItem?.img}.png`}
                                                                className="w-4 h-4 rounded-full"
                                                                alt={
                                                                    selectedItem?.label
                                                                }
                                                            />
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
                                                    selected={selected}
                                                    checkIcon={CheckIcon}
                                                    label={option?.label}
                                                    prefix={
                                                        <img
                                                            src={`/img/countries/${option?.img}.png`}
                                                            className="w-4 h-4 rounded-full"
                                                            alt={option?.label}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            onClick={() => onSubmit(getValues())}
                            disabled={isSubmitting || !isValid}
                            loading={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Customer'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default CreateCustomerDialog
