import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import highlightSearchMatch from '@/utils/highlightSearchMatch'

const SearchResult = ({ text, query }) => {
    return (
        <div className="p-4">
            {highlightSearchMatch(text, query)}
        </div>
    )
}

// Usage
<SearchResult 
    text="The quick brown fox jumps over the lazy dog" 
    query="fox" 
/>
// Renders: "The quick brown <mark>fox</mark> jumps over the lazy dog"

// Case-insensitive matching
<SearchResult 
    text="Hello World" 
    query="world" 
/>
// Renders: "Hello <mark>World</mark>"

// Multiple matches
<SearchResult 
    text="The cat sat on the mat" 
    query="at" 
/>
// Renders: "The c<mark>at</mark> s<mark>at</mark> on the m<mark>at</mark>"
`}</SyntaxHighlighter>
    )
}

export default Example
