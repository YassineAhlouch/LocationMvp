import { SvgProps } from '@/@types/common'

const Select = ({ height = 100, width = 100, ...rest }: SvgProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 455"
            width={width}
            height={height}
            fill="none"
            {...rest}
        >
            <path
                d="M114 110H675"
                stroke="url(#paint0_linear_25_749)"
                strokeWidth="3"
            />
            <path
                d="M114 369H675"
                stroke="url(#paint1_linear_25_749)"
                strokeWidth="3"
            />
            <path
                d="M559 0L559 455"
                stroke="url(#paint2_linear_25_749)"
                strokeWidth="3"
            />
            <path
                d="M229 4L224 454.597"
                stroke="url(#paint3_linear_25_749)"
                strokeWidth="3"
            />
            <rect
                x="282.5"
                y="197.5"
                width="222"
                height="127"
                rx="8.5"
                className="fill-white dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <rect
                x="292"
                y="247"
                width="203"
                height="28"
                rx="4"
                className="fill-gray-100 dark:fill-gray-800"
            />
            <rect
                x="282.5"
                y="154.5"
                width="222"
                height="33"
                rx="6.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <rect
                x="292"
                y="163"
                width="78"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="298"
                y="215"
                width="78"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="298"
                y="253"
                width="78"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <path
                d="M476 261L479.662 265L487 257"
                className="stroke-primary"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="298"
                y="291"
                width="78"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_25_749"
                    x1="114"
                    y1="110.5"
                    x2="675"
                    y2="110.5"
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
                    id="paint1_linear_25_749"
                    x1="114"
                    y1="369.5"
                    x2="675"
                    y2="369.5"
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
                    id="paint2_linear_25_749"
                    x1="558.5"
                    y1="2.18557e-08"
                    x2="558.5"
                    y2="455"
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
                    id="paint3_linear_25_749"
                    x1="228.5"
                    y1="3.99445"
                    x2="223.5"
                    y2="454.591"
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

export default Select
