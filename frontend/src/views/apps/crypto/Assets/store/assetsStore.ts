import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'

export type TableState = TableQueries & {
    pageIndex: number
    pageSize: number
    sortKey: string
    sortOrder: '' | 'asc' | 'desc'
}

export type AssetsUIState = {
    selectedDateRange: string
    activeTab: 'assets' | 'transactions' | 'trades'
    modals: {
        deposit: boolean
        withdraw: boolean
        trade: boolean
    }
    selectedAsset: string | null
    tradeModalTab: 'buy' | 'sell'
    tableState: {
        assets: TableState
        transactions: TableState
        trades: TableState
    }
}

type AssetsUIActions = {
    setDateRange: (range: string) => void
    setActiveTab: (tab: 'assets' | 'transactions' | 'trades') => void
    openDepositModal: (asset?: string) => void
    openWithdrawModal: (asset?: string) => void
    openTradeModal: (tab?: 'buy' | 'sell', asset?: string) => void
    closeAllModals: () => void
    setSelectedAsset: (asset: string | null) => void
    setTablePagination: (
        table: 'assets' | 'transactions' | 'trades',
        pageIndex: number,
    ) => void
    setTablePageSize: (
        table: 'assets' | 'transactions' | 'trades',
        pageSize: number,
    ) => void
    setTableSort: (
        table: 'assets' | 'transactions' | 'trades',
        sortKey: string,
        sortOrder: '' | 'asc' | 'desc',
    ) => void
    resetState: () => void
}

const initialTableState: TableState = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sortKey: '',
    sortOrder: '',
}

const initialState: AssetsUIState = {
    selectedDateRange: '1m',
    activeTab: 'assets',
    modals: {
        deposit: false,
        withdraw: false,
        trade: false,
    },
    selectedAsset: null,
    tradeModalTab: 'buy',
    tableState: {
        assets: { ...initialTableState },
        transactions: { ...initialTableState },
        trades: { ...initialTableState },
    },
}

export const useAssetsStore = create<AssetsUIState & AssetsUIActions>()(
    (set) => ({
        ...initialState,
        setDateRange: (range) => set({ selectedDateRange: range }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        openDepositModal: (asset) =>
            set({
                modals: { deposit: true, withdraw: false, trade: false },
                selectedAsset: asset || null,
            }),
        openWithdrawModal: (asset) =>
            set({
                modals: { deposit: false, withdraw: true, trade: false },
                selectedAsset: asset || null,
            }),
        openTradeModal: (tab = 'buy', asset) =>
            set({
                modals: { deposit: false, withdraw: false, trade: true },
                tradeModalTab: tab,
                selectedAsset: asset || null,
            }),
        closeAllModals: () =>
            set({
                modals: { deposit: false, withdraw: false, trade: false },
                selectedAsset: null,
            }),
        setSelectedAsset: (asset) => set({ selectedAsset: asset }),
        setTablePagination: (table, pageIndex) =>
            set((state) => ({
                tableState: {
                    ...state.tableState,
                    [table]: {
                        ...state.tableState[table],
                        pageIndex,
                    },
                },
            })),
        setTablePageSize: (table, pageSize) =>
            set((state) => ({
                tableState: {
                    ...state.tableState,
                    [table]: {
                        ...state.tableState[table],
                        pageSize,
                        pageIndex: 1, // Reset to first page when changing page size
                    },
                },
            })),
        setTableSort: (table, sortKey, sortOrder) =>
            set((state) => ({
                tableState: {
                    ...state.tableState,
                    [table]: {
                        ...state.tableState[table],
                        sortKey,
                        sortOrder,
                    },
                },
            })),
        resetState: () => set(initialState),
    }),
)
