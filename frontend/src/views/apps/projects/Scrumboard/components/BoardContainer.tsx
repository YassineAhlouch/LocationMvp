import { useDndContext } from '@dnd-kit/core'
import classNames from '@/utils/classNames'
import type { ComponentProps } from 'react'

type BoardContainerProps = ComponentProps<'div'>

const BoardContainer = ({ children }: BoardContainerProps) => {
    const dndContext = useDndContext()

    return (
        <div className="p-4 h-full">
            <div
                className={classNames(
                    'px-2 py-1 md:px-0 flex pb-4 h-full overflow-x-auto',
                    dndContext.active ? 'snap-none' : 'snap-x snap-mandatory',
                )}
            >
                <div className=" flex gap-4 flex-row h-full">{children}</div>
            </div>
        </div>
    )
}

export default BoardContainer
