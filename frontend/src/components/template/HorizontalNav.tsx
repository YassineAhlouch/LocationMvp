import HorizontalMenuContent from './HorizontalMenuContent'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import useNavigationConfig from '@/utils/hooks/useNavigationConfig'
import appConfig from '@/configs/app.config'

type HorizontalNavProps = {
    translationSetup?: boolean
    dropdownLean?: boolean
    className?: string
}

const HorizontalNav = ({
    translationSetup = appConfig.activeNavTranslation,
    dropdownLean,
    className,
}: HorizontalNavProps) => {
    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)
    const navigationConfig = useNavigationConfig()

    return (
        <HorizontalMenuContent
            className={className}
            dropdownLean={dropdownLean}
            navigationTree={navigationConfig}
            routeKey={currentRouteKey}
            userAuthority={userAuthority || []}
            translationSetup={translationSetup}
        />
    )
}

export default HorizontalNav
