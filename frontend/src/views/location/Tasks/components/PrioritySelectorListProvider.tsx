import { useMemo } from 'react'
import { priorityMap } from '../utils'
import useTranslation from '@/utils/hooks/useTranslation'
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
    const { t } = useTranslation()

    const priorityList = useMemo(() => {
        return Object.entries(priorityMap).map(([key, value]) => ({
            label: t(`tasks.priority.${key.toLowerCase()}`, key),
            value: key,
            indicator: value.icon,
        }))
    }, [t])

    return children(priorityList)
}

export default PrioritySelectorListProvider
