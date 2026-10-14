import { useEffect, useRef, useState } from 'react'
import { useTabs } from './context'
import { useConfig } from '../ConfigProvider'
import classNames from '../utils/classNames'
import useMergedRef from '../hooks/useMergeRef'
import type { CommonProps } from '../@types/common'
import type { Ref } from 'react'

export type TabListProps = CommonProps & {
    ref?: Ref<HTMLDivElement>
}

const TabList = (props: TabListProps) => {
    const { className, children, ref = null, ...rest } = props
    const { value, variant } = useTabs()
    const { direction } = useConfig()

    const tabListRef = useRef<HTMLDivElement | null>(null)

    const indicattorTransition = useRef<string | undefined>(undefined)
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

    useEffect(() => {
        if (tabListRef.current) {
            const activeTab = tabListRef.current.querySelector(
                `[data-value="${value}"]`,
            )
            if (activeTab) {
                // `offsetLeft`/`offsetWidth` are physical (measured from the
                // container's left edge) regardless of writing direction, so
                // the same math works for both LTR and RTL. `direction` is kept
                // in the dependency list so the indicator is re-measured when
                // the layout flips.
                const { offsetLeft, offsetWidth } = activeTab as HTMLElement

                setIndicatorStyle({ left: offsetLeft, width: offsetWidth })
                if (!indicattorTransition.current) {
                    indicattorTransition.current = 'tab-indicator-transition'
                }
            }
        }
    }, [value, direction])

    const tabListClass = classNames(
        'tab-list',
        `tab-list-${variant}`,
        className,
    )

    return (
        <div
            ref={useMergedRef(ref, tabListRef)}
            role="tablist"
            className={tabListClass}
            {...rest}
        >
            {children}
            <div
                className={classNames(
                    'tab-indicator',
                    variant,

                    indicattorTransition.current,
                )}
                style={{
                    transform: `translateX(${indicatorStyle.left}px)`,
                    width: `${indicatorStyle.width}px`,
                }}
            />
        </div>
    )
}

export default TabList
