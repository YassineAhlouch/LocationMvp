import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'HighlightSearchMatchDoc'

const demoHeader = {
    title: 'highlightSearchMatch',
    desc: 'Function to highlight search terms in text content by wrapping matches in a styled <code>&lt;mark&gt;</code> element.',
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
                propName: 'text',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The text content to search within.',
            },
            {
                propName: 'searchTerm',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The term to highlight in the text.',
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
                component: 'Return',
                api: [
                    {
                        propName: 'highlightedContent',
                        type: `<code>React.ReactNode</code>`,
                        default: `-`,
                        desc: 'Text with highlighted matches as React elements.',
                    },
                ],
            },
        ]}
    />
)

const HighlightSearchMatchDoc = () => {
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

export default HighlightSearchMatchDoc
