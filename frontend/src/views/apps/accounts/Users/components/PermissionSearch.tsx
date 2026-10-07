import { useCallback } from 'react'
import { LiSearch } from '@/icons'
import Input from '@/components/ui/Input'
import classNames from '@/utils/classNames'

type PermissionSearchProps = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    loading?: boolean
}

const PermissionSearch = ({
    value,
    onChange,
    placeholder = 'Search permissions by name or description...',
    className,
    loading = false,
}: PermissionSearchProps) => {
    const handleClear = useCallback(() => {
        onChange('')
    }, [onChange])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClear()
            }
        },
        [handleClear],
    )

    return (
        <div className={classNames('flex items-center p-0.25', className)}>
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
                aria-label="Search permissions"
                role="searchbox"
                prefix={<LiSearch className="heading-text text-base" />}
            />
        </div>
    )
}

export default PermissionSearch
