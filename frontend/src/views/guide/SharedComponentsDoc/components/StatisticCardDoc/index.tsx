import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Inset from './Inset'
import WithHeaderFooter from './WithHeaderFooter'
import WithInsetFooter from './WithInsetFooter'
import WithInsetHeader from './WithInsetHeader'

const mdPath = 'StatisticCardDoc'

const demoHeader = {
    title: 'StatisticCard',
    desc: 'StatisticCard is a card component designed for displaying statistical data with optional header and footer sections.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage with simple content.`,
        component: <Basic />,
    },
    {
        mdName: 'Inset',
        mdPath: mdPath,
        title: 'Inset',
        desc: `Inset variant with a subtle background. Set <code>inset</code> to <code>true</code>.`,
        component: <Inset />,
    },
    {
        mdName: 'WithHeaderFooter',
        mdPath: mdPath,
        title: 'With Header & Footer',
        desc: `You can add header and footer sections using the <code>header</code> and <code>footer</code> props.`,
        component: <WithHeaderFooter />,
    },
    {
        mdName: 'WithInsetFooter',
        mdPath: mdPath,
        title: 'With Inset Footer',
        desc: `Example of inset variant & footer section.`,
        component: <WithInsetFooter />,
    },
    {
        mdName: 'WithInsetHeader',
        mdPath: mdPath,
        title: 'With Inset Header',
        desc: `Example of inset variant & header section.`,
        component: <WithInsetHeader />,
    },
]

const demoApi = [
    {
        component: 'StatisticCard',
        api: [
            {
                propName: 'inset',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to use the inset variant with a subtle background',
            },
            {
                propName: 'header',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Content to display in the card header',
            },
            {
                propName: 'footer',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Content to display in the card footer',
            },
            {
                propName: 'bodyClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes for the card body',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes for the card container',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Main content of the card',
            },
        ],
    },
]

const StatisticCardDoc = () => {
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

export default StatisticCardDoc
