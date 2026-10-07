import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import classNames from 'classnames'
import ReactHtmlParser from 'html-react-parser'
import isLastChild from '@/utils/isLastChild'
import dayjs from 'dayjs'
import {
    UPDATE_TICKET,
    COMMENT,
    ADD_TAGS_TO_TICKET,
    ADD_FILES_TO_TICKET,
    CREATE_TICKET,
    COMMENT_MENTION,
    ASSIGN_TICKET,
} from './constants'
import { colors } from '@/constants/colors.constant'
import {
    LuPaperclip,
    LuLoader,
    LuCheckCheck,
    LuTicketSlash,
} from 'react-icons/lu'
import type { CommonProps } from '@/@types/common'
import type { HTMLReactParserOptions } from 'html-react-parser'

type ActivityEventProps = {
    data: {
        type: string
        dateTime: number
        ticket?: string
        status?: number
        userName: string
        userImg?: string
        comment?: string
        tags?: {
            value: string
            label: string
        }[]
        files?: string[]
        assignee?: string
    }
    compact?: boolean
}

const ticketStatus: Record<
    number,
    {
        label: string
        icon: React.ReactNode
    }
> = {
    0: {
        label: 'Completed',
        icon: (
            <div className="w-4 h-4 rounded-full flex items-center justify-center bg-emerald-500 text-white">
                <LuCheckCheck />
            </div>
        ),
    },
    1: {
        label: 'In progress',
        icon: (
            <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center bg-blue-500 text-white">
                <LuLoader />
            </div>
        ),
    },
    2: {
        label: 'Open',
        icon: (
            <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center bg-amber-500 text-white">
                <LuTicketSlash />
            </div>
        ),
    },
}

const taskLabelColors: Record<string, string> = {
    '1': 'bg-rose-500',
    '2': 'bg-blue-500',
    '3': 'bg-amber-400',
    '4': 'bg-indigo-500',
}

const UnixDateTime = ({ value }: { value: number }) => {
    return <>{dayjs.unix(value).format('hh:mm A')}</>
}

const HighlightedText = ({ children, className }: CommonProps) => {
    return (
        <span className={classNames('font-medium heading-text', className)}>
            {children}
        </span>
    )
}

