import HorizontalMenuContent from './HorizontalMenuContent'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import appConfig from '@/configs/app.config'
import navigationConfig from '@/configs/navigation.config'

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
