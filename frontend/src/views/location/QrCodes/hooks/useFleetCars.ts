import useSWR from 'swr'
import { apiGetCars } from '@/services/LocationService'

/**
 * Active fleet for the QR picker. One page is enough for a QR selection
 * (capped at 24 cars by the public API anyway); the picker narrows further
 * with local search.
 */
const useFleetCars = () => {
    const { data, isLoading, mutate } = useSWR(
        ['qr-codes/cars'],
        () => apiGetCars({ per_page: 100, is_active: true }),
        { revalidateOnFocus: false },
    )

    return {
        cars: data?.data || [],
        isLoading,
        mutate,
    }
}

export default useFleetCars
