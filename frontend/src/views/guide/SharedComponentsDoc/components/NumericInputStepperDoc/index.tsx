import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import WithConstraints from './WithConstraints'

const mdPath = 'NumericInputStepperDoc'

const demoHeader = {
    title: 'NumericInputStepper',
    desc: 'NumericInputStepper provides increment and decrement buttons for numeric input, typically used alongside an input field for precise value control.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage with increment and decrement buttons.`,
        component: <Basic />,
    },
    {
        mdName: 'WithConstraints',
        mdPath: mdPath,
        title: 'With Constraints',
        desc: `You can set <code>min</code>, <code>max</code>, and <code>step</code> values to constrain the input range.`,
        component: <WithConstraints />,
    },
]

const demoApi = [
    {
        component: 'NumericInputStepper',
        api: [
            {
                propName: 'value',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Current numeric value',
            },
            {
                propName: 'onChange',
                type: `<code>(value: number) => void</code>`,
                default: `-`,
                desc: 'Callback fired when the value changes',
            },
            {
                propName: 'min',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Minimum allowed value',
            },
            {
                propName: 'max',
                type: `<code>number</code>`,
                default: `<code>Infinity</code>`,
                desc: 'Maximum allowed value',
            },
            {
                propName: 'step',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Amount to increment or decrement by',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether the stepper is disabled',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `<code>""</code>`,
                desc: 'Additional CSS classes to apply',
            },
        ],
    },
]

const NumericInputStepperDoc = () => {
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

export default NumericInputStepperDoc
