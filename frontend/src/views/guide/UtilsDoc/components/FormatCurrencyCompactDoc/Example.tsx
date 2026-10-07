import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import formatCurrencyCompact from '@/utils/formatCurrencyCompact'

// Small values (uses formatCurrency)
formatCurrencyCompact(500)
// output: '$500'

// Thousands
formatCurrencyCompact(1500)
// output: '1.50K'

// Millions
formatCurrencyCompact(2500000)
// output: '2.50M'

// Billions
formatCurrencyCompact(3500000000)
// output: '3.50B'

// Trillions
formatCurrencyCompact(1200000000000)
// output: '1.20T'

// Custom decimals
formatCurrencyCompact(1500000, 'USD', 1)
// output: '1.5M'
`}</SyntaxHighlighter>
    )
}

export default Example
