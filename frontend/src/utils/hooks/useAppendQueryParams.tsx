import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router'

interface AppendOptions {
    /** `true` → replaceState, `false` → pushState (default) */
    replace?: boolean
    override?: boolean
}

const initialOptions: AppendOptions = { replace: false, override: false }

const useAppendQueryParams = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const onAppendQueryParams = useCallback(
        (
            params: Record<string, unknown>,
            _options: AppendOptions = {},
        ): void => {
            const options = { ...initialOptions, ..._options }
            const { replace, override } = options

            // If override is true, start with empty search params, otherwise inherit existing ones
            const nextSearch = override
                ? new URLSearchParams()
                : new URLSearchParams(location.search)

            // Merge incoming params
            Object.entries(params).forEach(([key, value]) => {
                if (value === '' || value === null || value === undefined) {
                    nextSearch.delete(key) // keep things tidy
                } else {
                    nextSearch.set(key, String(value))
                }
            })

            // Build the next URL and navigate
            navigate(
                {
                    pathname: location.pathname,
                    search: `?${nextSearch.toString()}`,
                },
                { replace },
            )
        },
        [location.pathname, location.search, navigate],
    )

    return { onAppendQueryParams }
}

export default useAppendQueryParams
