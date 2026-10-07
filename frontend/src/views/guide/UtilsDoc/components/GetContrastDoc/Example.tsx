import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Example = () => {
    return (
        <SyntaxHighlighter language="js">{`import getContrast from '@/utils/getContrast'

// Light colors
getContrast('#ffffff')
// output: 'light'

getContrast('#f0f0f0')
// output: 'light'

// Dark colors
getContrast('#000000')
// output: 'dark'

getContrast('#333333')
// output: 'dark'

// Short hex format
getContrast('#fff')
// output: 'light'

// RGB format
getContrast('rgb(255, 255, 255)')
// output: 'light'

getContrast('rgb(0, 0, 0)')
// output: 'dark'

// Practical usage: determine text color
const bgColor = '#3b82f6'
const textColor = getContrast(bgColor) === 'light' ? 'text-gray-900' : 'text-white'
`}</SyntaxHighlighter>
    )
}

export default Example
