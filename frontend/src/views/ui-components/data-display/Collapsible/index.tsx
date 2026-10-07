import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Controlled from './Controlled'
import CustomTrigger from './CustomTrigger'
import Accordion from './Accordion'

const mdPath = 'Collapsible'

const demoHeader = {
    title: 'Collapsible',
    desc: 'Collapsible is a component that allows you to show and hide content with smooth animations.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Collapsible with default trigger.`,
        component: <Basic />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Collapsible can be controlled externally via <code>open</code> and <code>onOpenChange</code> props.`,
        component: <Controlled />,
    },
    {
        mdName: 'CustomTrigger',
        mdPath: mdPath,
        title: 'Custom Trigger',
        desc: `Use render props pattern to create a custom trigger with full control over the toggle behavior.`,
        component: <CustomTrigger />,
    },
    {
        mdName: 'Accordion',
        mdPath: mdPath,
        title: 'Accordion',
        desc: `Example of building an accordion using multiple Collapsible components.`,
        component: <Accordion />,
    },
]

const demoApi = [
    {
        component: 'Collapsible',
        api: [
            {
                propName: 'open',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Controlled open state',
            },
            {
                propName: 'defaultOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Default open state for uncontrolled usage',
            },
            {
                propName: 'onOpenChange',
                type: `<code>(open: boolean) => void</code>`,
                default: `-`,
                desc: 'Callback when open state changes',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS class for the wrapper',
            },
        ],
    },
    {
        component: 'Collapsible.Trigger',
        api: [
            {
                propName: 'children',
                type: `<code>ReactNode</code> | <code>((props: { isOpen: boolean; toggle: () => void }) => ReactNode)</code>`,
                default: `-`,
                desc: 'Trigger content or render function for custom triggers',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS class for the trigger button',
            },
        ],
    },
    {
        component: 'Collapsible.Content',
        api: [
            {
                propName: 'defaultOverflowHidden',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to apply overflow-hidden during animation',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS class for the content wrapper',
            },
        ],
    },
]

const Collapsible = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Collapsible
