import { useState } from 'react'
import Card from '@/components/ui/Card'
import Question from './Question'
import classNames from '@/utils/classNames'
import { questionList, questionCategory } from '../constants'
import isLastChild from '@/utils/isLastChild'
import { LiProfiles, LiReceiptItem, LiSetting } from '@/icons'
import { ReactNode } from 'react'

const menuIcon: Record<string, ReactNode> = {
    subscription: <LiProfiles />,
    billing: <LiReceiptItem />,
    others: <LiSetting />,
}

const Faq = () => {
    const [selectedCategory, setSelectedCategory] = useState('subscription')

    return (
        <Card>
            <h3 className="mt-2">FAQ</h3>
            <div className="flex flex-col md:flex-row gap-4 md:gap-20 mt-8">
                <div className="min-w-[230px]">
                    <ul>
                        {Object.entries(questionList).map(([key]) => (
                            <li
                                key={key}
                                role="menuitem"
                                tabIndex={-1}
                                onClick={() => setSelectedCategory(key)}
                            >
                                <button
                                    onClick={() => setSelectedCategory(key)}
                                    className={classNames(
                                        'h-[36px] w-full my-1 flex flex-auto items-center gap-2 px-2 rounded-md heading-text font-medium',
                                        key === selectedCategory
                                            ? 'bg-gray-100 dark:bg-gray-700 font-semibold'
                                            : 'hover:bg-gray-50 hover:dark:bg-gray-800',
                                    )}
                                >
                                    <span className="text-lg">
                                        {menuIcon[key]}
                                    </span>
                                    <span className="">
                                        {questionCategory[key]}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="my-2 flex-1">
                    <div className="">
                        {questionList[selectedCategory].map(
                            (question, index) => (
                                <Question
                                    key={question.title}
                                    border={
                                        !isLastChild(
                                            questionList[selectedCategory],
                                            index,
                                        )
                                    }
                                    isFirstChild={index === 0}
                                    {...question}
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default Faq
