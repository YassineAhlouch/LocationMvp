import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

const FilterComponent = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleFilterChange = (filter) => {
        // Appends to existing query params
        onAppendQueryParams({ filter, page: 1 })
        // URL: /products?existing=value&filter=new&page=1
    }

    const handleReset = () => {
        // Override all existing params
        onAppendQueryParams({ page: 1 }, { override: true })
        // URL: /products?page=1
    }

    const handleSilentUpdate = () => {
        // Use replaceState instead of pushState
        onAppendQueryParams({ sort: 'name' }, { replace: true })
    }

    return (...)
}
`}</SyntaxHighlighter>
    )
}

export default Example
