```jsx
import Button from '@/components/ui/Button'
import classNames from 'classnames'

const Custom = () => {
    return (
        <div className="inline-flex gap-2">
            <Button
                clickFeedback={false}
                className={({ active, unclickable }) =>
                    classNames(
                        'text-gray-100 hover:text-gray-50 dark:hover:bg-red-500 border-0 hover:ring-0',
                        active ? 'bg-red-700' : 'bg-red-500',
                        unclickable && 'opacity-50 cursor-not-allowed',
                        !active && !unclickable && 'hover:bg-red-400',
                    )
                }
            >
                Custom color
            </Button>
            <Button
                clickFeedback={false}
                className={({ active, unclickable }) =>
                    classNames(
                        'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500  border-0 hover:ring-0 p-0.5',
                        active
                            ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'
                            : '',
                        unclickable && 'opacity-50 cursor-not-allowed',
                        !active &&
                            !unclickable &&
                            'hover:bg-gradient-to-r hover:from-pink-400 hover:via-purple-400 hover:to-blue-400',
                    )
                }
            >
                <span className="relative px-5 h-full w-full flex items-center transition-all bg-white dark:bg-gray-900 rounded-md text-gray-900 dark:text-gray-100">
                    Gradient
                </span>
            </Button>
        </div>
    )
}

export default Custom
```
