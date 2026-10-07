import type { TableQueries } from '@/@types/common'
import type { Row } from '@/components/shared/DataTable'

type DataTableStateProps<T> = {
    pagingState: TableQueries
    onPagingChange: (data: TableQueries) => void
    selectedRows?: Partial<T>[]
    onRowSelectionChange?: (checked: boolean, row: T) => void
    onAllRowSelectChange?: (rows: T[]) => void
}

const useDataTableState = <T extends Record<string, unknown>>(
    props: DataTableStateProps<T>,
) => {
    const {
        onPagingChange,
        pagingState,
        selectedRows,
        onRowSelectionChange,
        onAllRowSelectChange,
    } = props

    const handleSetTableState = (data: TableQueries) => {
        onPagingChange(data)

        if (selectedRows && selectedRows.length > 0) {
            onAllRowSelectChange?.([])
        }
    }

    const onPaginationChange = (page: number) => {
        const newTableState = structuredClone(pagingState)
        newTableState.pageIndex = page
        handleSetTableState(newTableState)
    }

    const onPageSizeChange = (value: number) => {
        const newTableState = structuredClone(pagingState)
        newTableState.pageSize = Number(value)
        newTableState.pageIndex = 1
        handleSetTableState(newTableState)
    }

    const onSort = (sort: Pick<TableQueries, 'sortOrder' | 'sortKey'>) => {
        const newTableState = structuredClone(pagingState)
        newTableState.sortOrder = sort.sortOrder
        newTableState.sortKey = sort.sortKey
        handleSetTableState(newTableState)
    }

    const onRowSelect = (checked: boolean, row: T) => {
        if (onRowSelectionChange) {
            onRowSelectionChange(checked, row)
        }
    }

    const onAllRowSelect = (checked: boolean, rows: Row<T>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            onAllRowSelectChange?.(originalRows)
        } else {
            onAllRowSelectChange?.([])
        }
    }

    return {
        onPaginationChange,
        onPageSizeChange,
        onSort,
        onRowSelect,
        onAllRowSelect,
    }
}

export default useDataTableState
