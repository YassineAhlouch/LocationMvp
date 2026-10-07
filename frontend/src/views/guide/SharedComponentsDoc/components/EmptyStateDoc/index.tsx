import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Variants from './Variants'
import WithOffset from './WithOffset'

const mdPath = 'EmptyStateDoc'

const demoHeader = {
    title: 'EmptyState',
    desc: 'EmptyState provides a complete empty state display with decorative background patterns and customizable illustration placement.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic empty state with illustration and content.`,
        component: <Basic />,
    },
    {
        mdName: 'Variants',
        mdPath: mdPath,
        title: 'Variants',
        desc: `Different background pattern variants: wave (default), grid, and dots.`,
        component: <Variants />,
    },
    {
        mdName: 'WithOffset',
        mdPath: mdPath,
        title: 'With Offset',
        desc: `Use the <code>offset</code> prop to adjust the vertical position of the content below the illustration.`,
        component: <WithOffset />,
    },
]

const demoApi = [
    {
        component: 'EmptyState',
        api: [
            {
                propName: 'variant',
                type: `<code>'wave'</code> | <code>'grid'</code> | <code>'dots'</code>`,
                default: `<code>'wave'</code>`,
                desc: 'The background pattern variant to display',
            },
            {
                propName: 'size',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Size of the background container in pixels (width and height)',
            },
            {
                propName: 'illustration',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Illustration or icon to display centered on the background',
            },
            {
                propName: 'offset',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Vertical offset (negative margin) for the content below the illustration',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Content to display below the background (title, description, actions)',
            },
        ],
    },
]

const EmptyStateDoc = () => {
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

export default EmptyStateDoc
