import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import formatRelativeTime from '@/utils/formatRelativeTime'

// Just now (less than 60 seconds ago)
formatRelativeTime(new Date())
// output: 'just now'

// Minutes ago
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
formatRelativeTime(fiveMinutesAgo)
// output: '5 minutes ago'

// Hours ago
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
formatRelativeTime(twoHoursAgo)
// output: '2 hours ago'

// Days ago
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
formatRelativeTime(threeDaysAgo)
// output: '3 days ago'

// From string
formatRelativeTime('2024-01-01')
// output: '1 year ago' (depending on current date)
`}</SyntaxHighlighter>
    )
}

export default Example
