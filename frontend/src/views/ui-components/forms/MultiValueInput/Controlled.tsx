import { useState } from 'react'
import MultiValueInput from '@/components/ui/MultiValueInput'

const Controlled = () => {
    const [tags, setTags] = useState<string[]>(['JavaScript', 'CSS'])

    return (
        <div className="max-w-md mx-auto">
            <MultiValueInput
                value={tags}
                onChange={setTags}
                placeholder="Add skills..."
            />
            <p className="mt-4 text-sm text-gray-500">
                Current tags: {tags.join(', ') || 'None'}
            </p>
        </div>
    )
}

export default Controlled
