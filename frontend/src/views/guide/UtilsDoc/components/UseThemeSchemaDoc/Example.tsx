import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useThemeSchema from '@/utils/hooks/useThemeSchema'

const App = () => {
    // Call at the root of your app to apply theme CSS variables
    useThemeSchema()

    return (
        <div>
            {/* Theme variables are now applied to :root */}
            {/* --primary, --primary-deep, --primary-mild, --primary-subtle, --neutral */}
        </div>
    )
}

export default App
`}</SyntaxHighlighter>
    )
}

export default Example
