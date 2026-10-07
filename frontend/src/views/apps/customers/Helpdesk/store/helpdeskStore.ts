import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Ticket, Filter } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sortOrder: '',
    sortKey: '',
}

export const initialFilterData: Filter = {
    status: [],
    priority: [],
    category: [],
    query: '',
}

export type HelpdeskState = {
    pagingState: TableQueries
    filterData: Filter
    tickedTickets: Ticket[]
    filterDrawerOpen: boolean
    ticketPanelDrawerOpen: boolean
    ticketInfoDrawerOpen: boolean
}

type HelpdeskAction = {
    setFilterData: (payload: Partial<Filter>) => void
    setPagingState: (payload: TableQueries) => void
    setTickedTickets: (tickets: Ticket[]) => void
    setFilterDrawerOpen: (open: boolean) => void
    setTicketPanelDrawerOpen: (open: boolean) => void
    setTicketInfoDrawerOpen: (open: boolean) => void
}

const initialState: HelpdeskState = {
    pagingState: initialTableData,
    filterData: initialFilterData,
    tickedTickets: [],
    filterDrawerOpen: false,
    ticketPanelDrawerOpen: false,
    ticketInfoDrawerOpen: false,
}

export const useHelpdeskStore = create<HelpdeskState & HelpdeskAction>(
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
        setTickedTickets: (tickets) => set(() => ({ tickedTickets: tickets })),
        setFilterDrawerOpen: (open) => set(() => ({ filterDrawerOpen: open })),
        setTicketPanelDrawerOpen: (open) =>
            set(() => ({ ticketPanelDrawerOpen: open })),
        setTicketInfoDrawerOpen: (open) =>
            set(() => ({ ticketInfoDrawerOpen: open })),
    }),
)
