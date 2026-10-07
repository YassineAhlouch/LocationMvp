import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Customer, Filter } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sortOrder: '',
    sortKey: '',
}

export const initialFilterData: Filter = {
    customerLabel: [],
    status: '',
    dateRange: ['', ''],
}

export type CustomersListState = {
    pagingState: TableQueries
    filterData: Filter
    selectedRows: Partial<Customer>[]
}

type CustomersListAction = {
    setFilterData: (payload: Partial<Filter>) => void
    setPagingState: (payload: TableQueries) => void
    setSelectedRows: (checked: boolean, customer: Customer) => void
    setSelectAllRows: (customer: Customer[]) => void
}

const initialState: CustomersListState = {
    pagingState: initialTableData,
    filterData: initialFilterData,
    selectedRows: [],
}

export const useCustomerListStore = create<
    CustomersListState & CustomersListAction
>((set) => ({
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
                    prevData.some((prevCustomer) => row.id === prevCustomer.id)
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
}))
