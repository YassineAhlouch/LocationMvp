import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import CustomTrigger from './CustomTrigger'

const mdPath = 'PopoverFilterDoc'

const demoHeader = {
    title: 'PopoverFilter',
    desc: 'PopoverFilter provides a popover-based filter interface with searchable checkbox options, commonly used for filtering data in tables or lists.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage with a filter button trigger. Click to open the filter popover.`,
        component: <Basic />,
    },
    {
        mdName: 'CustomTrigger',
        mdPath: mdPath,
        title: 'Custom Trigger',
        desc: `You can customize the trigger element using the <code>renderTrigger</code> prop.`,
        component: <CustomTrigger />,
    },
]

const demoApi = [
    {
        component: 'PopoverFilter',
        api: [
            {
                propName: 'data',
                type: `<code>Array&lt;{ label: string; value: string }&gt;</code>`,
                default: `<code>[]</code>`,
                desc: 'Array of filter options with label and value',
            },
            {
                propName: 'onChange',
                type: `<code>(data: Array&lt;{ label: string; value: string }&gt;) => void</code>`,
                default: `-`,
                desc: 'Callback fired when selection changes, receives the selected items',
            },
            {
                propName: 'title',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `<code>"Filter"</code>`,
                desc: 'Title displayed in the popover header',
            },
            {
                propName: 'placement',
                type: `<code>"bottom-start"</code> | <code>"bottom-end"</code>`,
                default: `<code>"bottom-start"</code>`,
                desc: 'Placement of the popover relative to the trigger',
            },
            {
                propName: 'inputPlaceholder',
                type: `<code>string</code>`,
                default: `<code>"Search..."</code>`,
                desc: 'Placeholder text for the search input',
            },
            {
                propName: 'showReset',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to show the clear filters button',
            },
            {
                propName: 'value',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Controlled selected values',
            },
            {
                propName: 'renderTrigger',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Custom trigger element to open the popover',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `<code>220</code>`,
                desc: 'Width of the popover in pixels',
            },
        ],
    },
]

const PopoverFilterDoc = () => {
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

export default PopoverFilterDoc
