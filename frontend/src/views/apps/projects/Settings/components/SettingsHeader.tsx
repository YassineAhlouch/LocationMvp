import ToggleDrawer from '@/components/shared/ToggleDrawer'
import SettingsMenu from './SettingsMenu'
import useResponsive from '@/utils/hooks/useResponsive'
import type { ReactNode } from 'react'

type SettingsHeaderProps = {
    title: string
    description: string
    children?: ReactNode
}

const SettingsHeader = ({
    title,
    description,
    children,
}: SettingsHeaderProps) => {
    const { larger } = useResponsive()

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
                {!larger.lg && (
                    <ToggleDrawer title="Settings" placement="left">
                        <SettingsMenu />
                    </ToggleDrawer>
                )}
                <div>
                    <h4>{title}</h4>
                    <p className="hidden sm:block">{description}</p>
                </div>
            </div>
            {children && (
                <div className="flex items-center gap-2">{children}</div>
            )}
        </div>
    )
}

export default SettingsHeader
