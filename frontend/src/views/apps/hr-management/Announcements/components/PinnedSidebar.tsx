import PinnedAnnouncementCard from './PinnedAnnouncementCard'
import { apiGetPinnedAnnouncements } from '@/services/HrmService'
import useSWR from 'swr'
import type { Announcement } from '../types'

const PinnedSidebar = () => {
    const { data: pinnedAnnouncements } = useSWR<Announcement[]>(
        '/hrm/announcements/pinned',
        apiGetPinnedAnnouncements<Announcement[]>,
        { revalidateOnFocus: false },
    )

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {pinnedAnnouncements &&
                pinnedAnnouncements
                    .slice(0, 5)
                    .map((announcement) => (
                        <PinnedAnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                        />
                    ))}
        </div>
    )
}

export default PinnedSidebar
