import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useDataTableState from '@/utils/hooks/useDataTableState'
import DataTable from '@/components/shared/DataTable'

const TableComponent = () => {
    const [tableData, setTableData] = useState({
        pageIndex: 1,
        pageSize: 10,
        sortOrder: '',
        sortKey: '',
    })
    const [selectedRows, setSelectedRows] = useState([])

    const {
        onPaginationChange,
        onPageSizeChange,
        onSort,
        onRowSelect,
        onAllRowSelect,
    } = useDataTableState({
        pagingState: tableData,
        onPagingChange: setTableData,
        selectedRows,
        onRowSelectionChange: (checked, row) => {
            // Handle single row selection
        },
        onAllRowSelectChange: setSelectedRows,
    })

    return (
        <DataTable
            columns={columns}
            data={data}
            onPaginationChange={onPaginationChange}
            onSelectChange={onPageSizeChange}
            onSort={onSort}
            onCheckBoxChange={onRowSelect}
            onIndeterminateCheckBoxChange={onAllRowSelect}
        />
    )
}
`}</SyntaxHighlighter>
    )
}

export default Example
