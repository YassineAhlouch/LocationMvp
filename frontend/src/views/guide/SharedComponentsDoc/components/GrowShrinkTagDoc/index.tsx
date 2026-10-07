import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import WithoutIcon from './WithoutIcon'

const mdPath = 'GrowShrinkTagDoc'

const demoHeader = {
    title: 'GrowShrinkTag',
    desc: 'GrowShrinkTag displays a value with visual indicators for growth (positive) or decline (negative), commonly used for showing percentage changes or trends.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage showing positive, negative, and zero values with directional arrows.`,
        component: <Basic />,
    },
    {
        mdName: 'WithoutIcon',
        mdPath: mdPath,
        title: 'Without Icon',
        desc: `You can hide the directional arrow by setting <code>showIcon</code> to <code>false</code>.`,
        component: <WithoutIcon />,
    },
]

const demoApi = [
    {
        component: 'GrowShrinkTag',
        api: [
            {
                propName: 'value',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'The numeric value to display. Positive values show green/success styling, negative values show red/error styling',
            },
            {
                propName: 'showIcon',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to show the directional arrow icon',
            },
            {
                propName: 'prefix',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Content to display before the value',
            },
            {
                propName: 'suffix',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Content to display after the value',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes to apply to the tag',
            },
        ],
    },
]

const GrowShrinkTagDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
        />
    )
}

export default GrowShrinkTagDoc
