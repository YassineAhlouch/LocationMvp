import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Segment from '@/components/ui/Segment'
import Input from '@/components/ui/Input'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import Popover from '@/components/ui/Popover'
import Scroll from '@/components/ui/Scroll'
import Tag from '@/components/ui/Tag'
import { LiSearch, LiTick, LiChevronDown } from '@/icons'
import EmptyState from '@/components/shared/EmptyState'
import Divider from '@/components/shared/Divider'
import { colors } from '@/constants/colors.constant'
import formatCurrency from '@/utils/formatCurrency'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import {
    apiGetMarketData,
    apiGetFiatCurrencies,
} from '@/services/CryptoService'
import { useCryptoDashboardStore } from '@/views/apps/crypto/CryptoDashboard/store/cryptoDashboardStore'
import type { CryptoMarketData } from '@/views/apps/crypto/Market/types'
import type { FiatCurrency } from '@/mock/data/cryptoData'
import classNames from '@/utils/classNames'

type PaymentMethod = {
    id: string
    name: string
    icon: React.ReactNode
    recommended?: boolean
}

type SelectorItem = {
    id: string
    symbol: string
    name: string
    icon?: React.ReactNode
    extra?: React.ReactNode
    isSelected?: boolean
}

type CurrencySelectorProps = {
    triggerIcon: React.ReactNode
    triggerLabel: string
    items: SelectorItem[]
    onSelect: (id: string) => void
}

const CurrencySelector = ({
    triggerIcon,
    triggerLabel,
    items,
    onSelect,
}: CurrencySelectorProps) => {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)

    const filteredItems = useMemo(() => {
        if (!query.trim()) return items
        const q = query.toLowerCase()
        return items.filter(
            (item) =>
                item.symbol.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q),
        )
    }, [items, query])

    const handleSelect = (id: string) => {
        onSelect(id)
        setOpen(false)
        setQuery('')
    }

    return (
        <Popover
            className="p-2"
            placement="bottom-end"
            open={open}
            onOpenChange={setOpen}
            renderTrigger={
                <Button
                    size="sm"
                    variant="subtle"
                    className="flex items-center gap-2"
                >
                    {triggerIcon}
                    <span className="font-medium">{triggerLabel}</span>
                    <LiChevronDown className="w-4 h-4" />
                </Button>
            }
        >
            <div className="mb-2">
                <Input
                    placeholder="Search..."
                    prefix={<LiSearch className="text-lg" />}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <Scroll.FlexSize className="max-h-72 ltr:pr-2 rtl:pl-2">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className="w-full flex items-center gap-4 px-2 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                            onClick={() => handleSelect(item.id)}
                        >
                            {item.icon}
                            <div className="flex-1 ltr:text-left rtl:text-right">
                                <div className="font-medium heading-text">
                                    {item.symbol}
                                </div>
                                <div className="text-xs">{item.name}</div>
                            </div>
                            {item.isSelected && (
                                <LiTick className="w-5 h-5 text-primary" />
                            )}
                        </button>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No results found
                    </div>
                )}
            </Scroll.FlexSize>
        </Popover>
    )
}

type AmountFieldProps = {
    label: string
    value: string
    onChange: (value: string) => void
    selector: React.ReactNode
    helperText?: React.ReactNode
    inputRef?: React.RefObject<HTMLInputElement | null>
}

const AmountField = ({
    label,
    value,
    onChange,
    selector,
    inputRef,
}: AmountFieldProps) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="mb-2">{label}</div>
        <div className="flex items-center gap-2">
            <Input
                ref={inputRef}
                type="number"
                placeholder="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border-0 text-xl font-semibold p-0 bg-transparent focus:ring-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {selector}
        </div>
    </div>
)

const PaymentIcon = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="h-8 object-contain" />
)

const paymentMethods: PaymentMethod[] = [
    {
        id: 'card',
        name: 'Debit/Credit Card',
        icon: (
            <PaymentIcon
                src="/img/thumbs/payment/creditCard.png"
                alt="Credit Card"
            />
        ),
    },
    {
        id: 'google',
        name: 'Google Pay',
        icon: (
            <PaymentIcon
                src="/img/thumbs/payment/googlePay.png"
                alt="Google Pay"
            />
        ),
        recommended: true,
    },
    {
        id: 'apple',
        name: 'Apple Pay',
        icon: (
            <PaymentIcon
                src="/img/thumbs/payment/applePay.png"
                alt="Apple Pay"
            />
        ),
    },
]

