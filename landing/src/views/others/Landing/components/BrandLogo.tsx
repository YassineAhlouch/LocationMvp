import { TbCarSuv } from 'react-icons/tb'
import classNames from '@/utils/classNames'

const BrandLogo = ({
    className,
    iconSize = 22,
    textClassName,
}: {
    className?: string
    iconSize?: number
    textClassName?: string
}) => (
    <span
        className={classNames(
            'inline-flex items-center gap-2 text-gray-900 dark:text-white',
            className,
        )}
    >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <TbCarSuv size={iconSize} />
        </span>
        <span
            className={classNames(
                'text-lg font-semibold tracking-tight',
                textClassName,
            )}
        >
            Double V Drive
        </span>
    </span>
)

export default BrandLogo
