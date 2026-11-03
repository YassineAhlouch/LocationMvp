import { motion } from 'motion/react'
import { TbSquareCheck } from 'react-icons/tb'
import type { LandingPageContent } from '../types'
import { ColoniaSectionHeader, TAG_ICONS } from './ColoniaTag'
import { PreviewFrame, TasksBoardView } from './previewPanels'

const TeamTasks = ({ content }: { content: LandingPageContent }) => (
    <section id="tasks" className="mb-4 px-4">
        <div className="max-w-7xl mx-auto py-12 lg:py-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Kanban preview */}
            <div className="lg:col-span-7 order-2 lg:order-1">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                >
                    <PreviewFrame>
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="col-p3 uppercase tracking-wide text-[#9d9d9d] dark:text-[#8a8a8a]">
                                        {content.showcase.tasksPreview.eyebrow}
                                    </p>
                                    <p className="mt-1 col-h5 col-heading">
                                        {content.showcase.tasksPreview.title}
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#f8f8f8] dark:bg-[#2b2b2b] px-2.5 py-1 col-p3 text-[#5c5c5c] dark:text-[#b3b3b3] border border-[#ebebeb] dark:border-[#383838]">
                                    {content.showcase.tasksPreview.badge}
                                </span>
                            </div>
                            <div className="mt-4">
                                <TasksBoardView
                                    columns={content.showcase.tasksPreview.columns}
                                />
                            </div>
                        </div>
                    </PreviewFrame>
                </motion.div>
            </div>
            {/* Content + examples */}
            <div className="lg:col-span-5 order-1 lg:order-2">
                <ColoniaSectionHeader
                    tag={content.tasks.tag}
                    tagIcon={TAG_ICONS.features}
                    headings={[content.tasks.heading]}
                    subtext={content.tasks.subtext}
                    className="items-start text-start"
                />
                <div className="mt-8 flex flex-col gap-3">
                    {content.tasks.examples.map((example, index) => (
                        <motion.div
                            key={example}
                            initial={{ opacity: 0, x: 16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                            }}
                            className="flex items-center gap-3 rounded-[14px] bg-[#f8f8f8] px-4 py-3 dark:bg-[#232323]"
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#fa7319] text-white shadow-[0_6px_10px_1px_rgba(250,115,25,0.25)]">
                                <TbSquareCheck size={16} />
                            </span>
                            <span className="col-p3 col-heading">
                                {example}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
)

export default TeamTasks
