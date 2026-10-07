import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'UseThemeSchemaDoc'

const demoHeader = {
    title: 'useThemeSchema',
    desc: 'A hook that applies theme color variables to the document root based on the current theme schema and mode.',
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

const UseThemeSchemaDoc = () => {
    return (
        <DemoLayout
            hideApiTitle
            hideFooter
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            mdPrefixPath="utils"
            keyText="param"
        />
    )
}

export default UseThemeSchemaDoc
