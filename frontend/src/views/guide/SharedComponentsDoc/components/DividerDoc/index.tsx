import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Horizontal from './Horizontal'
import Vertical from './Vertical'

const mdPath = 'DividerDoc'

const demoHeader = {
    title: 'Divider',
    desc: 'Divider is a simple component that creates a visual separation between content sections, supporting both horizontal and vertical orientations.',
}

const demos = [
    {
        mdName: 'Horizontal',
        mdPath: mdPath,
        title: 'Horizontal',
        desc: `Default horizontal divider that spans the full width of its container.`,
        component: <Horizontal />,
    },
    {
        mdName: 'Vertical',
        mdPath: mdPath,
        title: 'Vertical',
        desc: `Vertical divider for separating inline content. Set <code>orientation</code> to <code>"vertical"</code>.`,
        component: <Vertical />,
    },
]

const demoApi = [
    {
        component: 'Divider',
        api: [
            {
                propName: 'orientation',
                type: `<code>"horizontal"</code> | <code>"vertical"</code>`,
                default: `<code>"horizontal"</code>`,
                desc: 'The orientation of the divider',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `<code>""</code>`,
                desc: 'Additional CSS classes to apply to the divider',
            },
        ],
    },
]

const DividerDoc = () => {
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

export default DividerDoc
