import { CommonProps } from '@/@types/common'
import LayoutBase from '@/components//template/LayoutBase'
import Header from '@/components/template/Header'
import SidePanel from '@/components//template/SidePanel'
import ContentFrame from '@/components/template/ContentFrame'
import SideNav from '@/components/template/SideNav'
import SideNavLogo from '@/components/template/SideNavLogo'
import MobileNav from '@/components/template/MobileNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import Search from '@/components/template/Search'
import Notification from '@/components/template/Notification'
import LanguageSelector from '@/components/template/LanguageSelector'
import SideNavProfileMenu from '@/components/template/SideNavProfileMenu'
import { LAYOUT_INSET_SHELL } from '@/constants/theme.constant'
import classNames from '@/utils/classNames'
import useScrollTop from '@/utils/hooks/useScrollTop'

const InsetShell = ({ children }: CommonProps) => {
    const { isSticky } = useScrollTop()

    return (
        <LayoutBase
            adaptiveCardActive
            type={LAYOUT_INSET_SHELL}
            className="app-layout-inset-shell flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                <SideNav
                    background={false}
                    menuVariant="subtle"
                    headerContent={<SideNavLogo />}
                    footerContent={<SideNavProfileMenu />}
                />
                <ContentFrame withGap={true}>
                    <Header
                        className={classNames(
                            'rounded-t-2xl dark:bg-gray-900',
                            isSticky && 'shadow-sm rounded-none!',
                        )}
                        headerStart={[
                            {
                                component: MobileNav,
                            },
                            {
                                component: SideNavToggle,
                            },
                            {
                                component: Search,
                            },
                        ]}
                        headerEnd={[
                            {
                                component: Notification,
                            },
                            {
                                component: LanguageSelector,
                            },
                            {
                                component: SidePanel,
                            },
                        ]}
                    />
                    <div className="h-full flex flex-auto flex-col">
                        {children}
                    </div>
                </ContentFrame>
            </div>
        </LayoutBase>
    )
}

export default InsetShell
