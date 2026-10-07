import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import { LiAdd, LiCross } from '@/icons'
import useLeadsList from '../hooks/useLeadsList'
import { useLeadsListStore } from '../store/leadsListStore'
import useResponsive from '@/utils/hooks/useResponsive'
import sleep from '@/utils/sleep'
import { countryList } from '@/constants/countries.constant'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type Option = {
    value: string
    label: string
}

type FormSchema = {
    name: string
    email: string
    dialCode: string
    phoneNumber: string
    company?: string
    tags: Option[]
}

const tagOptions = [
    { label: 'VIP', value: 'VIP' },
    { label: 'Frequent Buyer', value: 'Frequent Buyer' },
    { label: 'First-Time Buyer', value: 'First-Time Buyer' },
    { label: 'Refund Risk', value: 'Refund Risk' },
    { label: 'New Customer', value: 'New Customer' },
    { label: 'High AOV', value: 'High AOV' },
    { label: 'Coupon User', value: 'Coupon User' },
    { label: 'Manual Review', value: 'Manual Review' },
    { label: 'International', value: 'International' },
]

const validationSchema = z.object({
    name: z.string().min(1, 'Please select one assignee!'),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    dialCode: z.string().min(1, { message: 'Please select your country code' }),
    phoneNumber: z
        .string()
        .min(1, { message: 'Please input your mobile number' }),
    tags: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .max(2, { message: 'You can select maximum 2 tags' })
        .nonempty('At least one is selected!'),
})

const AddLeadDialog = () => {
    const { larger } = useResponsive()
    const [open, setOpen] = useState(false)

    const { mutate, leadsList, leadsListTotal } = useLeadsList()
    const setSelectAllRows = useLeadsListStore(
        (state) => state.setSelectAllRows,
    )

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: '',
            email: '',
            dialCode: '',
            phoneNumber: '',
            company: '',
            tags: [],
        },
        resolver: zodResolver(validationSchema),
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

    const handleCloseDialog = () => {
        reset()
        setOpen(false)
    }

    const handleFormSubmit = async (values: FormSchema) => {
        setSelectAllRows([])
        await sleep(1000)
        mutate(
            {
                list: [
                    {
                        // eslint-disable-next-line react-hooks/purity
                        id: Date.now().toString(),
                        name: values.name,
                        firstName: '',
                        lastName: '',
                        email: values.email,
                        img: '',
                        role: '',
                        lastOnline: 0,
                        status: '',
                        location: '',
                        title: '',
                        birthday: '',
                        phoneNumber: values.dialCode + values.phoneNumber,
                        dialCode: values.dialCode,
                        address: '',
                        postcode: '',
                        city: '',
                        country: '',
                        totalSpending: 0,
                        tags: values.tags.map((tag) => tag.value),
                        probability: 'Medium',
                        company: values.company || '-',
                    },
                    ...leadsList,
                ],
                total: leadsListTotal + 1,
            },
            false,
        )

        handleCloseDialog()
        toast.push(
            <Notification type="success" title={'Lead added successfully!'} />,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <>
            <Button icon={<LiAdd />} onClick={() => setOpen(true)}>
                {larger.lg && 'Add Lead'}
            </Button>
            <Dialog
                isOpen={open}
                onClose={handleCloseDialog}
                className="p-0"
                closable={false}
            >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <IconFrame variant="thick">
                            <LiAdd className="text-xl heading-text" />
                        </IconFrame>
                        <div>
                            <h5>Add Lead</h5>
                            <p className="pr-12">Add new lead manually.</p>
                        </div>
                    </div>
                    <Button
                        variant="subtle"
                        size="sm"
                        type="button"
                        icon={<LiCross className="text-2xl" />}
                        onClick={handleCloseDialog}
                    />
                </div>
                <div className="p-4">
                    <Form onSubmit={handleSubmit(handleFormSubmit)}>
                        <FormItem
                            label="Name"
                            invalid={Boolean(errors.name)}
                            errorMessage={errors.name?.message}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter lead name"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Email"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter lead email"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Company"
                            invalid={Boolean(errors.company)}
                            errorMessage={errors.company?.message}
                        >
                            <Controller
                                name="company"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter lead company"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="flex items-end gap-2 w-full">
                            <FormItem
                                invalid={
                                    Boolean(errors.phoneNumber) ||
                                    Boolean(errors.dialCode)
                                }
                                className="min-w-[150px]"
                            >
                                <label className="form-label mb-2">
                                    Phone number
                                </label>
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
                                                    option.value ===
                                                    field.value,
                                            )}
                                            placeholder="Dial code"
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
                                                                className="w-5 h-5 rounded-full"
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
                                                            className="w-5 h-5 rounded-full"
                                                            alt={option?.label}
                                                        />
                                                    }
                                                />
                                            )}
                                            searchInputProps={{
                                                placeholder: 'Search...',
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                className="w-full"
                                invalid={
                                    Boolean(errors.phoneNumber) ||
                                    Boolean(errors.dialCode)
                                }
                                errorMessage={errors.phoneNumber?.message}
                            >
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <NumericInput
                                            autoComplete="off"
                                            placeholder="Phone Number"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <FormItem
                            label="Multiple Select"
                            invalid={Boolean(errors.tags)}
                            errorMessage={errors.tags?.message}
                        >
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <Select.Multi
                                        options={tagOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isSubmitting}
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </Dialog>
        </>
    )
}

export default AddLeadDialog
