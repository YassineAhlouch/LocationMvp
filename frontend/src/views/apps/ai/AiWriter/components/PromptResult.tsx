import Button from '@/components/ui/Button'
import { LuCopy, LuMessageSquareMore, LuLightbulb } from 'react-icons/lu'

export type BasePromptResultProps = {
    id: string
    content: string
    prompt: string
    showButton: boolean
    selectedText: string
    range?: {
        from: number
        to: number
    }
    retrying?: boolean
    type: 'ammend' | 'generate'
}

type PromptResultProps = BasePromptResultProps & {
    onMouseEnter: () => void
    onMouseLeave: () => void
    onApplyContent: () => void
    onRetry: () => void
}

const PromptResult = (props: PromptResultProps) => {
    const {
        prompt,
        content,
        selectedText,
        showButton,
        onMouseEnter,
        onRetry,
        retrying,
        onMouseLeave,
        type,
        onApplyContent,
    } = props

    return (
        <div
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3"
            onMouseOver={() => {
                onMouseEnter()
            }}
            onMouseLeave={() => onMouseLeave()}
        >
            <div className="flex items-center gap-2 mb-2">
                {type === 'generate' && (
                    <LuLightbulb className="text-amber-500 text-xl" />
                )}
                {type === 'ammend' && (
                    <LuMessageSquareMore className="text-primary text-xl" />
                )}
                <span className="heading-text font-semibold">{prompt}</span>
            </div>
            {selectedText && (
                <div className="text-xs italic mb-2 border-l-2 border-gray-300 pl-2">
                    {selectedText.length > 230
                        ? `${selectedText.substring(0, 230)}...`
                        : selectedText}
                </div>
            )}
            <div className="heading-text">{content}</div>
            {showButton && (
                <div className="flex item-center justify-between mt-3 gap-1">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="solid"
                            size="sm"
                            onClick={onApplyContent}
                            disabled={retrying}
                        >
                            Apply
                        </Button>
                        <Button
                            variant="subtle"
                            size="sm"
                            loading={retrying}
                            onClick={onRetry}
                        >
                            {retrying ? 'Retrying...' : 'Retry'}
                        </Button>
                    </div>
                    <Button variant="subtle" size="sm" icon={<LuCopy />} />
                </div>
            )}
        </div>
    )
}

export default PromptResult
