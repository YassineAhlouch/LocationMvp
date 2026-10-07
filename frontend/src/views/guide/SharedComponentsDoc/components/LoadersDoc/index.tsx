import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import MediaSkeletonDemo from './MediaSkeletonDemo'
import TableRowSkeletonDemo from './TableRowSkeletonDemo'
import TextBlockSkeletonDemo from './TextBlockSkeletonDemo'

const mdPath = 'LoadersDoc'

const demoHeader = {
    title: 'Loaders',
    desc: 'Loader components provide skeleton placeholders for content that is loading, improving perceived performance and user experience.',
}

const demos = [
    {
        mdName: 'MediaSkeletonDemo',
        mdPath: mdPath,
        title: 'MediaSkeleton',
        desc: `Skeleton for media items with optional avatar, title, and text placeholders.`,
        component: <MediaSkeletonDemo />,
    },
    {
        mdName: 'TableRowSkeletonDemo',
        mdPath: mdPath,
        title: 'TableRowSkeleton',
        desc: `Skeleton for table rows with configurable columns and optional avatars.`,
        component: <TableRowSkeletonDemo />,
    },
    {
        mdName: 'TextBlockSkeletonDemo',
        mdPath: mdPath,
        title: 'TextBlockSkeleton',
        desc: `Skeleton for text blocks with optional title and configurable row count.`,
        component: <TextBlockSkeletonDemo />,
    },
]

const demoApi = [
    {
        component: 'MediaSkeleton',
        api: [
            {
                propName: 'showAvatar',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to show the avatar skeleton',
            },
            {
                propName: 'avatarProps',
                type: `<code>SkeletonProps</code>`,
                default: `-`,
                desc: 'Props to pass to the avatar skeleton',
            },
            {
                propName: 'titleProps',
                type: `<code>SkeletonProps</code>`,
                default: `-`,
                desc: 'Props to pass to the title skeleton',
            },
            {
                propName: 'textProps',
                type: `<code>SkeletonProps</code>`,
                default: `-`,
                desc: 'Props to pass to the text skeleton',
            },
        ],
    },
    {
        component: 'TableRowSkeleton',
        api: [
            {
                propName: 'columns',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Number of columns per row',
            },
            {
                propName: 'rows',
                type: `<code>number</code>`,
                default: `<code>10</code>`,
                desc: 'Number of skeleton rows to render',
            },
            {
                propName: 'avatarInColumns',
                type: `<code>number[]</code>`,
                default: `<code>[]</code>`,
                desc: 'Column indices that should include an avatar skeleton',
            },
            {
                propName: 'avatarProps',
                type: `<code>SkeletonProps</code>`,
                default: `-`,
                desc: 'Props to pass to avatar skeletons',
            },
        ],
    },
    {
        component: 'TextBlockSkeleton',
        api: [
            {
                propName: 'rowCount',
                type: `<code>number</code>`,
                default: `<code>3</code>`,
                desc: 'Number of text rows to render',
            },
            {
                propName: 'title',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to show a title skeleton',
            },
            {
                propName: 'titleWidth',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>"40%"</code>`,
                desc: 'Width of the title skeleton',
            },
            {
                propName: 'lastChildWidth',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>"60%"</code>`,
                desc: 'Width of the last row skeleton',
            },
            {
                propName: 'height',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Height of each skeleton row',
            },
        ],
    },
]

const LoadersDoc = () => {
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

export default LoadersDoc
