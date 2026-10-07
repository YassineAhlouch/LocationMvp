import Logo from '@/components/template/Logo'
import Container from '@/components/shared/Container'
import useDarkMode from '@/utils/hooks/useDarkMode'
import type { CommonProps } from '@/@types/common'

const Centred = ({ children }: CommonProps) => {
    const [isDark] = useDarkMode()

    return (
        <div className="bg-white dark:bg-gray-900 h-full">
            <Container size="md" className="h-full px-2">
                <div className="flex flex-col justify-between border-r border-l border-gray-200 dark:border-gray-700 min-h-screen">
                    <div className="grid grid-cols-3 flex-1">
                        <div className="w-full h-full relative">
                            <svg
                                width="1"
                                height="100%"
                                className="text-gray-200 dark:text-gray-700 min-h-10 flex-1 absolute right-0"
                            >
                                <line
                                    x1="0.5"
                                    y1="0"
                                    x2="0.5"
                                    y2="100%"
                                    stroke="currentColor"
                                    strokeDasharray="4 6"
                                    strokeLinecap="round"
                                ></line>
                            </svg>
                            <div className="absolute w-2 h-2 -bottom-px -left-2 border-b border-r border-gray-400"></div>
                        </div>
                        <div className="py-8 flex justify-center">
                            <Logo
                                logoWidth={100}
                                mode={isDark ? 'dark' : 'light'}
                            />
                        </div>
                        <div className="w-full h-full relative">
                            <svg
                                width="1"
                                height="100%"
                                className="text-gray-200 dark:text-gray-700 min-h-10 flex-1 absolute left-0"
                            >
                                <line
                                    x1="0.5"
                                    y1="0"
                                    x2="0.5"
                                    y2="100%"
                                    stroke="currentColor"
                                    strokeDasharray="4 6"
                                    strokeLinecap="round"
                                ></line>
                            </svg>
                            <div className="absolute w-2 h-2 -bottom-px -right-2 border-b border-l border-gray-400"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="flex flex-col justify-center items-center py-12">
                            <div className="w-full px-8 max-w-97">
                                {children}
                            </div>
                        </div>
                        <div className="flex-col gap-12 h-full bg-gray-100 relative dark:bg-gray-800 hidden lg:flex">
                            <div className="absolute top-0 left-0 w-full h-full ">
                                <svg
                                    width="100%"
                                    height="100%"
                                    className="h-full w-full text-gray-900/20 dark:text-gray-100/20"
                                >
                                    <defs>
                                        <pattern
                                            id="slash"
                                            width="10"
                                            height="10"
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <rect
                                                x="5.5"
                                                y="5.5"
                                                width="1"
                                                height="1"
                                                fill="currentColor"
                                            ></rect>
                                        </pattern>
                                    </defs>
                                    <rect
                                        width="100%"
                                        height="100%"
                                        fill="url(#slash)"
                                    ></rect>
                                </svg>
                            </div>
                            <div className="pt-12 pb-8 px-12 z-10">
                                <h2>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Your app,
                                    </span>
                                    <span> supercharged.</span>
                                </h2>
                                <p className="opacity-80 mx-auto mt-4 text-base heading-text">
                                    From elegant UI components to thoughtful
                                    page designs, Eyris gives you all the tools
                                    to build scalable, high-performance web app
                                    experiences with ease.
                                </p>
                            </div>
                            <div className="flex items-end justify-end h-full overflow-hidden z-10">
                                <div className="p-2 rounded-xl bg-slate-900/10 dark:bg-slate-100/30 -mb-4 -mr-4">
                                    <img
                                        src="/img/others/auth-side.PNG"
                                        className="max-w-95 lg:max-w-132.5 rounded-xl"
                                        alt="auth-side"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 flex-1 min-h-25">
                        <div className="w-full h-full relative">
                            <svg
                                width="1"
                                height="100%"
                                className="text-gray-200 dark:text-gray-700 min-h-10 flex-1 absolute right-0"
                            >
                                <line
                                    x1="0.5"
                                    y1="0"
                                    x2="0.5"
                                    y2="100%"
                                    stroke="currentColor"
                                    strokeDasharray="4 6"
                                    strokeLinecap="round"
                                ></line>
                            </svg>
                            <div className="absolute w-2 h-2 -top-px -left-2 border-t border-r border-gray-400"></div>
                        </div>
                        <div />
                        <div className="w-full h-full relative">
                            <svg
                                width="1"
                                height="100%"
                                className="text-gray-200 dark:text-gray-700 min-h-10 flex-1 absolute left-0"
                            >
                                <line
                                    x1="0.5"
                                    y1="0"
                                    x2="0.5"
                                    y2="100%"
                                    stroke="currentColor"
                                    strokeDasharray="4 6"
                                    strokeLinecap="round"
                                ></line>
                            </svg>
                            <div className="absolute w-2 h-2 -top-px -right-2 border-t border-l border-gray-400"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Centred
