import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'OverflowTabsDoc'

const demoHeader = {
    title: 'OverflowTabs',
    desc: 'OverflowTabs is a responsive tab component that automatically moves tabs that don\'t fit into a "More" dropdown menu, ensuring all tabs remain accessible regardless of container width.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Basic usage with multiple tabs. Resize the window to see overflow behavior.`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'OverflowTabs',
        api: [
            {
                propName: 'tabList',
                type: `<code>Array&lt;{ label: string | ReactNode; value: string }&gt;</code>`,
                default: `-`,
                desc: 'Array of tab items with label and value',
            },
            {
                propName: 'value',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Currently active tab value',
            },
            {
                propName: 'onChange',
                type: `<code>(value: string) => void</code>`,
                default: `-`,
                desc: 'Callback fired when a tab is selected',
            },
            {
                propName: 'tabListClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes for the tab list container',
            },
            {
                propName: 'tabNavClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes for individual tab navigation items',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Additional content to render alongside the tabs (e.g., action buttons)',
            },
        ],
    },
]

const OverflowTabsDoc = () => {
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

export default OverflowTabsDoc
