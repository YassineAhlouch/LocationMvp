import { create } from 'zustand'
import { DEFAULT_CURRENCY } from '@/constants/agency.constant'
import type { Currency } from '@/@types/location'

type CurrencyState = {
    currency: Currency
    setCurrency: (currency: Currency) => void
}

/**
 * The currency every amount is rendered in. Hydrated from the agency on load
 * and updated from the settings screen; `money()` reads it imperatively so
 * helpers and non-component code can format amounts too.
 */
export const useCurrencyStore = create<CurrencyState>((set) => ({
    currency: DEFAULT_CURRENCY,
    setCurrency: (currency) => set({ currency }),
}))
