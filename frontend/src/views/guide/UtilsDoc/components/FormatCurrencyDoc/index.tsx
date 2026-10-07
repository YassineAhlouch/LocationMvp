import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'FormatCurrencyDoc'

const demoHeader = {
    title: 'formatCurrency',
    desc: 'Function to format monetary values with proper currency display using <code>Intl.NumberFormat</code>.',
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
                desc: 'The currency code (e.g., USD, EUR, GBP).',
            },
            {
                propName: 'locale',
                type: `<code>string</code>`,
                default: `<code>'en-US'</code>`,
                desc: 'The locale for formatting.',
            },
            {
                propName: 'decimals',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
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
                        desc: 'The formatted currency string.',
                    },
                ],
            },
        ]}
    />
)

const FormatCurrencyDoc = () => {
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

export default FormatCurrencyDoc
