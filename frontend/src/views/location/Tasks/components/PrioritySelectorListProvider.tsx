import { useMemo } from 'react'
import { priorityMap } from '../utils'
import type { ReactNode } from 'react'

const PrioritySelectorListProvider = ({
    children,
}: {
    children: (
        list: Array<{
            value: string
            label: string
            indicator: string | ReactNode
        }>,
    ) => ReactNode
}) => {
    const priorityList = useMemo(() => {
        return Object.entries(priorityMap).map(([key, value]) => ({
            label: key,
            value: key,
            indicator: value.icon,
        }))
    }, [])

    return children(priorityList)
}

export default PrioritySelectorListProvider
