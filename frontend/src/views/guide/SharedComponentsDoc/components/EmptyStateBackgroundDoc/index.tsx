import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Wave from './Wave'
import Grid from './Grid'
import Dots from './Dots'

const mdPath = 'EmptyStateBackgroundDoc'

const demoHeader = {
    title: 'EmptyStateBackground',
    desc: 'EmptyStateBackground provides decorative background patterns for empty state displays, helping to create visually appealing placeholder content.',
}

const demos = [
    {
        mdName: 'Wave',
        mdPath: mdPath,
        title: 'Wave',
        desc: `Default wave pattern background for empty states.`,
        component: <Wave />,
    },
    {
        mdName: 'Grid',
        mdPath: mdPath,
        title: 'Grid',
        desc: `Linear grid pattern background. Set <code>variant</code> to <code>"grid"</code>.`,
        component: <Grid />,
    },
    {
        mdName: 'Dots',
        mdPath: mdPath,
        title: 'Dots',
        desc: `Dots pattern background. Set <code>variant</code> to <code>"dots"</code>.`,
        component: <Dots />,
    },
]

const demoApi = [
    {
        component: 'EmptyStateBackground',
        api: [
            {
                propName: 'variant',
                type: `<code>"wave"</code> | <code>"grid"</code> | <code>"dots"</code>`,
                default: `<code>"wave"</code>`,
                desc: 'The background pattern variant to display',
            },
            {
                propName: 'size',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Size of the background container in pixels (width and height)',
            },
            {
                propName: 'style',
                type: `<code>CSSProperties</code>`,
                default: `<code>{}</code>`,
                desc: 'Additional inline styles to apply to the container',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes to apply to the container',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Content to display on top of the background pattern',
            },
        ],
    },
]

const EmptyStateBackgroundDoc = () => {
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

export default EmptyStateBackgroundDoc
