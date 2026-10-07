import ToggleDrawer from '@/components/shared/ToggleDrawer'
import AnnouncementFilters from './AnnouncementFilters'
import AnnouncementsSidebar from './AnnouncementsSidebar'

const AnnouncementHeader = () => {
    return (
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <div className="lg:hidden">
                    <ToggleDrawer
                        title="Categories"
                        placement="left"
                        width={280}
                    >
                        <AnnouncementsSidebar />
                    </ToggleDrawer>
                </div>
                <h4>Announcements</h4>
            </div>
            <AnnouncementFilters />
        </div>
    )
}

export default AnnouncementHeader
