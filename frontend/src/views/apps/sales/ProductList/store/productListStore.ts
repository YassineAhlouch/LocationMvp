import { create } from 'zustand'
import type { Product } from '../types'

type QuickEditDrawerState = {
    open: boolean
    product: Product | null
}

export type ProductListState = {
    quickEditDrawer: QuickEditDrawerState
    selectedRows: Partial<Product>[]
}

type ProductListAction = {
    setQuickEditDrawer: (payload: QuickEditDrawerState) => void
    setSelectedRows: (checked: boolean, customer: Product) => void
    setSelectAllRows: (customer: Product[]) => void
}

const initialState: ProductListState = {
    quickEditDrawer: {
        open: false,
        product: null,
    },
    selectedRows: [],
}

export const useProductListStore = create<ProductListState & ProductListAction>(
    (set) => ({
        ...initialState,
        setQuickEditDrawer: (payload) =>
            set(() => ({ quickEditDrawer: payload })),
        setSelectedRows: (checked, row) =>
            set((state) => {
                const prevData = state.selectedRows
                if (checked) {
                    return { selectedRows: [...prevData, ...[row]] }
                } else {
                    if (
                        prevData.some(
                            (prevProduct) => row.id === prevProduct.id,
                        )
                    ) {
                        return {
                            selectedRows: prevData.filter(
                                (prevProduct) => prevProduct.id !== row.id,
                            ),
                        }
                    }
                    return { selectedRows: prevData }
                }
            }),
        setSelectAllRows: (row) => set(() => ({ selectedRows: row })),
    }),
)
