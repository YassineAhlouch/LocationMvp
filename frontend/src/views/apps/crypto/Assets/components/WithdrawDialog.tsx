import { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import Alert from '@/components/ui/Alert'
import { FormItem, Form } from '@/components/ui/Form'
import Divider from '@/components/shared/Divider'
import IconFrame from '@/components/shared/IconFrame'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import NumericInput from '@/components/shared/NumericInput'
import NumericInputStepper from '@/components/shared/NumericInputStepper'
import EmptyState from '@/components/shared/EmptyState'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { useAssetsStore } from '../store/assetsStore'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import {
    apiGetMarketData,
    apiGetAvailableNetworks,
    apiGetPortfolioAssets,
} from '@/services/CryptoService'
import uniqueId from 'lodash/uniqueId'
import { LiCross, LiMoneySend, LiTick } from '@/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Network, PortfolioAsset } from '../types'
import type {
    CryptoMarketData,
    GetMarketDataResponse,
} from '@/views/apps/crypto/Market/types'

type WithdrawStep = 'form' | 'confirmation' | 'success'

const validationSchema = z.object({
    crypto: z.string().min(1, 'Please select a cryptocurrency'),
    network: z.string().min(1, 'Please select a network'),
    address: z.string().min(1, 'Please enter a withdrawal address'),
    amount: z
        .string()
        .min(1, 'Please enter an amount')
        .refine((val) => {
            const num = parseFloat(val)
            return !isNaN(num) && num > 0
        }, 'Amount must be greater than 0'),
    remarks: z.string(),
})

type FormSchema = z.infer<typeof validationSchema>

const WithdrawDialog = () => {
    const { modals, closeAllModals, selectedAsset, tableState } =
        useAssetsStore()
    const [currentStep, setCurrentStep] = useState<WithdrawStep>('form')
    const [withdrawalResult, setWithdrawalResult] = useState<{
        withdrawalId: string
        txHash: string
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
            crypto: '',
            network: '',
            address: '',
            amount: '',
            remarks: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const watchedCrypto = watch('crypto')
    const watchedNetwork = watch('network')
    const watchedAmount = watch('amount')

    // Reset form when modal closes
    useEffect(() => {
        if (!modals.withdraw) {
            reset()
            setCurrentStep('form')
            setWithdrawalResult(null)
        }
    }, [modals.withdraw, reset])

    // Auto-populate crypto field when selectedAsset is provided
    useEffect(() => {
        if (modals.withdraw && selectedAsset) {
            setValue('crypto', selectedAsset)
        }
    }, [modals.withdraw, selectedAsset, setValue])

    // SWR for market data to get available cryptos
    const { data: marketDataResponse, isLoading: loadingMarketData } = useSWR(
        modals.withdraw ? '/api/crypto/market/data' : null,
        () =>
            apiGetMarketData<GetMarketDataResponse, Record<string, unknown>>({
                pageIndex: 1,
                pageSize: 100,
                sortKey: 'marketCap',
                sortOrder: 'desc',
            }),
        { revalidateOnFocus: false },
    )

    // SWR for user's assets data
    const { data: assetsResponse } = useSWR(
        modals.withdraw
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
        [marketDataResponse?.data],
    )
    const assetsData = assetsResponse?.data

    // SWR for networks data
    const { data: networksResponse, isLoading: loadingNetworks } = useSWR(
        watchedCrypto ? '/api/crypto/networks' : null,
        () => apiGetAvailableNetworks<{ networks: Network[] }>(),
        { revalidateOnFocus: false },
    )

    const networks = useMemo(
        () => networksResponse?.networks || [],
        [networksResponse?.networks],
    )

    // Generate crypto options from user's owned assets
    const cryptoOptions = useMemo(() => {
        const ownedAssets = (assetsData || []).filter(
            (asset) => asset.balance > 0,
        )
        const ownedSymbols = new Set(ownedAssets.map((asset) => asset.symbol))

        // Combine owned assets with popular market data
        const popularCryptos = marketData.slice(0, 20) // Top 20 by market cap
        const allCryptos = new Map<string, CryptoMarketData>()

        // Add popular cryptos first (only if user owns them)
        popularCryptos.forEach((crypto) => {
            if (ownedSymbols.has(crypto.symbol)) {
                allCryptos.set(crypto.symbol, crypto)
            }
        })

        // Add owned assets (they might not be in top 20)
        ownedAssets.forEach((asset) => {
            if (!allCryptos.has(asset.symbol)) {
                // Create a market data entry for owned assets not in popular list
                allCryptos.set(asset.symbol, {
                    id: asset.id,
                    symbol: asset.symbol,
                    name: asset.name,
                    image: asset.icon,
                    price: asset.value / asset.balance,
                    priceChange24h: 0,
                    priceChangePercentage24h: asset.priceChangePercentage24h,
                    priceChangePercentage30d: 0,
                    marketCap: 0,
                    volume24h: 0,
                    circulatingSupply: 0,
                    sparklineData: [],
                    marketType: 'spot' as const,
                    rank: 999,
                })
            }
        })

        return Array.from(allCryptos.values()).map((crypto) => {
            const ownedAsset = ownedAssets.find(
                (asset) => asset.symbol === crypto.symbol,
            )
            return {
                value: crypto.symbol,
                label: crypto.name,
                symbol: crypto.symbol,
                icon: crypto.image,
                balance: ownedAsset?.balance || 0,
            }
        })
    }, [marketData, assetsData])

    // Generate network options
    const networkOptions = useMemo(() => {
        return networks.map((network) => ({
            value: network.id,
            label: network.name,
            symbol: network.symbol,
            fee: network.fee,
        }))
    }, [networks])

    const currentAsset = assetsData?.find((a) => a.symbol === watchedCrypto)
    const availableBalance = currentAsset?.balance || 0
    const selectedNetworkData = networks.find((n) => n.id === watchedNetwork)
    const estimatedFee = selectedNetworkData?.fee || 0

    const clearAddress = () => {
        setValue('address', '')
    }

    const validateWithdrawal = (data: FormSchema) => {
        const amount = parseFloat(data.amount)
        if (isNaN(amount) || amount <= 0) return 'Please enter a valid amount'
        if (amount > availableBalance) return 'Insufficient balance'
        if (amount <= estimatedFee)
            return 'Amount must be greater than network fee'

        return null
    }

    const handleFormSubmit = (data: FormSchema) => {
        const error = validateWithdrawal(data)
        if (error) {
            setMessage(error)
            return
        }
        setCurrentStep('confirmation')
    }

    const confirmWithdrawal = async (data: FormSchema) => {
        try {
            await sleep(1500) // Simulate API call
            console.log('Submit withdrawal:', {
                asset: data.crypto,
                network: data.network,
                address: data.address,
                amount: parseFloat(data.amount),
                remarks: data.remarks,
            })

            setWithdrawalResult({
                withdrawalId: uniqueId('withdrawal-id-'),
                txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                message: 'Withdrawal succeeded',
            })
            setCurrentStep('success')
        } catch {
            setMessage('Error submitting withdrawal. Please try again.')
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
                    label="Select Crypto"
                    invalid={Boolean(errors.crypto)}
                    errorMessage={errors.crypto?.message}
                >
                    <Controller
                        name="crypto"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={cryptoOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(value) => {
                                    field.onChange(value?.value || '')
                                    setValue('network', '')
                                    setValue('address', '')
                                    setValue('amount', '')
                                    setValue('remarks', '')
                                }}
                                options={cryptoOptions}
                                isLoading={loadingMarketData}
                                placeholder={
                                    loadingMarketData
                                        ? 'Loading cryptocurrencies...'
                                        : 'Select cryptocurrency'
                                }
                                customInputDisplay={(selectedItem) => {
                                    const cryptoItem = selectedItem as
                                        | (typeof cryptoOptions)[0]
                                        | undefined
                                    return (
                                        <SelectInputWithPrefix
                                            label={
                                                cryptoItem ? (
                                                    <>
                                                        <span className="font-medium heading-text">
                                                            {cryptoItem.symbol}
                                                        </span>
                                                    </>
                                                ) : (
                                                    ''
                                                )
                                            }
                                            prefix={
                                                cryptoItem && (
                                                    <Avatar
                                                        size="sm"
                                                        src={cryptoItem.icon}
                                                        alt={cryptoItem.symbol}
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
                                    const cryptoOption =
                                        option as (typeof cryptoOptions)[0]
                                    return (
                                        <SelectOptionWithPrefix
                                            selected={selected}
                                            checkIcon={CheckIcon}
                                            label={
                                                <>
                                                    <span className="font-medium">
                                                        {cryptoOption.symbol}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                                        {cryptoOption.label}
                                                    </span>
                                                </>
                                            }
                                            prefix={
                                                <Avatar
                                                    size="sm"
                                                    src={cryptoOption.icon}
                                                    alt={cryptoOption.symbol}
                                                    className="w-5 h-5 border-0 bg-transparent"
                                                />
                                            }
                                        />
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>
                {watchedCrypto && (
                    <FormItem
                        label="Address"
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <div className="relative">
                                    <Input
                                        {...field}
                                        placeholder="Please enter your withdrawal address"
                                        suffix={
                                            <>
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        onClick={clearAddress}
                                                        title="Clear"
                                                    >
                                                        <LiCross className="text-lg" />
                                                    </button>
                                                )}
                                            </>
                                        }
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                )}

                {watchedCrypto && (
                    <FormItem
                        label="Network"
                        invalid={Boolean(errors.network)}
                        errorMessage={errors.network?.message}
                    >
                        <Controller
                            name="network"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={networkOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(value) =>
                                        field.onChange(value?.value || '')
                                    }
                                    options={networkOptions}
                                    isLoading={loadingNetworks}
                                    placeholder={
                                        loadingNetworks
                                            ? 'Loading networks...'
                                            : 'Select network'
                                    }
                                    customInputDisplay={(selectedItem) => {
                                        const networkItem = selectedItem as
                                            | (typeof networkOptions)[0]
                                            | undefined
                                        return (
                                            <>
                                                {networkItem ? (
                                                    <span className="flex items-center gap-1">
                                                        <span className="heading-text font-medium">
                                                            {networkItem.symbol}
                                                        </span>
                                                        -
                                                        <span className="font-normal">
                                                            {networkItem.label}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        )
                                    }}
                                    customOption={({ option, selected }) => {
                                        const networkOption =
                                            option as (typeof networkOptions)[0]
                                        return (
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={classNames(
                                                                'heading-text font-medium',
                                                                {
                                                                    'text-primary':
                                                                        selected,
                                                                },
                                                            )}
                                                        >
                                                            {
                                                                networkOption.symbol
                                                            }
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                                            {
                                                                networkOption.label
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                                            Fee:{' '}
                                                            {networkOption.fee}{' '}
                                                            {
                                                                networkOption.symbol
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                            )}
                        />
                    </FormItem>
                )}

                {watchedCrypto && watchedNetwork && (
                    <>
                        <FormItem
                            label={
                                <div className="flex items-center justify-between w-full">
                                    <span>Withdraw Amount</span>
                                    <span className="font-normal">
                                        Available Balance:
                                        <span className="font-semibold">
                                            {' '}
                                            {availableBalance.toFixed(8)}{' '}
                                            {watchedCrypto}
                                        </span>
                                    </span>
                                </div>
                            }
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
                                            <div className="flex items-center gap-2 -mr-2">
                                                <span className="heading-text font-medium">
                                                    {watchedCrypto}
                                                </span>
                                                <NumericInputStepper
                                                    step={0.00000001}
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
                                        placeholder="0.00000000"
                                        decimalScale={8}
                                        fixedDecimalScale
                                        allowNegative={false}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Remarks */}
                        <FormItem
                            label="Remarks (optional)"
                            invalid={Boolean(errors.remarks)}
                            errorMessage={errors.remarks?.message}
                        >
                            <Controller
                                name="remarks"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="e.g. Purpose of withdrawal"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Fee Summary */}
                        {watchedAmount && parseFloat(watchedAmount) > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium heading-text">
                                        Received
                                    </span>
                                    <div className="ltr:text-right rtl:text-left">
                                        <div className="font-semibold heading-text text-base">
                                            {parseFloat(watchedAmount).toFixed(
                                                8,
                                            )}{' '}
                                            {watchedCrypto}
                                        </div>
                                        <div className="font-medium">
                                            Fee: {estimatedFee}{' '}
                                            {selectedNetworkData?.symbol}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Form>
    )

    const renderConfirmationStep = () => {
        const formValues = watch()
        const withdrawAmount = parseFloat(formValues.amount || '0')
        const currentPrice = currentAsset
            ? currentAsset.value / currentAsset.balance
            : 0
        const usdValue = withdrawAmount * currentPrice

        return (
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <EmptyState
                        variant="dots"
                        size={200}
                        illustration={
                            <div className="relative">
                                <div className="w-20 h-20 bg-primary-subtle dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <Avatar
                                        size="lg"
                                        src={currentAsset?.icon}
                                        alt={formValues.crypto}
                                        className="w-12 h-12 border-0 bg-transparent"
                                    />
                                </div>
                            </div>
                        }
                    ></EmptyState>
                </div>
                <div className="space-y-1">
                    <h4>Confirm Withdrawal</h4>
                    <div>
                        You're withdrawing{' '}
                        <span className="font-medium heading-text">
                            {formValues.amount} {formValues.crypto}
                        </span>{' '}
                        worth{' '}
                        <span className="font-medium heading-text">
                            ${usdValue.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <div className="text-sm font-medium heading-text text-left">
                        Transaction Summary
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Amount</span>
                            <span className="heading-text">
                                {formValues.amount} {formValues.crypto}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Network fee</span>
                            <span className="heading-text">
                                {estimatedFee} {selectedNetworkData?.symbol}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Network</span>
                            <span className="heading-text">
                                {selectedNetworkData?.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Average processing time</span>
                            <span className="heading-text">2-5 mins</span>
                        </div>
                        {formValues.remarks && (
                            <div className="flex justify-between">
                                <span>Remarks</span>
                                <span className="heading-text max-w-[200px] text-right break-words">
                                    {formValues.remarks}
                                </span>
                            </div>
                        )}
                    </div>
                    <Divider />
                    <div>
                        <div className="flex justify-between">
                            <span className="font-semibold heading-text">
                                You will send:
                            </span>
                            <span className="font-semibold heading-text">
                                {formValues.amount} {formValues.crypto}
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

    const renderSuccessStep = () => (
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
                <h4 className="heading-text mb-1">Withdrawal Submitted</h4>
                <p>{withdrawalResult?.message}</p>
            </div>
            {withdrawalResult && (
                <Card bodyClass="space-y-2">
                    <div className="flex justify-between">
                        <span>Withdrawal ID:</span>
                        <span className="font-mono heading-text">
                            {withdrawalResult.withdrawalId}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Transaction Hash:</span>
                        <span className="font-mono heading-text">
                            {withdrawalResult.txHash.slice(0, 6)}...
                            {withdrawalResult.txHash.slice(-6)}
                        </span>
                    </div>
                </Card>
            )}

            <p>
                Your withdrawal is being processed. You will receive a
                confirmation email shortly.
            </p>
        </div>
    )

    return (
        <Dialog
            isOpen={modals.withdraw}
            onClose={closeAllModals}
            width={600}
            className="p-0"
            closable={false}
        >
            {currentStep !== 'success' && currentStep !== 'confirmation' && (
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <IconFrame variant="layered">
                            <LiMoneySend className="text-xl heading-text" />
                        </IconFrame>
                        <div>
                            <h5>Withdraw Crypto</h5>
                            <p className="pr-12">
                                Send cryptocurrency to external wallet
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="subtle"
                        size="sm"
                        type="button"
                        icon={<LiCross className="text-2xl" />}
                        onClick={() => {
                            closeAllModals()
                            reset()
                            setCurrentStep('form')
                            setWithdrawalResult(null)
                        }}
                    />
                </div>
            )}

            <div className="p-4">
                {currentStep === 'form' && renderFormStep()}
                {currentStep === 'confirmation' && renderConfirmationStep()}
                {currentStep === 'success' && renderSuccessStep()}

                <div className="flex justify-end gap-3 mt-6">
                    {currentStep === 'form' && (
                        <>
                            <Button
                                variant="default"
                                onClick={() => {
                                    closeAllModals()
                                    reset()
                                    setCurrentStep('form')
                                    setWithdrawalResult(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleSubmit(handleFormSubmit)}
                                disabled={
                                    !watchedCrypto ||
                                    !watchedNetwork ||
                                    !watchedAmount ||
                                    !watch('address')
                                }
                            >
                                Submit
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
                                onClick={handleSubmit(confirmWithdrawal)}
                                loading={isSubmitting}
                            >
                                Confirm Withdrawal
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
                                setWithdrawalResult(null)
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

export default WithdrawDialog
