import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Levels from './Levels'

const mdPath = 'InfoBarDoc'

const demoHeader = {
    title: 'InfoBar',
    desc: 'InfoBar displays a signal strength indicator with three bars, commonly used to show levels like low, medium, or high intensity.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage showing all three level states.`,
        component: <Basic />,
    },
    {
        mdName: 'Levels',
        mdPath: mdPath,
        title: 'Custom Height',
        desc: `You can customize the height of the info bar using the <code>height</code> prop.`,
        component: <Levels />,
    },
]

const demoApi = [
    {
        component: 'InfoBar',
        api: [
            {
                propName: 'level',
                type: `<code>"low"</code> | <code>"medium"</code> | <code>"high"</code>`,
                default: `-`,
                desc: 'The level to display. Low shows 1 bar (red), medium shows 2 bars (yellow), high shows 3 bars (green)',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes to apply to the container',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>15</code>`,
                desc: 'Height of the info bar in pixels',
            },
        ],
    },
]

const InfoBarDoc = () => {
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

export default InfoBarDoc
