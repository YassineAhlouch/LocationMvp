import { create } from 'zustand'

type SelectedAsset = {
    name: string
    symbol: string
    icon: string
    price: number
} | null

type CryptoDashboardStore = {
    selectedAsset: SelectedAsset
    setSelectedAsset: (asset: SelectedAsset) => void
}

export const useCryptoDashboardStore = create<CryptoDashboardStore>((set) => ({
    selectedAsset: null,
    setSelectedAsset: (asset) => set({ selectedAsset: asset }),
}))
