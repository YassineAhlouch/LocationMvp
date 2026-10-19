import classNames from 'classnames'
import type { CommonProps } from '../../@types/common'

export interface HeaderProps extends CommonProps {
    hasNext: boolean
    hasPrevious: boolean
    onNext?: () => void
    onPrevious?: () => void
    onNextLevel?: () => void
    label?: string
    nextLevelDisabled?: boolean
    nextLabel?: string
    previousLabel?: string
    preventLevelFocus?: boolean
    preventFocus?: boolean
}

const ChevronRight = (props: CommonProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        aria-hidden="true"
        viewBox="0 0 20 20"
        {...props}
    >
        <path
            fillRule="evenodd"
            stroke="none"
            d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z"
            clipRule="evenodd"
        />
    </svg>
)

const ChevronLeft = (props: CommonProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        aria-hidden="true"
        viewBox="0 0 20 20"
        {...props}
    >
        <path
            fillRule="evenodd"
            stroke="none"
            d="M12.707 5.293a1 1 0 0 1 0 1.414L9.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"
            clipRule="evenodd"
        />
    </svg>
)

const Header = (props: HeaderProps) => {
    const {
        hasNext,
        hasPrevious,
        onNext,
        onPrevious,
        onNextLevel,
        label,
        nextLevelDisabled,
        nextLabel,
        previousLabel,
        preventLevelFocus = false,
        preventFocus,
        children,
        className,
        ...rest
    } = props

    const headerLabel = (
        <button
            className="picker-header-label"
            disabled={nextLevelDisabled}
            tabIndex={preventLevelFocus ? -1 : 0}
            type="button"
            onClick={onNextLevel}
            onMouseDown={(event) => preventFocus && event.preventDefault()}
        >
            {label}
        </button>
    )

    const renderChildren = children ? children : headerLabel

    return (
        <div className={classNames('picker-header', className)} {...rest}>
            <div
                className={
                    'flex justify-between w-full items-center rtl:flex-row-reverse'
                }
            >
                <button
                    type="button"
                    className={classNames(
                        'picker-direction-button',
                        !hasPrevious && 'opacity-0 cursor-default',
                    )}
                    disabled={!hasPrevious}
                    aria-label={previousLabel}
                    onClick={onPrevious}
                    onMouseDown={(event) =>
                        preventFocus && event.preventDefault()
                    }
                >
                    <ChevronLeft />
                </button>
                {renderChildren}
                <button
                    type="button"
                    className={classNames(
                        'picker-direction-button',
                        !hasNext && 'opacity-0 cursor-default',
                    )}
                    disabled={!hasNext}
                    aria-label={nextLabel}
                    onClick={onNext}
                    onMouseDown={(event) =>
                        preventFocus && event.preventDefault()
                    }
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    )
}

export default Header
