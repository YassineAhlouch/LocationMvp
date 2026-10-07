import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Placement from './Placement'
import CustomizeTrigger from './CustomizeTrigger'
import Width from './Width'
import Controlled from './Controlled'

const mdPath = 'Popover'

const demoHeader = {
    title: 'Popover',
    desc: 'A floating card pops up when clicking/mouse hovering over an element, compare to dropdown, porpover is more flexible on content.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Popover.`,
        component: <Basic />,
    },
    {
        mdName: 'Placement',
        mdPath: mdPath,
        title: 'Placement',
        desc: `Popover can be placed on different position.`,
        component: <Placement />,
    },
    {
        mdName: 'CustomizeTrigger',
        mdPath: mdPath,
        title: 'Customize Trigger',
        desc: `Customize trigger element.`,
        component: <CustomizeTrigger />,
    },
    {
        mdName: 'Width',
        mdPath: mdPath,
        title: 'Width',
        desc: `Customize width of Popover.`,
        component: <Width />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Controlled Popover.`,
        component: <Controlled />,
    },
]

const demoApi = [
    {
        component: 'Popover',
        api: [
            {
                propName: 'open',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Controlled open state of Popover',
            },
            {
                propName: 'placement',
                type: `<code>'top'</code> | <code>'top-start'</code> | <code>'top-end'</code> | <code>'bottom'</code> | <code>'bottom-start'</code> | <code>'bottom-end'</code> | <code>'right'</code> | <code>'right-start'</code> | <code>'right-end'</code> | <code>'left'</code> | <code>'left-start'</code> | <code>'left-end'</code>`,
                default: `<code>'bottom'</code>`,
                desc: 'Tooltip placement',
            },
            {
                propName: 'onOpenChange',
                type: `<code>(open: boolean) => void</code>`,
                default: `-`,
                desc: 'Callback when Popover open state is changed',
            },
            {
                propName: 'renderTrigger',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Customize trigger element',
            },
            {
                propName: 'title',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: ``,
                desc: 'Popover trigger content',
            },
            {
                propName: 'trigger',
                type: `<code>'click'</code> | <code>'hover'</code>`,
                default: ``,
                desc: 'Popover trigger type',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: ``,
                desc: 'Popover width',
            },
        ],
    },
]

const Tag = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Tag
