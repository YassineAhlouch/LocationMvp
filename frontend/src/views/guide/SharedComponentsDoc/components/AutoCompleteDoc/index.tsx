import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'

const mdPath = 'AutoCompleteDoc'

const demoHeader = {
    title: 'AutoComplete',
    desc: 'AutoComplete is an input component that provides suggestions as the user types, allowing for quick selection from a filtered list of options.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of AutoComplete with a list of countries. Type to filter and select an option.`,
        component: <Basic />,
    },
]

const demoApi = [
    {
        component: 'AutoComplete',
        api: [
            {
                propName: 'data',
                type: `<code>Array&lt;T&gt;</code>`,
                default: `<code>[]</code>`,
                desc: 'Array of data items to be used as autocomplete options',
            },
            {
                propName: 'optionKey',
                type: `<code>(obj: T) => string</code>`,
                default: `-`,
                desc: 'Function to extract the string key from each data item for filtering and display',
            },
            {
                propName: 'value',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Current input value (controlled)',
            },
            {
                propName: 'onInputChange',
                type: `<code>(value: string) => void</code>`,
                default: `-`,
                desc: 'Callback fired when the input value changes',
            },
            {
                propName: 'onOptionSelected',
                type: `<code>(option: T) => void</code>`,
                default: `-`,
                desc: 'Callback fired when an option is selected from the dropdown',
            },
            {
                propName: 'renderOption',
                type: `<code>(option: T) => ReactNode</code>`,
                default: `-`,
                desc: 'Custom render function for each option in the dropdown list',
            },
        ],
    },
]

const AutoCompleteDoc = () => {
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

export default AutoCompleteDoc
