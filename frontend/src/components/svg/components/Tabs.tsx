import { SvgProps } from '@/@types/common'

const Tabs = ({ height = 100, width = 100, ...rest }: SvgProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 452"
            width={width}
            height={height}
            fill="none"
            {...rest}
        >
            <path
                d="M73 148H713"
                stroke="url(#paint0_linear_29_1052)"
                strokeWidth="3"
            />
            <path
                d="M82 293H713"
                stroke="url(#paint1_linear_29_1052)"
                strokeWidth="3"
            />
            <path
                d="M600.187 84L600.186 366"
                stroke="url(#paint2_linear_29_1052)"
                strokeWidth="3"
            />
            <path
                d="M169.187 84L169.186 366"
                stroke="url(#paint3_linear_29_1052)"
                strokeWidth="3"
            />
            <rect
                x="221"
                y="242.771"
                width="345"
                height="4.41897"
                rx="2"
                className="fill-gray-200 dark:fill-gray-700"
            />
            <rect
                x="221"
                y="242.771"
                width="114.653"
                height="4.41897"
                rx="2"
                className="fill-primary"
            />
            <rect
                x="247.057"
                y="203"
                width="57.3263"
                height="22.0949"
                rx="4"
                className="fill-primary"
            />
            <rect
                x="359.625"
                y="203"
                width="57.3263"
                height="22.0949"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="474.278"
                y="203"
                width="57.3263"
                height="22.0949"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_29_1052"
                    x1="73"
                    y1="148.5"
                    x2="713"
                    y2="148.5"
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
                    id="paint1_linear_29_1052"
                    x1="82"
                    y1="293.5"
                    x2="713"
                    y2="293.5"
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
                    id="paint2_linear_29_1052"
                    x1="600.5"
                    y1="84.2882"
                    x2="600.5"
                    y2="365.998"
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
                    id="paint3_linear_29_1052"
                    x1="169.5"
                    y1="84.2882"
                    x2="169.5"
                    y2="365.998"
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

export default Tabs
