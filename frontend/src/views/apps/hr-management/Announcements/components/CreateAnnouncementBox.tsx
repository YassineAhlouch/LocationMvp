import { useState, useMemo, useRef } from 'react'
import Dropdown from '@/components/ui/Dropdown'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import uniqueId from 'lodash/uniqueId'
import CommentInput from '@/components/view/CommentInput'
import { apiGetAnnouncementCategories } from '@/services/HrmService'
import { useAnnouncementsStore } from '../store/announcementsStore'
import useSWR, { useSWRConfig } from 'swr'
import sleep from '@/utils/sleep'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiChevronDown, LiTick } from '@/icons'
import type { CommentInputRef } from '@/components/view/CommentInput'
import type { Category, Announcement } from '../types'

const CreateAnnouncementBox = () => {
    const { data: categories } = useSWR<Category[]>(
        '/hrm/announcements/categories',
        apiGetAnnouncementCategories<Category[]>,
        { revalidateOnFocus: false },
    )

    const storeSelectedCategory = useAnnouncementsStore(
        (state) => state.selectedCategory,
    )
    const dateRange = useAnnouncementsStore((state) => state.dateRange)
    const sortBy = useAnnouncementsStore((state) => state.sortBy)

    const { mutate } = useSWRConfig()

    const [selectedCategory, setSelectedCategory] = useState('')
    const commentInputRef = useRef<CommentInputRef>(null)

    const currentUser = {
        id: '1',
        name: 'Angelina Gotelli',
        title: 'Employee',
        avatar: '/img/avatars/thumb-1.jpg',
    }

    const categoryOptions = useMemo(
        () =>
            categories
                ?.filter((c) => c.id !== 'all')
                .map((c) => ({
                    value: c.id,
                    label: c.name,
                })) || [],
        [categories],
    )

    const selectedLabel =
        categoryOptions.find((opt) => opt.value === selectedCategory)?.label ||
        'Category'

    const { larger } = useResponsive()

    const handlePost = async (value: { message: string }) => {
        if (!value.message.trim()) {
            toast.push(
                <Notification type="warning" title="Content required">
                    Please enter announcement content
                </Notification>,
            )
            return
        }

        if (!selectedCategory) {
            toast.push(
                <Notification type="warning" title="Category required">
                    Please select a category
                </Notification>,
            )
            return
        }
        await sleep(500)

        toast.push(
            <Notification type="success" title="Announcement posted">
                Your announcement has been published successfully
            </Notification>,
        )

        const newAnnouncement = {
            id: uniqueId('announcement_'),
            author: currentUser,
            category: selectedCategory,
            title: value.message.substring(0, 100).replace(/<[^>]*>/g, ''),
            description: value.message,
            reactions: [],
            comments: [],
            isPinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const swrKey = [
            '/hrm/announcements/list',
            { category: storeSelectedCategory, dateRange, sortBy },
        ]
        mutate(
            swrKey,
            (currentData: Announcement[] | undefined) => [
                newAnnouncement,
                ...(currentData || []),
            ],
            { revalidate: false },
        )
        setSelectedCategory('')
    }

    return (
        <div className="flex gap-2">
            <Avatar
                className="hidden xl:block"
                size="sm"
                shape="circle"
                src={currentUser.avatar}
            />
            <div className="flex-1">
                <CommentInput
                    ref={commentInputRef}
                    onSubmit={handlePost}
                    placeholder={`What's on your mind, ${currentUser.name}?`}
                    extraTools={
                        <Dropdown
                            renderTitle={
                                <Button
                                    size="sm"
                                    icon={<LiChevronDown className="text-xs" />}
                                    iconAlignment="end"
                                >
                                    {larger.xl && selectedLabel}
                                </Button>
                            }
                        >
                            {categoryOptions.map((option) => (
                                <Dropdown.Item
                                    key={option.value}
                                    eventKey={option.value}
                                    onClick={() =>
                                        setSelectedCategory(option.value)
                                    }
                                    active={option.value === selectedCategory}
                                    className="justify-between"
                                >
                                    <span>{option.label}</span>
                                    {option.value === selectedCategory && (
                                        <LiTick className="text-lg" />
                                    )}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    }
                />
            </div>
        </div>
    )
}

export default CreateAnnouncementBox
