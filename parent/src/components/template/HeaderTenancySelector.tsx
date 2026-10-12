import TenancySelector from './TenancySelector'
import { useThemeStore } from '@/store/themeStore'

const HeaderTenancySelector = ({ className }: { className?: string }) => {
    const direction = useThemeStore((state) => state.direction)

    const placement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

    return <TenancySelector placement={placement} className={className} />
}

export default HeaderTenancySelector
