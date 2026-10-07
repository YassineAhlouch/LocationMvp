import classNames from '@/utils/classNames'
import type { ComponentProps } from 'react'

type SectionContainerProps = ComponentProps<'div'> & {
    show: boolean
}

const SectionContainer = ({ show, children }: SectionContainerProps) => {
    return <div className={classNames(!show && 'hidden')}>{children}</div>
}

export default SectionContainer
