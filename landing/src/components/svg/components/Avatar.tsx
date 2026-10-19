import { SvgProps } from '@/@types/common'

const Avatar = ({ height = 100, width = 100, ...rest }: SvgProps) => {
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
                d="M47 135H717"
                stroke="url(#paint0_linear_4_159)"
                strokeWidth="3"
            />
            <path
                d="M47 315H717"
                stroke="url(#paint1_linear_4_159)"
                strokeWidth="3"
            />
            <path
                d="M585 20L585 430"
                stroke="url(#paint2_linear_4_159)"
                strokeWidth="3"
            />
            <path
                d="M184 20L184 430"
                stroke="url(#paint3_linear_4_159)"
                strokeWidth="3"
            />
            <circle
                cx="479.5"
                cy="225.5"
                r="65"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <path
                d="M479.5 223C469.202 223 460.929 214.762 460.929 204.5C460.929 194.382 469.202 186 479.5 186C489.659 186 498.071 194.382 498.071 204.5C498.071 214.762 489.659 223 479.5 223ZM486.752 229.938C500.681 229.938 512 241.211 512 255.086C512 257.832 509.679 260 506.921 260H451.931C449.173 260 447 257.832 447 255.086C447 241.211 458.171 229.938 472.099 229.938H486.752Z"
                className="fill-gray-400 dark:fill-gray-500"
            />
            <rect
                x="223.5"
                y="160.5"
                width="130"
                height="130"
                rx="18.5"
                className="fill-white dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
            />
            <path
                d="M253.636 245V198.455H259.273V240H280.909V245H253.636ZM315.091 210.091C314.818 207.788 313.712 206 311.773 204.727C309.833 203.455 307.455 202.818 304.636 202.818C302.576 202.818 300.773 203.152 299.227 203.818C297.697 204.485 296.5 205.402 295.636 206.568C294.788 207.735 294.364 209.061 294.364 210.545C294.364 211.788 294.659 212.856 295.25 213.75C295.856 214.629 296.629 215.364 297.568 215.955C298.508 216.53 299.492 217.008 300.523 217.386C301.553 217.75 302.5 218.045 303.364 218.273L308.091 219.545C309.303 219.864 310.652 220.303 312.136 220.864C313.636 221.424 315.068 222.189 316.432 223.159C317.811 224.114 318.947 225.341 319.841 226.841C320.735 228.341 321.182 230.182 321.182 232.364C321.182 234.879 320.523 237.152 319.205 239.182C317.902 241.212 315.992 242.826 313.477 244.023C310.977 245.22 307.939 245.818 304.364 245.818C301.03 245.818 298.144 245.28 295.705 244.205C293.28 243.129 291.371 241.629 289.977 239.705C288.598 237.78 287.818 235.545 287.636 233H293.455C293.606 234.758 294.197 236.212 295.227 237.364C296.273 238.5 297.591 239.348 299.182 239.909C300.788 240.455 302.515 240.727 304.364 240.727C306.515 240.727 308.447 240.379 310.159 239.682C311.871 238.97 313.227 237.985 314.227 236.727C315.227 235.455 315.727 233.97 315.727 232.273C315.727 230.727 315.295 229.47 314.432 228.5C313.568 227.53 312.432 226.742 311.023 226.136C309.614 225.53 308.091 225 306.455 224.545L300.727 222.909C297.091 221.864 294.212 220.371 292.091 218.432C289.97 216.492 288.909 213.955 288.909 210.818C288.909 208.212 289.614 205.939 291.023 204C292.447 202.045 294.356 200.53 296.75 199.455C299.159 198.364 301.848 197.818 304.818 197.818C307.818 197.818 310.485 198.356 312.818 199.432C315.152 200.492 317 201.947 318.364 203.795C319.742 205.644 320.47 207.742 320.545 210.091H315.091Z"
                className="fill-gray-400 dark:fill-gray-500"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_4_159"
                    x1="47"
                    y1="135.5"
                    x2="717"
                    y2="135.5"
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
                    id="paint1_linear_4_159"
                    x1="47"
                    y1="315.5"
                    x2="717"
                    y2="315.5"
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
                    id="paint2_linear_4_159"
                    x1="584.5"
                    y1="20"
                    x2="584.5"
                    y2="430"
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
                    id="paint3_linear_4_159"
                    x1="183.5"
                    y1="20"
                    x2="183.5"
                    y2="430"
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

export default Avatar
