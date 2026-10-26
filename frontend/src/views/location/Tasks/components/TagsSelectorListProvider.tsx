import { useMemo } from 'react'
import { tagsMap } from '../utils'
import type { ReactNode } from 'react'

const TagsSelectorListProvider = ({
    children,
}: {
    children: (list: Array<{ value: string; label: string }>) => ReactNode
}) => {
    const tagsList = useMemo(() => {
        return Object.entries(tagsMap).map(([key, value]) => ({
            label: key,
            value: key,
            color: value.color,
        }))
    }, [])

    return children(tagsList)
}

export default TagsSelectorListProvider
