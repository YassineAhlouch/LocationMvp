import { useEffect } from 'react'
import useSWR from 'swr'
import Loading from '@/components/shared/Loading'
import { apiGetAgency } from '@/services/LocationService'
import { AGENCY_SWR_KEY } from '@/constants/agency.constant'
import { useCurrencyStore } from '@/store/currencyStore'
import type { CommonProps } from '@/@types/common'

/**
 * Resolves the agency's currency before the workspace paints, so the first
 * render already formats amounts in the right unit, then keeps the store in
 * sync on later revalidations. The value lives in a store rather than a
 * context so `money()` can format amounts outside the React tree too.
 */
const CurrencyHydrator = ({ children }: CommonProps) => {
    const setCurrency = useCurrencyStore((state) => state.setCurrency)
    const { data, error } = useSWR(AGENCY_SWR_KEY, apiGetAgency, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
    })

    useEffect(() => {
        if (data?.currency) {
            setCurrency(data.currency)
        }
    }, [data, setCurrency])

    // Wait for the agency, but fall back to the default unit if the call fails
    // rather than locking the workspace behind a request that will not succeed.
    if (data === undefined && error === undefined) {
        return (
            <div className="flex flex-auto flex-col h-[100vh]">
                <Loading loading={true} />
            </div>
        )
    }

    return <>{children}</>
}

export default CurrencyHydrator
