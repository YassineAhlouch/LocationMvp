import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Variants from './Variants'
import CustomSize from './CustomSize'

const mdPath = 'IconFrameDoc'

const demoHeader = {
    title: 'IconFrame',
    desc: 'IconFrame is a container component for displaying icons with consistent styling. It supports multiple visual variants including default, thick adn layered styles.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of IconFrame with default styling.`,
        component: <Basic />,
    },
    {
        mdName: 'Variants',
        mdPath: mdPath,
        title: 'Variants',
        desc: `IconFrame supports four visual variants: <code>default</code>, <code>thick</code>, <code>layered</code>.`,
        component: <Variants />,
    },
    {
        mdName: 'CustomSize',
        mdPath: mdPath,
        title: 'Custom Size',
        desc: `Use the <code>size</code> prop to customize the frame dimensions. Default size is 40px.`,
        component: <CustomSize />,
    },
]

const demoApi = [
    {
        component: 'IconFrame',
        api: [
            {
                propName: 'variant',
                type: `<code>'default'</code> | <code>'thick'</code> | <code>'layered'</code>`,
                default: `<code>'default'</code>`,
                desc: 'Visual style variant of the icon frame',
            },
            {
                propName: 'size',
                type: `<code>number</code>`,
                default: `<code>40</code>`,
                desc: 'Width and height of the icon frame in pixels',
            },
            {
                propName: 'children',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Icon or content to display inside the frame',
            },
            {
                propName: 'className',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional CSS classes to apply to the frame',
            },
        ],
    },
]

const IconFrameDoc = () => {
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

export default IconFrameDoc
