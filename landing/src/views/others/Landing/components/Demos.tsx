import { motion } from 'motion/react'
import useDemoUrl from '../hooks/useDemoUrl'
import type { LandingDemoCategory, LandingDemos } from '../types'
import type { Mode, Framework } from '../types'

const Tabs = ({ categories }: { categories: LandingDemoCategory[] }) => {
    const handleTabClick = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const headerOffset = 150
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition =
                elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
    }

    return (
        <div className="flex flex-col">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    className="font-medium heading-text px-2 rounded-lg flex items-center w-full whitespace-nowrap gap-x-2 transition-colors duration-150 h-9 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleTabClick(cat.id)}
                >
                    <span>{cat.name}</span>
                </button>
            ))}
        </div>
    )
}

const DemoCard = ({
    id,
    name,
    path,
    mode,
    url,
}: {
    id: string
    name: string
    path: string
    mode: Mode
    url: string
}) => (
    <motion.a
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        href={`${url}${path}`}
        className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-800 p-1 h-max hover:border-gray-300 dark:hover:border-gray-600"
        target="_blank"
        rel="noreferrer"
    >
        <div className="rounded-xl overflow-hidden">
            <motion.img
                whileHover={{ scale: 1.05 }}
                className="rounded-xl"
                src={
                    mode === 'light'
                        ? `https://static.themenate.net/eyris/images/demo/${id}.webp`
                        : `https://static.themenate.net/eyris/images/demo/${id}-dark.webp`
                }
                alt={name}
            />
        </div>
        <div className="mt-3 px-2 pb-1">
            <h6 className="font-semibold">{name}</h6>
        </div>
    </motion.a>
)

const Demos = ({
    mode,
    framework,
    content,
}: {
    mode: Mode
    framework: Framework
    content: LandingDemos
}) => {
    const url = useDemoUrl(framework)

    return (
        <section
            id="demos"
            className="border-t border-gray-200 dark:border-gray-700"
        >
            <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700">
                <div className="max-w-[320] mx-auto text-center py-24">
                    <h2 className="max-w-200 leading-snug">
                        <span>{content.heading}</span>
                    </h2>
                    <p className="text-slate-400 font-medium mt-2">
                        {content.subheading}
                    </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                    <div className="relative grid grid-cols-12 divide-x divide-gray-200 dark:divide-gray-700">
                        <div className="col-span-3 py-12 px-8 hidden md:block">
                            <div className="sticky top-28">
                                <div className="font-medium">CATEGORIES</div>
                                <div className="mt-8">
                                    <div className="min-w-62.5">
                                        <Tabs categories={content.categories} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 px-4 lg:px-0 md:col-span-9">
                            {content.categories.map((cat, index) => (
                                <div key={cat.id} id={cat.id}>
                                    <div className="max-w-200 mx-auto py-14">
                                        <div className="uppercase font-medium pb-4 md:pb-10">
                                            {cat.name}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {cat.items.map((demo) => (
                                                <DemoCard
                                                    key={demo.id}
                                                    id={demo.id}
                                                    name={demo.name}
                                                    path={demo.path}
                                                    mode={mode}
                                                    url={url}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {index !==
                                        content.categories.length - 1 && (
                                        <svg width="100%" height="1">
                                            <line
                                                x1="0"
                                                y1="0.5"
                                                x2="100%"
                                                y2="0.5"
                                                className="stroke-gray-300 dark:stroke-gray-700"
                                                strokeDasharray="4 6"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Demos
