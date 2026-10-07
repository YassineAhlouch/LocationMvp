import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import CustomStyles from './CustomStyles'

const mdPath = 'SegmentProgressBarDoc'

const demoHeader = {
    title: 'SegmentProgressBar',
    desc: 'SegmentProgressBar displays progress as discrete segments rather than a continuous bar, useful for showing step-based progress or discrete levels.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage showing different progress percentages with 5 segments.`,
        component: <Basic />,
    },
    {
        mdName: 'CustomStyles',
        mdPath: mdPath,
        title: 'Custom Styles',
        desc: `You can customize the color, height, gap, and number of segments.`,
        component: <CustomStyles />,
    },
]

const demoApi = [
    {
        component: 'SegmentProgressBar',
        api: [
            {
                propName: 'segments',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Number of segments to display',
            },
            {
                propName: 'percent',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Progress percentage (0-100). Determines how many segments are filled',
            },
            {
                propName: 'filledClass',
                type: `<code>string</code>`,
                default: `<code>"bg-emerald-500"</code>`,
                desc: 'CSS class for filled segments',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes for each segment',
            },
            {
                propName: 'gap',
                type: `<code>number</code>`,
                default: `<code>4</code>`,
                desc: 'Gap between segments in pixels',
            },
            {
                propName: 'height',
                type: `<code>number</code>`,
                default: `<code>16</code>`,
                desc: 'Height of each segment in pixels',
            },
        ],
    },
]

const SegmentProgressBarDoc = () => {
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

export default SegmentProgressBarDoc
