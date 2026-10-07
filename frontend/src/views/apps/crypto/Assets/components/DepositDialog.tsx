import { useState, useMemo } from 'react'
import useSWR from 'swr'
import Alert from '@/components/ui/Alert'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import InputGroup from '@/components/ui/InputGroup'
import Select from '@/components/ui/Select'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Loading from '@/components/shared/Loading'
import { useAssetsStore } from '../store/assetsStore'
import {
    apiGetMarketData,
    apiGetAvailableNetworks,
    apiGetDepositAddress,
    apiGetPortfolioAssets,
} from '@/services/CryptoService'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import { LiMoneyRecive, LiCross, LiChevronRight } from '@/icons'
import type { Network, PortfolioAsset } from '../types'
import type {
    CryptoMarketData,
    GetMarketDataResponse,
} from '@/views/apps/crypto/Market/types'

const DepositDialog = () => {
    const { modals, closeAllModals, tableState } = useAssetsStore()
    const [selectedCrypto, setSelectedCrypto] = useState<
        { value: string; label: string } | undefined
    >(undefined)
    const [selectedNetwork, setSelectedNetwork] = useState<
        { value: string; label: string } | undefined
    >(undefined)
    const [walletAddress, setWalletAddress] = useState<string>('')
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)

    // SWR for market data to get available cryptos
    const { data: marketDataResponse, isLoading: loadingMarketData } = useSWR(
        modals.deposit ? '/api/crypto/market/data' : null,
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
        modals.deposit
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
        selectedCrypto ? '/api/crypto/networks' : null,
        () => apiGetAvailableNetworks<{ networks: Network[] }>(),
        { revalidateOnFocus: false },
    )

    const networks = useMemo(
        () => networksResponse?.networks || [],
        [networksResponse?.networks],
    )

    const cryptoOptions = useMemo(() => {
        const ownedAssets = (assetsData || []).filter(
            (asset) => asset.balance > 0,
        )
        const ownedSymbols = new Set(ownedAssets.map((asset) => asset.symbol))

        const popularCryptos = marketData.slice(0, 20) // Top 20 by market cap
        const allCryptos = new Map<string, CryptoMarketData>()

        // Add popular cryptos first
        popularCryptos.forEach((crypto) => {
            allCryptos.set(crypto.symbol, crypto)
        })
        ownedAssets.forEach((asset) => {
            if (!allCryptos.has(asset.symbol)) {
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

        return Array.from(allCryptos.values()).map((crypto) => ({
            value: crypto.symbol,
            label: crypto.name,
            symbol: crypto.symbol,
            icon: crypto.image,
            isOwned: ownedSymbols.has(crypto.symbol),
        }))
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

    // Load wallet address when both crypto and network are selected
    const loadWalletAddress = async () => {
        if (!selectedCrypto || !selectedNetwork) return

        setIsLoadingAddress(true)
        setWalletAddress('')

        try {
            const response = await apiGetDepositAddress<{ address: string }>(
                selectedNetwork.value,
            )
            setWalletAddress(response.address)
        } catch (error) {
            console.error('Failed to load wallet address:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to generate wallet address
                </Notification>,
            )
        } finally {
            setIsLoadingAddress(false)
        }
    }

    // Load address when network changes
    useMemo(() => {
        if (selectedCrypto && selectedNetwork) {
            loadWalletAddress()
        }
    }, [selectedCrypto, selectedNetwork]) // eslint-disable-line react-hooks/exhaustive-deps

    const copyAddress = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress)
            toast.push(
                <Notification type="success" title="Copied">
                    Wallet address copied to clipboard
                </Notification>,
            )
        }
    }

    const generateQRCode = () => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(walletAddress)}`
    }

    const selectedNetworkData = networks.find(
        (n) => n.id === selectedNetwork?.value,
    )

    return (
        <Dialog
            isOpen={modals.deposit}
            onClose={closeAllModals}
            width={600}
            className="p-0"
            closable={false}
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame variant="layered">
                        <LiMoneyRecive className="heading-text text-xl" />
                    </IconFrame>
                    <div>
                        <h5>Deposit Crypto</h5>
                        <p className="pr-12">
                            Select cryptocurrency and network to generate
                            deposit address
                        </p>
                    </div>
                </div>
                <Button
                    variant="subtle"
                    size="sm"
                    icon={<LiCross className="text-2xl" />}
                    type="button"
                    onClick={() => closeAllModals()}
                />
            </div>

            <div className="space-y-6 p-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Select Crypto
                    </label>
                    <Select
                        value={selectedCrypto}
                        onChange={(value) => {
                            setSelectedCrypto(value)
                            setSelectedNetwork(undefined)
                            setWalletAddress('')
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
                        customOption={({ option, selected, CheckIcon }) => {
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
                </div>

                {selectedCrypto && (
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Network
                        </label>
                        <Select
                            value={selectedNetwork}
                            onChange={(value) => {
                                setSelectedNetwork(value)
                                setWalletAddress('')
                            }}
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
                            customOption={({ option, selected, CheckIcon }) => {
                                const networkOption =
                                    option as (typeof networkOptions)[0]
                                return (
                                    <>
                                        <div className="flex flex-col">
                                            <span className="heading-text font-medium">
                                                {networkOption.symbol}
                                            </span>
                                            <span className="text-xs">
                                                {networkOption.label}
                                            </span>
                                        </div>
                                        {selected && CheckIcon}
                                    </>
                                )
                            }}
                        />
                    </div>
                )}

                {selectedCrypto && selectedNetwork && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Deposit Address</span>
                        </div>

                        {isLoadingAddress ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="flex items-center justify-center p-8">
                                    <Loading loading />
                                </div>
                            </div>
                        ) : walletAddress ? (
                            <div className="space-y-4">
                                <Card bodyClass="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={generateQRCode()}
                                            alt="Deposit QR Code"
                                            className="w-24 h-24 rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <p className="mb-1">
                                                {selectedNetworkData?.name} (
                                                {selectedNetworkData?.symbol})
                                                Address
                                            </p>
                                            <InputGroup>
                                                <Input
                                                    value={walletAddress}
                                                    readOnly
                                                />
                                                <Button
                                                    variant="solid"
                                                    onClick={copyAddress}
                                                >
                                                    Copy
                                                </Button>
                                            </InputGroup>
                                        </div>
                                    </div>
                                </Card>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Minimum deposit amount</span>
                                        <span className="heading-text">
                                            0 {selectedCrypto.value}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Deposit Account</span>
                                        <span className="heading-text">
                                            <span>Spot Account</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Pre-crediting</span>
                                        <span className="heading-text">
                                            15 network confirmations
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Credited Successfully</span>
                                        <span className="heading-text">
                                            61 network confirmations
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Contract Address</span>
                                        <button className="text-primary hover:underline flex items-center gap-1">
                                            <span>97955</span>
                                            <LiChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
                {selectedCrypto && selectedNetwork && walletAddress && (
                    <Alert type="info" showIcon title="Important Information">
                        <ul className="space-y-1 list-disc">
                            <li>
                                Only send {selectedCrypto.value} to this address
                                via {selectedNetworkData?.name} network
                            </li>
                            <li>
                                Sending any other cryptocurrency or using wrong
                                network will result in permanent loss
                            </li>
                            <li>Minimum deposit amount applies</li>
                            <li>Network fees are deducted from your deposit</li>
                        </ul>
                    </Alert>
                )}
                <Button block variant="subtle" onClick={closeAllModals}>
                    Close
                </Button>
            </div>
        </Dialog>
    )
}

export default DepositDialog
