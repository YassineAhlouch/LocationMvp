import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseQueryParamPagingStateDoc'

const demoHeader = {
    title: 'useQueryParamPagingState',
    desc: 'A hook that syncs table pagination and filter state with URL query parameters.',
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
                propName: 'initialTableData',
                type: `<code>Partial&lt;TableQueries&gt;</code>`,
                default: `<code>{ pageIndex: 1, pageSize: 10, query: '', sortOrder: '', sortKey: '' }</code>`,
                desc: 'Default values for table state when URL params are not present.',
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
                        propName: 'pagingState',
                        type: `<code>TableQueries</code>`,
                        default: `-`,
                        desc: 'Current paging state derived from URL params.',
                    },
                    {
                        propName: 'filterState',
                        type: `<code>Record&lt;string, string&gt;</code>`,
                        default: `-`,
                        desc: 'Additional filter params from URL (excluding paging params).',
                    },
                    {
                        propName: 'setQueryParams',
                        type: `<code>(params: Record&lt;string, unknown&gt;, override?: boolean) =&gt; void</code>`,
                        default: `-`,
                        desc: 'Function to update URL query params.',
                    },
                ],
            },
        ]}
    />
)

const UseQueryParamPagingStateDoc = () => {
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

export default UseQueryParamPagingStateDoc
