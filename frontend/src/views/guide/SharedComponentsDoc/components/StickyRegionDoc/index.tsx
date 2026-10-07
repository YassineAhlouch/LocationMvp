import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import WithOffset from './WithOffset'

const mdPath = 'StickyRegionDoc'

const demoHeader = {
    title: 'StickyRegion',
    desc: 'StickyRegion creates a sticky positioned element that becomes fixed when scrolling past a certain point, useful for sticky headers or navigation.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic sticky region that becomes fixed when scrolling.`,
        component: <Basic />,
    },
    {
        mdName: 'WithOffset',
        mdPath: mdPath,
        title: 'With Offset & Callback',
        desc: `You can customize the offset and receive callbacks when the sticky state changes.`,
        component: <WithOffset />,
    },
]

const demoApi = [
    {
        component: 'StickyRegion',
        api: [
            {
                propName: 'offsetTop',
                type: `<code>number</code>`,
                default: `<code>0</code>`,
                desc: 'Distance from the top of the viewport when sticky',
            },
            {
                propName: 'triggerOffset',
                type: `<code>number</code>`,
                default: `-`,
                desc: "Custom scroll position to trigger sticky behavior. Defaults to element's natural position",
            },
            {
                propName: 'shadow',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to show a shadow when sticky',
            },
            {
                propName: 'stickyClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes to apply when sticky',
            },
            {
                propName: 'zIndex',
                type: `<code>number</code>`,
                default: `<code>40</code>`,
                desc: 'z-index value when sticky',
            },
            {
                propName: 'transitionDuration',
                type: `<code>number</code>`,
                default: `<code>300</code>`,
                desc: 'Duration of the shadow transition in milliseconds',
            },
            {
                propName: 'onStickyChange',
                type: `<code>(isSticky: boolean) => void</code>`,
                default: `-`,
                desc: 'Callback fired when sticky state changes',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes for the container',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Content to render inside the sticky region',
            },
        ],
    },
]

const StickyRegionDoc = () => {
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

export default StickyRegionDoc
