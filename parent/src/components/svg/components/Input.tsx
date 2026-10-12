import { SvgProps } from '@/@types/common'

const Input = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                stroke="url(#paint0_linear_23_654)"
                strokeWidth="3"
            />
            <path
                d="M82 293H713"
                stroke="url(#paint1_linear_23_654)"
                strokeWidth="3"
            />
            <path
                d="M600.187 84L600.186 366"
                stroke="url(#paint2_linear_23_654)"
                strokeWidth="3"
            />
            <path
                d="M169.187 84L169.186 366"
                stroke="url(#paint3_linear_23_654)"
                strokeWidth="3"
            />
            <rect
                x="221.5"
                y="199.5"
                width="328"
                height="51"
                rx="8.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <rect
                x="221.5"
                y="199.5"
                width="328"
                height="51"
                rx="8.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <rect
                x="241"
                y="215"
                width="102"
                height="19"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="352"
                y="208"
                width="2"
                height="31"
                rx="1"
                className="fill-gray-900 dark:fill-gray-100"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_23_654"
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
                    id="paint1_linear_23_654"
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
                    id="paint2_linear_23_654"
                    x1="599.687"
                    y1="84"
                    x2="599.687"
                    y2="366"
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
                    id="paint3_linear_23_654"
                    x1="168.687"
                    y1="84"
                    x2="168.687"
                    y2="366"
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

export default Input
