import { Fragment } from 'react'
import classNames from '@/utils/classNames'
import {
    HEADER_HEIGHT,
    HEADER_EXTENDED_HEIGHT,
} from '@/constants/theme.constant'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import type { ReactNode, JSX } from 'react'
import type { CommonProps } from '@/@types/common'

type HeaderContent = {
    component: ((props: Record<string, unknown>) => JSX.Element) | ReactNode
}

type HeaderContents = Array<HeaderContent>

interface HeaderProps extends CommonProps {
    headerStart?: HeaderContents
    headerEnd?: HeaderContents
    headerBottom?: HeaderContents
    headerMiddle?: ReactNode
    extended?: ReactNode
    container?: boolean
    wrapperClass?: string
    sticky?: boolean
}

const Header = (props: HeaderProps) => {
    const {
        headerStart = [],
        headerEnd = [],
        headerMiddle,
        className,
        container,
        wrapperClass,
        extended,
        sticky = true,
    } = props

    const headerActionClass = 'flex items-center gap-2'

    const renderContent = (item: HeaderContent, index: number) => {
        if (typeof item.component === 'function') {
            const Component = withHeaderItem(item.component)

            return <Component key={`header-start-${index}`} />
        }

        return (
            <Fragment key={`header-start-${index}`}>{item.component}</Fragment>
        )
    }

    return (
        <header
            className={classNames(
                'header',
                sticky && 'sticky top-0',
                className,
            )}
        >
            <div
                className={classNames(
                    'header-wrapper',
                    container && 'container mx-auto',
                    wrapperClass,
                )}
                style={{ height: HEADER_HEIGHT }}
            >
                <div
                    className={classNames(
                        'header-action-start',
                        headerActionClass,
                    )}
                >
                    {headerStart.map(renderContent)}
                </div>
                {headerMiddle && (
                    <div
                        className={classNames(
                            'header-action-middle',
                            headerActionClass,
                        )}
                    >
                        {headerMiddle}
                    </div>
                )}
                <div
                    className={classNames(
                        'header-action-end',
                        headerActionClass,
                    )}
                >
                    {headerEnd.map(renderContent)}
                </div>
            </div>
            {extended && (
                <div
                    className={classNames(
                        'header-extended-wrapper',
                        container && 'container mx-auto',
                    )}
                >
                    <div
                        className="flex items-center justify-between gap-2 w-full"
                        style={{ height: HEADER_EXTENDED_HEIGHT }}
                    >
                        {extended}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
