import { apiGetProjectSettings } from '@/services/ProjectService'
import useSWR from 'swr'
import type { GetSettingsResponse } from '../types'

const useProjectSettingData = () => {
    const { data, isLoading, mutate } = useSWR(
        [`/api/projects/settings`],
        () => apiGetProjectSettings<GetSettingsResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const setData = (
        callback: (data: GetSettingsResponse) => GetSettingsResponse,
    ) => {
        if (data) {
            mutate(callback(data), false)
        }
    }

    return {
        data,
        setData,
        isLoading,
    }
}

export default useProjectSettingData
