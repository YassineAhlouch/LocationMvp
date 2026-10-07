import type { LandingTechItem, LandingTech } from '../types'

const TechFeature = ({
    stackList,
    content,
}: {
    stackList: LandingTechItem[]
    content: LandingTech
}) => {
    return (
        <section className="border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 py-24">
                    <div className="col-span-1" />
                    <div className="col-span-10">
                        <h3 className="max-w-200 leading-snug">
                            <span>{content.heading.primary} </span>
                            <span className="text-slate-400 font-medium">
                                {content.heading.secondary}
                            </span>
                        </h3>
                    </div>
                    <div className="col-span-1" />
                </div>
                <div className="pb-24">
                    <div className="border-t border-b border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 lg:grid-cols-10 bg-gray-200 dark:bg-gray-700 gap-px">
                            {stackList.map((stack) => (
                                <div
                                    className="lg:col-span-2 bg-white dark:bg-gray-900"
                                    key={stack.id}
                                >
                                    <div className="flex flex-col gap-6 p-6">
                                        <div className="w-11 h-11 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-100/10 dark:bg-gray-100/10">
                                            <img
                                                className="max-h-6"
                                                src={`https://static.themenate.net/eyris/images/tech/${stack.image}`}
                                                alt={stack.title}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-semibold heading-text">
                                                {stack.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TechFeature
