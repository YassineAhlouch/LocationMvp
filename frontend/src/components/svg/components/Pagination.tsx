import { SvgProps } from '@/@types/common'

const Pagination = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M73 148H713"
                stroke="url(#paint0_linear_26_840)"
                strokeWidth="3"
            />
            <path
                d="M82 293H713"
                stroke="url(#paint1_linear_26_840)"
                strokeWidth="3"
            />
            <path
                d="M600.187 84L600.186 366"
                stroke="url(#paint2_linear_26_840)"
                strokeWidth="3"
            />
            <path
                d="M169.187 84L169.187 366"
                stroke="url(#paint3_linear_26_840)"
                strokeWidth="3"
            />
            <rect
                x="267.5"
                y="197.5"
                width="51"
                height="51"
                rx="8.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <path
                d="M296.068 209.727V233H292.545V213.25H292.409L286.841 216.886V213.523L292.648 209.727H296.068Z"
                className="fill-gray-900 dark:fill-gray-100"
            />
            <path
                d="M354.239 233V230.455L362.114 222.295C362.955 221.409 363.648 220.633 364.193 219.966C364.746 219.292 365.159 218.652 365.432 218.045C365.705 217.439 365.841 216.795 365.841 216.114C365.841 215.341 365.659 214.674 365.295 214.114C364.932 213.545 364.436 213.11 363.807 212.807C363.178 212.496 362.47 212.341 361.682 212.341C360.848 212.341 360.121 212.511 359.5 212.852C358.879 213.193 358.402 213.674 358.068 214.295C357.735 214.917 357.568 215.644 357.568 216.477H354.216C354.216 215.061 354.542 213.822 355.193 212.761C355.845 211.701 356.739 210.879 357.875 210.295C359.011 209.705 360.303 209.409 361.75 209.409C363.212 209.409 364.5 209.701 365.614 210.284C366.735 210.86 367.61 211.648 368.239 212.648C368.867 213.64 369.182 214.761 369.182 216.011C369.182 216.875 369.019 217.72 368.693 218.545C368.375 219.371 367.818 220.292 367.023 221.307C366.227 222.314 365.121 223.538 363.705 224.977L359.08 229.818V229.989H369.557V233H354.239Z"
                className="fill-gray-900 dark:fill-gray-100"
            />
            <path
                d="M408.523 233.216C407.902 233.216 407.367 232.996 406.92 232.557C406.473 232.11 406.25 231.572 406.25 230.943C406.25 230.322 406.473 229.792 406.92 229.352C407.367 228.905 407.902 228.682 408.523 228.682C409.144 228.682 409.678 228.905 410.125 229.352C410.572 229.792 410.795 230.322 410.795 230.943C410.795 231.36 410.689 231.742 410.477 232.091C410.273 232.432 410 232.705 409.659 232.909C409.318 233.114 408.939 233.216 408.523 233.216ZM417.585 233.216C416.964 233.216 416.43 232.996 415.983 232.557C415.536 232.11 415.312 231.572 415.312 230.943C415.312 230.322 415.536 229.792 415.983 229.352C416.43 228.905 416.964 228.682 417.585 228.682C418.206 228.682 418.741 228.905 419.188 229.352C419.634 229.792 419.858 230.322 419.858 230.943C419.858 231.36 419.752 231.742 419.54 232.091C419.335 232.432 419.062 232.705 418.722 232.909C418.381 233.114 418.002 233.216 417.585 233.216ZM426.648 233.216C426.027 233.216 425.492 232.996 425.045 232.557C424.598 232.11 424.375 231.572 424.375 230.943C424.375 230.322 424.598 229.792 425.045 229.352C425.492 228.905 426.027 228.682 426.648 228.682C427.269 228.682 427.803 228.905 428.25 229.352C428.697 229.792 428.92 230.322 428.92 230.943C428.92 231.36 428.814 231.742 428.602 232.091C428.398 232.432 428.125 232.705 427.784 232.909C427.443 233.114 427.064 233.216 426.648 233.216Z"
                className="fill-gray-900 dark:fill-gray-100"
            />
            <path
                d="M473.92 233.318C472.496 233.318 471.216 233.045 470.08 232.5C468.951 231.947 468.049 231.189 467.375 230.227C466.701 229.265 466.341 228.167 466.295 226.932H469.705C469.788 227.932 470.231 228.754 471.034 229.398C471.837 230.042 472.799 230.364 473.92 230.364C474.814 230.364 475.606 230.159 476.295 229.75C476.992 229.333 477.538 228.761 477.932 228.034C478.333 227.307 478.534 226.477 478.534 225.545C478.534 224.598 478.33 223.754 477.92 223.011C477.511 222.269 476.947 221.686 476.227 221.261C475.515 220.837 474.697 220.621 473.773 220.614C473.068 220.614 472.36 220.735 471.648 220.977C470.936 221.22 470.36 221.538 469.92 221.932L466.705 221.455L468.011 209.727H480.807V212.739H470.932L470.193 219.25H470.33C470.784 218.811 471.386 218.443 472.136 218.148C472.894 217.852 473.705 217.705 474.568 217.705C475.985 217.705 477.246 218.042 478.352 218.716C479.466 219.39 480.341 220.311 480.977 221.477C481.621 222.636 481.939 223.97 481.932 225.477C481.939 226.985 481.598 228.33 480.909 229.511C480.227 230.693 479.28 231.625 478.068 232.307C476.864 232.981 475.481 233.318 473.92 233.318ZM494.185 233.386C492.389 233.379 490.855 232.905 489.582 231.966C488.31 231.027 487.336 229.659 486.662 227.864C485.988 226.068 485.651 223.905 485.651 221.375C485.651 218.852 485.988 216.697 486.662 214.909C487.344 213.121 488.321 211.758 489.594 210.818C490.874 209.879 492.404 209.409 494.185 209.409C495.965 209.409 497.491 209.883 498.764 210.83C500.037 211.769 501.01 213.133 501.685 214.92C502.366 216.701 502.707 218.852 502.707 221.375C502.707 223.913 502.37 226.08 501.696 227.875C501.022 229.663 500.048 231.03 498.776 231.977C497.503 232.917 495.973 233.386 494.185 233.386ZM494.185 230.352C495.76 230.352 496.991 229.583 497.878 228.045C498.772 226.508 499.219 224.284 499.219 221.375C499.219 219.443 499.014 217.811 498.605 216.477C498.204 215.136 497.624 214.121 496.866 213.432C496.116 212.735 495.223 212.386 494.185 212.386C492.616 212.386 491.385 213.159 490.491 214.705C489.598 216.25 489.147 218.473 489.139 221.375C489.139 223.314 489.34 224.955 489.741 226.295C490.151 227.629 490.73 228.64 491.48 229.33C492.23 230.011 493.132 230.352 494.185 230.352Z"
                className="fill-gray-900 dark:fill-gray-100"
            />
            <path
                d="M225 230.92L218.48 224.4C217.71 223.63 217.71 222.37 218.48 221.6L225 215.08"
                className="stroke-gray-900 dark:stroke-gray-100"
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M546 215.08L552.52 221.6C553.29 222.37 553.29 223.63 552.52 224.4L546 230.92"
                className="stroke-gray-900 dark:stroke-gray-100"
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_26_840"
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
                    id="paint1_linear_26_840"
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
                    id="paint2_linear_26_840"
                    x1="600.5"
                    y1="84.2882"
                    x2="600.5"
                    y2="365.998"
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
                    id="paint3_linear_26_840"
                    x1="169.5"
                    y1="84.2882"
                    x2="169.5"
                    y2="365.998"
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

export default Pagination
