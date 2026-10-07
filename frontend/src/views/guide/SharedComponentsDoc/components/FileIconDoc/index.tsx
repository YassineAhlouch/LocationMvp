import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'

const mdPath = 'FileIconDoc'

const demoHeader = {
    title: 'FileIcon',
    desc: 'FileIcon renders an SVG icon that matches a given file type or extension. Unrecognised types fall back to a generic file icon.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Displays icons for common file types. Pass the file extension string as <code>type</code> and optionally adjust the size with <code>size</code>.`,
        component: <Basic />,
    },
]

const demoApi = [
    {
        component: 'FileIcon',
        api: [
            {
                propName: 'type',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'File extension or type key. Supported values: <code>pdf</code>, <code>xlsx</code>, <code>docx</code>, <code>ppt</code>, <code>jpg</code>, <code>jpeg</code>, <code>png</code>, <code>directory</code>. Anything else renders a generic file icon.',
            },
            {
                propName: 'size',
                type: `<code>number</code>`,
                default: `<code>30</code>`,
                desc: 'Width and height of the icon in pixels.',
            },
        ],
    },
]

const FileIconDoc = () => {
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

export default FileIconDoc
