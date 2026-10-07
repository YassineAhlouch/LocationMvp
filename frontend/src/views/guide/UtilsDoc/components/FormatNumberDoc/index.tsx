import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'FormatNumberDoc'

const demoHeader = {
    title: 'formatNumber',
    desc: 'Function to format large numbers with abbreviated suffixes (K, M, B, T).',
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
                propName: 'value',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'The numeric value to format.',
            },
            {
                propName: 'decimals',
                type: `<code>number</code>`,
                default: `<code>2</code>`,
                desc: 'Number of decimal places in the result.',
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
                        propName: 'formattedNumber',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'The formatted number string with suffix.',
                    },
                ],
            },
        ]}
    />
)

const FormatNumberDoc = () => {
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

export default FormatNumberDoc
