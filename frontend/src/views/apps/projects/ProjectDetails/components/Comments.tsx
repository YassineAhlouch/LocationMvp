import { useState, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CommentInput from '@/components/view/CommentInput'
import Divider from '@/components/shared/Divider'
import ReactionEmojiPicker from '@/components/shared/ReactionEmojiPicker'
import useProjectDetailsData from '../hooks/useProjectDetailsData'
import sleep from '@/utils/sleep'
import classNames from '@/utils/classNames'
import { LuSmile } from 'react-icons/lu'
import ReactHtmlParser from 'html-react-parser'
import dayjs from 'dayjs'
import type { CommentInputRef } from '@/components/view/CommentInput'
import type { Comment as CommentType } from '../types'

type CommentsProps = {
    data: CommentType[]
}

type CommentProps = {
    comment: CommentType
    onReply?: (commentId: string, value: string) => void
    onEmojiSelect?: (emoji: string, commentId: string) => void
    onEmojiCancel?: (emoji: string, commentId: string) => void
}

const Comment = ({
    comment,
    onEmojiSelect,
    onEmojiCancel,
    onReply,
}: CommentProps) => {
    const [showReplyInput, setShowReplyInput] = useState(false)

    const handleReply = (commentId: string, value: string) => {
        onReply?.(commentId, value)
        setShowReplyInput(false)
    }

    return (
        <div className="flex gap-2 py-4 w-full">
            <div>
                <Avatar shape="circle" src={comment.src} size={30} />
            </div>
            <div className="rounded-sm w-full">
                <div className="flex items-center mb-1">
                    <span className="font-medium heading-text">
                        {comment.name}
                    </span>
                    <span className="mx-1"> • </span>
                    <span className="text-xs">
                        {dayjs(comment.date).format('hh:mm A')}
                    </span>
                </div>
                <div className="mb-0 prose text-sm prose-p:text-sm prose-p:leading-normal">
                    {ReactHtmlParser(comment.message)}
                </div>
                <div className="flex items-center gap-1 mt-2">
                    {comment?.reactions && comment?.reactions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                            {comment.reactions.map((r) => {
                                if (r.count > 0 && !r.reacted) {
                                    return (
                                        <div key={r.emoji}>
                                            <span>{r.emoji}</span>
                                            <span className="ml-1 font-medium">
                                                {r.count}
                                            </span>
                                        </div>
                                    )
                                }
                                if (r.count > 0 && r.reacted) {
                                    return (
                                        <button
                                            key={r.emoji}
                                            onClick={() =>
                                                onEmojiCancel?.(
                                                    r.emoji,
                                                    comment.id,
                                                )
                                            }
                                            className={classNames(
                                                'flex items-center px-1.5 py-0.5 rounded-full border text-xs',
                                                r.reacted
                                                    ? 'bg-primary-subtle'
                                                    : 'border-primary',
                                            )}
                                        >
                                            <span>{r.emoji}</span>
                                            <span className="ml-1 font-medium">
                                                {r.count}
                                            </span>
                                        </button>
                                    )
                                }
                                return null
                            })}
                        </div>
                    )}
                    <ReactionEmojiPicker
                        trigger={
                            <button className="border border-gray-200 dark:border-gray-800 w-7 h-6 flex items-center justify-center rounded-md heading-text">
                                <LuSmile />
                            </button>
                        }
                        onSelect={(emoji) => onEmojiSelect?.(emoji, comment.id)}
                    />
                    <Divider orientation="vertical" className="min-h-4" />
                    <Button
                        className="font-medium px-1"
                        active={showReplyInput}
                        variant="link"
                        onClick={() => setShowReplyInput(!showReplyInput)}
                    >
                        {showReplyInput ? 'Cancel' : 'Reply'}
                    </Button>
                </div>
                {showReplyInput && (
                    <div className="mt-2">
                        <CommentInput
                            onSubmit={(value) =>
                                handleReply(comment.id, value.message)
                            }
                        />
                    </div>
                )}
                {comment?.replies?.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2">
                                <div>
                                    <Avatar
                                        shape="circle"
                                        src={reply.src}
                                        size={30}
                                    />
                                </div>
                                <div className="rounded-sm w-full">
                                    <div className="flex items-center mb-1">
                                        <span className="font-medium heading-text">
                                            {reply.name}
                                        </span>
                                        <span className="mx-1"> • </span>
                                        <span className="text-xs">
                                            {dayjs(reply.date).format(
                                                'hh:mm A',
                                            )}
                                        </span>
                                    </div>
                                    <div className="mb-0 prose text-sm prose-p:text-sm prose-p:leading-normal">
                                        {ReactHtmlParser(reply.message)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const Comments = ({ data }: CommentsProps) => {
    const [commentInputOpen, setCommentInputOpen] = useState(false)

    const { setData } = useProjectDetailsData()

    const commentRef = useRef<CommentInputRef>(null)

    const handleSubmit = (value: { message: string }) => {
        setData((prev) => ({
            ...prev,
            comments: [
                {
                    id: new Date().getTime().toString(),
                    src: '/img/avatars/thumb-1.jpg',
                    name: 'Angelina Gotelli',
                    date: dayjs().format('YYYY-MM-DD'),
                    message: value.message,
                    replies: [],
                },
                ...prev.comments,
            ],
        }))

        setCommentInputOpen(false)
    }

    const handleInputClick = async () => {
        setCommentInputOpen(true)
        await sleep(50)

        commentRef.current?.handleFocus()
    }

    const handleEmojiClick = (emoji: string, id: string) => {
        setData((prev) => ({
            ...prev,
            comments: prev.comments.map((comment) => {
                if (comment.id === id) {
                    let newReactions = comment.reactions || []

                    if (!newReactions.some((r) => r.emoji === emoji)) {
                        newReactions = [
                            {
                                emoji: emoji,
                                count: 1,
                                reacted: true,
                            },
                        ]
                    } else {
                        newReactions = newReactions.map((r) => {
                            if (r.emoji === emoji && r.reacted) {
                                return r
                            }

                            if (r.emoji === emoji) {
                                return {
                                    ...r,
                                    count: r.count + 1,
                                    reacted: true,
                                }
                            }

                            if (r.reacted) {
                                return {
                                    ...r,
                                    count: r.count - 1,
                                }
                            }

                            return {
                                ...r,
                                reacted: false,
                            }
                        })
                    }

                    return {
                        ...comment,
                        message: comment.message,
                        reactions: newReactions,
                    }
                }
                return comment
            }),
        }))
    }

    const handleEmojiCancel = (emoji: string, id: string) => {
        setData((prev) => ({
            ...prev,
            comments: prev.comments.map((comment) => {
                if (comment.id === id) {
                    let newReactions = comment.reactions || []

                    newReactions = newReactions.map((r) => {
                        if (r.emoji === emoji) {
                            return {
                                ...r,
                                count: r.count - 1,
                                reacted: false,
                            }
                        }
                        return r
                    })

                    return {
                        ...comment,
                        reactions: newReactions,
                    }
                }

                return comment
            }),
        }))
    }

    const handleReply = (commentId: string, value: string) => {
        setData((prev) => ({
            ...prev,
            comments: prev.comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [
                            {
                                id: new Date().getTime().toString(),
                                src: '/img/avatars/thumb-1.jpg',
                                name: 'Angelina Gotelli',
                                date: dayjs().format('YYYY-MM-DD'),
                                message: value,
                            },
                            ...comment.replies,
                        ],
                    }
                }
                return comment
            }),
        }))
    }

    return (
        <div>
            <div className="flex gap-2 py-4">
                <div>
                    <Avatar
                        shape="circle"
                        src="/img/avatars/thumb-1.jpg"
                        size={30}
                    />
                </div>
                {commentInputOpen ? (
                    <CommentInput
                        ref={commentRef}
                        className="w-full"
                        onSubmit={handleSubmit}
                        onCancel={() => setCommentInputOpen(false)}
                    />
                ) : (
                    <Input
                        placeholder="Write a comment..."
                        className="w-full"
                        onClick={handleInputClick}
                        readOnly
                    />
                )}
            </div>
            {data.map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    onEmojiSelect={handleEmojiClick}
                    onEmojiCancel={handleEmojiCancel}
                    onReply={handleReply}
                />
            ))}
        </div>
    )
}

export default Comments
