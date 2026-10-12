import { useThemeStore } from '@/store/themeStore'
import NavToggle from '@/components/shared/NavToggle'
import classNames from '@/utils/classNames'

import type { CommonProps } from '@/@types/common'

const SideNavToggle = ({ className }: CommonProps) => {
    const { layout, setSideNavCollapse } = useThemeStore((state) => state)

    const sideNavCollapse = layout.sideNavCollapse

    const onCollapse = () => {
        setSideNavCollapse(!sideNavCollapse)
    }

    return (
        <div
            className={classNames('hidden lg:block', className)}
            role="button"
            onClick={onCollapse}
        >
            <NavToggle className="text-xl" toggled={sideNavCollapse} />
        </div>
    )
}

export default SideNavToggle
