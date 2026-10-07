import Container from '@/components/shared/Container'
import type { ComponentProps } from 'react'

type ProductFooterProps = ComponentProps<'div'> & {
    containerSize?: 'sm' | 'md' | 'lg'
}

const OrderFooter = ({ children, containerSize }: ProductFooterProps) => {
    return (
        <div className="bottom-0 left-0 right-0 z-10 mt-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 sticky">
            <Container size={containerSize}>{children}</Container>
        </div>
    )
}

export default OrderFooter
