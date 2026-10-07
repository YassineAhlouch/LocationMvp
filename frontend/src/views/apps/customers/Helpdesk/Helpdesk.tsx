import HelpdeskWorkSpace from './components/HelpdeskWorkSpace'
import HelpdeskTicketPanel from './components/HelpdeskTicketPanel'
import classNames from '@/utils/classNames'
import { useThemeStore } from '@/store/themeStore'
import {
    LAYOUT_INSET_SHELL,
    LAYOUT_STACKED_SIDE,
    LAYOUT_SEAMLESS_SIDE,
} from '@/constants/theme.constant'

const Helpdesk = () => {
    const layout = useThemeStore((state) => state.layout)

    return (
        <div
            className={classNames(
                'h-full overflow-hidden',
                [
                    LAYOUT_INSET_SHELL,
                    LAYOUT_STACKED_SIDE,
                    LAYOUT_SEAMLESS_SIDE,
                ].includes(layout.type) &&
                    'border-t border-gray-200 dark:border-gray-800',
            )}
        >
            <div className="pt-px h-full absolute inset-0 flex min-w-0 overflow-hidden">
                <HelpdeskTicketPanel />
                <HelpdeskWorkSpace />
            </div>
        </div>
    )
}

export default Helpdesk
