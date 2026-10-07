import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import CustomInputDisplay from './CustomInputDisplay'
import CustomOption from './CustomOption'
import Combined from './Combined'

const mdPath = 'SelectExtensionDoc'

const demoHeader = {
    title: 'Select Extension',
    desc: "Helper components designed to extend the Select component with custom input displays and option rendering. These components are meant to be used with Select's customInputDisplay and customOption props.",
}

const demos = [
    {
        mdName: 'CustomInputDisplay',
        mdPath: mdPath,
        title: 'Custom Input Display',
        desc: `Use <code>SelectInputWithPrefix</code> with Select's <code>customInputDisplay</code> prop to show prefix icons alongside selected values.`,
        component: <CustomInputDisplay />,
    },
    {
        mdName: 'CustomOption',
        mdPath: mdPath,
        title: 'Custom Option',
        desc: `Use <code>SelectOptionWithPrefix</code> with Select's <code>customOption</code> prop to render options with prefix icons and check indicators.`,
        component: <CustomOption />,
    },
    {
        mdName: 'Combined',
        mdPath: mdPath,
        title: 'Combined Usage',
        desc: `Use both <code>SelectInputWithPrefix</code> and <code>SelectOptionWithPrefix</code> together for a fully customized Select experience.`,
        component: <Combined />,
    },
]

const demoApi = [
    {
        component: 'SelectInputWithPrefix',
        api: [
            {
                propName: 'label',
                type: `<code>string | ReactNode</code>`,
                default: `-`,
                desc: 'Selected value label to display',
            },
            {
                propName: 'prefix',
                type: `<code>string | ReactNode</code>`,
                default: `-`,
                desc: 'Prefix icon or element',
            },
            {
                propName: 'showPrefix',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Controls prefix visibility',
            },
        ],
    },
    {
        component: 'SelectOptionWithPrefix',
        api: [
            {
                propName: 'prefix',
                type: `<code>string | ReactNode</code>`,
                default: `-`,
                desc: 'Prefix icon or element for option',
            },
            {
                propName: 'label',
                type: `<code>string | ReactNode</code>`,
                default: `-`,
                desc: 'Option label text',
            },
            {
                propName: 'selected',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether option is currently selected',
            },
            {
                propName: 'checkIcon',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Custom check icon for selected state',
            },
        ],
    },
]

const SelectExtensionDoc = () => {
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

export default SelectExtensionDoc
