import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseDataTableStateDoc'

const demoHeader = {
    title: 'useDataTableState',
    desc: 'A hook that provides handlers for DataTable pagination, sorting, and row selection.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: ``,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'Params',
        api: [
            {
                propName: 'pagingState',
                type: `<code>TableQueries</code>`,
                default: `-`,
                desc: 'Current table query state (pageIndex, pageSize, sortOrder, sortKey).',
            },
            {
                propName: 'onPagingChange',
                type: `<code>(data: TableQueries) =&gt; void</code>`,
                default: `-`,
                desc: 'Callback when paging state changes.',
            },
            {
                propName: 'selectedRows',
                type: `<code>Partial&lt;T&gt;[]</code>`,
                default: `-`,
                desc: 'Currently selected rows.',
            },
            {
                propName: 'onRowSelectionChange',
                type: `<code>(checked: boolean, row: T) =&gt; void</code>`,
                default: `-`,
                desc: 'Callback when a single row selection changes.',
            },
            {
                propName: 'onAllRowSelectChange',
                type: `<code>(rows: T[]) =&gt; void</code>`,
                default: `-`,
                desc: 'Callback when all rows selection changes.',
            },
        ],
    },
]

const extra = (
    <DemoComponentApi
        hideApiTitle
        keyText="return"
        api={[
            {
                api: [
                    {
                        propName: 'onPaginationChange',
                        type: `<code>(page: number) =&gt; void</code>`,
                        default: `-`,
                        desc: 'Handler for page changes.',
                    },
                    {
                        propName: 'onPageSizeChange',
                        type: `<code>(value: number) =&gt; void</code>`,
                        default: `-`,
                        desc: 'Handler for page size changes.',
                    },
                    {
                        propName: 'onSort',
                        type: `<code>(sort: { sortOrder, sortKey }) =&gt; void</code>`,
                        default: `-`,
                        desc: 'Handler for sort changes.',
                    },
                    {
                        propName: 'onRowSelect',
                        type: `<code>(checked: boolean, row: T) =&gt; void</code>`,
                        default: `-`,
                        desc: 'Handler for single row selection.',
                    },
                    {
                        propName: 'onAllRowSelect',
                        type: `<code>(checked: boolean, rows: Row&lt;T&gt;[]) =&gt; void</code>`,
                        default: `-`,
                        desc: 'Handler for all rows selection.',
                    },
                ],
            },
        ]}
    />
)

const UseDataTableStateDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="utils"
            extra={extra}
            keyText="param"
        />
    )
}

export default UseDataTableStateDoc
