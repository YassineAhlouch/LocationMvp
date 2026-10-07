import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'

const mdPath = 'HistogramDoc'

const demoHeader = {
    title: 'Histogram',
    desc: 'Histogram displays data distribution as vertical bars, with the ability to highlight a selected range. Useful for visualizing data distributions in filter interfaces.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic histogram with interactive range selection. Bars within the selected range are highlighted.`,
        component: <Basic />,
    },
]

const demoApi = [
    {
        component: 'Histogram',
        api: [
            {
                propName: 'data',
                type: `<code>Array&lt;{ value: number; label: string }&gt;</code>`,
                default: `-`,
                desc: 'Array of data points with value and label for each bar',
            },
            {
                propName: 'range',
                type: `<code>[number, number]</code>`,
                default: `-`,
                desc: 'The selected range as a tuple [min, max]. Bars within this range are highlighted',
            },
            {
                propName: 'min',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Minimum value of the histogram scale',
            },
            {
                propName: 'max',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Maximum value of the histogram scale',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes to apply to the bars',
            },
        ],
    },
]

const HistogramDoc = () => {
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

export default HistogramDoc
