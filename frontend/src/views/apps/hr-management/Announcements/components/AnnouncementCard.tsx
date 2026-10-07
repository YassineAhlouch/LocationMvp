import { useState, useMemo, useRef, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import Tag from '@/components/ui/Tag'
import Input from '@/components/ui/Input'
import ReactionEmojiPicker from '@/components/shared/ReactionEmojiPicker'
import formatRelativeTime from '@/utils/formatRelativeTime'
import CommentInput from '@/components/view/CommentInput'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { useAnnouncementsStore } from '../store/announcementsStore'
import { useSWRConfig } from 'swr'
import { truncateText } from '../utils'
import { LiMessage } from '@/icons'
import ReactHtmlParser from 'html-react-parser'
import { LuEllipsis, LuX } from 'react-icons/lu'
import { TbPin } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { CommentInputRef } from '@/components/view/CommentInput'
import type { Announcement } from '../types'

type AnnouncementCardProps = {
    announcement: Announcement
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onPin?: (id: string) => void
    onComment?: (id: string) => void
    onClose?: () => void
    onScrollBottom?: () => void
    isDialogView?: boolean
}

const AnnouncementCard = ({
    announcement,
    onEdit,
    onDelete,
    onPin,
    onComment,
    onClose,
    isDialogView = false,
    onScrollBottom,
}: AnnouncementCardProps) => {
    const {
        expandedComments,
        openViewModal,
        selectedCategory,
        dateRange,
        sortBy,
    } = useAnnouncementsStore()
    const { mutate } = useSWRConfig()
    const swrKey = [
        '/hrm/announcements/list',
        { category: selectedCategory, dateRange, sortBy },
    ]

    const [showCommentInput, setShowCommentInput] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [commentInputValue, setCommentInputValue] = useState('')

    const isCommentsExpanded = expandedComments.has(announcement.id)

    const commentRef = useRef<CommentInputRef>(null)
    const commnentWrapperRef = useRef<HTMLDivElement>(null)

    const updateAnnouncements = (
        updater: (announcements: Announcement[]) => Announcement[],
    ) => {
        mutate(
            swrKey,
            (currentData: Announcement[] | undefined) =>
                updater(currentData || []),
            { revalidate: false },
        )
    }

    const totalReactions = useMemo(
        () => announcement.reactions.reduce((sum, r) => sum + r.count, 0),
        [announcement.reactions],
    )

    const formattedDate = useMemo(
        () => formatRelativeTime(dayjs(announcement.createdAt).toDate()),
        [announcement.createdAt],
    )

    const truncatedDescription = useMemo(
        () => truncateText(announcement.description, 200),
        [announcement.description],
    )

    const shouldShowReadMore = useMemo(
        () => announcement.description.length > 200,
        [announcement.description.length],
    )

    const handleToggleComments = () => {
        // Open modal instead of toggling inline
        openViewModal(announcement.id)
        if (onComment) {
            onComment(announcement.id)
        }
    }

    const handleReactionSelect = async (emoji: string) => {
        updateAnnouncements((announcements) =>
            announcements.map((a) => {
                if (a.id === announcement.id) {
                    let newReactions = [...a.reactions]

                    const existingReactionIndex = newReactions.findIndex(
                        (r) => r.emoji === emoji,
                    )

                    if (existingReactionIndex !== -1) {
                        if (newReactions[existingReactionIndex].reacted) {
                            return a
                        }

                        newReactions = newReactions.map((r, idx) => {
                            if (idx === existingReactionIndex) {
                                return {
                                    ...r,
                                    count: r.count + 1,
                                    reacted: true,
                                }
                            }
                            if (r.reacted) {
                                return {
                                    ...r,
                                    count: Math.max(0, r.count - 1),
                                    reacted: false,
                                }
                            }
                            return r
                        })
                    } else {
                        newReactions = newReactions.map((r) => {
                            if (r.reacted) {
                                return {
                                    ...r,
                                    count: Math.max(0, r.count - 1),
                                    reacted: false,
                                }
                            }
                            return r
                        })
                        newReactions.push({
                            emoji,
                            count: 1,
                            reacted: true,
                            users: [],
                        })
                    }

                    return {
                        ...a,
                        reactions: newReactions,
                    }
                }
                return a
            }),
        )
    }

    const handleReactionCancel = async (emoji: string) => {
        updateAnnouncements((announcements) =>
            announcements.map((a) => {
                if (a.id === announcement.id) {
                    const newReactions = a.reactions.map((r) => {
                        if (r.emoji === emoji && r.reacted) {
                            return {
                                ...r,
                                count: Math.max(0, r.count - 1),
                                reacted: false,
                            }
                        }
                        return r
                    })

                    return {
                        ...a,
                        reactions: newReactions,
                    }
                }
                return a
            }),
        )
    }

    const handleCommentReaction = async (commentId: string, emoji: string) => {
        updateAnnouncements((announcements) =>
            announcements.map((a) => {
                if (a.id === announcement.id) {
                    return {
                        ...a,
                        comments: a.comments.map((c) => {
                            if (c.id === commentId) {
                                let newReactions = [...(c.reactions || [])]
                                const existingReactionIndex =
                                    newReactions.findIndex(
                                        (r) => r.emoji === emoji,
                                    )

                                if (existingReactionIndex !== -1) {
                                    if (
                                        newReactions[existingReactionIndex]
                                            .reacted
                                    ) {
                                        newReactions[existingReactionIndex] = {
                                            ...newReactions[
                                                existingReactionIndex
                                            ],
                                            count:
                                                newReactions[
                                                    existingReactionIndex
                                                ].count - 1,
                                            reacted: false,
                                            users: newReactions[
                                                existingReactionIndex
                                            ].users.filter((u) => u.id !== '1'),
                                        }
                                        if (
                                            newReactions[existingReactionIndex]
                                                .count === 0
                                        ) {
                                            newReactions = newReactions.filter(
                                                (r) => r.emoji !== emoji,
                                            )
                                        }
                                    } else {
                                        newReactions[existingReactionIndex] = {
                                            ...newReactions[
                                                existingReactionIndex
                                            ],
                                            count:
                                                newReactions[
                                                    existingReactionIndex
                                                ].count + 1,
                                            reacted: true,
                                            users: [
                                                ...newReactions[
                                                    existingReactionIndex
                                                ].users,
                                                {
                                                    id: '1',
                                                    name: 'Angelina Gotelli',
                                                },
                                            ],
                                        }
                                    }
                                } else {
                                    newReactions.push({
                                        emoji,
                                        count: 1,
                                        reacted: true,
                                        users: [
                                            {
                                                id: '1',
                                                name: 'Angelina Gotelli',
                                            },
                                        ],
                                    })
                                }

                                return {
                                    ...c,
                                    reactions: newReactions,
                                }
                            }
                            return c
                        }),
                    }
                }
                return a
            }),
        )
    }

    const handleSubmitReply = async (
        commentId: string,
        value: { message: string },
    ) => {
        updateAnnouncements((announcements) =>
            announcements.map((a) => {
                if (a.id === announcement.id) {
                    return {
                        ...a,
                        comments: a.comments.map((c) => {
                            if (c.id === commentId) {
                                const newReply = {
                                    id: new Date().getTime().toString(),
                                    author: {
                                        id: '1',
                                        name: 'Angelina Gotelli',
                                        avatar: '/img/avatars/thumb-1.jpg',
                                    },
                                    text: value.message,
                                    createdAt: dayjs().toISOString(),
                                }
                                return {
                                    ...c,
                                    replies: [...(c.replies || []), newReply],
                                }
                            }
                            return c
                        }),
                    }
                }
                return a
            }),
        )
        setReplyingTo(null)
        onScrollBottom?.()
    }

    const handleInputClick = async () => {
        setShowCommentInput(true)
        await sleep(50)
        commentRef.current?.handleFocus()
        onScrollBottom?.()
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showCommentInput &&
                commnentWrapperRef.current &&
                !commnentWrapperRef.current.contains(event.target as Node)
            ) {
                if (!commentInputValue || commentInputValue.trim() === '') {
                    setShowCommentInput(false)
                }
            }
        }

        if (showCommentInput) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showCommentInput, commentInputValue])

    return (
        <div
            className="py-4"
            role="article"
            aria-label={`Post by ${announcement.author.name}`}
        >
            <div className="flex gap-2 w-full">
                <div
                    className={classNames(
                        'flex  gap-2',
                        isCommentsExpanded &&
                            isDialogView &&
                            announcement.comments.length > 0 &&
                            'flex-col justify-center items-center',
                    )}
                >
                    <Avatar
                        size="sm"
                        shape="circle"
                        src={announcement.author.avatar}
                        alt={`${announcement.author.name}'s avatar`}
                    />
                    {isCommentsExpanded &&
                        isDialogView &&
                        announcement.comments.length > 0 && (
                            <div className="bg-gray-200 dark:bg-gray-700 w-0.5 flex-1"></div>
                        )}
                </div>
                <div className="w-full">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div>
                                    <div className="flex items-center gap-2 leading-1.25">
                                        <div className="flex items-center gap-1">
                                            <span className="heading-text font-semibold">
                                                {announcement.author.name}
                                            </span>
                                            <span>•</span>
                                            <time
                                                className="text-xs font-medium"
                                                dateTime={
                                                    announcement.createdAt
                                                }
                                            >
                                                {formattedDate}
                                            </time>
                                        </div>
                                    </div>
                                    <span className="text-xs">
                                        {announcement.author.title}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {announcement.isPinned && (
                                    <Tag className="gap-1 border-0 rounded-full">
                                        <TbPin aria-label="Pinned announcement" />
                                        <span>Pinned</span>
                                    </Tag>
                                )}
                                <Dropdown
                                    placement="bottom-end"
                                    renderTitle={
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            icon={<LuEllipsis />}
                                            aria-label="Announcement options"
                                        />
                                    }
                                >
                                    <Dropdown.Item
                                        onClick={() =>
                                            onEdit?.(announcement.id)
                                        }
                                    >
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => onPin?.(announcement.id)}
                                    >
                                        {announcement.isPinned
                                            ? 'Unpin'
                                            : 'Pin'}
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() =>
                                            onDelete?.(announcement.id)
                                        }
                                    >
                                        Delete
                                    </Dropdown.Item>
                                </Dropdown>
                                {isDialogView && (
                                    <Button
                                        size="sm"
                                        icon={<LuX />}
                                        variant="ghost"
                                        onClick={onClose}
                                        aria-label="Close dialog"
                                    ></Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 mt-4">
                        <h6 className="font-semibold mb-2">
                            {announcement.title}
                        </h6>
                        <div className="mb-2 heading-text">
                            <p className="whitespace-pre-wrap">
                                {showFullDescription
                                    ? announcement.description
                                    : truncatedDescription}
                            </p>
                            {shouldShowReadMore && (
                                <button
                                    onClick={() =>
                                        setShowFullDescription(
                                            !showFullDescription,
                                        )
                                    }
                                    className="heading-text hover:underline text-sm mt-1"
                                    aria-expanded={showFullDescription}
                                    aria-label={
                                        showFullDescription
                                            ? 'Show less content'
                                            : 'Show more content'
                                    }
                                >
                                    {showFullDescription
                                        ? 'Show less'
                                        : 'Read more'}
                                </button>
                            )}
                        </div>
                        {announcement.media &&
                            announcement.media.length > 0 && (
                                <div
                                    className={classNames(
                                        'mb-4',
                                        announcement.media.length > 1 &&
                                            'grid-cols-2 grid gap-2',
                                    )}
                                    role="group"
                                    aria-label="Announcement media"
                                >
                                    {announcement.media.map((media) => (
                                        <div
                                            key={media.id}
                                            className="rounded-lg overflow-hidden"
                                            aria-label={`View ${media.type}: ${media.name}`}
                                        >
                                            {media.type === 'photo' && (
                                                <img
                                                    src={media.url}
                                                    alt={media.name}
                                                    className={classNames(
                                                        'w-full object-cover',
                                                        announcement.media &&
                                                            announcement?.media
                                                                ?.length > 1 &&
                                                            'h-48',
                                                    )}
                                                    loading="lazy"
                                                />
                                            )}
                                            {media.type === 'video' && (
                                                <div className="relative">
                                                    <video
                                                        src={media.url}
                                                        className="w-full h-48 object-cover"
                                                        aria-label={media.name}
                                                        preload="metadata"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                        <div
                                                            className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"
                                                            aria-hidden="true"
                                                        >
                                                            <div className="w-0 h-0 border-l-8 border-l-gray-800 border-y-6 border-y-transparent ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <div
                                    className="flex items-center gap-1"
                                    role="group"
                                    aria-label={`${totalReactions} reactions`}
                                >
                                    <ReactionEmojiPicker
                                        onSelect={handleReactionSelect}
                                        placement="top-start"
                                    />
                                    {announcement.reactions.map((r) => {
                                        if (r.count > 0 && !r.reacted) {
                                            return (
                                                <button
                                                    key={r.emoji}
                                                    className={classNames(
                                                        'flex items-center justify-center h-7 px-1.5 space-x-1 rounded-md border border-gray-200 dark:border-gray-700 text-xs heading-text hover:bg-gray-100 dark:hover:bg-gray-800',
                                                    )}
                                                    onClick={() =>
                                                        handleReactionSelect(
                                                            r.emoji,
                                                        )
                                                    }
                                                >
                                                    <span>{r.emoji}</span>
                                                    <span>{r.count}</span>
                                                </button>
                                            )
                                        }
                                        if (r.count > 0 && r.reacted) {
                                            return (
                                                <button
                                                    key={r.emoji}
                                                    onClick={() =>
                                                        handleReactionCancel(
                                                            r.emoji,
                                                        )
                                                    }
                                                    className={classNames(
                                                        'flex items-center justify-center h-7 px-1.5 space-x-1 rounded-md border text-xs heading-text',
                                                        r.reacted
                                                            ? 'bg-primary-subtle border-primary'
                                                            : 'border-gray-200 dark:border-gray-700',
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
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    icon={<LiMessage />}
                                    onClick={handleToggleComments}
                                    aria-expanded={isCommentsExpanded}
                                    aria-label={`${
                                        isCommentsExpanded ? 'Hide' : 'Show'
                                    } ${announcement.comments.length} comments`}
                                    className="text-sm"
                                >
                                    Comment ({announcement.comments.length})
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isCommentsExpanded && isDialogView && (
                <div
                    className={classNames(
                        'space-y-4 mt-4 pl-1',
                        showCommentInput ? 'pb-28' : 'pb-8',
                    )}
                    role="region"
                    aria-label="Comments"
                >
                    {announcement.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 w-full">
                            <div>
                                <Avatar
                                    shape="circle"
                                    src={comment.author.avatar}
                                    size={25}
                                    alt={`${comment.author.name}'s avatar`}
                                />
                            </div>
                            <div className="rounded-sm w-full">
                                <div className="flex items-center mb-1">
                                    <span className="font-medium heading-text">
                                        {comment.author.name}
                                    </span>
                                    <span className="mx-1"> • </span>
                                    <time
                                        className="text-xs"
                                        dateTime={comment.createdAt}
                                    >
                                        {dayjs(comment.createdAt).format(
                                            'hh:mm A',
                                        )}
                                    </time>
                                </div>
                                <div className="mb-0 heading-text">
                                    {ReactHtmlParser(comment.text)}
                                </div>

                                <div className="flex items-center gap-1 mt-2">
                                    <div className="flex items-center gap-1">
                                        <ReactionEmojiPicker
                                            onSelect={(emoji) =>
                                                handleCommentReaction(
                                                    comment.id,
                                                    emoji,
                                                )
                                            }
                                        />
                                        {comment.reactions &&
                                            comment.reactions.length > 0 && (
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {comment.reactions.map(
                                                        (reaction) => (
                                                            <button
                                                                key={
                                                                    reaction.emoji
                                                                }
                                                                className={classNames(
                                                                    'flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-200 dark:border-gray-700 heading-text transition-colors',
                                                                    reaction.reacted
                                                                        ? 'bg-primary-subtle border-primary'
                                                                        : 'border-gray-200 dark:border-gray-700',
                                                                )}
                                                                onClick={() =>
                                                                    handleCommentReaction(
                                                                        comment.id,
                                                                        reaction.emoji,
                                                                    )
                                                                }
                                                                aria-label={`${
                                                                    reaction.emoji
                                                                } reaction, ${
                                                                    reaction.count
                                                                } ${
                                                                    reaction.count ===
                                                                    1
                                                                        ? 'person'
                                                                        : 'people'
                                                                }`}
                                                            >
                                                                <span>
                                                                    {
                                                                        reaction.emoji
                                                                    }
                                                                </span>
                                                                <span className="font-medium">
                                                                    {
                                                                        reaction.count
                                                                    }
                                                                </span>
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                                {replyingTo === comment.id && (
                                    <div className="mt-2">
                                        <CommentInput
                                            ref={commentRef}
                                            onSubmit={(value) =>
                                                handleSubmitReply(
                                                    comment.id,
                                                    value,
                                                )
                                            }
                                            onCancel={() => setReplyingTo(null)}
                                        />
                                    </div>
                                )}
                                {comment.replies &&
                                    comment.replies.length > 0 && (
                                        <div className="mt-4 space-y-4">
                                            {comment.replies.map((reply) => (
                                                <div
                                                    key={reply.id}
                                                    className="flex gap-2"
                                                >
                                                    <div>
                                                        <Avatar
                                                            shape="circle"
                                                            src={
                                                                reply.author
                                                                    .avatar
                                                            }
                                                            size={25}
                                                            alt={`${reply.author.name}'s avatar`}
                                                        />
                                                    </div>
                                                    <div className="rounded-sm w-full">
                                                        <div className="flex items-center mb-1">
                                                            <span className="font-medium heading-text">
                                                                {
                                                                    reply.author
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="mx-1">
                                                                {' '}
                                                                •{' '}
                                                            </span>
                                                            <time
                                                                className="text-xs"
                                                                dateTime={
                                                                    reply.createdAt
                                                                }
                                                            >
                                                                {dayjs(
                                                                    reply.createdAt,
                                                                ).format(
                                                                    'hh:mm A',
                                                                )}
                                                            </time>
                                                        </div>
                                                        <div className="mb-0  heading-text">
                                                            {ReactHtmlParser(
                                                                reply.text,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-2 pt-2 absolute bottom-0 left-0 px-4 py-2 bg-white dark:bg-gray-800 w-full">
                        <Avatar
                            shape="circle"
                            src="/img/avatars/thumb-1.jpg"
                            size={25}
                            alt="Your avatar"
                        />
                        <div className="flex-1">
                            {!showCommentInput && (
                                <div className="-mt-1">
                                    <Input
                                        placeholder="What are in your mind?"
                                        onClick={handleInputClick}
                                        readOnly
                                    />
                                </div>
                            )}
                            <div ref={commnentWrapperRef}>
                                {showCommentInput && (
                                    <CommentInput
                                        ref={commentRef}
                                        onChange={(value) =>
                                            setCommentInputValue(value)
                                        }
                                        onSubmit={(value) => {
                                            updateAnnouncements(
                                                (announcements) =>
                                                    announcements.map((a) => {
                                                        if (
                                                            a.id ===
                                                            announcement.id
                                                        ) {
                                                            const newComment = {
                                                                id: new Date()
                                                                    .getTime()
                                                                    .toString(),
                                                                author: {
                                                                    id: '1',
                                                                    name: 'Angelina Gotelli',
                                                                    avatar: '/img/avatars/thumb-1.jpg',
                                                                },
                                                                text: value.message,
                                                                createdAt:
                                                                    dayjs().toISOString(),
                                                                replies: [],
                                                                reactions: [],
                                                            }
                                                            return {
                                                                ...a,
                                                                comments: [
                                                                    ...a.comments,
                                                                    newComment,
                                                                ],
                                                            }
                                                        }
                                                        return a
                                                    }),
                                            )
                                            setCommentInputValue('')
                                            setShowCommentInput(false)
                                        }}
                                        onCancel={() => {
                                            setShowCommentInput(false)
                                            setCommentInputValue('')
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnnouncementCard
