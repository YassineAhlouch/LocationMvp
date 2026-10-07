import { useCallback, useEffect, useMemo, useRef } from 'react'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import Slider from '@/components/ui/Slider'
import NumericInput from '@/components/shared/NumericInput'
import NumericInputStepper from '@/components/shared/NumericInputStepper'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import classNames from '@/utils/classNames'
import useDebounce from '@/utils/hooks/useDebounce'
import type {
    TradingFormProps,
    TradingSide,
    OrderType,
    NewOrderData,
} from '../types'

const TRADING_VALIDATION_RULES = {
    MIN_ORDER_VALUE: 10,
    MAX_PERCENTAGE: 100,
    MIN_PERCENTAGE: 0,
    PRICE_DECIMAL_PLACES: 2,
    AMOUNT_DECIMAL_PLACES: 8,
    TOTAL_DECIMAL_PLACES: 2,
} as const

const createTradingFormSchema = (params: {
    orderType: OrderType
    side: TradingSide
    currentPrice: number
    availableBalance: number
    baseAsset: string
    quoteAsset: string
}) => {
    const {
        orderType,
        side,
        currentPrice,
        availableBalance,
        baseAsset,
        quoteAsset,
    } = params

    return z
        .object({
            price: z
                .string()
                .optional()
                .refine((val) => {
                    if (orderType === 'limit') {
                        const price = parseFloat(val || '0')
                        return price > 0
                    }
                    return true
                }, 'Price is required for limit orders'),

            amount: z.string().refine((val) => {
                if (!val || val.trim() === '') return true
                const amount = parseFloat(val)
                return amount > 0
            }, 'Amount must be greater than 0'),

            total: z.string().optional(),

            percentage: z.number().min(0).max(100),
        })
        .refine(
            (data) => {
                if (!data.amount || data.amount.trim() === '') {
                    return true
                }

                const amount = parseFloat(data.amount) || 0
                const price = parseFloat(data.price || '0') || currentPrice || 0
                const total = parseFloat(data.total || '0') || amount * price

                if (amount <= 0) {
                    return false
                }

                // Balance validation
                if (side === 'buy') {
                    const requiredBalance = total
                    if (requiredBalance > availableBalance) {
                        return false
                    }
                } else {
                    if (amount > availableBalance) {
                        return false
                    }
                }

                // Minimum order value validation
                if (total < TRADING_VALIDATION_RULES.MIN_ORDER_VALUE) {
                    return false
                }

                return true
            },
            {
                message:
                    side === 'buy'
                        ? `Insufficient ${quoteAsset} balance or minimum order value is $${TRADING_VALIDATION_RULES.MIN_ORDER_VALUE}.00`
                        : `Insufficient ${baseAsset} balance or minimum order value is $${TRADING_VALIDATION_RULES.MIN_ORDER_VALUE}.00`,
                path: ['amount'],
            },
        )
}

/**
 * Type inference for the trading form schema
 */
type TradingFormSchema = z.infer<ReturnType<typeof createTradingFormSchema>>

/**
 * Default values for trading form
 */
const getTradingFormDefaults = (currentPrice: number): TradingFormSchema => ({
    price: currentPrice.toString(),
    amount: '',
    total: '',
    percentage: 0,
})

