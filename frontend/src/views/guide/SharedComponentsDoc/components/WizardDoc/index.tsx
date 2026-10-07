import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Horizontal from './Horizontal'
import Vertical from './Vertical'
import WithCustomIcons from './WithCustomIcons'

const mdPath = 'WizardDoc'

const demoHeader = {
    title: 'Wizard',
    desc: 'Wizard is a step-by-step navigation component that guides users through a multi-step process with visual progress indicators.',
}

const demos = [
    {
        mdName: 'Horizontal',
        mdPath: mdPath,
        title: 'Horizontal',
        desc: `Default horizontal wizard layout with step indicators and sliding content transitions.`,
        component: <Horizontal />,
    },
    {
        mdName: 'Vertical',
        mdPath: mdPath,
        title: 'Vertical',
        desc: `Vertical wizard layout with inline step content. Set <code>vertical</code> prop to enable this mode.`,
        component: <Vertical />,
    },
    {
        mdName: 'WithCustomIcons',
        mdPath: mdPath,
        title: 'Custom Icons',
        desc: `You can customize step icons using the <code>customIcon</code> prop on each step.`,
        component: <WithCustomIcons />,
    },
]

const demoApi = [
    {
        component: 'Wizard',
        api: [
            {
                propName: 'current',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'The current active step index (zero-based)',
            },
            {
                propName: 'vertical',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to display the wizard in vertical layout',
            },
            {
                propName: 'onChange',
                type: `<code>(index: number) => void</code>`,
                default: `-`,
                desc: 'Callback fired when a step is clicked',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS class for the wizard container',
            },
        ],
    },
    {
        component: 'Wizard.Step',
        api: [
            {
                propName: 'title',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'The title displayed for the step',
            },
            {
                propName: 'customIcon',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Custom icon to display instead of the step number',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether the step is disabled and cannot be clicked',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS class for the step',
            },
        ],
    },
]

const WizardDoc = () => {
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

export default WizardDoc
