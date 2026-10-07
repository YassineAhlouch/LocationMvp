import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import formatNumber from '@/utils/formatNumber'

formatNumber(0)
// output: '0'

formatNumber(999)
// output: '999'

formatNumber(1000)
// output: '1.00K'

formatNumber(1500000)
// output: '1.50M'

formatNumber(2500000000)
// output: '2.50B'

formatNumber(1234567890123)
// output: '1.23T'

// Custom decimals
formatNumber(1500000, 1)
// output: '1.5M'
`}</SyntaxHighlighter>
    )
}

export default Example
