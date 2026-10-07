import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Horizontal from './Horizontal'
import ScrollToCertainPosition from './ScrollToCertainPosition'
import FlexSize from './FlexSize'
import EdgeShadow from './EdgeShadow'

const mdPath = 'Scroll'

const demoHeader = {
    title: 'Scroll',
    desc: 'Enhances default scroll behavior with customizable, cross-browser styling support.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Scroll.`,
        component: <Basic />,
    },
    {
        mdName: 'Horizontal',
        mdPath: mdPath,
        title: 'Horizontal',
        desc: `Horizontal Scroll.`,
        component: <Horizontal />,
    },
    {
        mdName: 'ScrollToCertainPosition',
        mdPath: mdPath,
        title: 'Scroll To Certain Position',
        desc: `We can access scroll view port to control the scroll method.`,
        component: <ScrollToCertainPosition />,
    },
    {
        mdName: 'FlexSize',
        mdPath: mdPath,
        title: 'Flex Size',
        desc: `<code>Scroll.FlexSize</code> allow us to cater with uncertain height & width, such as <code>max-height</code> & <code>max-width</code>.`,
        component: <FlexSize />,
    },
    {
        mdName: 'EdgeShadow',
        mdPath: mdPath,
        title: 'Edge Shadow',
        desc: `Applied shadow to scrollable the edge of the content for better user experience.`,
        component: <EdgeShadow />,
    },
]

const demoApi = [
    {
        component: 'Button',
        api: [
            {
                propName: 'contentClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional class names for styling the content area.',
            },
            {
                propName: 'edgeShadow',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Displays a shadow on the top/bottom or left/right edges when content is scrollable.',
            },
            {
                propName: 'offsetScrollbars',
                type: `<code>boolean</code> | <code>'horizontal'</code> | <code>'vertical'</code> | <code>'present'</code>`,
                default: `<code>false</code>`,
                desc: 'Offsets scrollbars from the content. Useful when scrollbars should not overlap content.',
            },
            {
                propName: 'onScrollPositionChange',
                type: `<code>(position: { x: number; y: number }) =&gt; void</code>`,
                default: `-`,
                desc: 'Callback triggered whenever the scroll position changes.',
            },
            {
                propName: 'onBottomReached',
                type: `<code>() =&gt; void</code>`,
                default: `-`,
                desc: 'Callback fired when the user scrolls to the bottom of the content.',
            },
            {
                propName: 'onTopReached',
                type: `<code>() =&gt; void</code>`,
                default: `-`,
                desc: 'Callback fired when the user scrolls to the top of the content.',
            },
            {
                propName: 'scrollbarSize',
                type: `<code>number</code> | <code>string</code>`,
                default: `-`,
                desc: 'Specifies the thickness of the scrollbar. Can be a number (in pixels) or a CSS size string.',
            },
            {
                propName: 'scrollHideDelay',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Time (in milliseconds) to delay hiding the scrollbar after scroll stops.',
            },
            {
                propName: 'scrollbars',
                type: `<code>'horizontal'</code> | <code>'vertical'</code> | <code>'both'</code>`,
                default: `<code>'vertical'</code>`,
                desc: 'Specifies which scrollbars should be shown.',
            },
            {
                propName: 'type',
                type: `<code>ScrollType</code>`,
                default: `-`,
                desc: 'Determines the scrollbar behavior or style, based on your custom ScrollType.',
            },
            {
                propName: 'viewportRef',
                type: `<code>Ref&lt;HTMLDivElement&gt;</code>`,
                default: `-`,
                desc: 'Ref object to access the internal scrollable viewport.',
            },
            {
                propName: 'viewportProps',
                type: `<code>ComponentProps&lt;'div'&gt;</code>`,
                default: `-`,
                desc: 'Additional props passed to the scrollable viewport div.',
            },
        ],
    },
]

const Button = () => {
    return (
        <>
            <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
        </>
    )
}

export default Button
