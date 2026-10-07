import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Sizes from './Sizes'

const mdPath = 'ClockProgressDoc'

const demoHeader = {
    title: 'ClockProgress',
    desc: 'ClockProgress displays a circular progress indicator that fills like a clock face, useful for showing completion percentage in a compact visual format.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage showing different progress values from 0% to 100%.`,
        component: <Basic />,
    },
    {
        mdName: 'Sizes',
        mdPath: mdPath,
        title: 'Sizes',
        desc: `You can customize the size of the clock progress indicator using the <code>size</code> prop.`,
        component: <Sizes />,
    },
]

const demoApi = [
    {
        component: 'ClockProgress',
        api: [
            {
                propName: 'value',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Progress value from 0 to 100',
            },
            {
                propName: 'size',
                type: `<code>number</code>`,
                default: `<code>40</code>`,
                desc: 'Size of the clock progress indicator in pixels',
            },
        ],
    },
]

const ClockProgressDoc = () => {
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

export default ClockProgressDoc
