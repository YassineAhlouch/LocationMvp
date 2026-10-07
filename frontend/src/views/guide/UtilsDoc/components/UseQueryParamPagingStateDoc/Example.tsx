import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import DataTable from '@/components/shared/DataTable'

const TableWithUrlState = () => {
    const { pagingState, filterState, setQueryParams } = useQueryParamPagingState({
        pageIndex: 1,
        pageSize: 10,
    })

    // URL: /users?pageIndex=2&pageSize=20&status=active
    // pagingState: { pageIndex: 2, pageSize: 20, ... }
    // filterState: { status: 'active' }

    const handlePageChange = (page) => {
        setQueryParams({ pageIndex: page })
    }

    const handleFilterChange = (status) => {
        setQueryParams({ status, pageIndex: 1 })
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            pagingData={{
                pageIndex: pagingState.pageIndex,
                pageSize: pagingState.pageSize,
                total: totalCount,
            }}
            onPaginationChange={handlePageChange}
        />
    )
}
`}</SyntaxHighlighter>
    )
}

export default Example
