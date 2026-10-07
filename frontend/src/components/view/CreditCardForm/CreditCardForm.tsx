import { useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { Form, FormItem } from '@/components/ui/Form'
import FormCustomFormatInput from '@/components/shared/CustomFormatInput'
import FormPatternInput from '@/components/shared/PatternInput'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export type CreditCard = {
    cardHolderName: string
    ccNumber?: string
    cardExpiry?: string
    code?: string
    isPrimary?: boolean
}

type FormSchema = CreditCard

type CreditCardDialogProps = {
    defaultValues: CreditCard
    onSubmit: (value: FormSchema) => void
    showSetPrimaryCheckbox?: boolean
    buttonText?: string
    isSubmitting?: boolean
}

function limit(val: string, max: string) {
    if (val.length === 1 && val[0] > max[0]) {
        val = '0' + val
    }

    if (val.length === 2) {
        if (Number(val) === 0) {
            val = '01'
        } else if (val > max) {
            val = max
        }
    }

    return val
}

function cardExpiryFormat(val: string) {
    const month = limit(val.substring(0, 2), '12')
    const date = limit(val.substring(2, 4), '31')

    return month + (date.length ? '/' + date : '')
}

const validationSchema = z.object({
    id: z.string().optional(),
    cardHolderName: z.string().min(1, { message: 'Card holder name required' }),
    ccNumber: z.optional(
        z
            .string()
            .min(1, 'Credit card number required')
            .refine(
                (value) =>
                    /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(
                        value,
                    ),
                'Invalid credit card number',
            ),
    ),
    cardExpiry: z.optional(
        z
            .string()
            .min(1, { message: 'Card holder name required' })
            .refine(
                (value) =>
                    /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(value),
                'Invalid Date',
            ),
    ),
    code: z.optional(
        z
            .string()
            .min(1, { message: 'Code required' })
            .refine((value) => /^[0-9]{3}$/.test(value), 'Invalid CVV'),
    ),
    isPrimary: z.optional(z.boolean()),
})

const CreditCardForm = ({
    defaultValues,
    onSubmit,
    showSetPrimaryCheckbox,
    buttonText = 'Update',
    isSubmitting,
}: CreditCardDialogProps) => {
    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({
        defaultValues,
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues, reset])

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
                label="Card Holder Name"
                invalid={Boolean(errors.cardHolderName)}
                errorMessage={errors.cardHolderName?.message}
            >
                <Controller
                    name="cardHolderName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Card holder name"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Credit card number"
                invalid={Boolean(errors.ccNumber)}
                errorMessage={errors.ccNumber?.message}
            >
                <Controller
                    name="ccNumber"
                    control={control}
                    render={({ field }) => (
                        <FormPatternInput
                            placeholder="•••• •••• •••• ••••"
                            format="#### #### #### ####"
                            value={field.value}
                            onValueChange={(e) => {
                                field.onChange(e.value)
                            }}
                        />
                    )}
                />
            </FormItem>
            <div className="grid grid-cols-2 gap-4">
                <FormItem
                    label="Expiration date"
                    invalid={Boolean(errors.cardExpiry)}
                    errorMessage={errors.cardExpiry?.message}
                >
                    <Controller
                        name="cardExpiry"
                        control={control}
                        render={({ field }) => (
                            <FormCustomFormatInput
                                placeholder="••/••"
                                format={cardExpiryFormat}
                                value={field.value}
                                onValueChange={(e) => {
                                    field.onChange(e.value)
                                }}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="CVV"
                    invalid={Boolean(errors.code)}
                    errorMessage={errors.code?.message}
                >
                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <FormPatternInput
                                placeholder="•••"
                                format="###"
                                value={field.value}
                                onValueChange={(e) => {
                                    field.onChange(e.value)
                                }}
                            />
                        )}
                    />
                </FormItem>
                {showSetPrimaryCheckbox && (
                    <FormItem>
                        <Controller
                            name="isPrimary"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    {...field}
                                    className="heading-text"
                                    checked={field.value}
                                >
                                    Set as primary
                                </Checkbox>
                            )}
                        />
                    </FormItem>
                )}
            </div>
            <Button block variant="solid" type="submit" loading={isSubmitting}>
                {buttonText}
            </Button>
        </Form>
    )
}

export default CreditCardForm
