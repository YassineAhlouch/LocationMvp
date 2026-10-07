import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import formatCurrency from '@/utils/formatCurrency'

// Basic usage
formatCurrency(1234.56)
// output: '$1,235'

// With decimals
formatCurrency(1234.56, 'USD', 'en-US', 2)
// output: '$1,234.56'

// Different currency
formatCurrency(1234.56, 'EUR', 'de-DE', 2)
// output: '1.234,56 €'

// Japanese Yen
formatCurrency(1234, 'JPY', 'ja-JP')
// output: '¥1,234'
`}</SyntaxHighlighter>
    )
}

export default Example
