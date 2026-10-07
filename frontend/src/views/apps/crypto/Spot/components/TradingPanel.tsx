import { useState, useMemo, useCallback } from 'react'
import Tabs from '@/components/ui/Tabs'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useSpotTradingStore } from '../store/spotTradingStore'
import useSpotData from '../hooks/useSpotData'
import useSpotOrders from '../hooks/useSpotOrders'
import TradingForm from './TradingForm'
import { createNewOrder } from '../utils'
import sleep from '@/utils/sleep'
import type { OrderType, NewOrderData, OpenOrder, TradingSide } from '../types'

const MOCK_BASE_ASSET_VALUE = 2.5
const MOCK_QUOTE_ASSET_VALUE = 500000

interface TradingPanelProps {
    defaultSide?: TradingSide
    singleSideMode?: boolean
}

const TradingPanel = ({
    defaultSide = 'buy',
    singleSideMode = false,
}: TradingPanelProps) => {
    const activePair = useSpotTradingStore((state) => state.activePair)
    const { data: spotData } = useSpotData()
    const { mutate } = useSpotOrders()
    const [orderType, setOrderType] = useState<OrderType>('limit')

    const baseAsset = activePair.split('-')[0]
    const quoteAsset = activePair.split('-')[1]

    const currentPrice = useMemo(() => {
        return spotData?.price || 0
    }, [spotData])

    const balances = useMemo(
        () => ({
            [baseAsset]: MOCK_BASE_ASSET_VALUE,
            [quoteAsset]: MOCK_QUOTE_ASSET_VALUE,
        }),
        [baseAsset, quoteAsset],
    )

    const handleOrderSubmit = useCallback(
        async (orderData: NewOrderData) => {
            try {
                if (orderData.amount <= 0) {
                    toast.push(
                        <Notification type="danger" title="Invalid Order">
                            Order amount must be greater than 0
                        </Notification>,
                    )
                    return
                }

                if (orderData.price <= 0 && orderData.type === 'limit') {
                    toast.push(
                        <Notification type="danger" title="Invalid Order">
                            Price must be greater than 0 for limit orders
                        </Notification>,
                    )
                    return
                }

                const requiredBalance =
                    orderData.side === 'buy'
                        ? orderData.price * orderData.amount
                        : orderData.amount

                const availableBalance =
                    orderData.side === 'buy'
                        ? balances[quoteAsset]
                        : balances[baseAsset]

                if (requiredBalance > availableBalance) {
                    const asset =
                        orderData.side === 'buy' ? quoteAsset : baseAsset
                    toast.push(
                        <Notification
                            type="danger"
                            title="Insufficient Balance"
                        >
                            Insufficient {asset} balance for this order
                        </Notification>,
                    )
                    return
                }

                await sleep(1000)

                const newOrder = createNewOrder(orderData)

                mutate(
                    (currentData: { orders: OpenOrder[] } | undefined) =>
                        ({
                            orders: [newOrder, ...(currentData?.orders || [])],
                        }) as { orders: OpenOrder[] },
                    false,
                )

                toast.push(
                    <Notification type="success" title="Order Created">
                        {orderData.side.toUpperCase()} order for{' '}
                        {orderData.amount} {baseAsset} created successfully
                    </Notification>,
                )
            } catch (error) {
                console.error('Failed to create order:', error)
                toast.push(
                    <Notification type="danger" title="Order Failed">
                        Failed to create order. Please try again.
                    </Notification>,
                )
            }
        },
        [mutate, balances, baseAsset, quoteAsset],
    )

    return (
        <div>
            <Tabs
                value={orderType}
                onChange={(type) => setOrderType(type as OrderType)}
            >
                <Tabs.TabList className="dark:border-gray-800">
                    <Tabs.TabNav value="limit">Limit</Tabs.TabNav>
                    <Tabs.TabNav value="market">Market</Tabs.TabNav>
                </Tabs.TabList>
            </Tabs>

            {singleSideMode ? (
                <div className="py-4">
                    <TradingForm
                        side={defaultSide}
                        orderType={orderType}
                        currentPrice={currentPrice}
                        baseAsset={baseAsset}
                        quoteAsset={quoteAsset}
                        availableBalance={
                            defaultSide === 'buy'
                                ? balances[quoteAsset]
                                : balances[baseAsset]
                        }
                        onOrderSubmit={handleOrderSubmit}
                    />
                </div>
            ) : (
                <div className="flex gap-8 p-4">
                    <div className="flex-1">
                        <TradingForm
                            side="buy"
                            orderType={orderType}
                            currentPrice={currentPrice}
                            baseAsset={baseAsset}
                            quoteAsset={quoteAsset}
                            availableBalance={balances[quoteAsset]}
                            onOrderSubmit={handleOrderSubmit}
                        />
                    </div>
                    <div className="flex-1">
                        <TradingForm
                            side="sell"
                            orderType={orderType}
                            currentPrice={currentPrice}
                            baseAsset={baseAsset}
                            quoteAsset={quoteAsset}
                            availableBalance={balances[baseAsset]}
                            onOrderSubmit={handleOrderSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default TradingPanel
