import { SvgProps } from '@/@types/common'

const Radio = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M187 157.047H557"
                stroke="url(#paint0_linear_23_705)"
                strokeWidth="3"
            />
            <path
                d="M199 283.887H569"
                stroke="url(#paint1_linear_23_705)"
                strokeWidth="3"
            />
            <path
                d="M488 81.5466L488 363.413"
                stroke="url(#paint2_linear_23_705)"
                strokeWidth="3"
            />
            <path
                d="M273 81.5466L273 363.413"
                stroke="url(#paint3_linear_23_705)"
                strokeWidth="3"
            />
            <rect
                x="393"
                y="197.313"
                width="50"
                height="50.3333"
                rx="25"
                className="fill-primary"
            />
            <rect
                x="406"
                y="210"
                width="24"
                height="25"
                rx="12"
                className="fill-white"
            />
            <rect
                x="312.5"
                y="198.813"
                width="47"
                height="47.3333"
                rx="23.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_23_705"
                    x1="187"
                    y1="157.547"
                    x2="557"
                    y2="157.547"
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
                    id="paint1_linear_23_705"
                    x1="199"
                    y1="284.387"
                    x2="569"
                    y2="284.387"
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
                    id="paint2_linear_23_705"
                    x1="487.5"
                    y1="81.5466"
                    x2="487.5"
                    y2="363.413"
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
                    id="paint3_linear_23_705"
                    x1="272.5"
                    y1="81.5466"
                    x2="272.5"
                    y2="363.413"
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

export default Radio
