import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Width from './Width'
import Escape from './Escape'
import Checkbox from './Checkbox'

const mdPath = 'ActionBar'

const demoHeader = {
    title: 'ActionBar',
    desc: 'ActionBar is a popup with a set of actions at the bottom.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of ActionBar.`,
        component: <Basic />,
    },
    {
        mdName: 'Width',
        mdPath: mdPath,
        title: 'Width',
        desc: `We can adjust ActionBar via with <code>width</code> prop.`,
        component: <Width />,
    },
    {
        mdName: 'Escape',
        mdPath: mdPath,
        title: 'Close with escape',
        desc: `We can close ActionBar with escape key by setting <code>shouldCloseOnEsc</code> prop.`,
        component: <Escape />,
    },
    {
        mdName: 'Checkbox',
        mdPath: mdPath,
        title: 'Checkbox',
        desc: `Example with checkbox`,
        component: <Checkbox />,
    },
]

const demoApi = [
    {
        component: 'ActionBar',
        api: [
            {
                propName: 'contentClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional class names for styling the content area.',
            },
            {
                propName: 'open',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Controls whether the action bar is open or closed.',
            },
            {
                propName: 'shouldCloseOnEsc',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Determines whether pressing the "Escape" key closes the action bar.',
            },
            {
                propName: 'onOpenChange',
                type: `<code>(open: boolean) => void</code>`,
                default: `-`,
                desc: 'Callback function triggered when the open state changes.',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Specifies the width of the action bar in pixels.',
            },
        ],
    },
]

const ActionBar = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default ActionBar
