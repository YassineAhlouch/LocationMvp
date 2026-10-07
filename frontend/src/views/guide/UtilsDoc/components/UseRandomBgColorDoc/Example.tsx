import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useRandomColor from '@/utils/hooks/useRandomColor'

const Example = ({ name }) => {
    const generateColor = useRandomColor()
    const { background, text } = generateColor(name)

    return (
        <div className={background}>
            <span className={text}>{name}</span>
        </div>
    )
}

export default Example
`}</SyntaxHighlighter>
    )
}

export default Example