const fiatColorMap: Record<string, keyof typeof colors> = {
    USD: 'emerald',
    EUR: 'blue',
    GBP: 'purple',
    JPY: 'rose',
    CAD: 'red',
    AUD: 'orange',
    CHF: 'cyan',
    CNY: 'yellow',
}

const FiatIcon = ({ symbol, code }: { symbol: string; code?: string }) => {
    const colorKey = code ? fiatColorMap[code] || 'gray' : 'emerald'
    const colorClass = colors[colorKey]

    return (
        <Avatar
            size={24}
            shape="circle"
            className={classNames('border-0 text-white', colorClass.bg)}
        >
            {symbol}
        </Avatar>
    )
}

const CryptoIcon = ({ src, alt }: { src: string; alt: string }) => (
    <img
        src={src}
        alt={alt}
        className="w-5 h-5 rounded-full"
        onError={(e) => {
            ;(e.target as HTMLImageElement).src =
                '/img/thumbs/crypto/default.png'
        }}
    />
)

const BuySellPanel = () => {
    const navigate = useNavigate()
    const selectedAsset = useCryptoDashboardStore(
        (state) => state.selectedAsset,
    )
    const cryptoInputRef = useRef<HTMLInputElement>(null)
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
    const [fiatAmount, setFiatAmount] = useState('')
    const [cryptoAmount, setCryptoAmount] = useState('')
    const [lastEdited, setLastEdited] = useState<'fiat' | 'crypto'>('fiat')
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedCryptoId, setSelectedCryptoId] = useState<string | null>(
        null,
    )
    const [selectedFiatId, setSelectedFiatId] = useState<string | null>(null)

    // Dialog states
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
    const [summaryDialogOpen, setSummaryDialogOpen] = useState(false)
    const [successDialogOpen, setSuccessDialogOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
        paymentMethods[0],
    )
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    // Data fetching
    const { data: cryptoData } = useSWR('crypto-market-data', () =>
        apiGetMarketData<{ data: CryptoMarketData[] }, { pageSize: number }>({
            pageSize: 50,
        }),
    )
    const { data: fiatData } = useSWR('fiat-currencies', () =>
        apiGetFiatCurrencies<{ data: FiatCurrency[] }>(),
    )

    const cryptoList = useMemo(() => cryptoData?.data || [], [cryptoData?.data])
    const fiatList = useMemo(() => fiatData?.data || [], [fiatData?.data])

    // When selectedAsset changes from store (Buy button clicked), update crypto and focus input
    useEffect(() => {
        if (selectedAsset && cryptoList.length > 0) {
            const matchedCrypto = cryptoList.find(
                (c) =>
                    c.symbol === selectedAsset.symbol ||
                    c.name === selectedAsset.name,
            )
            if (matchedCrypto) {
                setSelectedCryptoId(matchedCrypto.id)
                setTimeout(() => cryptoInputRef.current?.focus(), 100)
            }
        }
    }, [selectedAsset, cryptoList])

    const selectedCrypto = useMemo(
        () =>
            cryptoList.find((c) => c.id === selectedCryptoId) ||
            cryptoList.find((c) => c.symbol === 'BTC') ||
            cryptoList[0],
        [cryptoList, selectedCryptoId],
    )

    const asset = useMemo(
        () =>
            selectedCrypto
                ? {
                      name: selectedCrypto.name,
                      symbol: selectedCrypto.symbol,
                      icon: selectedCrypto.image,
                      price: selectedCrypto.price,
                  }
                : selectedAsset || {
                      name: 'Bitcoin',
                      symbol: 'BTC',
                      icon: '/img/thumbs/crypto/btc.png',
                      price: 104500,
                  },
        [selectedCrypto, selectedAsset],
    )

    const selectedFiat = useMemo(
        () =>
            fiatList.find((f) => f.id === selectedFiatId) ||
            fiatList.find((f) => f.code === 'USD') ||
            fiatList[0] || {
                id: 'usd',
                name: 'US Dollar',
                symbol: '$',
                code: 'USD',
                exchangeRate: 1,
            },
        [fiatList, selectedFiatId],
    )

    const fee = 2.0
    const isBuy = activeTab === 'buy'
    const numericFiat = parseFloat(fiatAmount) || 0
    const numericCrypto = parseFloat(cryptoAmount) || 0
    const calculatedCrypto =
        lastEdited === 'fiat' ? numericFiat / asset.price : numericCrypto
    const calculatedFiat =
        lastEdited === 'crypto' ? numericCrypto * asset.price : numericFiat
    const totalCost = calculatedFiat + fee
    const isDisabled = isBuy ? calculatedFiat <= 0 : calculatedCrypto <= 0

    // Selector items
    const fiatItems: SelectorItem[] = useMemo(
        () =>
            fiatList.map((fiat) => ({
                id: fiat.id,
                symbol: fiat.code,
                name: fiat.name,
                icon: <FiatIcon symbol={fiat.symbol} code={fiat.code} />,
                isSelected: selectedFiat.id === fiat.id,
            })),
        [fiatList, selectedFiat.id],
    )

    const cryptoItems: SelectorItem[] = useMemo(
        () =>
            cryptoList.slice(0, 15).map((crypto) => ({
                id: crypto.id,
                symbol: crypto.symbol,
                name: crypto.name,
                icon: <CryptoIcon src={crypto.image} alt={crypto.name} />,
                extra: (
                    <div className="text-sm heading-text">
                        {formatCurrency(crypto.price)}
                    </div>
                ),
                isSelected: selectedCrypto?.id === crypto.id,
            })),
        [cryptoList, selectedCrypto?.id],
    )

    // Handlers
    const handleFiatChange = useCallback(
        (value: string) => {
            setFiatAmount(value)
            setLastEdited('fiat')
            const num = parseFloat(value) || 0
            setCryptoAmount(num > 0 ? (num / asset.price).toFixed(8) : '')
        },
        [asset.price],
    )

    const handleCryptoChange = useCallback(
        (value: string) => {
            setCryptoAmount(value)
            setLastEdited('crypto')
            const num = parseFloat(value) || 0
            setFiatAmount(num > 0 ? (num * asset.price).toFixed(2) : '')
        },
        [asset.price],
    )

    const handleCryptoSelect = useCallback(
        (id: string) => {
            setSelectedCryptoId(id)
            const newCrypto = cryptoList.find((c) => c.id === id)
            if (newCrypto && numericFiat > 0) {
                setCryptoAmount((numericFiat / newCrypto.price).toFixed(8))
            }
        },
        [cryptoList, numericFiat],
    )

    const handleFiatSelect = useCallback((id: string) => {
        setSelectedFiatId(id)
    }, [])

    const handlePaymentSelect = useCallback((method: PaymentMethod) => {
        setSelectedPayment(method)
    }, [])

    const [orderId, setOrderId] = useState('')

    const handlePurchaseClick = useCallback(() => {
        setAgreedToTerms(false)
        setOrderId(`${(Math.random() * 2 + 1).toFixed(2)}T`)
        setSummaryDialogOpen(true)
    }, [])

    const handleConfirmPurchase = useCallback(async () => {
        if (!agreedToTerms) return
        setIsProcessing(true)
        await sleep(1500)
        setIsProcessing(false)
        setSummaryDialogOpen(false)
        setSuccessDialogOpen(true)
    }, [agreedToTerms])

    const handleSuccessDismiss = useCallback(() => {
        setSuccessDialogOpen(false)
        setFiatAmount('')
        setCryptoAmount('')
    }, [])

    return (
        <>
            <Card>
                <h5 className="mb-4">{isBuy ? 'Buy' : 'Sell'} Crypto</h5>
                <Segment
                    value={activeTab}
                    onChange={(v) => {
                        setActiveTab(v as 'buy' | 'sell')
                        setFiatAmount('')
                        setCryptoAmount('')
                    }}
                    className="mb-4 w-full"
                >
                    <Segment.Item value="buy">Buy</Segment.Item>
                    <Segment.Item value="sell">Sell</Segment.Item>
                </Segment>

                <div className="space-y-4">
                    {isBuy ? (
                        <>
                            <AmountField
                                label="Spend"
                                value={fiatAmount}
                                onChange={handleFiatChange}
                                selector={
                                    <CurrencySelector
                                        triggerIcon={
                                            <FiatIcon
                                                symbol={selectedFiat.symbol}
                                                code={selectedFiat.code}
                                            />
                                        }
                                        triggerLabel={selectedFiat.code}
                                        items={fiatItems}
                                        onSelect={handleFiatSelect}
                                    />
                                }
                            />
                            <AmountField
                                label="Receive"
                                value={cryptoAmount}
                                onChange={handleCryptoChange}
                                inputRef={cryptoInputRef}
                                selector={
                                    <CurrencySelector
                                        triggerIcon={
                                            <CryptoIcon
                                                src={asset.icon}
                                                alt={asset.name}
                                            />
                                        }
                                        triggerLabel={asset.symbol}
                                        items={cryptoItems}
                                        onSelect={handleCryptoSelect}
                                    />
                                }
                            />
                        </>
                    ) : (
                        <>
                            <AmountField
                                label="Sell"
                                value={cryptoAmount}
                                onChange={handleCryptoChange}
                                inputRef={cryptoInputRef}
                                selector={
                                    <CurrencySelector
                                        triggerIcon={
                                            <CryptoIcon
                                                src={asset.icon}
                                                alt={asset.name}
                                            />
                                        }
                                        triggerLabel={asset.symbol}
                                        items={cryptoItems}
                                        onSelect={handleCryptoSelect}
                                    />
                                }
                            />
                            <AmountField
                                label="Get"
                                value={fiatAmount}
                                onChange={handleFiatChange}
                                selector={
                                    <CurrencySelector
                                        triggerIcon={
                                            <FiatIcon
                                                symbol={selectedFiat.symbol}
                                                code={selectedFiat.code}
                                            />
                                        }
                                        triggerLabel={selectedFiat.code}
                                        items={fiatItems}
                                        onSelect={handleFiatSelect}
                                    />
                                }
                            />
                        </>
                    )}
                    <div>
                        <div className="mb-2 heading-text">
                            {isBuy ? 'Pay with' : 'Sell to'}
                        </div>
                        <button
                            type="button"
                            className="w-full flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setPaymentDialogOpen(true)}
                        >
                            <div className="flex items-center gap-3">
                                {selectedPayment.icon}
                                <span className="font-medium heading-text">
                                    {selectedPayment.name}
                                </span>
                            </div>
                            <LiChevronDown className="heading-text text-lg" />
                        </button>
                    </div>

                    <div className="">
                        Estimated price:{' '}
                        <span className="heading-text">
                            1 {asset.symbol} ≈ {selectedFiat.symbol}
                            {(asset.price / selectedFiat.exchangeRate).toFixed(
                                2,
                            )}
                        </span>
                    </div>

                    <Button
                        block
                        variant="solid"
                        disabled={isDisabled}
                        loading={isProcessing}
                        onClick={handlePurchaseClick}
                    >
                        {isBuy ? 'Buy' : 'Sell'} {asset.symbol}
                    </Button>
                </div>
            </Card>

            {/* Payment Method Dialog */}
            <Dialog
                isOpen={paymentDialogOpen}
                onClose={() => setPaymentDialogOpen(false)}
                width={600}
            >
                <div>
                    <h5 className="mb-4">Select Payment Method</h5>
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                type="button"
                                className={classNames(
                                    `
                                    w-full flex items-center justify-between p-4 rounded-xl border transition-colors relative`,
                                    selectedPayment.id === method.id
                                        ? 'border-primary dark:border-primary ring-1 ring-primary'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700',
                                )}
                                onClick={() => handlePaymentSelect(method)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        {method.icon}
                                    </div>
                                    <span className="font-medium heading-text">
                                        {method.name}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-semibold heading-text">
                                        {(
                                            asset.price /
                                            selectedFiat.exchangeRate
                                        ).toFixed(4)}{' '}
                                        {selectedFiat.code}
                                    </span>
                                    {method.recommended && (
                                        <div className="absolute top-0 ltr:right-0 rtl:left-0">
                                            <Tag
                                                className={classNames(
                                                    colors.emerald.iconBg,
                                                    colors.emerald.iconText,
                                                    'border-0',
                                                )}
                                            >
                                                Recommended
                                            </Tag>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 pb-2">
                        <div>
                            <div className="font-semibold heading-text">
                                {calculatedCrypto.toFixed(4)} {asset.symbol}
                            </div>
                            <div className="heading-text text-xs">
                                Pay - {selectedFiat.symbol}
                                {calculatedFiat.toFixed(2)} {selectedFiat.code}
                            </div>
                        </div>
                        <Button
                            variant="solid"
                            onClick={() => setPaymentDialogOpen(false)}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Summary Dialog */}
            <Dialog
                isOpen={summaryDialogOpen}
                onClose={() => setSummaryDialogOpen(false)}
                width={600}
            >
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
                                            src={asset.icon}
                                            alt={asset.name}
                                            className="w-12 h-12 border-0 bg-transparent"
                                        />
                                    </div>
                                </div>
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <h4>Confirm {isBuy ? 'Purchase' : 'Sale'}</h4>
                        <div>
                            You're {isBuy ? 'buying' : 'selling'}{' '}
                            <span className="font-medium heading-text">
                                {calculatedCrypto.toFixed(4)} {asset.symbol}
                            </span>{' '}
                            worth{' '}
                            <span className="font-medium heading-text">
                                {selectedFiat.symbol}
                                {calculatedFiat.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="text-sm font-medium heading-text text-left">
                            Transaction Summary
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Order ID</span>
                                <span className="heading-text">{orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount</span>
                                <span className="heading-text">
                                    {formatCurrency(calculatedFiat)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>
                                    Estimated {isBuy ? 'Received' : 'Value'}
                                </span>
                                <span className="heading-text">
                                    {calculatedCrypto.toFixed(4)} {asset.symbol}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Fee</span>
                                <span className="heading-text">
                                    {formatCurrency(fee)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>{isBuy ? 'Pay with' : 'Sell to'}</span>
                                <span className="heading-text">
                                    {selectedPayment.name}
                                </span>
                            </div>
                        </div>
                        <Divider />
                        <div>
                            <div className="flex justify-between">
                                <span className="font-semibold heading-text">
                                    Total Cost:
                                </span>
                                <span className="font-semibold heading-text">
                                    {formatCurrency(totalCost)}
                                </span>
                            </div>
                        </div>
                        <div className="ltr:text-left rtl:text-right">
                            <Checkbox
                                checked={agreedToTerms}
                                onChange={(checked) =>
                                    setAgreedToTerms(checked)
                                }
                            >
                                <span>
                                    I understand that I won't be able to
                                    withdraw this purchase for 72 hours
                                </span>
                            </Checkbox>
                        </div>

                        <Button
                            block
                            variant="solid"
                            disabled={!agreedToTerms}
                            loading={isProcessing}
                            onClick={handleConfirmPurchase}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Success Dialog */}
            <Dialog
                isOpen={successDialogOpen}
                onClose={handleSuccessDismiss}
                width={600}
                closable={false}
            >
                <div className="text-center mt-5">
                    <div className="mx-auto flex justify-center">
                        <EmptyState
                            variant="wave"
                            size={200}
                            illustration={
                                <div className="w-16 h-16 bg-success-subtle text-success rounded-full border-2 border-emerald-200 flex items-center justify-center mx-auto text-4xl">
                                    <LiTick />
                                </div>
                            }
                        />
                    </div>
                    <h4 className="mb-4">
                        {calculatedCrypto.toFixed(4)} {asset.symbol}
                    </h4>
                    <h6 className="mb-2">
                        Your {isBuy ? 'purchase' : 'sale'} was successful!
                    </h6>
                    <p className="mb-8">
                        Your {asset.name} is on the way! You'll be notified once
                        the funds arrive in your wallet.
                    </p>
                    <div className="space-y-2">
                        <Button
                            block
                            variant="solid"
                            onClick={() => {
                                handleSuccessDismiss()
                                navigate('/apps/crypto/assets')
                            }}
                        >
                            View Transactions
                        </Button>
                        <Button
                            block
                            variant="default"
                            onClick={handleSuccessDismiss}
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default BuySellPanel
