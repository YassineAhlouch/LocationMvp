import { SvgProps } from '@/@types/common'

const Skeleton = ({ height = 100, width = 100, ...rest }: SvgProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 450"
            width={width}
            height={height}
            fill="none"
            {...rest}
        >
            <path
                d="M22 98H742"
                stroke="url(#paint0_linear_11_84)"
                strokeWidth="3"
            />
            <path
                d="M22 335H742"
                stroke="url(#paint1_linear_11_84)"
                strokeWidth="3"
            />
            <path
                d="M600.149 4.70148L600.149 445.298"
                stroke="url(#paint2_linear_11_84)"
                strokeWidth="3"
            />
            <path
                d="M169.224 4.70148L169.224 445.298"
                stroke="url(#paint3_linear_11_84)"
                strokeWidth="3"
            />
            <rect
                x="224"
                y="207"
                width="321"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="224"
                y="240"
                width="321"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="224"
                y="273"
                width="160"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <circle
                cx="244.5"
                cy="155.5"
                r="20.5"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_11_84"
                    x1="22"
                    y1="98.5"
                    x2="742"
                    y2="98.5"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                    <stop
                        offset="0.134615"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.519231"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.913462"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="1"
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_11_84"
                    x1="22"
                    y1="335.5"
                    x2="742"
                    y2="335.5"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                    <stop
                        offset="0.134615"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.519231"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.913462"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="1"
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_11_84"
                    x1="599.649"
                    y1="4.70148"
                    x2="599.649"
                    y2="445.298"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                    <stop
                        offset="0.134615"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.519231"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.913462"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="1"
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_11_84"
                    x1="168.724"
                    y1="4.70148"
                    x2="168.724"
                    y2="445.298"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                    <stop
                        offset="0.134615"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.519231"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="0.913462"
                        stopColor="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <stop
                        offset="1"
                        stopColor="currentColor"
                        className="text-white dark:text-gray-800"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default Skeleton
