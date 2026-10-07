import { useState, useMemo, useCallback, memo } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import classNames from '@/utils/classNames'
import useDebounce from '@/utils/hooks/useDebounce'
import { LiChevronLeft, LiSearch } from '@/icons'
import { Link } from 'react-router'
import * as LinearIconsLib from '@/icons'
import { allIcons } from '@/icons/metadata'
import type { IconProps } from '@/icons/types'

type IconComponent = (props: IconProps) => React.ReactElement

const IconCell = memo(
    ({
        iconName,
        className,
        onCopy,
    }: {
        iconName: string
        displayName: string
        className?: string
        onCopy: (name: string) => void
    }) => {
        const IconComp = (
            LinearIconsLib as unknown as Record<string, IconComponent>
        )[iconName]
        if (!IconComp || typeof IconComp !== 'function') return null

        return (
            <div
                className={classNames(
                    'aspect-square flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer',
                    className,
                )}
                onClick={() => onCopy(iconName)}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="heading-text text-2xl">
                        <IconComp />
                    </span>
                    <div className="mt-2 text-xs hidden md:block">
                        {iconName}
                    </div>
                </div>
            </div>
        )
    },
)

const CategorySection = memo(
    ({
        category,
        icons,
        onCopy,
    }: {
        category: string
        icons: typeof allIcons
        onCopy: (name: string) => void
    }) => {
        return (
            <div>
                <div className="px-2 py-4">
                    <h6 className="capitalize">
                        {category} ({icons.length})
                    </h6>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 divide-x divide-y divide-gray-200 dark:divide-gray-700 -mb-1 ltr:-mr-1 rtl:-ml-1">
                        {icons.map((icon, index) => (
                            <IconCell
                                key={icon.name}
                                iconName={icon.name}
                                displayName={icon.displayName}
                                onCopy={onCopy}
                                className={
                                    index === icons.length - 1
                                        ? 'ltr:border-r rtl:border-l border-b border-gray-200 dark:border-gray-700'
                                        : ''
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    },
)

const LinearIcons = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')

    const debouncedSearch = useDebounce(
        (query: string) => setDebouncedQuery(query),
        300,
    )

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setSearchQuery(value)
            debouncedSearch(value)
        },
        [debouncedSearch],
    )

    const categories = useMemo(() => {
        const cats: Record<string, typeof allIcons> = {}
        allIcons.forEach((icon) => {
            if (!cats[icon.category]) {
                cats[icon.category] = []
            }
            cats[icon.category].push(icon)
        })
        return cats
    }, [])

    const filteredCategories = useMemo(() => {
        if (!debouncedQuery.trim()) return categories

        const query = debouncedQuery.toLowerCase()
        const filtered: Record<string, typeof allIcons> = {}

        Object.entries(categories).forEach(([category, icons]) => {
            const matchingIcons = icons.filter(
                (icon) =>
                    icon.name.toLowerCase().includes(query) ||
                    icon.displayName.toLowerCase().includes(query) ||
                    icon.keywords.some((k) => k.toLowerCase().includes(query)),
            )
            if (matchingIcons.length > 0) {
                filtered[category] = matchingIcons
            }
        })

        return filtered
    }, [categories, debouncedQuery])

    const handleCopyIcon = useCallback((iconName: string) => {
        const importStatement = `import { ${iconName} } from '@/icons'`
        navigator.clipboard.writeText(importStatement)
        toast.push(
            <Notification type="success" title="Copied!">
                {importStatement}
            </Notification>,
            { placement: 'top-end' },
        )
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        asElement={Link}
                        to="/ui-components/icons"
                        variant="subtle"
                        size="sm"
                        icon={<LiChevronLeft />}
                    />
                    <h4>Linear Icons Gallery</h4>
                </div>
                <div className="w-full sm:w-72">
                    <Input
                        placeholder="Search icons..."
                        prefix={<LiSearch className="text-base" />}
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(filteredCategories).map(([category, icons]) => (
                    <CategorySection
                        key={category}
                        category={category}
                        icons={icons}
                        onCopy={handleCopyIcon}
                    />
                ))}
            </div>

            {Object.keys(filteredCategories).length === 0 && (
                <div className="text-center py-12">
                    <p className="heading-text">No icons found</p>
                    <p className="mt-1">Try a different search term</p>
                </div>
            )}
        </div>
    )
}

export default LinearIcons
