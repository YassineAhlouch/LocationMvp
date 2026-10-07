import Collapsible from '@/components/ui/Collapsible'
import classNames from '@/utils/classNames'
import { TbMinus, TbPlus } from 'react-icons/tb'

type QuestionProps = {
    title: string
    content: string
    defaultExpand: boolean
    border: boolean
    isFirstChild: boolean
}

const Question = (props: QuestionProps) => {
    const { title, content, border } = props

    return (
        <Collapsible
            className={classNames(
                'flex flex-col w-full',
                border && 'border-b border-gray-200 dark:border-gray-700',
            )}
        >
            <Collapsible.Trigger>
                {({ isOpen, toggle }) => (
                    <button
                        className={classNames(
                            'flex flex-col w-full group py-5',
                        )}
                        onClick={toggle}
                    >
                        <div className="flex items-center gap-4 transition-colors h6 cursor-pointer group">
                            <span className="text-lg">
                                {isOpen ? <TbPlus /> : <TbMinus />}
                            </span>
                            <span className="group-hover:text-primary">
                                {title}
                            </span>
                        </div>
                    </button>
                )}
            </Collapsible.Trigger>
            <Collapsible.Content className="mb-5 ltr:ml-10">
                {content}
            </Collapsible.Content>
        </Collapsible>
    )
}

export default Question
