import { useState, useCallback } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import classNames from 'classnames'
import { DEFAULT_KEYWORDS } from '../utils'
import type { KeywordItem } from '../types'
import type { KeyboardEvent } from 'react'

type KeywordFilterProps = {
    selectedKeyword: string | null
    onKeywordSelect: (keyword: string | null) => void
}

const KeywordFilter = ({
    selectedKeyword,
    onKeywordSelect,
}: KeywordFilterProps) => {
    const [showNewInput, setShowNewInput] = useState(false)
    const [newKeyword, setNewKeyword] = useState('')
    const [keywordList, setKeywordList] = useState(DEFAULT_KEYWORDS)

    const handleKeywordClick = useCallback(
        (keyword: KeywordItem) => {
            if (selectedKeyword === keyword.id) {
                onKeywordSelect(null)
            } else {
                onKeywordSelect(keyword.id)
            }
        },
        [selectedKeyword, onKeywordSelect],
    )

    const handleNewKeywordSubmit = useCallback(() => {
        const trimmedKeyword = newKeyword.trim()
        if (
            trimmedKeyword.length >= 2 &&
            trimmedKeyword.length <= 50 &&
            !keywordList.some((item) => item.id === trimmedKeyword)
        ) {
            setKeywordList((prev) => [
                ...prev,
                { id: trimmedKeyword, label: trimmedKeyword, count: 0 },
            ])
            setNewKeyword('')
            setShowNewInput(false)
        }
    }, [keywordList, newKeyword])

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleNewKeywordSubmit()
            } else if (e.key === 'Escape') {
                setNewKeyword('')
                setShowNewInput(false)
            }
        },
        [handleNewKeywordSubmit],
    )

    return (
        <div className="px-4">
            {keywordList.map((keyword) => (
                <div
                    key={keyword.id}
                    className={classNames(
                        'flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors',
                        selectedKeyword === keyword.id
                            ? 'border border-primary bg-primary-subtle'
                            : 'border border-transparent group',
                    )}
                    onClick={() => handleKeywordClick(keyword)}
                >
                    <div className="flex items-center heading-text font-medium group-hover:text-primary">
                        <span className="opacity-40 mr-1">#</span>
                        <span>{keyword.label}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                        {keyword.count}
                    </span>
                </div>
            ))}

            {showNewInput ? (
                <div className="py-1">
                    <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter keyword..."
                        prefix={<span>#</span>}
                        autoFocus
                    />
                </div>
            ) : (
                <Button
                    variant="link"
                    className="px-1.5 opacity-60 hover:opacity-100"
                    onClick={() => setShowNewInput(true)}
                >
                    + New
                </Button>
            )}
        </div>
    )
}

export default KeywordFilter
