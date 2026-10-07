import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Size from './Size'
import CloseWithEscBackdrop from './CloseWithEscBackdrop'
import InternalScroll from './InternalScroll'
import StaticBackdrop from './StaticBackdrop'
import CustomStyle from './CustomStyle'
import Closable from './Closable'

const mdPath = 'Dialog'

const demoHeader = {
    title: 'Dialog',
    desc: 'Dialog is a box that overlay on the current page which force user interact with.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Dialog.`,
        component: <Basic />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `Dialog allow us to input <code>width</code> & <code>height</code> to adjust the size of Dialog.`,
        component: <Size />,
    },
    {
        mdName: 'CloseWithEscBackdrop',
        mdPath: mdPath,
        title: 'Disable Escape & backdrop click',
        desc: `We can disable escape key & backdrop click close by setting <code>shouldCloseOnOverlayClick</code> & <code>shouldCloseOnEsc</code> props. `,
        component: <CloseWithEscBackdrop />,
    },
    {
        mdName: 'InternalScroll',
        mdPath: mdPath,
        title: 'Internal Scroll',
        desc: `Example of Dialog internal scroll.`,
        component: <InternalScroll />,
    },
    {
        mdName: 'StaticBackdrop',
        mdPath: mdPath,
        title: 'Lock Scroll',
        desc: `We can lock window scroll by passing <code>'overflow-hidden</code> to <code>bodyOpenClassName</code>`,
        component: <StaticBackdrop />,
    },
    {
        mdName: 'CustomStyle',
        mdPath: mdPath,
        title: 'Custom dialog style',
        desc: `Example of Dialog custom style`,
        component: <CustomStyle />,
    },
    {
        mdName: 'Closable',
        mdPath: mdPath,
        title: 'Closable',
        desc: `Set <code>closeable</code> to false will hide Dialog close icon.`,
        component: <Closable />,
    },
]

const demoApi = [
    {
        component: 'Dialog',
        api: [
            {
                propName: 'width',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>520</code>`,
                desc: 'Dialog width',
            },
            {
                propName: 'height',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Dialog height',
            },
            {
                propName: 'isOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to display dialog',
            },
            {
                propName: 'contentClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to Dialog content',
            },
            {
                propName: 'overlayClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name for Dialog backdrop',
            },

            {
                propName: 'closable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether show Dialog close icon',
            },
            {
                propName: 'onClose',
                type: `<code>(open: boolean) => void</code>`,
                default: `-`,
                desc: 'Callback function after click on Dialog close icon',
            },
            {
                propName: 'onOpen',
                type: `<code>(open: boolean) => void</code>`,
                default: `-`,
                desc: 'Callback function after Dialog open',
            },
            {
                propName: 'lockScroll',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to lock window scroll',
            },
            {
                propName: 'shouldCloseOnOverlayClick',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to close Dialog when the backdrop is clicked',
            },
            {
                propName: 'shouldCloseOnEsc',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to close Dialog when esc key pressed',
            },
        ],
    },
]

const Dialog = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Dialog
