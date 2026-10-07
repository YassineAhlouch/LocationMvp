import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import sleep from '@/utils/sleep'
import type {
    Balance,
    OpenOrder,
    OrderHistory,
    TradeHistory,
    OrderBookView,
    OrderRequest,
    TradingSide,
} from '../types'

export type ChartTimeRange = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'

export type MobileTab = 'chart' | 'book'

export type SpotTradingState = {
    activePair: string
    chartTimeframe: ChartTimeRange
    balances: Balance[]
    openOrders: OpenOrder[]
    orderHistory: OrderHistory[]
    tradeHistory: TradeHistory[]
    orderBookView: OrderBookView
    isPlacingOrder: boolean
    isCancellingOrder: boolean
    lastOrderError: string | null
    mobileActiveTab: MobileTab
    isMarketDrawerOpen: boolean
    isTradingDrawerOpen: boolean
    tradingDrawerSide: TradingSide | null
}

type SpotTradingAction = {
    setActivePair: (pair: string) => void
    setChartTimeframe: (timeframe: ChartTimeRange) => void
    setOrderBookView: (view: OrderBookView) => void
    setMobileActiveTab: (tab: MobileTab) => void
    setMarketDrawerOpen: (open: boolean) => void
    openTradingDrawer: (side: TradingSide) => void
    closeTradingDrawer: () => void
    setBalances: (balances: Balance[]) => void
    updateBalance: (asset: string, available: number, locked: number) => void
    setOpenOrders: (orders: OpenOrder[]) => void
    addOpenOrder: (order: OpenOrder) => void
    updateOpenOrder: (orderId: string, updates: Partial<OpenOrder>) => void
    removeOpenOrder: (orderId: string) => void
    setOrderHistory: (orders: OrderHistory[]) => void
    addOrderHistory: (order: OrderHistory) => void
    setTradeHistory: (trades: TradeHistory[]) => void
    addTradeHistory: (trade: TradeHistory) => void
    placeOrder: (orderRequest: OrderRequest) => Promise<void>
    cancelOrder: (orderId: string) => Promise<void>
    cancelAllOrders: (pair?: string) => Promise<void>
    setOrderError: (error: string | null) => void
    clearOrderError: () => void
    getBalanceByAsset: (asset: string) => Balance | undefined
    getOpenOrdersByPair: (pair: string) => OpenOrder[]
    getOrderHistoryByPair: (pair: string) => OrderHistory[]
    getTradeHistoryByPair: (pair: string) => TradeHistory[]
}

const initialState: SpotTradingState = {
    activePair: 'BTC-USDT',
    chartTimeframe: '1h',
    balances: [],
    openOrders: [],
    orderHistory: [],
    tradeHistory: [],
    orderBookView: 'orders',
    isPlacingOrder: false,
    isCancellingOrder: false,
    lastOrderError: null,
    // Responsive layout initial state
    mobileActiveTab: 'chart',
    isMarketDrawerOpen: false,
    // Mobile trading drawer initial state
    isTradingDrawerOpen: false,
    tradingDrawerSide: null,
}

export const useSpotTradingStore = create<
    SpotTradingState & SpotTradingAction
