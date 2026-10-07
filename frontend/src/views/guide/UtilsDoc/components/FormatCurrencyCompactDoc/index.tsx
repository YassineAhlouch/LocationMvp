import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'FormatCurrencyCompactDoc'

const demoHeader = {
    title: 'formatCurrencyCompact',
    desc: 'Function to format large currency values with abbreviated suffixes (K, M, B, T).',
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
                propName: 'currency',
                type: `<code>string</code>`,
                default: `<code>'USD'</code>`,
                desc: 'The currency code.',
            },
            {
                propName: 'toFixed',
                type: `<code>number</code>`,
                default: `<code>2</code>`,
                desc: 'Number of decimal places.',
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
                        propName: 'formattedCurrency',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'The formatted currency string with suffix.',
                    },
                ],
            },
        ]}
    />
)

const FormatCurrencyCompactDoc = () => {
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

export default FormatCurrencyCompactDoc
