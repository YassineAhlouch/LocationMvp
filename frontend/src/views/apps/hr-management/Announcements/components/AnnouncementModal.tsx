import { useEffect, useRef } from 'react'
import Dialog from '@/components/ui/Dialog'
import Scroll from '@/components/ui/Scroll'
import { useAnnouncementsStore } from '../store/announcementsStore'
import { apiGetAnnouncementsList } from '@/services/HrmService'
import useSWR from 'swr'
import AnnouncementCard from './AnnouncementCard'
import type { Announcement } from '../types'

const AnnouncementModal = () => {
    const {
        modals,
        closeAllModals,
        toggleComments,
        expandedComments,
        selectedCategory,
        dateRange,
        sortBy,
    } = useAnnouncementsStore()

    const { data: announcements } = useSWR<Announcement[]>(
        [
            '/hrm/announcements/list',
            { category: selectedCategory, dateRange, sortBy },
        ],
        ([, params]: [string, Record<string, unknown>]) =>
            apiGetAnnouncementsList<Announcement[]>(params),
        { revalidateOnFocus: false },
    )

    const isOpen = modals.viewAnnouncement.isOpen
    const announcementId = modals.viewAnnouncement.announcementId

    const announcement = announcements?.find((a) => a.id === announcementId)

    const scrollRef = useRef<HTMLDivElement>(null)

    const handleScrollBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    useEffect(() => {
        if (isOpen && announcementId && !expandedComments.has(announcementId)) {
            toggleComments(announcementId)
        }
    }, [isOpen, announcementId, expandedComments, toggleComments])

    return (
        <Dialog
            isOpen={isOpen}
            onClose={closeAllModals}
            width={800}
            closable={false}
            aria-labelledby="announcement-modal-title"
            className="pb-4 px-1"
        >
            {announcement && (
                <Scroll.FlexSize ref={scrollRef} className="max-h-[80vh] px-3">
                    <AnnouncementCard
                        isDialogView
                        announcement={announcement}
                        onClose={closeAllModals}
                        onScrollBottom={handleScrollBottom}
                    />
                </Scroll.FlexSize>
            )}
        </Dialog>
    )
}

export default AnnouncementModal
