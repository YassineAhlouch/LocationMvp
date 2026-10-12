import LayoutBase from '@/components/template/LayoutBase'
import StackedSideNav from '@/components/template/StackedSideNav'
import ContentFrame from '@/components/template/ContentFrame'
import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import Search from '@/components/template/Search'
import LanguageSelector from '@/components/template/LanguageSelector'
import Notification from '@/components/template/Notification'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import SidePanel from '@/components/template/SidePanel'
import { LAYOUT_STACKED_SIDE } from '@/constants/theme.constant'
import classNames from '@/utils/classNames'
import useScrollTop from '@/utils/hooks/useScrollTop'

import type { CommonProps } from '@/@types/common'

const StackedSide = ({ children }: CommonProps) => {
    const { isSticky } = useScrollTop()

    return (
        <LayoutBase
            type={LAYOUT_STACKED_SIDE}
            className="app-layout-stacked-side flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                <StackedSideNav />
                <ContentFrame>
                    <Header
                        className={classNames(
                            'dark:bg-gray-900',
                            isSticky && 'shadow-sm rounded-none!',
                        )}
                        headerStart={[
                            { component: MobileNav },
                            { component: Search },
                        ]}
                        headerEnd={[
                            { component: LanguageSelector },
                            { component: Notification },
                            { component: SidePanel },
                            { component: UserProfileDropdown },
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

export default StackedSide
