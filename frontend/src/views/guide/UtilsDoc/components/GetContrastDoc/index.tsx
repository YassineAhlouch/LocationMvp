import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'GetContrastDoc'

const demoHeader = {
    title: 'getContrast',
    desc: 'Function to determine if a color is light or dark based on perceived brightness (W3C formula).',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: ``,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'Params',
        api: [
            {
                propName: 'color',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Color in hex (#fff or #ffffff) or rgb format (rgb(255, 255, 255)).',
            },
        ],
    },
]

const extra = (
    <DemoComponentApi
        hideApiTitle
        keyText="return"
        api={[
            {
                component: 'Return',
                api: [
                    {
                        propName: 'contrast',
                        type: `<code>'light' | 'dark'</code>`,
                        default: `-`,
                        desc: 'Returns "light" for bright colors, "dark" for dark colors.',
                    },
                ],
            },
        ]}
    />
)

const GetContrastDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="utils"
            extra={extra}
            keyText="param"
        />
    )
}

export default GetContrastDoc
