import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import useAppendQueryParams from './useAppendQueryParams'
import type { TableQueries } from '@/@types/common'

type SearchParams = Record<string, string | string[]>

const useQueryParamTableState = (
    initialTableData: Partial<TableQueries> = {
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sortOrder: '',
        sortKey: '',
    },
) => {
    const [queryParam] = useSearchParams()

    const getSortOrder = (value: string | null): '' | 'asc' | 'desc' => {
        if (value === 'asc' || value === 'desc') {
            return value
        }
        return ''
    }

    const { onAppendQueryParams } = useAppendQueryParams()

    const allParams = useMemo(() => {
        const allParams: SearchParams = {}
        for (const [key, value] of queryParam.entries()) {
            if (allParams[key]) {
                if (Array.isArray(allParams[key])) {
                    allParams[key].push(value)
                } else {
                    allParams[key] = [allParams[key], value]
                }
            } else {
                allParams[key] = value
            }
        }

        const { pageIndex, pageSize, query, sortOrder, sortKey, ...rest } =
            allParams

        const pagingState: TableQueries = {
            pageIndex: parseInt(
                (pageIndex as string) || `${initialTableData.pageIndex || 0}`,
            ),
            pageSize: parseInt(
                (pageSize as string) || `${initialTableData.pageSize || 10}`,
            ),
            query: (query as string) || initialTableData.query || '',
            sortOrder:
                getSortOrder(sortOrder as string) ||
                initialTableData.sortOrder ||
                '',
            sortKey: (sortKey as string) || initialTableData.sortKey || '',
        }

        return {
            pagingState,
            filterState: rest as Record<string, string>,
        }
    }, [
        initialTableData.pageIndex,
        initialTableData.pageSize,
        initialTableData.query,
        initialTableData.sortKey,
        initialTableData.sortOrder,
        queryParam,
    ])

    const handleSetQueryParams = (
        params: Record<string, unknown>,
        override = false,
    ) => {
        onAppendQueryParams(params, { replace: true, override })
    }

    return {
        ...allParams,
        setQueryParams: handleSetQueryParams,
    }
}

export default useQueryParamTableState