const ActivityEvent = ({ data, compact }: ActivityEventProps) => {
    const options: HTMLReactParserOptions = {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        replace: (node: any) => {
            if (node.type === 'tag' && node?.name === 'strong') {
                return (
                    <Tag
                        className={classNames(
                            'py-0.5 px-1 border-0 font-semibold',
                            colors.blue.iconBg,
                            colors.blue.iconText,
                        )}
                        key={node?.children[0]?.data}
                    >
                        {node?.children[0]?.data}
                    </Tag>
                )
            }
            return node.data
        },
    }

    switch (data.type) {
        case UPDATE_TICKET:
            return compact ? (
                <>
                    <div className="flex flex-col gap-y-0.5">
                        <HighlightedText>{data.userName}</HighlightedText>
                        <span className="text-xs font-medium">
                            <UnixDateTime value={data.dateTime} />
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className="mx-1">has change </span>
                        <HighlightedText>{data.ticket}</HighlightedText>
                        <span className="mx-1"> status to </span>
                        <span className="inline-flex items-center gap-1 max-h-[18px]">
                            {ticketStatus[data.status || 0].icon}
                            <HighlightedText className="ml-1 rtl:mr-1">
                                {ticketStatus[data.status || 0].label}
                            </HighlightedText>
                        </span>
                    </div>
                </>
            ) : (
                <div className="inline-flex items-center gap-1 flex-wrap">
                    <HighlightedText>{data.userName}</HighlightedText>
                    <span>has change </span>
                    <HighlightedText>{data.ticket}</HighlightedText>
                    <span> status to </span>
                    <span className="inline-flex items-center gap-1 mx-1 max-h-[18px]">
                        {ticketStatus[data.status || 0].icon}
                        <HighlightedText>
                            {ticketStatus[data.status || 0].label}
                        </HighlightedText>
                    </span>
                    <span className="font-medium">
                        <UnixDateTime value={data.dateTime} />
                    </span>
                </div>
            )
        case COMMENT:
            return (
                <>
                    {compact ? (
                        <>
                            <div className="flex flex-col gap-y-0.5">
                                <HighlightedText>
                                    {data.userName}
                                </HighlightedText>
                                <span className="text-xs font-medium">
                                    <UnixDateTime value={data.dateTime} />
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className="mx-1">comment on your</span>
                                <HighlightedText>Post</HighlightedText>
                            </div>
                        </>
                    ) : (
                        <div className="gap-1 inline-flex items-center flex-wrap">
                            <HighlightedText>{data.userName}</HighlightedText>
                            <span className="mx-1">comment on your</span>
                            <HighlightedText>Post</HighlightedText>
                            <span className="font-medium">
                                <UnixDateTime value={data.dateTime} />
                            </span>
                        </div>
                    )}
                    <Card className="mt-4 heading-text">
                        {ReactHtmlParser(data.comment || '', options)}
                    </Card>
                </>
            )
        case COMMENT_MENTION:
            return (
                <>
                    {compact ? (
                        <>
                            <div className="flex flex-col gap-y-0.5">
                                <HighlightedText>
                                    {data.userName}
                                </HighlightedText>
                                <span className="text-xs font-medium">
                                    <UnixDateTime value={data.dateTime} />
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className="mx-1">mentioned you in a</span>
                                <HighlightedText>Comment</HighlightedText>
                            </div>
                        </>
                    ) : (
                        <div className="gap-1 inline-flex items-center flex-wrap">
                            <HighlightedText>{data.userName}</HighlightedText>
                            <span>mentioned you in a comment</span>
                            <HighlightedText>Post</HighlightedText>
                            <span className="font-medium">
                                <UnixDateTime value={data.dateTime} />
                            </span>
                        </div>
                    )}
                    <Card className="mt-4 heading-text">
                        {ReactHtmlParser(data.comment || '', options)}
                    </Card>
                </>
            )
        case ADD_TAGS_TO_TICKET:
            return compact ? (
                <>
                    <div className="flex flex-col gap-y-0.5">
                        <HighlightedText>{data.userName}</HighlightedText>
                        <span className="text-xs font-medium">
                            <UnixDateTime value={data.dateTime} />
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className="mx-1">added tags </span>
                        {data?.tags?.map((tag, index) => (
                            <Tag
                                key={tag.label + index}
                                prefix
                                className="mx-1 px-1 py-0.5 bg-transparent"
                                prefixClass={`${taskLabelColors[tag.value]}`}
                            >
                                {tag.label}
                            </Tag>
                        ))}
                    </div>
                </>
            ) : (
                <div className="gap-1 inline-flex items-center flex-wrap">
                    <HighlightedText>{data.userName} </HighlightedText>
                    <span>added tags </span>
                    <span className="inline-flex items-center gap-1 max-h-[18px] mx-1">
                        {data?.tags?.map((tag, index) => (
                            <Tag
                                key={tag.label + index}
                                prefix
                                className="mx-0.5 px-1 py-0.5 bg-transparent"
                                prefixClass={`${taskLabelColors[tag.value]}`}
                            >
                                {tag.label}
                            </Tag>
                        ))}
                    </span>
                    <span className="font-medium">
                        <UnixDateTime value={data.dateTime} />
                    </span>
                </div>
            )
        case ADD_FILES_TO_TICKET:
            return compact ? (
                <>
                    <div className="flex flex-col gap-y-0.5">
                        <HighlightedText>{data.userName}</HighlightedText>
                        <span className="text-xs font-medium">
                            <UnixDateTime value={data.dateTime} />
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className="mx-1">added</span>
                        <LuPaperclip />
                        {data?.files?.map((file, index) => (
                            <HighlightedText key={file + index}>
                                {file}
                                {!isLastChild(data?.files || [], index) && (
                                    <span className="ltr:mr-1 rtl:ml-1">
                                        ,{' '}
                                    </span>
                                )}
                            </HighlightedText>
                        ))}
                    </div>
                </>
            ) : (
                <div className="gap-1 inline-flex items-center flex-wrap">
                    <HighlightedText>{data.userName} </HighlightedText>
                    <span>added</span>
                    <span className="inline-flex items-center flex-wrap gap-0.5">
                        {data?.files?.map((file, index) => (
                            <span
                                className="hover:underline cursor-pointer"
                                key={file + index}
                            >
                                <HighlightedText className="flex items-center text-nowrap">
                                    <LuPaperclip className="mx-0.5 text-base heading-text" />
                                    {file}
                                    {!isLastChild(data?.files || [], index) && (
                                        <span className="ltr:mr-1 rtl:ml-1">
                                            ,{' '}
                                        </span>
                                    )}
                                </HighlightedText>
                            </span>
                        ))}
                    </span>
                    <span>to ticket</span>
                    <HighlightedText>{data.ticket} </HighlightedText>
                    <span className="font-medium">
                        <UnixDateTime value={data.dateTime} />
                    </span>
                </div>
            )
        case ASSIGN_TICKET:
            return compact ? (
                <>
                    <div className="flex flex-col gap-y-0.5">
                        <HighlightedText>{data.userName}</HighlightedText>
                        <span className="text-xs font-medium">
                            <UnixDateTime value={data.dateTime} />
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className="mx-1">assigned ticket</span>
                        <HighlightedText>{data.ticket}</HighlightedText>
                        <span className="mx-1">to</span>
                        <HighlightedText>{data?.assignee} </HighlightedText>
                    </div>
                </>
            ) : (
                <div className="gap-1 inline-flex items-center flex-wrap">
                    <HighlightedText>{data.userName} </HighlightedText>
                    <span>assigned ticket</span>
                    <HighlightedText>{data.ticket}</HighlightedText>
                    <span>to</span>
                    <HighlightedText>{data.assignee} </HighlightedText>
                    <span className="font-medium">
                        <UnixDateTime value={data.dateTime} />
                    </span>
                </div>
            )
        case CREATE_TICKET:
            return (
                <div className="gap-1 inline-flex items-center flex-wrap">
                    <HighlightedText>{data.userName} </HighlightedText>
                    <span className="mx-1">has created ticket</span>
                    <HighlightedText>{data.ticket}</HighlightedText>
                    <span className="font-medium">
                        <UnixDateTime value={data.dateTime} />
                    </span>
                </div>
            )
        default:
            return null
    }
}

export default ActivityEvent
