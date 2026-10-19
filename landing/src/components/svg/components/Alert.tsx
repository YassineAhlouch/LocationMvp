import { SvgProps } from '@/@types/common'

const Alert = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M20 135L779 135"
                stroke="url(#paint0_linear_4_256)"
                strokeWidth="3"
            />
            <path
                d="M20 311L779 315"
                stroke="url(#paint1_linear_4_256)"
                strokeWidth="3"
            />
            <path
                d="M698 38L698 410"
                stroke="url(#paint2_linear_4_256)"
                strokeWidth="3"
            />
            <path
                d="M103 39L103 411"
                stroke="url(#paint3_linear_4_256)"
                strokeWidth="3"
            />
            <rect
                x="141.5"
                y="166.5"
                width="517"
                height="123"
                rx="18.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <circle cx="206.5" cy="226.5" r="26.5" className="fill-primary" />
            <rect
                x="259"
                y="211"
                width="320"
                height="30"
                rx="8"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_4_256"
                    x1="20"
                    y1="135.5"
                    x2="779"
                    y2="135.5"
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
                    id="paint1_linear_4_256"
                    x1="19.9974"
                    y1="311.5"
                    x2="778.997"
                    y2="315.5"
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
                    id="paint2_linear_4_256"
                    x1="697.5"
                    y1="38"
                    x2="697.5"
                    y2="410"
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
                    id="paint3_linear_4_256"
                    x1="102.5"
                    y1="39"
                    x2="102.5"
                    y2="411"
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

export default Alert
