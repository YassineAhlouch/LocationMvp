import classNames from '@/utils/classNames'
import Scroll from '@/components/ui/Scroll'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    HEADER_HEIGHT,
    SIDE_NAV_FOOTER_HEIGHT,
} from '@/constants/theme.constant'
import type { ReactNode } from 'react'

type SideNavProps = {
    translationSetup?: boolean
    background?: boolean
    className?: string
    menuVariant?: 'default' | 'subtle'
    headerContent?: ReactNode
    footerContent?: ReactNode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    menuVariant,
    headerContent,
    footerContent,
}: SideNavProps) => {
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav hidden lg:flex',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <div
                className="side-nav-header flex flex-col justify-center"
                style={{ height: HEADER_HEIGHT }}
            >
                {headerContent}
            </div>
            <Scroll.FlexSize
                scrollbars="vertical"
                className={classNames('side-nav-content')}
                style={{
                    height: `calc(100vh - ${HEADER_HEIGHT}px - ${footerContent ? SIDE_NAV_FOOTER_HEIGHT : 0}px)`,
                }}
                dir={direction}
            >
                <VerticalMenuContent
                    collapsed={sideNavCollapse}
                    navigationTree={navigationConfig}
                    routeKey={currentRouteKey}
                    direction={direction}
                    translationSetup={translationSetup}
                    menuVariant={menuVariant}
                    userAuthority={userAuthority || []}
                />
            </Scroll.FlexSize>
            {footerContent && (
                <div
                    className="flex flex-col"
                    style={{ height: SIDE_NAV_FOOTER_HEIGHT }}
                >
                    {footerContent}
                </div>
            )}
        </div>
    )
}

export default SideNav
