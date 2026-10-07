import useChatSend from '../hooks/useChatSend'
import {
    LuCalendarClock,
    LuLightbulb,
    LuNotebookPen,
    LuBraces,
} from 'react-icons/lu'
import type { ReactNode } from 'react'

type PromptType = 'idea' | 'guide' | 'writing' | 'coding'

const suggestionIcon: Record<PromptType, ReactNode> = {
    idea: <LuCalendarClock />,
    guide: <LuLightbulb />,
    writing: <LuNotebookPen />,
    coding: <LuBraces />,
}

const promptSuggestion: {
    title: string
    prompt: string
    type: PromptType
}[] = [
    {
        title: 'Planing',
        prompt: `Help me plan like an pro for an upcoming trip`,
        type: 'guide',
    },
    {
        title: 'Writing',
        prompt: `Outline an logical sales pitch for a new product`,
        type: 'writing',
    },
    {
        title: 'Insight',
        prompt: `Help me get organized with a list of 10 tips`,
        type: 'idea',
    },
    {
        title: 'Coding',
        prompt: `Write code for a specific task with edge cases`,
        type: 'coding',
    },
]

const ChatLandingView = () => {
    const { handleSend } = useChatSend()

    return (
        <div className="max-w-[900px] w-full mx-auto flex-1 flex items-center justify-center">
            <div>
                <div className="mb-8 flex flex-col items-center">
                    <img
                        className="w-20 orb-rotate"
                        src="/img/thumbs/ai.png"
                        alt="Chat AI"
                    />
                    <div
                        className="w-16 h-4 rounded-[50%] mt-1 blur-md"
                        style={{
                            background:
                                'radial-gradient(ellipse, rgba(147, 51, 234, 0.85) 0%, rgba(168, 85, 247, 0.6) 40%, transparent 70%)',
                        }}
                    />
                </div>
                <div className="heading-text text-4xl leading-snug text-center">
                    <span>Hello there!</span>
                    <br />
                    <span>
                        What can I{' '}
                        <span className="font-medium bg-linear-to-r from-pink-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                            Assist
                        </span>
                        ?
                    </span>
                </div>
                <div className="mt-8 md:grid grid-cols-2 xl:grid-cols-4 gap-4 hidden">
                    {promptSuggestion.map((suggestion) => (
                        <div
                            key={suggestion.title}
                            className="flex flex-col gap-4 justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700  p-2 min-h-40 2xl:min-h-40 cursor-pointer hover:shadow dark:hover:border-gray-500 dark:hover:ring dark:hover:ring-gray-500"
                            role="button"
                            onClick={() => handleSend(suggestion.prompt)}
                        >
                            <div className="p-2 inline-flex">
                                <span className="text-2xl heading-text">
                                    {suggestionIcon[suggestion.type]}
                                </span>
                            </div>
                            <div className="min-h-[90px]">
                                <h6 className="mb-2">{suggestion.title}</h6>
                                <p className="">{suggestion.prompt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChatLandingView
