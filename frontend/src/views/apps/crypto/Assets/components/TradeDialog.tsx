import { useState, useMemo, useEffect, useRef } from 'react'
import useSWR from 'swr'
import Alert from '@/components/ui/Alert'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Segment from '@/components/ui/Segment'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { FormItem, Form } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import NumericInput from '@/components/shared/NumericInput'
import EmptyState from '@/components/shared/EmptyState'
import Divider from '@/components/shared/Divider'
import { LiTick } from '@/icons'
import { useAssetsStore } from '../store/assetsStore'
import {
    apiGetMarketData,
    apiGetPortfolioAssets,
} from '@/services/CryptoService'
import sleep from '@/utils/sleep'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import uniqueId from 'lodash/uniqueId'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { GetMarketDataResponse } from '@/views/apps/crypto/Market/types'
import type { PortfolioAsset } from '../types'

type TradeStep = 'form' | 'confirmation' | 'success'

const buyPaymentMethodOptions = [
    {
        value: 'creditCard',
        label: 'Credit Card',
        accountInfo: '**** **** **** 8313',
        icon: '/img/thumbs/payment/creditCard.png',
    },
    {
        value: 'paypal',
        label: 'PayPal',
        accountInfo: 'john.doe@email.com',
        icon: '/img/thumbs/payment/paypal.png',
    },
    {
        value: 'googlePay',
        label: 'Google Pay',
        accountInfo: 'john.doe@gmail.com',
        icon: '/img/thumbs/payment/googlePay.png',
    },
    {
        value: 'applePay',
        label: 'Apple Pay',
        accountInfo: 'iPhone 15 Pro',
        icon: '/img/thumbs/payment/applePay.png',
    },
    {
        value: 'bankTransfer',
        label: 'Bank Transfer',
        accountInfo: 'Chase Bank ****5981',
        icon: '/img/thumbs/payment/bankTransfer.png',
    },
]

const sellPaymentMethodOptions = [
    {
        value: 'creditCard',
        label: 'Credit Card',
        accountInfo: '**** **** **** 8313',
        icon: '/img/thumbs/payment/creditCard.png',
    },
    {
        value: 'paypal',
        label: 'PayPal',
        accountInfo: 'john.doe@email.com',
        icon: '/img/thumbs/payment/paypal.png',
    },
    {
        value: 'bankTransfer',
        label: 'Bank Transfer',
        accountInfo: 'Chase Bank ****5981',
        icon: '/img/thumbs/payment/bankTransfer.png',
    },
]

const validationSchema = z.object({
    asset: z.string().min(1, 'Please select an asset'),
    payAmount: z
        .string()
        .min(1, 'Please enter an amount')
        .refine((val) => {
            const num = parseFloat(val)
            return !isNaN(num) && num > 0
        }, 'Amount must be greater than 0'),
    receiveAmount: z.string().min(1, 'Receive amount is required'),
    paymentMethod: z.string().min(1, 'Please select a payment method'),
})

type FormSchema = z.infer<typeof validationSchema>

type AssetOption = {
    value: string
    label: string
    symbol: string
    name: string
    icon: string
    balance?: number
}

