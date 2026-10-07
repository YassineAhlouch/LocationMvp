```jsx
import { useState } from 'react'
import ReactionEmojiPicker from '@/components/shared/ReactionEmojiPicker'
import Button from '@/components/ui/Button'

const customEmojis = ['🚀', '⭐', '💯', '🔥', '✨', '💪', '✅', '🙏']

const CustomEmojis = () => {
    const [selectedEmoji, setSelectedEmoji] = useState(null)

    return (
        <div className="flex items-center gap-4">
            <ReactionEmojiPicker
                emojis={customEmojis}
                onSelect={setSelectedEmoji}
                trigger={<Button>React {selectedEmoji || '😊'}</Button>}
            />
            {selectedEmoji && <span>Selected: {selectedEmoji}</span>}
        </div>
    )
}

export default CustomEmojis
```