>()(
    subscribeWithSelector((set, get) => ({
        ...initialState,
        setActivePair: (pair) => set({ activePair: pair }),
        setChartTimeframe: (timeframe) => set({ chartTimeframe: timeframe }),
        setOrderBookView: (view) => set({ orderBookView: view }),
        // Responsive layout actions
        setMobileActiveTab: (tab) => set({ mobileActiveTab: tab }),
        setMarketDrawerOpen: (open) => set({ isMarketDrawerOpen: open }),
        // Mobile trading drawer actions
        openTradingDrawer: (side) =>
            set({ isTradingDrawerOpen: true, tradingDrawerSide: side }),
        closeTradingDrawer: () =>
            set({ isTradingDrawerOpen: false, tradingDrawerSide: null }),
        setBalances: (balances) => set({ balances }),
        updateBalance: (asset, available, locked) =>
            set((state) => ({
                balances: state.balances.map((balance) =>
                    balance.asset === asset
                        ? { ...balance, available, locked }
                        : balance,
                ),
            })),
        setOpenOrders: (orders) => set({ openOrders: orders }),
        addOpenOrder: (order) =>
            set((state) => ({
                openOrders: [...state.openOrders, order],
            })),
        updateOpenOrder: (orderId, updates) =>
            set((state) => ({
                openOrders: state.openOrders.map((order) =>
                    order.id === orderId ? { ...order, ...updates } : order,
                ),
            })),
        removeOpenOrder: (orderId) =>
            set((state) => ({
                openOrders: state.openOrders.filter(
                    (order) => order.id !== orderId,
                ),
            })),
        setOrderHistory: (orders) => set({ orderHistory: orders }),
        addOrderHistory: (order) =>
            set((state) => ({
                orderHistory: [order, ...state.orderHistory],
            })),
        setTradeHistory: (trades) => set({ tradeHistory: trades }),
        addTradeHistory: (trade) =>
            set((state) => ({
                tradeHistory: [trade, ...state.tradeHistory],
            })),
        placeOrder: async (orderRequest) => {
            set({ isPlacingOrder: true, lastOrderError: null })

            try {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                const newOrder: OpenOrder = {
                    id: `order-${Date.now()}`,
                    date: new Date(),
                    pair: orderRequest.pair,
                    type: orderRequest.type,
                    side: orderRequest.side,
                    price: orderRequest.price || 0,
                    amount: orderRequest.amount,
                    filled: 0,
                    total: (orderRequest.price || 0) * orderRequest.amount,
                    status: 'pending',
                }
                get().addOpenOrder(newOrder)
                const state = get()
                if (orderRequest.side === 'buy') {
                    const quoteAsset = orderRequest.pair.split('-')[1]
                    const balance = state.getBalanceByAsset(quoteAsset)
                    if (balance) {
                        const lockAmount = newOrder.total
                        get().updateBalance(
                            quoteAsset,
                            balance.available - lockAmount,
                            balance.locked + lockAmount,
                        )
                    }
                } else {
                    const baseAsset = orderRequest.pair.split('-')[0]
                    const balance = state.getBalanceByAsset(baseAsset)
                    if (balance) {
                        const lockAmount = orderRequest.amount
                        get().updateBalance(
                            baseAsset,
                            balance.available - lockAmount,
                            balance.locked + lockAmount,
                        )
                    }
                }
            } catch (error) {
                set({
                    lastOrderError:
                        error instanceof Error
                            ? error.message
                            : 'Order placement failed',
                })
                throw error
            } finally {
                set({ isPlacingOrder: false })
            }
        },

        cancelOrder: async (orderId) => {
            set({ isCancellingOrder: true, lastOrderError: null })

            try {
                await sleep(500)

                const order = get().openOrders.find((o) => o.id === orderId)
                if (order) {
                    get().removeOpenOrder(orderId)

                    const historyOrder: OrderHistory = {
                        id: order.id,
                        dateTime: new Date(),
                        pair: order.pair,
                        type: order.type,
                        side: order.side,
                        averagePrice: 0,
                        price: order.price,
                        executed: order.filled,
                        amount: order.amount,
                        total: order.total,
                        status: 'cancelled',
                    }
                    get().addOrderHistory(historyOrder)

                    // Unlock balance
                    if (order.side === 'buy') {
                        const quoteAsset = order.pair.split('-')[1]
                        const balance = get().getBalanceByAsset(quoteAsset)
                        if (balance) {
                            const unlockAmount =
                                order.total - order.filled * order.price
                            get().updateBalance(
                                quoteAsset,
                                balance.available + unlockAmount,
                                balance.locked - unlockAmount,
                            )
                        }
                    } else {
                        const baseAsset = order.pair.split('-')[0]
                        const balance = get().getBalanceByAsset(baseAsset)
                        if (balance) {
                            const unlockAmount = order.amount - order.filled
                            get().updateBalance(
                                baseAsset,
                                balance.available + unlockAmount,
                                balance.locked - unlockAmount,
                            )
                        }
                    }
                }
            } catch (error) {
                set({
                    lastOrderError:
                        error instanceof Error
                            ? error.message
                            : 'Order cancellation failed',
                })
                throw error
            } finally {
                set({ isCancellingOrder: false })
            }
        },

        cancelAllOrders: async (pair) => {
            set({ isCancellingOrder: true, lastOrderError: null })

            try {
                await new Promise((resolve) => setTimeout(resolve, 1500))

                const ordersToCancel = pair
                    ? get().openOrders.filter((order) => order.pair === pair)
                    : get().openOrders

                for (const order of ordersToCancel) {
                    await get().cancelOrder(order.id)
                }
            } catch (error) {
                set({
                    lastOrderError:
                        error instanceof Error
                            ? error.message
                            : 'Bulk cancellation failed',
                })
                throw error
            } finally {
                set({ isCancellingOrder: false })
            }
        },

        setOrderError: (error) => set({ lastOrderError: error }),
        clearOrderError: () => set({ lastOrderError: null }),

        // Selectors
        getBalanceByAsset: (asset) => {
            return get().balances.find((balance) => balance.asset === asset)
        },

        getOpenOrdersByPair: (pair) => {
            return get().openOrders.filter((order) => order.pair === pair)
        },

        getOrderHistoryByPair: (pair) => {
            return get().orderHistory.filter((order) => order.pair === pair)
        },

        getTradeHistoryByPair: (pair) => {
            return get().tradeHistory.filter((trade) => trade.pair === pair)
        },
    })),
)
