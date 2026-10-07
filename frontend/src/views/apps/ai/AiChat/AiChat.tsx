import ChatSideNav from './components/ChatSideNav'
import ChatView from './components/ChatView'
import ChatHistoryRenameDialog from './components/ChatHistoryRenameDialog'
import classNames from '@/components/ui/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import { useThemeStore } from '@/store/themeStore'
import {
    LAYOUT_INSET_SHELL,
    LAYOUT_STACKED_SIDE,
    LAYOUT_SEAMLESS_SIDE,
} from '@/constants/theme.constant'

const AiChat = () => {
    const { larger } = useResponsive()

    const layout = useThemeStore((state) => state.layout)

    return (
        <div
            className={classNames(
                'h-full',
                [
                    LAYOUT_INSET_SHELL,
                    LAYOUT_STACKED_SIDE,
                    LAYOUT_SEAMLESS_SIDE,
                ].includes(layout.type) &&
                    'border-t border-gray-200 dark:border-gray-800',
            )}
        >
            <div className="flex flex-auto gap-4 h-full">
                <ChatView />
                {larger.xl && <ChatSideNav />}
                <ChatHistoryRenameDialog />
            </div>
        </div>
    )
}

export default AiChat
