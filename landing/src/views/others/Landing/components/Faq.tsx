import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TbMinus, TbPlus, TbReceipt, TbSettings, TbUsers } from 'react-icons/tb'
import classNames from '@/utils/classNames'
import type { IconType } from 'react-icons'
import type { LandingFaq, LandingFaqCategory } from '../types'

const categoryIcon: Record<string, IconType> = {
    subscription: TbUsers,
    billing: TbReceipt,
    other: TbSettings,
}

const Question = ({
    question,
    answer,
    isFirst,
    isLast,
}: {
    question: string
    answer: string
    isFirst: boolean
    isLast: boolean
}) => {
    const [isOpen, setIsOpen] = useState(isFirst)

    return (
        <div
            className={classNames(
                !isLast && 'border-b border-gray-200 dark:border-gray-700',
            )}
        >
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="group flex w-full items-center gap-4 py-5 text-start"
            >
                <span className="text-lg text-gray-400 transition-colors group-hover:text-primary">
                    {isOpen ? <TbMinus /> : <TbPlus />}
                </span>
                <span className="font-medium heading-text transition-colors group-hover:text-primary">
                    {question}
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 ltr:ml-9 rtl:mr-9 text-sm text-gray-500 dark:text-gray-400">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const Faq = ({ content }: { content: LandingFaq }) => {
    const [selectedId, setSelectedId] = useState(
        content.categories[0]?.id ?? '',
    )

    const selectedCategory = useMemo<LandingFaqCategory | undefined>(
        () =>
            content.categories.find((category) => category.id === selectedId),
        [content.categories, selectedId],
    )

    const isCategoryActive = (category: LandingFaqCategory) =>
        category.id === selectedCategory?.id

    return (
        <section id="faq" className="border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700">
                <div className="px-4 lg:px-0 py-12 lg:py-24">
                    <div className="grid grid-cols-12">
                        <div className="col-span-1" />
                        <div className="col-span-10">
                            <h3 className="max-w-2xl leading-snug">
                                {content.heading}
                            </h3>
                            <p className="mt-3 max-w-2xl text-gray-500 dark:text-gray-400 font-medium">
                                {content.subheading}
                            </p>
                        </div>
                        <div className="col-span-1" />
                    </div>

                    <div className="grid grid-cols-12 mt-10">
                        <div className="col-span-1" />
                        <div className="col-span-10 flex flex-col gap-6 md:flex-row md:gap-16">
                            <div className="min-w-[230px]">
                                <ul>
                                    {content.categories.map((category) => {
                                        const Icon = categoryIcon[category.id]
                                        const isActive = isCategoryActive(category)

                                        return (
                                            <li key={category.id}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedId(category.id)
                                                    }
                                                    className={classNames(
                                                        'my-1 flex h-9 w-full items-center gap-2 rounded-md px-2 text-start font-medium heading-text transition-colors',
                                                        isActive
                                                            ? 'bg-gray-100 font-semibold dark:bg-gray-700'
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                                                    )}
                                                >
                                                    <span className="text-lg">
                                                        {Icon ? <Icon /> : null}
                                                    </span>
                                                    <span>{category.title}</span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="flex-1">
                                {selectedCategory?.questions.map(
                                    (item, index) => (
                                        <Question
                                            key={item.question}
                                            question={item.question}
                                            answer={item.answer}
                                            isFirst={index === 0}
                                            isLast={
                                                index ===
                                                selectedCategory.questions
                                                    .length -
                                                    1
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                        <div className="col-span-1" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Faq
