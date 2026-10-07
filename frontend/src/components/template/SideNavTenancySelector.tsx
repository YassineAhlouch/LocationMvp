import TenancySelector from './TenancySelector'
import { useThemeStore } from '@/store/themeStore'

const SideNavTenancySelector = () => {
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    return (
        <TenancySelector
            className="bg-white dark:bg-white/10"
            collapsed={sideNavCollapse}
            placement="bottom-start"
        />
    )
}

export default SideNavTenancySelector
