import { useState, useMemo, useRef, useEffect, memo } from 'react'
import { Controller } from 'react-hook-form'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import SectionCard from './SectionCard'
import FormFieldWrapper from './FormFieldWrapper'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import { apiGetCustomersList } from '@/services/CustomersService'
import { populateBillingFromCustomer } from '../utils'
import classNames from '@/utils/classNames'
import useDebounce from '@/utils/hooks/useDebounce'
import { LiUser } from '@/icons'
import useSWR from 'swr'
import type {
    FormSectionBaseProps,
    GetCustomersListResponse,
    Customer,
    Address,
} from '../types'

type CustomerSectionProps = FormSectionBaseProps & {
    onSelectCustomer?: (customer: Customer) => void
    initialCustomer?: Customer | null
}

type CustomerOption = {
    value: string
    label: string
    email: string
    phone: string
    img: string
    address?: Address
}

const CustomerSection = ({
    control,
    errors,
    setValue,
    onSelectCustomer,
    initialCustomer,
}: CustomerSectionProps) => {
    const [newCreateCustomerList] = useState<Customer[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption>()
    const [query, setQuery] = useState('')

    const latestInputRef = useRef('')

    const { data, isLoading } = useSWR(
        [`/api/customers/search/${query}`, { query }],
        ([, params]) => {
            return apiGetCustomersList<
                GetCustomersListResponse,
                { query: string }
            >(params)
        },
        {
            revalidateOnFocus: false,
        },
    )

    const debouncedSearch = useDebounce(async () => {
        setQuery(latestInputRef.current)
    }, 500)

    // Populate customer data when initialCustomer is provided (edit mode)
    useEffect(() => {
        if (initialCustomer) {
            const customerOption: CustomerOption = {
                value: initialCustomer.id,
                label: initialCustomer.name,
                email: initialCustomer.email,
                phone: initialCustomer.phoneNumber,
                img: initialCustomer.img || '',
                address: initialCustomer.address,
            }

            setSelectedCustomer(customerOption)
            onSelectCustomer?.(initialCustomer)

            if (initialCustomer.address) {
                const billingAddress =
                    populateBillingFromCustomer(initialCustomer)
                setValue?.('billingAddress', billingAddress)
            }
        }
    }, [initialCustomer, setValue, onSelectCustomer])

    const handleInputChange = (value: string) => {
        latestInputRef.current = value

        if (selectedCustomer && value !== selectedCustomer.label) {
            setSelectedCustomer(undefined)
            // Also clear the form values
            setValue?.('customerId', '')
            setValue?.('customerName', '')
            setValue?.('customerEmail', '')
            setValue?.('customerPhone', '')
        }

        debouncedSearch()
    }

    const allOptions = useMemo(() => {
        if (!data || !data.list) return []

        const queryDataList = data.list.map((customer) => ({
            value: customer.id,
            label: customer.name,
            email: customer.email,
            phone: customer.phoneNumber,
            img: customer.img || '',
            address: customer.address,
        }))

        const createdCustomersList = newCreateCustomerList
            .filter((customer) =>
                customer.name.toLowerCase().includes(query.toLowerCase()),
            )
            .map((customer) => ({
                value: customer.id,
                label: customer.name,
                email: customer.email,
                phone: customer.phoneNumber,
                img: customer.img || '',
                address: customer.address,
            }))

        return [...queryDataList, ...createdCustomersList]
    }, [data, newCreateCustomerList, query])

    const handleCustomerSelect = (option: CustomerOption) => {
        setSelectedCustomer(option)

        if (option) {
            const customer = option
            const completeCustomer =
                data?.list.find((c) => c.id === customer.value) ||
                newCreateCustomerList.find((c) => c.id === customer.value)

            if (completeCustomer) {
                onSelectCustomer?.(completeCustomer)

                // Auto-populate billing address
                if (completeCustomer.address) {
                    const billingAddress =
                        populateBillingFromCustomer(completeCustomer)
                    setValue?.('billingAddress', billingAddress)
                }
            }

            // Update form values
            setValue?.('customerId', customer.value)
            setValue?.('customerName', customer.label)
            setValue?.('customerEmail', customer.email)
            setValue?.('customerPhone', customer.phone)
        } else {
            setValue?.('customerId', '')
            setValue?.('customerName', '')
            setValue?.('customerEmail', '')
            setValue?.('customerPhone', '')
        }
    }

    return (
        <SectionCard
            title="Customer Information"
            description="Select an existing customer for this invoice"
        >
            <FormFieldWrapper
                label="Customer"
                error={errors.customerId?.message}
                required
                description="Search by name, email, or phone number"
            >
                <Controller
                    name="customerId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={allOptions}
                            value={allOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(selected) => {
                                const customerId = selected?.value || ''
                                field.onChange(customerId)
                                handleCustomerSelect(selected)
                            }}
                            onInputChange={handleInputChange}
                            placeholder="Search customers..."
                            noOptionsMessage={(ListElement) => (
                                <ListElement
                                    className={classNames('justify-center')}
                                >
                                    {isLoading
                                        ? 'Loading...'
                                        : 'No customers found'}
                                </ListElement>
                            )}
                            isSearchable
                            isLoading={isLoading}
                            customOption={({ option, selected, CheckIcon }) => {
                                return (
                                    <>
                                        <div className="flex items-center justify-between gap-2">
                                            <Avatar
                                                size={25}
                                                src={option.img}
                                                icon={
                                                    <LiUser className="text-base" />
                                                }
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="heading-text font-medium truncate">
                                                    {option.label}
                                                </div>
                                                <div className="text-xs font-normal text-gray-500 dark:text-gray-400 truncate">
                                                    {option.email}
                                                </div>
                                            </div>
                                        </div>
                                        {selected && CheckIcon}
                                    </>
                                )
                            }}
                            customInputDisplay={(selectedItem) => (
                                <>
                                    <SelectInputWithPrefix
                                        label={selectedItem?.label}
                                        prefix={
                                            selectedItem && (
                                                <Avatar
                                                    size={20}
                                                    src={selectedItem.img}
                                                    shape="circle"
                                                    icon={
                                                        <LiUser className="text-base" />
                                                    }
                                                />
                                            )
                                        }
                                    />
                                </>
                            )}
                            filter={({ options }) => {
                                return options
                            }}
                        />
                    )}
                />
            </FormFieldWrapper>
        </SectionCard>
    )
}

export default memo(CustomerSection)
