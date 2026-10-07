import { useState } from 'react'
import Button from '@/components/ui/Button'
import { LiEye, LiEyeSlash } from '@/icons'

type PreviewToggleProps = {
    onToggle: (isVisible: boolean) => void
    initialVisible?: boolean
    className?: string
}

const PreviewToggle = ({
    onToggle,
    initialVisible = true,
    className,
}: PreviewToggleProps) => {
    const [isVisible, setIsVisible] = useState(initialVisible)

    const handleToggle = () => {
        const newVisible = !isVisible
        setIsVisible(newVisible)
        onToggle(newVisible)
    }

    return (
        <Button
            variant="subtle"
            onClick={handleToggle}
            className={className}
            aria-label={
                isVisible ? 'Hide invoice preview' : 'Show invoice preview'
            }
            aria-pressed={isVisible}
            icon={
                isVisible ? (
                    <LiEyeSlash className="text-base" />
                ) : (
                    <LiEye className="text-base" />
                )
            }
        >
            {isVisible ? 'Hide Preview' : 'Show Preview'}
        </Button>
    )
}

export default PreviewToggle
