import { SvgProps } from '@/@types/common'

const Menu = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M138 130H644"
                stroke="url(#paint0_linear_27_941)"
                strokeWidth="3"
            />
            <path
                d="M149 369H655"
                stroke="url(#paint1_linear_27_941)"
                strokeWidth="3"
            />
            <path
                d="M536 63L536 428"
                stroke="url(#paint2_linear_27_941)"
                strokeWidth="3"
            />
            <path
                d="M243.5 66.1953L243.5 427.69"
                stroke="url(#paint3_linear_27_941)"
                strokeWidth="3"
            />
            <rect
                x="298.573"
                y="179.5"
                width="182.154"
                height="142"
                rx="8.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <rect
                x="306.125"
                y="234.885"
                width="167.05"
                height="31.2308"
                rx="4"
                className="fill-gray-100 dark:fill-gray-800"
            />
            <rect
                x="342.15"
                y="198.942"
                width="120"
                height="17"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="342.15"
                y="241.942"
                width="120"
                height="16"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="342.15"
                y="283.942"
                width="120"
                height="17"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <circle
                cx="323.5"
                cy="210.5"
                r="8.5"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <circle cx="323.5" cy="252.5" r="8.5" className="fill-primary" />
            <circle
                cx="323.5"
                cy="295.5"
                r="8.5"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_27_941"
                    x1="138"
                    y1="130.5"
                    x2="644"
                    y2="130.5"
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
                    id="paint1_linear_27_941"
                    x1="149"
                    y1="369.5"
                    x2="655"
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
                    id="paint2_linear_27_941"
                    x1="536"
                    y1="63"
                    x2="536"
                    y2="428"
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
                    id="paint3_linear_27_941"
                    x1="243"
                    y1="66.1953"
                    x2="243"
                    y2="427.69"
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

export default Menu
