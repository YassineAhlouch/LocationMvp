import Container from '@/components/shared/Container'
import AnnouncementsSidebar from './components/AnnouncementsSidebar'
import AnnouncementsFeed from './components/AnnouncementsFeed'
import PinnedSidebar from './components/PinnedSidebar'
import AnnouncementModal from './components/AnnouncementModal'
import AnnouncementHeader from './components/AnnouncementHeader'

const Announcements = () => {
    return (
        <>
            <Container>
                <AnnouncementHeader />
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="hidden lg:block lg:min-w-[160px] 2xl:min-w-[260px]">
                        <AnnouncementsSidebar />
                    </div>
                    <AnnouncementsFeed />
                    <div className="lg:min-w-[220px] 2xl:min-w-[360px] max-w-[360px]">
                        <PinnedSidebar />
                    </div>
                </div>
            </Container>
            <AnnouncementModal />
        </>
    )
}

export default Announcements
