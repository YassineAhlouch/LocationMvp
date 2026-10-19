import { SvgProps } from '@/@types/common'

const Segment = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                stroke="url(#paint0_linear_23_725)"
                strokeWidth="3"
            />
            <path
                d="M82 293H713"
                stroke="url(#paint1_linear_23_725)"
                strokeWidth="3"
            />
            <path
                d="M600.187 84L600.186 366"
                stroke="url(#paint2_linear_23_725)"
                strokeWidth="3"
            />
            <path
                d="M169.187 84L169.186 366"
                stroke="url(#paint3_linear_23_725)"
                strokeWidth="3"
            />
            <rect
                x="220"
                y="198"
                width="331"
                height="54"
                rx="10"
                className="fill-gray-200 dark:fill-gray-600"
            />
            <rect
                x="220"
                y="198"
                width="331"
                height="54"
                rx="10"
                className="fill-gray-200 dark:fill-gray-600"
            />
            <rect
                x="226"
                y="206"
                width="108"
                height="38"
                rx="8"
                className="fill-white dark:fill-gray-300"
            />
            <rect
                x="250"
                y="218"
                width="51"
                height="14.8352"
                rx="4"
                className="fill-gray-300 dark:fill-gray-700"
            />
            <rect
                x="369"
                y="218"
                width="51"
                height="14.8352"
                rx="4"
                className="fill-gray-400 dark:fill-gray-700"
            />
            <rect
                x="470"
                y="218"
                width="51"
                height="14.8352"
                rx="4"
                className="fill-gray-400 dark:fill-gray-700"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_23_725"
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
                    id="paint1_linear_23_725"
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
                    id="paint2_linear_23_725"
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
                    id="paint3_linear_23_725"
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

export default Segment
