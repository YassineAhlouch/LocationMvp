import { memo, useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { LuPin } from 'react-icons/lu'
import { truncateText } from '../utils'
import { useAnnouncementsStore } from '../store/announcementsStore'
import type { Announcement } from '../types'

type PinnedAnnouncementCardProps = {
    announcement: Announcement
}

const PinnedAnnouncementCard = memo(
    ({ announcement }: PinnedAnnouncementCardProps) => {
        const { openViewModal } = useAnnouncementsStore()

        const handleViewFull = () => {
            openViewModal(announcement.id)
        }

        const truncatedDescription = useMemo(
            () => truncateText(announcement.description, 100),
            [announcement.description],
        )

        return (
            <article
                className="py-4 focus-within:ring-2 focus-within:ring-primary"
                role="article"
                aria-label={`Pinned announcement: ${announcement.title}`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Avatar
                            size={25}
                            shape="circle"
                            src={announcement.author.avatar}
                            alt={`${announcement.author.name}'s avatar`}
                        />
                        <div>
                            <div className="font-medium heading-text">
                                {announcement.author.name}
                            </div>
                        </div>
                    </div>
                    <Tag className="gap-1 border-0 rounded-full">
                        <LuPin aria-label="Pinned announcement" />
                        <span>Pinned</span>
                    </Tag>
                </div>

                <h6 className=" mb-2 line-clamp-2">{announcement.title}</h6>

                <p className="line-clamp-2 mb-2">{truncatedDescription}</p>

                <Button
                    variant="link"
                    onClick={handleViewFull}
                    aria-label={`View full post: ${announcement.title}`}
                    className="px-0 hover:underline"
                >
                    View Full Post
                </Button>
            </article>
        )
    },
)

PinnedAnnouncementCard.displayName = 'PinnedAnnouncementCard'

export default PinnedAnnouncementCard
