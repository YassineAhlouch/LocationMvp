import { SvgProps } from '@/@types/common'

const Switcher = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M143 122H604"
                stroke="url(#paint0_linear_21_482)"
                strokeWidth="3"
            />
            <path
                d="M156 322H617"
                stroke="url(#paint1_linear_21_482)"
                strokeWidth="3"
            />
            <path
                d="M488 63L488 381"
                stroke="url(#paint2_linear_21_482)"
                strokeWidth="3"
            />
            <path
                d="M273 63L273 381"
                stroke="url(#paint3_linear_21_482)"
                strokeWidth="3"
            />
            <path
                d="M339 257C339 244.436 349.125 234.25 361.615 234.25H400.385C412.875 234.25 423 244.436 423 257C423 269.564 412.875 279.75 400.385 279.75H361.615C349.125 279.75 339 269.564 339 257Z"
                className="fill-primary"
            />
            <path
                d="M414.833 256.417C414.833 265.476 407.496 272.75 398.5 272.75C389.442 272.75 382.167 265.476 382.167 256.417C382.167 247.421 389.442 240.083 398.5 240.083C407.496 240.083 414.833 247.421 414.833 256.417Z"
                className="fill-white"
            />
            <path
                d="M339 186.417C339 174.174 349.125 164.25 361.615 164.25H400.385C412.875 164.25 423 174.174 423 186.417C423 198.659 412.875 208.583 400.385 208.583H361.615C349.125 208.583 339 198.659 339 186.417Z"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <path
                d="M379.833 185.25C379.833 194.31 372.496 201.583 363.5 201.583C354.442 201.583 347.167 194.31 347.167 185.25C347.167 176.254 354.442 168.917 363.5 168.917C372.496 168.917 379.833 176.254 379.833 185.25Z"
                className="fill-white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_21_482"
                    x1="143"
                    y1="122.5"
                    x2="604"
                    y2="122.5"
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
                    id="paint1_linear_21_482"
                    x1="156"
                    y1="322.5"
                    x2="617"
                    y2="322.5"
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
                    id="paint2_linear_21_482"
                    x1="487.5"
                    y1="63"
                    x2="487.5"
                    y2="381"
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
                    id="paint3_linear_21_482"
                    x1="272.5"
                    y1="63"
                    x2="272.5"
                    y2="381"
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

export default Switcher