const TradeModal = () => {
    const { modals, tradeModalTab, selectedAsset, closeAllModals, tableState } =
        useAssetsStore()
    const [currentStep, setCurrentStep] = useState<TradeStep>('form')
    const [tradeResult, setTradeResult] = useState<{
        tradeId: string
        executionPrice: number
        message: string
    } | null>(null)

    const [message, setMessage] = useTimeOutMessage()

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormSchema>({
        defaultValues: {
            asset: '',
            payAmount: '',
            receiveAmount: '',
            paymentMethod: 'creditCard',
        },
        resolver: zodResolver(validationSchema),
    })

    const watchedAsset = watch('asset')
    const watchedPayAmount = watch('payAmount')
    const watchedReceiveAmount = watch('receiveAmount')

    // Ref to prevent circular updates
    const isUpdatingRef = useRef(false)

    // Mock exchange rates
    const exchangeRates = {
        BTC: 45000,
        ETH: 3000,
        MATIC: 0.8,
        UNI: 25,
        LINK: 15,
        SOL: 100,
    }

    // SWR for market data
    const { data: marketDataResponse, isLoading: loadingMarketData } = useSWR(
        modals.trade ? '/api/crypto/market/data' : null,
        () =>
            apiGetMarketData<GetMarketDataResponse, Record<string, unknown>>({
                pageIndex: 1,
                pageSize: 100, // Get top 100 coins
                sortKey: 'marketCap',
                sortOrder: 'desc',
            }),
        { revalidateOnFocus: false },
    )

    // SWR for user's assets data
    const { data: assetsResponse, mutate: mutateAssets } = useSWR(
        modals.trade
            ? ['/api/crypto/portfolio/assets', tableState.assets]
            : null,
        ([, tableState]) =>
            apiGetPortfolioAssets<{ data: PortfolioAsset[]; total: number }>({
                pageIndex: tableState.pageIndex,
                pageSize: tableState.pageSize,
                sortKey: tableState.sortKey,
                sortOrder: tableState.sortOrder,
                query: tableState.query,
            }),
        { revalidateOnFocus: false },
    )

    const marketData = useMemo(
        () => marketDataResponse?.data || [],
        [marketDataResponse],
    )
    const assetsData = assetsResponse?.data

    // Generate asset options based on trade type
    const assetOptions: AssetOption[] =
        tradeModalTab === 'buy'
            ? marketData.map((coin) => ({
                  value: coin.symbol,
                  label: `${coin.name} (${coin.symbol})`,
                  symbol: coin.symbol,
                  name: coin.name,
                  icon: coin.image,
              }))
            : (assetsData || [])
                  .filter((asset) => asset.balance > 0) // Only show assets with balance > 0
                  .map((asset) => ({
                      value: asset.symbol,
                      label: `${asset.name} (${asset.symbol}) - ${asset.balance.toLocaleString(
                          'en-US',
                          {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6,
                          },
                      )} available`,
                      symbol: asset.symbol,
                      name: asset.name,
                      icon: asset.icon,
                      balance: asset.balance,
                  }))

    const paymentMethodOptions =
        tradeModalTab === 'buy'
            ? buyPaymentMethodOptions
            : sellPaymentMethodOptions

    // Get current price from market data, portfolio data, or fallback to exchange rates
    const selectedCoin = marketData.find((coin) => coin.symbol === watchedAsset)
    const selectedPortfolioAsset = assetsData?.find(
        (asset) => asset.symbol === watchedAsset,
    )

    // For portfolio assets, calculate price from value/balance, otherwise use market data
    const portfolioPrice =
        selectedPortfolioAsset && selectedPortfolioAsset.balance > 0
            ? selectedPortfolioAsset.value / selectedPortfolioAsset.balance
            : 0

    const currentPrice =
        selectedCoin?.price ||
        portfolioPrice ||
        exchangeRates[watchedAsset as keyof typeof exchangeRates] ||
        0

    // Reset form when modal closes
    useEffect(() => {
        if (!modals.trade) {
            reset()
            setCurrentStep('form')
            setTradeResult(null)
        }
    }, [modals.trade, reset])

    // Auto-populate asset when modal opens with selectedAsset
    useEffect(() => {
        if (modals.trade && selectedAsset) {
            if (tradeModalTab === 'buy') {
                // For buy: use selectedAsset if available in market data
                const initialAsset = marketData.find(
                    (coin) => coin.symbol === selectedAsset,
                )
                if (initialAsset) {
                    setValue('asset', initialAsset.symbol)
                }
            } else {
                // For sell: use selectedAsset if user owns it
                const ownedAssets = (assetsData || []).filter(
                    (asset) => asset.balance > 0,
                )
                const selectedOwnedAsset = ownedAssets.find(
                    (asset) => asset.symbol === selectedAsset,
                )
                if (selectedOwnedAsset) {
                    setValue('asset', selectedOwnedAsset.symbol)
                }
            }
        } else if (modals.trade) {
            // Set default asset when no selectedAsset
            if (tradeModalTab === 'buy' && marketData.length > 0) {
                const btcAsset =
                    marketData.find((coin) => coin.symbol === 'BTC') ||
                    marketData[0]
                setValue('asset', btcAsset.symbol)
            } else if (tradeModalTab === 'sell') {
                const ownedAssets = (assetsData || []).filter(
                    (asset) => asset.balance > 0,
                )
                if (ownedAssets.length > 0) {
                    setValue('asset', ownedAssets[0].symbol)
                }
            }
        }
    }, [
        modals.trade,
        selectedAsset,
        marketData,
        tradeModalTab,
        assetsData,
        setValue,
    ])

    // Auto-calculate amounts when pay amount changes
    useEffect(() => {
        if (isUpdatingRef.current) return

        if (watchedPayAmount && currentPrice > 0) {
            const payAmount = parseFloat(watchedPayAmount) || 0
            if (payAmount > 0) {
                isUpdatingRef.current = true
                if (tradeModalTab === 'buy') {
                    const receiveAmount = payAmount / currentPrice
                    setValue('receiveAmount', receiveAmount.toFixed(6), {
                        shouldValidate: false,
                    })
                } else {
                    const receiveAmount = payAmount * currentPrice
                    setValue('receiveAmount', receiveAmount.toFixed(2), {
                        shouldValidate: false,
                    })
                }
                // Reset flag after a short delay
                setTimeout(() => {
                    isUpdatingRef.current = false
                }, 50)
            }
        }
    }, [watchedPayAmount, currentPrice, tradeModalTab, setValue])

    // Auto-calculate amounts when receive amount changes
    useEffect(() => {
        if (isUpdatingRef.current) return

        if (watchedReceiveAmount && currentPrice > 0) {
            const receiveAmount = parseFloat(watchedReceiveAmount) || 0
            if (receiveAmount > 0) {
                isUpdatingRef.current = true
                if (tradeModalTab === 'buy') {
                    const payAmount = receiveAmount * currentPrice
                    setValue('payAmount', payAmount.toFixed(2), {
                        shouldValidate: false,
                    })
                } else {
                    const payAmount = receiveAmount / currentPrice
                    setValue('payAmount', payAmount.toFixed(6), {
                        shouldValidate: false,
                    })
                }
                // Reset flag after a short delay
                setTimeout(() => {
                    isUpdatingRef.current = false
                }, 50)
            }
        }
    }, [watchedReceiveAmount, currentPrice, tradeModalTab, setValue])

    // Reset amounts when switching between buy/sell modes
    useEffect(() => {
        isUpdatingRef.current = true
        setValue('payAmount', '', { shouldValidate: false })
        setValue('receiveAmount', '', { shouldValidate: false })
        setTimeout(() => {
            isUpdatingRef.current = false
        }, 100)
    }, [tradeModalTab, setValue])

    const validateTrade = (data: FormSchema) => {
        // For sell orders, check if user has enough balance
        if (tradeModalTab === 'sell') {
            const selectedAsset = assetsData?.find(
                (asset) => asset.symbol === data.asset,
            )
            if (!selectedAsset || selectedAsset.balance <= 0) {
                return 'You do not own this asset'
            }

            const sellAmount = parseFloat(data.payAmount)
            if (sellAmount > selectedAsset.balance) {
                return `Insufficient balance. You have ${selectedAsset.balance.toLocaleString(
                    'en-US',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                    },
                )} ${data.asset} available`
            }
        }
        return null
    }

    const handleFormSubmit = (data: FormSchema) => {
        const error = validateTrade(data)
        if (error) {
            setMessage(error)
            return
        }
        setCurrentStep('confirmation')
    }

    const confirmTrade = async (data: FormSchema) => {
        try {
            await sleep(800)

            console.log('Submit Trade:', {
                type: tradeModalTab,
                asset: data.asset,
                amount: parseFloat(data.receiveAmount),
                paymentMethod: data.paymentMethod,
            })

            // Optimistic update - add to assets if buying
            if (tradeModalTab === 'buy' && assetsResponse) {
                const existingAsset = assetsData?.find(
                    (a) => a.symbol === data.asset,
                )
                if (existingAsset) {
                    mutateAssets(
                        {
                            data: assetsResponse.data.map((a) =>
                                a.symbol === data.asset
                                    ? {
                                          ...a,
                                          balance:
                                              a.balance +
                                              parseFloat(data.receiveAmount),
                                      }
                                    : a,
                            ),
                            total: assetsResponse.total,
                        },
                        false,
                    )
                }
            }

            setTradeResult({
                tradeId: uniqueId('trade-id-'),
                executionPrice: parseFloat(data.receiveAmount),
                message:
                    tradeModalTab === 'buy'
                        ? 'Successfully bought'
                        : 'Successfully sold',
            })
            setCurrentStep('success')
        } catch {
            setMessage('Failed to execute trade. Please try again.')
        }
    }

    const renderFormStep = () => (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            {message && (
                <Alert showIcon type="danger" className="mb-4">
                    {message}
                </Alert>
            )}
            <div>
                <FormItem
                    label="Asset"
                    invalid={Boolean(errors.asset)}
                    errorMessage={errors.asset?.message}
                >
                    <Controller
                        name="asset"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={assetOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(value) =>
                                    field.onChange(value?.value || '')
                                }
                                options={assetOptions}
                                isLoading={loadingMarketData}
                                placeholder={
                                    loadingMarketData
                                        ? 'Loading assets...'
                                        : 'Select asset'
                                }
                                isDisabled={
                                    tradeModalTab === 'sell' &&
                                    assetOptions.length === 0
                                }
                                isSearchable
                                customInputDisplay={(selectedItem) => {
                                    const assetItem = selectedItem as
                                        | AssetOption
                                        | undefined
                                    return (
                                        <SelectInputWithPrefix
                                            label={
                                                assetItem ? (
                                                    <>
                                                        <span className="heading-text">
                                                            {assetItem.symbol}
                                                        </span>
                                                        <span className="text-xs font-normal">
                                                            {tradeModalTab ===
                                                            'buy'
                                                                ? ''
                                                                : `${assetItem.name}${
                                                                      assetItem.balance
                                                                          ? ` - ${assetItem.balance.toLocaleString(
                                                                                'en-US',
                                                                                {
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 6,
                                                                                },
                                                                            )} available`
                                                                          : ''
                                                                  }`}
                                                        </span>
                                                    </>
                                                ) : (
                                                    ''
                                                )
                                            }
                                            prefix={
                                                assetItem && (
                                                    <Avatar
                                                        size="sm"
                                                        src={assetItem.icon}
                                                        alt={assetItem.symbol}
                                                        className="w-5 h-5 border-0 bg-transparent"
                                                    />
                                                )
                                            }
                                        />
                                    )
                                }}
                                customOption={({
                                    option,
                                    selected,
                                    CheckIcon,
                                }) => {
                                    const assetOption = option as AssetOption
                                    return (
                                        <SelectOptionWithPrefix
                                            selected={selected}
                                            checkIcon={CheckIcon}
                                            label={
                                                <>
                                                    <span className="font-medium">
                                                        {assetOption.symbol}
                                                    </span>
                                                    <span className="text-xs font-normal">
                                                        {tradeModalTab === 'buy'
                                                            ? assetOption.name
                                                            : `${assetOption.name}${
                                                                  assetOption.balance
                                                                      ? ` - ${assetOption.balance.toLocaleString(
                                                                            'en-US',
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 6,
                                                                            },
                                                                        )} available`
                                                                      : ''
                                                              }`}
                                                    </span>
                                                </>
                                            }
                                            prefix={
                                                <Avatar
                                                    size="sm"
                                                    src={assetOption.icon}
                                                    alt={assetOption.symbol}
                                                    className="w-5 h-5 border-0 bg-transparent"
                                                />
                                            }
                                        />
                                    )
                                }}
                            />
                        )}
                    />
                    {tradeModalTab === 'sell' && assetOptions.length === 0 && (
                        <div className="mt-1 text-xs">
                            You don't have any assets available to sell
                        </div>
                    )}
                </FormItem>
                <FormItem
                    label={tradeModalTab === 'buy' ? 'Pay' : `Sell`}
                    invalid={Boolean(errors.payAmount)}
                    errorMessage={errors.payAmount?.message}
                >
                    <Controller
                        name="payAmount"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                value={field.value}
                                onValueChange={(values) =>
                                    field.onChange(values.value)
                                }
                                placeholder={
                                    tradeModalTab === 'buy'
                                        ? '0.00'
                                        : '0.00000000'
                                }
                                decimalScale={tradeModalTab === 'buy' ? 2 : 8}
                                fixedDecimalScale={tradeModalTab === 'buy'}
                                allowNegative={false}
                                inputSuffix={
                                    <span className="heading-text">
                                        {tradeModalTab === 'buy'
                                            ? 'USD'
                                            : watchedAsset}
                                    </span>
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Receive"
                    invalid={Boolean(errors.receiveAmount)}
                    errorMessage={errors.receiveAmount?.message}
                >
                    <Controller
                        name="receiveAmount"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                value={field.value}
                                onValueChange={(values) =>
                                    field.onChange(values.value)
                                }
                                placeholder={
                                    tradeModalTab === 'buy'
                                        ? '0.00000000'
                                        : '0.00'
                                }
                                decimalScale={tradeModalTab === 'buy' ? 8 : 2}
                                fixedDecimalScale={tradeModalTab === 'sell'}
                                allowNegative={false}
                                inputSuffix={
                                    <span className="heading-text">
                                        {tradeModalTab === 'buy'
                                            ? watchedAsset
                                            : 'USD'}
                                    </span>
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Payment Method"
                    invalid={Boolean(errors.paymentMethod)}
                    errorMessage={errors.paymentMethod?.message}
                >
                    <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={paymentMethodOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(value) =>
                                    field.onChange(value?.value || '')
                                }
                                options={paymentMethodOptions}
                                customInputDisplay={(selectedItem) => {
                                    const paymentItem = selectedItem as
                                        | (typeof paymentMethodOptions)[0]
                                        | undefined
                                    return (
                                        <SelectInputWithPrefix
                                            label={
                                                paymentItem ? (
                                                    <>
                                                        <span className="heading-text">
                                                            {paymentItem.label}
                                                        </span>
                                                    </>
                                                ) : (
                                                    ''
                                                )
                                            }
                                            prefix={
                                                paymentItem && (
                                                    <Avatar
                                                        size="sm"
                                                        src={paymentItem.icon}
                                                        alt={paymentItem.label}
                                                        className="w-5 h-5 border-0 bg-transparent"
                                                    />
                                                )
                                            }
                                        />
                                    )
                                }}
                                customOption={({
                                    option,
                                    selected,
                                    CheckIcon,
                                }) => {
                                    const paymentOption =
                                        option as (typeof paymentMethodOptions)[0]
                                    return (
                                        <SelectOptionWithPrefix
                                            selected={selected}
                                            checkIcon={CheckIcon}
                                            label={
                                                <div>
                                                    <div className="font-medium heading-text">
                                                        {paymentOption.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                                        {
                                                            paymentOption.accountInfo
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            prefix={
                                                <Avatar
                                                    size="sm"
                                                    src={paymentOption.icon}
                                                    alt={paymentOption.label}
                                                    className="border-0 bg-transparent"
                                                />
                                            }
                                        />
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Form>
    )

    const renderConfirmationStep = () => {
        const formValues = watch()
        const selectedPaymentMethod = paymentMethodOptions.find(
            (option) => option.value === formValues.paymentMethod,
        )
        const selectedAssetData = assetOptions.find(
            (option) => option.value === formValues.asset,
        )
        const payAmount = parseFloat(formValues.payAmount || '0')
        const receiveAmount = parseFloat(formValues.receiveAmount || '0')

        return (
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <EmptyState
                        variant="dots"
                        size={200}
                        illustration={
                            <div className="relative">
                                <div className="w-20 h-20 bg-primary-subtle rounded-full flex items-center justify-center">
                                    <Avatar
                                        size="lg"
                                        src={selectedAssetData?.icon}
                                        alt={formValues.asset}
                                        className="w-12 h-12 border-0 bg-transparent"
                                    />
                                </div>
                            </div>
                        }
                    ></EmptyState>
                </div>
                <div className="space-y-2">
                    <h4>
                        Confirm {tradeModalTab === 'buy' ? 'Purchase' : 'Sale'}
                    </h4>
                    <div>
                        {tradeModalTab === 'buy' ? (
                            <>
                                You're buying{' '}
                                <span className="font-medium heading-text">
                                    {receiveAmount.toFixed(6)}{' '}
                                    {formValues.asset}
                                </span>{' '}
                                for{' '}
                                <span className="font-medium heading-text">
                                    ${payAmount.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <>
                                You're selling{' '}
                                <span className="font-medium heading-text">
                                    {payAmount.toFixed(6)} {formValues.asset}
                                </span>{' '}
                                for{' '}
                                <span className="font-medium heading-text">
                                    ${receiveAmount.toFixed(2)}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    <h6 className="font-medium heading-text text-left">
                        Transaction Summary
                    </h6>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Asset</span>
                            <span className="heading-text">
                                {selectedAssetData?.name} ({formValues.asset})
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                {tradeModalTab === 'buy'
                                    ? 'Pay amount'
                                    : 'Sell amount'}
                            </span>
                            <span className="heading-text">
                                {tradeModalTab === 'buy'
                                    ? `$${payAmount.toFixed(2)}`
                                    : `${payAmount.toFixed(6)} ${formValues.asset}`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>You will receive</span>
                            <span className="heading-text">
                                {tradeModalTab === 'buy'
                                    ? `${receiveAmount.toFixed(6)} ${formValues.asset}`
                                    : `$${receiveAmount.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment method</span>
                            <div className="flex items-center gap-1">
                                {selectedPaymentMethod && (
                                    <Avatar
                                        src={selectedPaymentMethod.icon}
                                        alt={selectedPaymentMethod.label}
                                        className="w-5 h-5 border-0 bg-transparent"
                                    />
                                )}
                                <span className="heading-text">
                                    {selectedPaymentMethod?.label}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span>Execution price</span>
                            <span className="heading-text">
                                ${currentPrice.toFixed(4)} USD
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Processing time</span>
                            <span className="heading-text">Instant</span>
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <div className="flex justify-between">
                            <span className="font-semibold heading-text">
                                {tradeModalTab === 'buy'
                                    ? 'Total cost:'
                                    : 'Total received:'}
                            </span>
                            <span className="font-semibold heading-text">
                                {tradeModalTab === 'buy'
                                    ? `$${payAmount.toFixed(2)}`
                                    : `$${receiveAmount.toFixed(2)}`}
                            </span>
                        </div>
                    </div>
                </div>

                {message && (
                    <Alert showIcon type="danger" className="mb-4">
                        {message}
                    </Alert>
                )}
            </div>
        )
    }

    const renderSuccessStep = () => {
        const formValues = watch()

        return (
            <div className="text-center space-y-4 mt-4">
                <div className="mx-auto flex justify-center">
                    <EmptyState
                        variant="wave"
                        size={200}
                        illustration={
                            <div className="w-16 h-16 bg-success-subtle text-success rounded-full border-2 border-emerald-200 flex items-center justify-center mx-auto text-4xl">
                                <LiTick />
                            </div>
                        }
                    ></EmptyState>
                </div>
                <div>
                    <h4 className="heading-text mb-1">
                        {tradeModalTab === 'buy' ? 'Purchase' : 'Sale'}{' '}
                        Completed
                    </h4>
                    <p>{tradeResult?.message}</p>
                </div>
                {tradeResult && (
                    <Card bodyClass="space-y-2">
                        <div className="flex justify-between">
                            <span>Trade ID:</span>
                            <span className="font-mono heading-text">
                                {tradeResult.tradeId}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Execution Price:</span>
                            <span className="font-medium heading-text">
                                ${currentPrice.toFixed(4)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                {tradeModalTab === 'buy'
                                    ? 'Amount Purchased:'
                                    : 'Amount Sold:'}
                            </span>
                            <span className="font-medium heading-text">
                                {tradeModalTab === 'buy'
                                    ? `${formValues.receiveAmount} ${formValues.asset}`
                                    : `${formValues.payAmount} ${formValues.asset}`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                {tradeModalTab === 'buy'
                                    ? 'Total Cost:'
                                    : 'Total Received:'}
                            </span>
                            <span className="font-medium heading-text">
                                {tradeModalTab === 'buy'
                                    ? `$${formValues.payAmount}`
                                    : `$${formValues.receiveAmount}`}
                            </span>
                        </div>
                    </Card>
                )}

                <p>
                    Your {tradeModalTab === 'buy' ? 'purchase' : 'sale'} has
                    been completed successfully. You can view the details in
                    your trade history.
                </p>
            </div>
        )
    }

    return (
        <Dialog isOpen={modals.trade} onClose={closeAllModals}>
            <div>
                <div className="mb-4">
                    <h5 className="mb-4">Buy/Sell Assets</h5>

                    {currentStep === 'form' && (
                        <Segment
                            className="w-full"
                            value={tradeModalTab}
                            onChange={(tab) =>
                                useAssetsStore.setState({
                                    tradeModalTab: tab as 'buy' | 'sell',
                                })
                            }
                        >
                            <Segment.Item value="buy">Buy</Segment.Item>
                            <Segment.Item value="sell">Sell</Segment.Item>
                        </Segment>
                    )}
                </div>

                {currentStep === 'form' && renderFormStep()}
                {currentStep === 'confirmation' && renderConfirmationStep()}
                {currentStep === 'success' && renderSuccessStep()}

                <div className="flex justify-end gap-3 mt-4">
                    {currentStep === 'form' && (
                        <>
                            <Button
                                variant="default"
                                onClick={() => {
                                    closeAllModals()
                                    reset()
                                    setCurrentStep('form')
                                    setTradeResult(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleSubmit(handleFormSubmit)}
                            >
                                {tradeModalTab === 'buy' ? 'Buy' : 'Sell'}{' '}
                                {watchedAsset}
                            </Button>
                        </>
                    )}
                    {currentStep === 'confirmation' && (
                        <>
                            <Button
                                variant="default"
                                onClick={() => setCurrentStep('form')}
                                disabled={isSubmitting}
                            >
                                Back
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleSubmit(confirmTrade)}
                                loading={isSubmitting}
                            >
                                Confirm Trade
                            </Button>
                        </>
                    )}
                    {currentStep === 'success' && (
                        <Button
                            variant="solid"
                            onClick={() => {
                                closeAllModals()
                                reset()
                                setCurrentStep('form')
                                setTradeResult(null)
                            }}
                        >
                            Done
                        </Button>
                    )}
                </div>
            </div>
        </Dialog>
    )
}

export default TradeModal
