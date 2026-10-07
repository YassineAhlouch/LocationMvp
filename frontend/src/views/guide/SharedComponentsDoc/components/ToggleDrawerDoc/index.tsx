import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Placement from './Placement'

const mdPath = 'ToggleDrawerDoc'

const demoHeader = {
    title: 'ToggleDrawer',
    desc: 'ToggleDrawer combines a toggle button with a drawer panel, providing a simple way to create collapsible side panels with a hamburger menu toggle.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage with a toggle button that opens a drawer from the left.`,
        component: <Basic />,
    },
    {
        mdName: 'Placement',
        mdPath: mdPath,
        title: 'Placement',
        desc: `You can change the drawer placement using the <code>placement</code> prop.`,
        component: <Placement />,
    },
]

const demoApi = [
    {
        component: 'ToggleDrawer',
        api: [
            {
                propName: 'placement',
                type: `<code>"left"</code> | <code>"right"</code> | <code>"top"</code> | <code>"bottom"</code>`,
                default: `<code>"left"</code>`,
                desc: 'The side from which the drawer opens',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Content to render inside the drawer',
            },
            {
                propName: 'ref',
                type: `<code>Ref&lt;ToggleDrawerRef&gt;</code>`,
                default: `-`,
                desc: 'Ref to access drawer methods (handleOpenDrawer, handleCloseDrawer)',
            },
        ],
    },
    {
        component: 'ToggleDrawerRef',
        api: [
            {
                propName: 'handleOpenDrawer',
                type: `<code>() => void</code>`,
                default: `-`,
                desc: 'Method to programmatically open the drawer',
            },
            {
                propName: 'handleCloseDrawer',
                type: `<code>() => void</code>`,
                default: `-`,
                desc: 'Method to programmatically close the drawer',
            },
        ],
    },
]

const ToggleDrawerDoc = () => {
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

export default ToggleDrawerDoc
