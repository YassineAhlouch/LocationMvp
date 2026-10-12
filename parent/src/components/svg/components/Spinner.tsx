import { SvgProps } from '@/@types/common'

const Spinner = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M197 138H567"
                stroke="url(#paint0_linear_12_109)"
                strokeWidth="3"
            />
            <path
                d="M197 295H567"
                stroke="url(#paint1_linear_12_109)"
                strokeWidth="3"
            />
            <path
                d="M475 82L475 362"
                stroke="url(#paint2_linear_12_109)"
                strokeWidth="3"
            />
            <path
                d="M288 82L288 362"
                stroke="url(#paint3_linear_12_109)"
                strokeWidth="3"
            />
            <path
                d="M341.023 224.809C338.405 225.511 336.824 228.21 337.807 230.728C340.608 237.905 345.241 244.258 351.283 249.138C358.601 255.048 367.609 258.492 377.018 258.98C386.425 259.464 395.75 256.966 403.655 251.843C411.559 246.716 417.639 239.229 421.021 230.452C424.403 221.675 424.915 212.059 422.483 202.982C420.051 193.906 414.799 185.834 407.482 179.924C400.164 174.014 391.156 170.57 381.747 170.082C373.98 169.683 366.269 171.317 359.366 174.782C356.944 175.998 356.305 179.058 357.78 181.324C359.254 183.59 362.284 184.199 364.742 183.059C369.873 180.677 375.531 179.569 381.227 179.861C388.566 180.24 395.592 182.926 401.3 187.537C407.007 192.146 411.104 198.444 413.001 205.523C414.897 212.602 414.499 220.105 411.86 226.95C409.223 233.798 404.481 239.636 398.315 243.634C392.149 247.629 384.876 249.578 377.538 249.202C370.199 248.822 363.173 246.137 357.465 241.525C353.034 237.946 349.574 233.352 347.361 228.161C346.3 225.674 343.642 224.108 341.023 224.809Z"
                className="fill-gray-300 dark:fill-gray-600"
            />
            <path
                d="M389.81 176.024C390.512 173.405 388.965 170.687 386.292 170.279C378.677 169.116 370.858 169.952 363.611 172.745C354.834 176.127 347.347 182.206 342.22 190.11C337.097 198.015 334.598 207.34 335.083 216.748C335.571 226.156 339.015 235.164 344.925 242.482C350.835 249.8 358.907 255.051 367.983 257.483C377.059 259.915 386.676 259.403 395.453 256.021C404.23 252.639 411.717 246.559 416.843 238.655C421.073 232.128 423.514 224.633 423.964 216.923C424.122 214.217 421.791 212.134 419.091 212.278C416.392 212.422 414.349 214.741 414.108 217.44C413.605 223.074 411.736 228.528 408.635 233.315C404.637 239.481 398.798 244.223 391.95 246.86C385.106 249.499 377.603 249.898 370.524 248.001C363.445 246.104 357.147 242.008 352.538 236.3C347.926 230.592 345.241 223.566 344.861 216.227C344.485 208.89 346.434 201.616 350.429 195.45C354.427 189.285 360.265 184.542 367.113 181.905C372.428 179.857 378.137 179.158 383.739 179.836C386.423 180.16 389.108 178.642 389.81 176.024Z"
                className="fill-primary"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_12_109"
                    x1="197"
                    y1="138.5"
                    x2="567"
                    y2="138.5"
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
                    id="paint1_linear_12_109"
                    x1="197"
                    y1="295.5"
                    x2="567"
                    y2="295.5"
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
                    id="paint2_linear_12_109"
                    x1="474.5"
                    y1="82"
                    x2="474.5"
                    y2="362"
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
                    id="paint3_linear_12_109"
                    x1="287.5"
                    y1="82"
                    x2="287.5"
                    y2="362"
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

export default Spinner
