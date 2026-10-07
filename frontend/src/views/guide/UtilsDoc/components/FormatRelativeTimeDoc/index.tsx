import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'FormatRelativeTimeDoc'

const demoHeader = {
    title: 'formatRelativeTime',
    desc: 'Function to format dates as human-readable relative time strings using <code>Intl.RelativeTimeFormat</code>.',
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
                propName: 'date',
                type: `<code>Date | string | number</code>`,
                default: `-`,
                desc: 'The date to format relative to now.',
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
                        propName: 'relativeTime',
                        type: `<code>string</code>`,
                        default: `-`,
                        desc: 'Human-readable relative time string.',
                    },
                ],
            },
        ]}
    />
)

const FormatRelativeTimeDoc = () => {
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

export default FormatRelativeTimeDoc
