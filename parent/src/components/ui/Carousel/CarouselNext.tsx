import Button from '../Button'
import { ChevronRight } from '../Icons'
import classNames from '../utils/classNames'
import { useCarousel } from './context'
import type { ComponentPropsWithoutRef } from 'react'

export type CarouselNextProps = Omit<
    ComponentPropsWithoutRef<typeof Button>,
    'icon' | 'shape' | 'aria-label'
>

const CarouselNext = (props: CarouselNextProps) => {
    const { className, variant = 'default', size = 'sm', ...rest } = props
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    const buttonClass = classNames(
        orientation === 'vertical' && 'rotate-90',
        className,
    )

    return (
        <Button
            variant={variant}
            size={size}
            className={buttonClass}
            disabled={!canScrollNext}
            onClick={scrollNext}
            shape="circle"
            aria-label="Next slide"
            icon={<ChevronRight />}
            {...rest}
        />
    )
}

export default CarouselNext
