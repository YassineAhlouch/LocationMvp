import ActivityContext from './components/ActivityContext'
import FilterPanel from './components/FilterPanel'
import ContentZone from './components/ContentZone'
import classNames from '@/components/ui/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import { useThemeStore } from '@/store/themeStore'
import {
    LAYOUT_INSET_SHELL,
    LAYOUT_STACKED_SIDE,
    LAYOUT_SEAMLESS_SIDE,
} from '@/constants/theme.constant'

const Activity = () => {
    const { larger } = useResponsive()

    const layout = useThemeStore((state) => state.layout)

    return (
        <ActivityContext>
            <div
                className={classNames(
                    'h-full',
                    [
                        LAYOUT_INSET_SHELL,
                        LAYOUT_STACKED_SIDE,
                        LAYOUT_SEAMLESS_SIDE,
                    ].includes(layout.type) &&
                        'border-t border-gray-200 dark:border-gray-800',
                )}
            >
                <div className="flex flex-auto h-full">
                    {larger.xl && (
                        <div className="relative flex-1 xl:max-w-[280px] ltr:border-r rtl:border-l border-gray-200 dark:border-gray-800">
                            <FilterPanel />
                        </div>
                    )}
                    <ContentZone />
                </div>
            </div>
        </ActivityContext>
    )
}

export default Activity
