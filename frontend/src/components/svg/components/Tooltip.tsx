import { SvgProps } from '@/@types/common'

const Tooltip = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M57 140H707"
                stroke="url(#paint0_linear_21_462)"
                strokeWidth="3"
            />
            <path
                d="M57 320H707"
                stroke="url(#paint1_linear_21_462)"
                strokeWidth="3"
            />
            <path
                d="M559 25L559 435"
                stroke="url(#paint2_linear_21_462)"
                strokeWidth="3"
            />
            <path
                d="M224 25L224 435"
                stroke="url(#paint3_linear_21_462)"
                strokeWidth="3"
            />
            <rect
                x="366"
                y="244"
                width="43"
                height="44"
                rx="10"
                className="fill-primary"
            />
            <rect
                x="383"
                y="261"
                width="9"
                height="9"
                rx="4"
                className="fill-white"
            />
            <rect
                x="294"
                y="183"
                width="189"
                height="44"
                rx="10"
                className="fill-gray-900"
            />
            <rect
                x="314"
                y="200"
                width="152"
                height="9"
                rx="4"
                className="fill-gray-100 dark:fill-gray-700"
            />
            <path
                d="M388.583 234.368C387.849 235.854 385.73 235.854 384.996 234.368L381.178 226.635C380.522 225.306 381.489 223.75 382.972 223.75L390.608 223.75C392.09 223.75 393.057 225.306 392.401 226.635L388.583 234.368Z"
                className="fill-gray-900 dark:fill-gray-700"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_21_462"
                    x1="57"
                    y1="140.5"
                    x2="707"
                    y2="140.5"
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
                    id="paint1_linear_21_462"
                    x1="57"
                    y1="320.5"
                    x2="707"
                    y2="320.5"
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
                    id="paint2_linear_21_462"
                    x1="558.5"
                    y1="25"
                    x2="558.5"
                    y2="435"
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
                    id="paint3_linear_21_462"
                    x1="223.5"
                    y1="25"
                    x2="223.5"
                    y2="435"
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

export default Tooltip
