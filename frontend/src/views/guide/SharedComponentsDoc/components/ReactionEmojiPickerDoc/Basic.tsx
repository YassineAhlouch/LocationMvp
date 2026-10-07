import { useState } from 'react'
import ReactionEmojiPicker from '@/components/shared/ReactionEmojiPicker'

const Basic = () => {
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)

    return (
        <div className="flex items-center gap-4">
            <ReactionEmojiPicker onSelect={setSelectedEmoji} />
            {selectedEmoji && <span>Selected: {selectedEmoji}</span>}
        </div>
    )
}

export default Basic
