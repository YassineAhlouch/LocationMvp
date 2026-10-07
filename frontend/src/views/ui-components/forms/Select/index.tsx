import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Controlled from './Controlled'
import Size from './Size'
import Disabled from './Disabled'
import Search from './Search'
import MultiSelection from './MultiSelection'
import Group from './Group'
import Custom from './Custom'
import AsyncOnSearch from './AsyncOnSearch'
import LoadOptionOnExpand from './LoadOptionOnExpand'
import Creatable from './Creatable'

const mdPath = 'Select'

const demoHeader = {
    title: 'Select',
    desc: 'Select allows a user to pick single or multiple options from a list.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic Usage.`,
        component: <Basic />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Controlled usage.`,
        component: <Controlled />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `There's three sizes of option for Select.`,
        component: <Size />,
    },
    {
        mdName: 'MultiSelection',
        mdPath: mdPath,
        title: 'Multi Selection',
        desc: `By setting <code>isMulti</code> to true, we can select multiple options from the list.`,
        component: <MultiSelection />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Example of disabled.`,
        component: <Disabled />,
    },
    {
        mdName: 'Search',
        mdPath: mdPath,
        title: 'Search',
        desc: `Select is searchable by default  by setting <code>isSearchable</code> to true.`,
        component: <Search />,
    },
    {
        mdName: 'Group',
        mdPath: mdPath,
        title: 'Group',
        desc: `Options can be grouped with nested data.`,
        component: <Group />,
    },
    {
        mdName: 'Custom',
        mdPath: mdPath,
        title: 'Custom',
        desc: `Select component allow us to make customization on selected item and options.`,
        component: <Custom />,
    },
    {
        mdName: 'AsyncOnSearch',
        mdPath: mdPath,
        title: 'Async on Search',
        desc: `Use the Async component to load options from a remote source as the user types.`,
        component: <AsyncOnSearch />,
    },
    {
        mdName: 'LoadOptionOnExpand',
        mdPath: mdPath,
        title: 'Load Options on Expand',
        desc: `We can also load options upon clicking the Select.`,
        component: <LoadOptionOnExpand />,
    },
    {
        mdName: 'Creatable',
        mdPath: mdPath,
        title: 'Creatable',
        desc: `We can create a new option via the search input.`,
        component: <Creatable />,
    },
]

const demoApi = [
    {
        component: 'Select',
        api: [
            {
                propName: 'creatable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Determines whether users can create new options in the select component.',
            },
            {
                propName: 'customInputDisplay',
                type: `<code>(display: (inputClass?: string) => JSX.Element, selectedItem: {label: string; value: string;  disabled?: boolean;} & ExtraOption) => ReactNode</code>`,
                default: `<code>undefined</code>`,
                desc: 'Allows customization of how the selected value is displayed.',
            },
            {
                propName: 'customOption',
                type: `<code>(props: {option: {label: string; value: string;  disabled?: boolean;} & ExtraOption; hovered: boolean; selected: boolean; CheckIcon: ReactNode }) => ReactNode</code>`,
                default: `<code>undefined</code>`,
                desc: 'Allows to custom option content.',
            },
            {
                propName: 'defaultValue',
                type: `<code>{label: string; value: string;  disabled?: boolean;} & ExtraOption</code>`,
                default: `<code>undefined</code>`,
                desc: 'Specifies the default selected value of the select component.',
            },
            {
                propName: 'filter',
                type: `<code>(props: { inputValue: string, options: Options&lt;ExtraOption&gt;, selectedItem: {label: string; value: string;  disabled?: boolean;} & ExtraOption | null }) => Options&lt;ExtraOption&gt;</code>`,
                default: `<code>undefined</code>`,
                desc: 'Custom filtering function for the options based on user input.',
            },
            {
                propName: 'formatGroupLabel',
                type: `<code>(group: { label: string; options: {label: string; value: string;  disabled?: boolean;} & ExtraOption[]; };) => ReactNode</code>`,
                default: `<code>undefined</code>`,
                desc: 'Function to format group labels in the select component.',
            },
            {
                propName: 'invalid',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Indicates whether the select component has an invalid state.',
            },
            {
                propName: 'isCreatable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Alias for `creatable`. Determines if users can create new options.',
            },
            {
                propName: 'isDisabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Disables the select component, preventing user interactions.',
            },
            {
                propName: 'isSearchable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Enables search functionality within the select component.',
            },
            {
                propName: 'isLoading',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Displays a loading indicator when true.',
            },
            {
                propName: 'noOptionsMessage',
                type: `<code>string | ((OptionElement: ({ className, ...rest }: ComponentProps<"li">) => JSX.Element) => string | ReactNode)</code>`,
                default: `<code>"No options available"</code>`,
                desc: 'Message displayed when no options are available.',
            },
            {
                propName: 'options',
                type: `<code>Array&lt;{ label: string; value: string; disabled?: boolean;} & ExtraOption &gt; | Array&lt;{ label: string; options: { label: string; value: string; disabled?: boolean;} & ExtraOption} &gt;</code>`,
                default: `<code>[]</code>`,
                desc: 'Array of selectable options.',
            },
            {
                propName: 'onChange',
                type: `<code>(value: {label: string; value: string;  disabled?: boolean;} & ExtraOption) => void</code>`,
                default: `<code>undefined</code>`,
                desc: 'Callback function triggered when the selected value changes.',
            },
            {
                propName: 'onMenuOpen',
                type: `<code>() => void</code>`,
                default: `<code>undefined</code>`,
                desc: 'Callback function triggered when the menu opens.',
            },
            {
                propName: 'onInputChange',
                type: `<code>(inputValue: string) => void</code>`,
                default: `<code>undefined</code>`,
                desc: 'Callback function triggered when the input value changes.',
            },
            {
                propName: 'placeholder',
                type: `<code>string</code>`,
                default: `<code>"Select..."</code>`,
                desc: 'Placeholder text displayed when no value is selected.',
            },
            {
                propName: 'searchInputProps',
                type: `<code>Omit&lt;ComponentProps&lt;"input"&gt;, 'onChange' | 'value' | 'onKeyDown' | 'ref'&gt;</code>`,
                default: `<code>undefined</code>`,
                desc: 'Additional props to pass to the search input field.',
            },
            {
                propName: 'size',
                type: `<code>'sm' | 'md' | 'lg'</code>`,
                default: `<code>"md"</code>`,
                desc: 'Specifies the size of the select component.',
            },
            {
                propName: 'value',
                type: `<code>{label: string; value: string;  disabled?: boolean;} & ExtraOption</code>`,
                default: `<code>undefined</code>`,
                desc: 'Specifies controlled value for select.',
            },
        ],
    },
    {
        component: 'Select.Multi',
        api: [
            {
                propName: 'creatable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Determines whether users can create new options in the select component.',
            },
            {
                propName: 'customLabel',
                type: `<code>(selectedItem: {label: string; value: string;  disabled?: boolean;} & ExtraOption) => ReactNode</code>`,
                default: `<code>undefined</code>`,
                desc: 'Allows customization of selected customLabel content.',
            },
            {
                propName: 'customOption',
                type: `<code>(props: {option: {label: string; value: string;  disabled?: boolean;} & ExtraOption; hovered: boolean; selected: boolean; CheckIcon: ReactNode }) => ReactNode</code>`,
                default: `<code>undefined</code>`,
                desc: 'Allows to custom option content.',
            },
            {
                propName: 'defaultValue',
                type: `<code>Array&lt;{label: string; value: string;  disabled?: boolean;} & ExtraOption&gt;</code>`,
                default: `<code>undefined</code>`,
                desc: 'Specifies the default selected value of the select component.',
            },
            {
                propName: 'filter',
                type: `<code>(props: { inputValue: string, options: Options&lt;ExtraOption&gt;, selectedItem: Array&lt;{label: string; value: string;  disabled?: boolean;} & ExtraOption&gt; | null }) => Options&lt;ExtraOption&gt;</code>`,
                default: `<code>undefined</code>`,
                desc: 'Custom filtering function for the options based on user input.',
            },
            {
                propName: 'formatGroupLabel',
                type: `<code>(group: { label: string; options: {label: string; value: string;  disabled?: boolean;} & ExtraOption[]; };) => ReactNode</code>`,
                default: `<code>undefined</code>`,
                desc: 'Function to format group labels in the select component.',
            },
            {
                propName: 'invalid',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Indicates whether the select component has an invalid state.',
            },
            {
                propName: 'isCreatable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Alias for `creatable`. Determines if users can create new options.',
            },
            {
                propName: 'isDisabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Disables the select component, preventing user interactions.',
            },
            {
                propName: 'isSearchable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Enables search functionality within the select component.',
            },
            {
                propName: 'isLoading',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Displays a loading indicator when true.',
            },
            {
                propName: 'noOptionsMessage',
                type: `<code>string</code>`,
                default: `<code>"No options available"</code>`,
                desc: 'Message displayed when no options are available.',
            },
            {
                propName: 'options',
                type: `<code>Array&lt;{ label: string; value: string; disabled?: boolean;} & ExtraOption &gt; | Array&lt;{ label: string; options: { label: string; value: string; disabled?: boolean;} & ExtraOption} &gt;</code>`,
                default: `<code>[]</code>`,
                desc: 'Array of selectable options.',
            },
            {
                propName: 'onChange',
                type: `<code>(value: Array&lt;{label: string; value: string;  disabled?: boolean;} & ExtraOption&gt;) => void</code>`,
                default: `<code>undefined</code>`,
                desc: 'Callback function triggered when the selected value changes.',
            },
            {
                propName: 'onMenuOpen',
                type: `<code>() => void</code>`,
                default: `<code>undefined</code>`,
                desc: 'Callback function triggered when the menu opens.',
            },
            {
                propName: 'onInputChange',
                type: `<code>(inputValue: string) => void</code>`,
                default: `<code>undefined</code>`,
                desc: 'Callback function triggered when the input value changes.',
            },
            {
                propName: 'placeholder',
                type: `<code>string</code>`,
                default: `<code>"Select..."</code>`,
                desc: 'Placeholder text displayed when no value is selected.',
            },
            {
                propName: 'showClearAllButton',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Determines whether the clear all button is displayed.',
            },
            {
                propName: 'searchInputProps',
                type: `<code>Omit&lt;ComponentProps&lt;"input"&gt;, 'onChange' | 'value' | 'onKeyDown' | 'ref'&gt;</code>`,
                default: `<code>undefined</code>`,
                desc: 'Additional props to pass to the search input field.',
            },
            {
                propName: 'size',
                type: `<code>'sm' | 'md' | 'lg'</code>`,
                default: `<code>"md"</code>`,
                desc: 'Specifies the size of the select component.',
            },
            {
                propName: 'value',
                type: `<code>Array&lt;{label: string; value: string;  disabled?: boolean;} & ExtraOption&gt;</code>`,
                default: `<code>undefined</code>`,
                desc: 'Specifies controlled value for select.',
            },
        ],
    },
]

const Select = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Select
