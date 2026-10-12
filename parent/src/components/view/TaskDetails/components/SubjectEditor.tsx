import { useState, useRef } from 'react'
import classNames from '@/utils/classNames'
import { LuCheck, LuX } from 'react-icons/lu'
import sleep from '@/utils/sleep'
import type { ComponentProps } from 'react'

type SubjectEditorProps = ComponentProps<'div'> & {
    value: string
    onValueChange: (value: string) => void
}

const SubjectEditor = ({
    className,
    value,
    onValueChange,
}: SubjectEditorProps) => {
    const [editing, setEditing] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleEdit = async () => {
        setEditing(true)
        await sleep(10)
        inputRef.current?.focus()
    }

    const handleChange = () => {
        if (inputRef.current) {
            onValueChange(inputRef.current.value)
            setEditing(false)
            inputRef.current.blur()
        }
    }

    const handleClose = () => {
        setEditing(false)
        inputRef.current?.blur()
    }

    return (
        <>
            {editing ? (
                <span
                    className={classNames(
                        'flex items-center justify-between',
                        className,
                    )}
                >
                    <input
                        ref={inputRef}
                        defaultValue={value}
                        className="h-full w-full outline-0 min-h-[21px] leading-normal"
                        onBlur={handleClose}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.stopPropagation()
                                handleChange()
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            inputRef.current?.focus()
                        }}
                    />
                    <span className="flex gap-2">
                        <button type="button" onMouseDown={handleChange}>
                            <LuCheck className="heading-text hover:text-success" />
                        </button>
                        <button
                            type="button"
                            onMouseDown={handleClose}
                            className="heading-text  hover:text-error"
                        >
                            <LuX />
                        </button>
                    </span>
                </span>
            ) : (
                <span
                    onClick={handleEdit}
                    className={classNames('cursor-pointer', className)}
                >
                    {value}
                </span>
            )}
        </>
    )
}

export default SubjectEditor
