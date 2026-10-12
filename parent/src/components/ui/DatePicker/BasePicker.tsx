import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Input } from '../Input'
import useMergedRef from '../hooks/useMergeRef'
import CloseButton from '../CloseButton'
import { motion, AnimatePresence } from 'motion/react'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type {
    ReactNode,
    FocusEvent,
    HTMLInputTypeAttribute,
    KeyboardEvent,
    MouseEvent,
    ChangeEvent,
    Ref,
} from 'react'
import {
    useFloating,
    useInteractions,
    useDismiss,
    useRole,
    useFocus,
    useClick,
    useId,
    autoUpdate,
    offset,
    flip,
    shift,
} from '@floating-ui/react'

dayjs.extend(localizedFormat)

export interface BasePickerSharedProps {
    clearable?: boolean
    clearButton?: string | ReactNode
    disabled?: boolean
    inputtable?: boolean
    inputPrefix?: string | ReactNode
    inputSuffix?: string | ReactNode
    name?: string
    onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void
    onDropdownOpen?: () => void
    onDropdownClose?: () => void
    onFocus?: (event: FocusEvent<HTMLInputElement, Element>) => void
    placeholder?: string
    size?: TypeAttributes.ControlSize
    type?: HTMLInputTypeAttribute
}

interface BasePickerProps extends CommonProps, BasePickerSharedProps {
    dropdownOpened: boolean
    inputtableBlurClose?: boolean
    inputLabel?: string
    lockView?: boolean
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    onClear?: (event: MouseEvent<HTMLElement>) => void
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    setDropdownOpened: (opened: boolean) => void
    ref?: Ref<HTMLInputElement>
}

const CalendarIcon = (props: CommonProps) => (
    <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"></path>
        <path d="M16 3v4"></path>
        <path d="M8 3v4"></path>
        <path d="M4 11h16"></path>
        <path d="M11 15h1"></path>
        <path d="M12 15v3"></path>
    </svg>
)

const BasePicker = (props: BasePickerProps) => {
    const {
        className,
        clearable = true,
        clearButton,
        children,
        disabled,
        dropdownOpened,
        inputtable,
        inputtableBlurClose = false,
        inputLabel,
        inputPrefix,
        inputSuffix = <CalendarIcon className="text-lg" />,
        name,
        onDropdownOpen,
        onDropdownClose,
        onBlur,
        onFocus,
        onChange,
        onKeyDown,
        onClear,
        placeholder,
        ref = null,
        setDropdownOpened,
        size,
        type,
    } = props

    const handleInputClick = () => {
        if (inputtable) {
            openDropdown()
        } else {
            toggleDropdown(!dropdownOpened)
        }
    }

    const closeDropdown = () => {
        setDropdownOpened(false)
        onDropdownClose?.()
    }

    const suffixIconSlot = clearable ? (
        clearButton ? (
            <div role="presentation" onClick={onClear}>
                {clearButton}
            </div>
        ) : (
            <CloseButton className="text-base" onClick={onClear} />
        )
    ) : inputSuffix ? (
        <>{inputSuffix}</>
    ) : null

    const toggleDropdown = (open: boolean) => {
        setDropdownOpened(open)
        if (open) {
            onDropdownOpen?.()
        } else {
            onDropdownClose?.()
        }
    }

    const openDropdown = () => {
        setDropdownOpened(true)
        onDropdownOpen?.()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (typeof onKeyDown === 'function') {
            onKeyDown(event)
        }
        if ((event.key === 'Space' || event.key === 'Enter') && !inputtable) {
            event.preventDefault()
            openDropdown()
        }
    }

    const handleInputBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
        onBlur?.(event)
        if (inputtable && inputtableBlurClose) {
            closeDropdown()
        }
    }

    const handleInputFocus = (event: FocusEvent<HTMLInputElement, Element>) => {
        onFocus?.(event)
    }

    const { refs, floatingStyles, x, y, strategy, context } = useFloating({
        open: dropdownOpened,
        onOpenChange: toggleDropdown,
        placement: 'bottom-start',
        middleware: [
            offset(10),
            flip({
                fallbackAxisSideDirection: 'start',
            }),
            shift(),
        ],
        whileElementsMounted: autoUpdate,
    })

    const focus = useFocus(context)
    const click = useClick(context)
    const dismiss = useDismiss(context)
    const role = useRole(context)

    const { getReferenceProps, getFloatingProps } = useInteractions([
        inputtable ? focus : click,
        dismiss,
        role,
    ])

    const headingId = useId()

    return (
        <>
            <Input
                ref={useMergedRef(ref, refs.setReference)}
                className={className}
                placeholder={placeholder}
                size={size}
                name={name}
                value={inputLabel}
                readOnly={!inputtable}
                suffix={suffixIconSlot}
                prefix={inputPrefix}
                autoComplete="off"
                type={type}
                disabled={disabled}
                asElement={'input'}
                onKeyDown={handleKeyDown}
                onClick={handleInputClick}
                onChange={onChange}
                {...getReferenceProps({
                    onBlur: handleInputBlur,
                    onFocus: handleInputFocus,
                })}
            />
            <AnimatePresence>
                {dropdownOpened && (
                    <motion.div
                        ref={refs.setFloating}
                        className="picker"
                        style={floatingStyles}
                        aria-labelledby={headingId}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ ease: 'easeOut', duration: 0.1 }}
                        {...getFloatingProps({
                            style: {
                                position: strategy,
                                top: y ?? 0,
                                left: x ?? 0,
                            },
                        })}
                    >
                        <div className="picker-panel">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default BasePicker
