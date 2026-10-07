import SettingPanel from './components/SettingPanel'
import PreviewZone from './components/PreviewZone'
import classNames from '@/components/ui/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import { useThemeStore } from '@/store/themeStore'
import { LAYOUT_INSET_SHELL } from '@/constants/theme.constant'

const ImageGenerator = () => {
    const { larger } = useResponsive()

    const layout = useThemeStore((state) => state.layout)

    return (
        <div
            className={classNames(
                'h-full',
                [LAYOUT_INSET_SHELL].includes(layout.type) &&
                    'border-t border-gray-200 dark:border-gray-800',
            )}
        >
            <div className="flex flex-auto gap-4 h-full">
                {larger.lg && <SettingPanel />}
                <PreviewZone />
            </div>
        </div>
    )
}

export default ImageGenerator
