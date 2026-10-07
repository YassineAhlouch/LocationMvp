import { create } from 'zustand'

export type ProductDetailsState = {
    selectedSection: string
    invalidFields: string[]
}

type ProductDetailsAction = {
    setSelectedSection: (section: string) => void
    setInvalidFields: (fields: string[]) => void
}

const initialState: ProductDetailsState = {
    selectedSection: 'basicInfo',
    invalidFields: [],
}

export const useProductDetailsStore = create<
    ProductDetailsState & ProductDetailsAction
>((set) => ({
    ...initialState,
    setSelectedSection: (section) => set({ selectedSection: section }),
    setInvalidFields: (fields) => set({ invalidFields: fields }),
}))
