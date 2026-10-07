import { SvgProps } from '@/@types/common'

const Dropdown = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M113 110H674"
                stroke="url(#paint0_linear_27_921)"
                strokeWidth="3"
            />
            <path
                d="M113 369H674"
                stroke="url(#paint1_linear_27_921)"
                strokeWidth="3"
            />
            <path
                d="M530 0L530 455"
                stroke="url(#paint2_linear_27_921)"
                strokeWidth="3"
            />
            <path
                d="M253 4L248 454.597"
                stroke="url(#paint3_linear_27_921)"
                strokeWidth="3"
            />
            <rect
                x="305.5"
                y="197.5"
                width="163"
                height="127"
                rx="8.5"
                className="fill-white dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-600"
                strokeWidth="3"
            />
            <rect
                x="312.116"
                y="247"
                width="149.769"
                height="28"
                rx="4"
                className="fill-gray-100 dark:fill-gray-800"
            />
            <rect
                x="317"
                y="215"
                width="117"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="317"
                y="253"
                width="117"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <rect
                x="317"
                y="291"
                width="117"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <path
                d="M442 261L445.662 265L453 257"
                className="stroke-primary"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="386.5"
                y="154.5"
                width="82"
                height="33"
                rx="6.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-600"
                strokeWidth="3"
            />
            <rect
                x="401"
                y="163"
                width="48"
                height="15"
                rx="4"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_27_921"
                    x1="113"
                    y1="110.5"
                    x2="674"
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
                    id="paint1_linear_27_921"
                    x1="113"
                    y1="369.5"
                    x2="674"
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
                    id="paint2_linear_27_921"
                    x1="530"
                    y1="0"
                    x2="530"
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
                    id="paint3_linear_27_921"
                    x1="252.5"
                    y1="4"
                    x2="247.5"
                    y2="454.597"
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

export default Dropdown
