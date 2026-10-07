import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseAppendQueryParamsDoc'

const demoHeader = {
    title: 'useAppendQueryParams',
    desc: 'A hook that provides a function to append or update URL query parameters while preserving existing ones.',
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

const extra = (
    <DemoComponentApi
        hideApiTitle
        keyText="return"
        api={[
            {
                api: [
                    {
                        propName: 'onAppendQueryParams',
                        type: `<code>(params: Record&lt;string, unknown&gt;, options?: { replace?: boolean, override?: boolean }) =&gt; void</code>`,
                        default: `-`,
                        desc: 'Function to append/update query params. Set replace=true for replaceState, override=true to clear existing params.',
                    },
                ],
            },
        ]}
    />
)

const UseAppendQueryParamsDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="utils"
            extra={extra}
            keyText="param"
        />
    )
}

export default UseAppendQueryParamsDoc
