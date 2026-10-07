import Segment from '@/components/ui/Segment'
import CreateProject from './CreateProject'
import Container from '@/components/shared/Container'
import DebouceInput from '@/components/shared/DebouceInput'
import OverflowTabs from '@/components/shared/OverflowTabs'
import { useProjectListStore } from '../store/useProjectListStore'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiTextAlignLeft, LiElement3 } from '@/icons'
import { LuSearch } from 'react-icons/lu'

const ScrumboardHeader = () => {
    const view = useProjectListStore((state) => state.view)
    const selectedStatus = useProjectListStore((state) => state.selectedStatus)
    const setView = useProjectListStore((state) => state.setView)
    const setQuery = useProjectListStore((state) => state.setQuery)
    const setSelectedStatus = useProjectListStore(
        (state) => state.setSelectedStatus,
    )

    const { larger } = useResponsive()

    const renderActionSection = () => (
        <div className="flex items-center gap-2">
            <Segment
                value={view}
                onChange={(value) => setView(value as 'list' | 'grid')}
            >
                <Segment.Item value="list" className="px-2">
                    <LiTextAlignLeft className="text-base" />
                </Segment.Item>
                <Segment.Item value="grid" className="px-2">
                    <LiElement3 className="text-base" />
                </Segment.Item>
            </Segment>
            <DebouceInput
                placeholder="Search"
                prefix={<LuSearch />}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    )

    return (
        <div className="pt-4 px-4 border-b border-gray-200 dark:border-gray-800">
            <Container className="px-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div>
                        <h4>Projects</h4>
                        <p>
                            Browse all projects at a glance. Filter by status,
                            monitor activity, and take action with built-in
                            tools.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                        <div className="w-full sm:w-auto [&>button]:w-full [&>button]:sm:w-auto">
                            <CreateProject />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <OverflowTabs
                        key={location.pathname}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        className="flex justify-between items-center"
                        tabListClass="md:border-0"
                        tabList={[
                            { label: 'All', value: '' },
                            { label: 'Active', value: 'active' },
                            { label: 'Archived', value: 'archived' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'On Hold', value: 'onHold' },
                        ]}
                    >
                        {larger.md && renderActionSection()}
                    </OverflowTabs>
                    {!larger.md && (
                        <div className="py-4">{renderActionSection()}</div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default ScrumboardHeader
