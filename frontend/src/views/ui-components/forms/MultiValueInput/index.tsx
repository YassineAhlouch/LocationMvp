import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Controlled from './Controlled'
import WithValidation from './WithValidation'
import MaxTags from './MaxTags'

const mdPath = 'MultiValueInput'

const demoHeader = {
    title: 'MultiValueInput',
    desc: 'MultiValueInput allows users to enter multiple values as tags with keyboard navigation support.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of MultiValueInput. Press Enter to add a tag, Backspace to remove.`,
        component: <Basic />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `MultiValueInput can be controlled via <code>value</code> and <code>onChange</code> props.`,
        component: <Controlled />,
    },
    {
        mdName: 'WithValidation',
        mdPath: mdPath,
        title: 'With Validation',
        desc: `Use the <code>validate</code> prop to validate tags before adding them.`,
        component: <WithValidation />,
    },
    {
        mdName: 'MaxTags',
        mdPath: mdPath,
        title: 'Max Tags',
        desc: `Limit the number of tags with the <code>maxTags</code> prop.`,
        component: <MaxTags />,
    },
]

const demoApi = [
    {
        component: 'MultiValueInput',
        api: [
            {
                propName: 'value',
                type: `<code>string[]</code>`,
                default: `-`,
                desc: 'Current value for controlled usage',
            },
            {
                propName: 'defaultValue',
                type: `<code>string[]</code>`,
                default: `<code>[]</code>`,
                desc: 'Default value for uncontrolled usage',
            },
            {
                propName: 'onChange',
                type: `<code>(tags: string[]) => void</code>`,
                default: `-`,
                desc: 'Called when tags change',
            },
            {
                propName: 'placeholder',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Input placeholder text',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Disable the entire component',
            },
            {
                propName: 'maxTags',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Maximum number of tags allowed',
            },
            {
                propName: 'validate',
                type: `<code>(tag: string) => boolean</code>`,
                default: `-`,
                desc: 'Function to validate new tags',
            },
            {
                propName: 'onTagAdd',
                type: `<code>(tag: string, allTags: string[]) => void</code>`,
                default: `-`,
                desc: 'Called when a tag is added',
            },
            {
                propName: 'onTagRemove',
                type: `<code>(tag: string, allTags: string[]) => void</code>`,
                default: `-`,
                desc: 'Called when a tag is removed',
            },
            {
                propName: 'invalid',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the input is in invalid state',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code> | <code>'md'</code> | <code>'sm'</code>`,
                default: `-`,
                desc: 'Size of the input',
            },
            {
                propName: 'readOnly',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether the input is read-only',
            },
        ],
    },
]

const MultiValueInput = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default MultiValueInput
