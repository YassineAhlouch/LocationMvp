import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Lead, Filter } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 25,
    query: '',
    sortOrder: '',
    sortKey: '',
}

export const initialFilterData: Filter = {
    customerLabel: [
        'VIP',
        'Frequent Buyer',
        'First-Time Buyer',
        'Refund Risk',
        'New Customer',
        'High AOV',
        'Coupon User',
        'Manual Review',
        'International',
    ],
    probability: '',
    leadStatus: '',
    createdDateFrom: null,
    createdDateTo: null,
}

export type LeadsListState = {
    pagingState: TableQueries
    filterData: Filter
    selectedRows: Partial<Lead>[]
}

type LeadsListAction = {
    setFilterData: (payload: Partial<Filter>) => void
    setPagingState: (payload: TableQueries) => void
    setSelectedRows: (checked: boolean, lead: Lead) => void
    setSelectAllRows: (lead: Lead[]) => void
}

const initialState: LeadsListState = {
    pagingState: initialTableData,
    filterData: initialFilterData,
    selectedRows: [],
}

export const useLeadsListStore = create<LeadsListState & LeadsListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) =>
            set((state) => {
                return {
                    filterData: {
                        ...state.filterData,
                        ...payload,
                    },
                }
            }),
        setPagingState: (payload) => set(() => ({ pagingState: payload })),
        setSelectedRows: (checked, row) =>
            set((state) => {
                const prevData = state.selectedRows
                if (checked) {
                    return { selectedRows: [...prevData, ...[row]] }
                } else {
                    if (
                        prevData.some(
                            (prevCustomer) => row.id === prevCustomer.id,
                        )
                    ) {
                        return {
                            selectedRows: prevData.filter(
                                (prevCustomer) => prevCustomer.id !== row.id,
                            ),
                        }
                    }
                    return { selectedRows: prevData }
                }
            }),
        setSelectAllRows: (row) => set(() => ({ selectedRows: row })),
    }),
)