const TradingForm = ({
    side,
    orderType,
    currentPrice,
    baseAsset,
    quoteAsset,
    availableBalance,
    onOrderSubmit,
}: TradingFormProps) => {
    // Create validation schema using isolated validation logic
    const validationSchema = useMemo(
        () =>
            createTradingFormSchema({
                orderType,
                side,
                currentPrice,
                availableBalance,
                baseAsset,
                quoteAsset,
            }),
        [
            orderType,
            side,
            currentPrice,
            availableBalance,
            baseAsset,
            quoteAsset,
        ],
    )

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TradingFormSchema>({
        defaultValues: getTradingFormDefaults(currentPrice),
        resolver: zodResolver(validationSchema),
    })

    const watchedPrice = watch('price')
    const watchedAmount = watch('amount')
    const watchedTotal = watch('total')
    const watchedPercentage = watch('percentage')

    const isUpdatingRef = useRef(false)

    useEffect(() => {
        reset(getTradingFormDefaults(currentPrice))
    }, [currentPrice, reset])

    useEffect(() => {
        if (isUpdatingRef.current) return

        const price = parseFloat(watchedPrice || '0') || currentPrice || 0
        const amount = parseFloat(watchedAmount || '0') || 0

        if (price > 0 && amount > 0) {
            isUpdatingRef.current = true

            const total = (price * amount).toFixed(6)
            setValue('total', total, { shouldValidate: false })

            if (availableBalance > 0) {
                if (side === 'buy') {
                    const totalValue = price * amount
                    const percentage = Math.min(
                        100,
                        (totalValue / availableBalance) * 100,
                    )
                    setValue('percentage', Math.round(percentage), {
                        shouldValidate: false,
                    })
                } else {
                    const percentage = Math.min(
                        100,
                        (amount / availableBalance) * 100,
                    )
                    setValue('percentage', Math.round(percentage), {
                        shouldValidate: false,
                    })
                }
            }

            setTimeout(() => {
                isUpdatingRef.current = false
            }, 50)
        }
    }, [
        watchedPrice,
        watchedAmount,
        currentPrice,
        availableBalance,
        side,
        setValue,
    ])

    useEffect(() => {
        if (isUpdatingRef.current) return

        const price = parseFloat(watchedPrice || '0') || currentPrice || 0
        const total = parseFloat(watchedTotal || '0') || 0

        if (price > 0 && total > 0) {
            isUpdatingRef.current = true

            const amount = (total / price).toFixed(6)
            setValue('amount', amount, { shouldValidate: false })

            if (availableBalance > 0 && side === 'buy') {
                const percentage = Math.min(
                    100,
                    (total / availableBalance) * 100,
                )
                setValue('percentage', Math.round(percentage), {
                    shouldValidate: false,
                })
            }

            // Reset flag after a short delay
            setTimeout(() => {
                isUpdatingRef.current = false
            }, 50)
        }
    }, [
        watchedTotal,
        watchedPrice,
        currentPrice,
        availableBalance,
        side,
        setValue,
    ])

    const calculateFromPercentage = useCallback(
        (percentage: number) => {
            if (side === 'buy') {
                const price =
                    parseFloat(watchedPrice || '0') || currentPrice || 0
                if (price > 0) {
                    const totalValue = (availableBalance * percentage) / 100
                    const amount = totalValue / price
                    setValue('amount', amount.toFixed(6), {
                        shouldValidate: false,
                    })
                    setValue(
                        'total',
                        totalValue.toFixed(
                            TRADING_VALIDATION_RULES.TOTAL_DECIMAL_PLACES,
                        ),
                        { shouldValidate: false },
                    )
                }
            } else {
                const amount = (availableBalance * percentage) / 100
                setValue('amount', amount.toFixed(6), { shouldValidate: false })

                const price =
                    parseFloat(watchedPrice || '0') || currentPrice || 0
                if (price > 0) {
                    const total = (amount * price).toFixed(
                        TRADING_VALIDATION_RULES.TOTAL_DECIMAL_PLACES,
                    )
                    setValue('total', total, { shouldValidate: false })
                }
            }

            isUpdatingRef.current = false
        },
        [side, watchedPrice, currentPrice, availableBalance, setValue],
    )

    const debouncedCalculateFromPercentage = useDebounce(
        calculateFromPercentage,
        50,
    )

    const handlePercentageChange = (percentage: number) => {
        isUpdatingRef.current = true
        setValue('percentage', percentage, { shouldValidate: false })
        debouncedCalculateFromPercentage(percentage)
    }
    const handleFormSubmit = async (data: TradingFormSchema) => {
        if (!onOrderSubmit) {
            console.warn('No onOrderSubmit callback provided')
            return
        }

        if (
            !data.amount ||
            data.amount.trim() === '' ||
            parseFloat(data.amount) <= 0
        ) {
            return
        }

        try {
            const orderData: NewOrderData = {
                pair: `${baseAsset}-${quoteAsset}`,
                side,
                type: orderType,
                amount: parseFloat(data.amount),
                price:
                    orderType === 'limit'
                        ? parseFloat(data.price || '0')
                        : currentPrice,
                currentPrice,
            }

            await onOrderSubmit(orderData)

            // Reset form without triggering validation
            const defaultValues = getTradingFormDefaults(currentPrice)
            reset(defaultValues, {
                keepErrors: false,
                keepDirty: false,
                keepIsSubmitted: false,
                keepTouched: false,
                keepIsValid: false,
                keepSubmitCount: false,
            })
        } catch (error) {
            console.error('Order placement failed:', error)
        }
    }

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
                {orderType === 'limit' && (
                    <FormItem
                        label="Price"
                        invalid={Boolean(errors.price)}
                        errorMessage={errors.price?.message}
                    >
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    value={field.value}
                                    inputSuffix={
                                        <div className="flex items-center gap-2 -mr-2">
                                            <span className="heading-text font-medium">
                                                {quoteAsset}
                                            </span>
                                            <NumericInputStepper
                                                step={0.01}
                                                value={parseFloat(
                                                    field.value || '0',
                                                )}
                                                onChange={field.onChange}
                                            />
                                        </div>
                                    }
                                    onValueChange={(values) =>
                                        field.onChange(values.value)
                                    }
                                    placeholder="0.00"
                                    decimalScale={
                                        TRADING_VALIDATION_RULES.PRICE_DECIMAL_PLACES
                                    }
                                    fixedDecimalScale
                                    allowNegative={false}
                                />
                            )}
                        />
                    </FormItem>
                )}
                <FormItem
                    label="Amount"
                    invalid={Boolean(errors.amount)}
                    errorMessage={errors.amount?.message}
                >
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                value={field.value}
                                inputSuffix={
                                    <span className="heading-text font-medium">
                                        {baseAsset}
                                    </span>
                                }
                                onValueChange={(values) =>
                                    field.onChange(values.value)
                                }
                                placeholder="0.00000000"
                                decimalScale={
                                    TRADING_VALIDATION_RULES.AMOUNT_DECIMAL_PLACES
                                }
                                allowNegative={false}
                            />
                        )}
                    />
                </FormItem>
                <FormItem label={`Amount (${watchedPercentage}%)`}>
                    <Controller
                        name="percentage"
                        control={control}
                        render={() => (
                            <div className="px-2">
                                <Slider
                                    showTooltipOnHover
                                    tooltip={(value) => `${value}%`}
                                    min={
                                        TRADING_VALIDATION_RULES.MIN_PERCENTAGE
                                    }
                                    max={
                                        TRADING_VALIDATION_RULES.MAX_PERCENTAGE
                                    }
                                    step={1}
                                    marks={[
                                        { value: 0, label: '' },
                                        { value: 25, label: '' },
                                        { value: 50, label: '' },
                                        { value: 75, label: '' },
                                        { value: 100, label: '' },
                                    ]}
                                    onChange={(value) => {
                                        handlePercentageChange(value as number)
                                    }}
                                />
                            </div>
                        )}
                    />
                </FormItem>
                <FormItem
                    label={`Total (${quoteAsset})`}
                    invalid={Boolean(errors.total)}
                    errorMessage={errors.total?.message}
                >
                    <Controller
                        name="total"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                value={field.value}
                                inputSuffix={
                                    <span className="heading-text font-medium">
                                        {quoteAsset}
                                    </span>
                                }
                                onValueChange={(values) =>
                                    field.onChange(values.value)
                                }
                                placeholder="0.00"
                                decimalScale={
                                    TRADING_VALIDATION_RULES.TOTAL_DECIMAL_PLACES
                                }
                                fixedDecimalScale
                                allowNegative={false}
                            />
                        )}
                    />
                </FormItem>
                <div className="flex items-center justify-between mb-4">
                    <span>Available: </span>
                    <span className="font-medium heading-text">
                        {availableBalance.toFixed(6)}{' '}
                        {side === 'buy' ? quoteAsset : baseAsset}
                    </span>
                </div>
                <Button
                    type="submit"
                    variant="solid"
                    className={classNames(
                        'w-full',
                        side === 'buy'
                            ? 'bg-success hover:bg-success/90 text-white'
                            : 'bg-error hover:bg-error/90 text-white',
                    )}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? 'Placing Order...'
                        : `${side === 'buy' ? 'Buy' : 'Sell'} ${baseAsset}`}
                </Button>
            </div>
        </Form>
    )
}

export default TradingForm
