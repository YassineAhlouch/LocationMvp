import { create } from 'zustand'

export type ProjectListState = {
    selectedStatus: string
    query: string
    view: 'list' | 'grid'
}

type ProjectListAction = {
    setQuery: (query: string) => void
    setView: (view: 'list' | 'grid') => void
    setSelectedStatus: (status: string) => void
}

const initialState: ProjectListState = {
    selectedStatus: '',
    query: '',
    view: 'list',
}

export const useProjectListStore = create<ProjectListState & ProjectListAction>(
    (set) => ({
        ...initialState,
        setQuery: (query) => set(() => ({ query })),
        setView: (view) => set(() => ({ view })),
        setSelectedStatus: (status) => set(() => ({ selectedStatus: status })),
    }),
)
