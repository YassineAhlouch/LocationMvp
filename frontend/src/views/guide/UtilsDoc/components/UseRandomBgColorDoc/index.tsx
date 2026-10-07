import DemoComponentApi from '@/components/docs/DemoComponentApi'
import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseRandomBgColorDoc'

const demoHeader = {
    title: 'useRandomColor',
    desc: 'useRandomColor hook generates a random color from a predefined whitelist of Tailwind CSS colors based on the input name. This hook is useful for assigning consistent colors based on a string, such as a username or item name.',
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

const extra = (
    <DemoComponentApi
        hideApiTitle
        keyText="return"
        api={[
            {
                api: [
                    {
                        propName: 'generateColor',
                        type: `<code>(name: string) =&gt; { background: string, text: string }</code>`,
                        default: '',
                        desc: 'Returns an object with Tailwind CSS background and text color classes based on the input name string.',
                    },
                ],
            },
        ]}
    />
)

const UseRandomBgColorDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="utils"
            extra={extra}
            keyText="param"
        />
    )
}

export default UseRandomBgColorDoc
