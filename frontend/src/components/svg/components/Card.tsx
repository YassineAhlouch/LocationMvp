import { SvgProps } from '@/@types/common'

const Card = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M113 83H674"
                stroke="url(#paint0_linear_14_197)"
                strokeWidth="3"
            />
            <path
                d="M113 382H674"
                stroke="url(#paint1_linear_14_197)"
                strokeWidth="3"
            />
            <path
                d="M559 0L559 455"
                stroke="url(#paint2_linear_14_197)"
                strokeWidth="3"
            />
            <path
                d="M229 4L224 454.597"
                stroke="url(#paint3_linear_14_197)"
                strokeWidth="3"
            />
            <rect
                x="289.5"
                y="121.5"
                width="197"
                height="221"
                rx="8.5"
                className="fill-white dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <rect
                x="309"
                y="147"
                width="51"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="309"
                y="266"
                width="159"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="309"
                y="292"
                width="124"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="309"
                y="183"
                width="159"
                height="62"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_14_197"
                    x1="113"
                    y1="83.5"
                    x2="674"
                    y2="83.5"
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
                    id="paint1_linear_14_197"
                    x1="113"
                    y1="382.5"
                    x2="674"
                    y2="382.5"
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
                    id="paint2_linear_14_197"
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
                    id="paint3_linear_14_197"
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

export default Card
