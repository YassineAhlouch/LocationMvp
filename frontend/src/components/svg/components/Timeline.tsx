import { SvgProps } from '@/@types/common'

const Timeline = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M146 112H627"
                stroke="url(#paint0_linear_13_139)"
                strokeWidth="3"
            />
            <path
                d="M152 338H633"
                stroke="url(#paint1_linear_13_139)"
                strokeWidth="3"
            />
            <path
                d="M523 32.7985L523 412.799"
                stroke="url(#paint2_linear_13_139)"
                strokeWidth="3"
            />
            <path
                d="M258 41.7985L258 421.799"
                stroke="url(#paint3_linear_13_139)"
                strokeWidth="3"
            />
            <circle cx="333" cy="166" r="12" className="fill-primary" />
            <circle cx="333" cy="220" r="12" className="fill-primary" />
            <circle cx="333" cy="278" r="12" className="fill-primary" />
            <circle
                cx="333"
                cy="220"
                r="6"
                className="fill-white dark:fill-gray-800"
            />
            <circle
                cx="333"
                cy="278"
                r="6"
                className="fill-white dark:fill-gray-800"
            />
            <rect
                x="359"
                y="159"
                width="91"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="359"
                y="212"
                width="91"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="359"
                y="270"
                width="91"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="331"
                y="182"
                width="4"
                height="20"
                rx="2"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="331"
                y="240"
                width="4"
                height="20"
                rx="2"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <path
                d="M327 166L330.995 170L339 162"
                className="stroke-white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_13_139"
                    x1="146"
                    y1="112.5"
                    x2="627"
                    y2="112.5"
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
                    id="paint1_linear_13_139"
                    x1="152"
                    y1="338.5"
                    x2="633"
                    y2="338.5"
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
                    id="paint2_linear_13_139"
                    x1="522.5"
                    y1="32.7985"
                    x2="522.5"
                    y2="412.799"
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
                    id="paint3_linear_13_139"
                    x1="257.5"
                    y1="41.7985"
                    x2="257.5"
                    y2="421.799"
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

export default Timeline
