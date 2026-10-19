import classNames from '@/utils/classNames'

const BrandLogo = ({
    className,
    imgClassName,
}: {
    className?: string
    imgClassName?: string
}) => (
    <span className={classNames('inline-flex items-center', className)}>
        <img
            src="/img/logo/logo-light-full.svg"
            alt="Double V Drive"
            className={classNames('h-8 w-auto dark:hidden', imgClassName)}
        />
        <img
            src="/img/logo/logo-dark-full.svg"
            alt="Double V Drive"
            className={classNames('hidden h-8 w-auto dark:block', imgClassName)}
        />
    </span>
)

export default BrandLogo
