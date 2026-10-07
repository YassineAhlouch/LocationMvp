import { SvgProps } from '@/@types/common'

const Scroll = ({ height = 100, width = 100, ...rest }: SvgProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 456"
            width={width}
            height={height}
            fill="none"
            {...rest}
        >
            <path
                d="M22 91H742"
                stroke="url(#paint0_linear_29_1197)"
                strokeWidth="3"
            />
            <path
                d="M25 356H745"
                stroke="url(#paint1_linear_29_1197)"
                strokeWidth="3"
            />
            <path
                d="M601 10L601 450.597"
                stroke="url(#paint2_linear_29_1197)"
                strokeWidth="3"
            />
            <path
                d="M180 15L180 455.597"
                stroke="url(#paint3_linear_29_1197)"
                strokeWidth="3"
            />
            <rect
                x="231.5"
                y="128.5"
                width="317"
                height="192"
                rx="11.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <rect
                x="530"
                y="135"
                width="9"
                height="177"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="532"
                y="195"
                width="5"
                height="99"
                rx="2.5"
                className="fill-primary"
            />
            <rect
                x="244"
                y="310"
                width="8.99999"
                height="273"
                rx="4"
                transform="rotate(-90 244 310)"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="337"
                y="308"
                width="5"
                height="152"
                rx="2.5"
                transform="rotate(-90 337 308)"
                className="fill-primary"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_29_1197"
                    x1="22"
                    y1="87.5"
                    x2="742"
                    y2="87.5"
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
                    id="paint1_linear_29_1197"
                    x1="25"
                    y1="356.5"
                    x2="745"
                    y2="356.5"
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
                    id="paint2_linear_29_1197"
                    x1="600.5"
                    y1="10"
                    x2="600.5"
                    y2="450.597"
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
                    id="paint3_linear_29_1197"
                    x1="179.5"
                    y1="15"
                    x2="179.5"
                    y2="455.597"
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

export default Scroll
