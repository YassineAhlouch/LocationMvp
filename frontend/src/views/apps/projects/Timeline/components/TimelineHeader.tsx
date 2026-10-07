import Select from '@/components/ui/Select'
import { ViewMode } from '@/components/shared/Gantt/constants'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ProjectTab from '@/components/view/ProjectTab'
import ShareProjectDialog from '@/components/view/ShareProjectDialog'
import useTimelineData from '../hooks/useTimeLineData'
import { useTimelineStore } from '../store/timelineStore'
import { permissionRoleMap } from '../utils'
import useResponsive from '@/utils/hooks/useResponsive'
import { HiOutlineCalendar } from 'react-icons/hi'
import { LuClock } from 'react-icons/lu'

type TimelineHeaderProps = {
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
}

const TimelineHeader = ({
    viewMode,
    onViewModeChange,
}: TimelineHeaderProps) => {
    const { projects, sprints, updateProject, isLoading } = useTimelineData()

    const { larger, smaller } = useResponsive()

    const selectedSprint = useTimelineStore((state) => state.selectedSprint)
    const setSelectedSprint = useTimelineStore(
        (state) => state.setSelectedSprint,
    )

    const viewModeOptions = [
        {
            value: ViewMode.Week,
            label: 'Week',
            icon: <HiOutlineCalendar className="w-4 h-4" />,
        },
        {
            value: ViewMode.Day,
            label: 'Day',
            icon: <LuClock className="w-4 h-4" />,
        },
        {
            value: ViewMode.Hour,
            label: 'Hour',
            icon: <LuClock className="w-4 h-4" />,
        },
    ]

    const sprintOptions = [
        { value: '', label: 'All Sprints' },
        ...(sprints || []),
    ]

    const handleSprintChange = (option: { value: string; label: string }) => {
        setSelectedSprint(option.value)
    }

    const handleViewModeChange = (option: {
        value: ViewMode
        label: string
    }) => {
        if (option) {
            onViewModeChange(option.value)
        }
    }

    const getCurrentSprint = () =>
        sprints?.find((sprint) => sprint.value === selectedSprint)

    const renderActionSection = () => (
        <div className="flex items-center gap-2 my-2">
            <div className="min-w-[150px]">
                <Select
                    placeholder="Select sprint"
                    options={sprintOptions}
                    value={sprintOptions.find((opt) =>
                        selectedSprint
                            ? opt.value === selectedSprint
                            : opt.value === '',
                    )}
                    onChange={handleSprintChange}
                    isDisabled={isLoading}
                />
            </div>
            <div className="min-w-[150px]">
                <Select
                    placeholder="View mode"
                    options={viewModeOptions}
                    value={viewModeOptions.find(
                        (opt) => opt.value === viewMode,
                    )}
                    onChange={handleViewModeChange}
                />
            </div>
        </div>
    )

    return (
        <div className="pt-4 px-4 border-b border-gray-200 dark:border-gray-800 ">
            {projects && (
                <>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                            <h4 className="">
                                {getCurrentSprint()?.label ||
                                    'Project Timeline'}
                            </h4>
                            <p className="mt-2">{projects.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <UsersAvatarGroup
                                users={projects.participantMembers}
                            />
                            <ShareProjectDialog
                                data={projects}
                                setData={updateProject}
                                permissionRoleMap={permissionRoleMap}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <ProjectTab tabListClass="lg:border-0 lg:mx-0 -mx-4">
                            {larger.lg && renderActionSection()}
                        </ProjectTab>
                        {smaller.lg && renderActionSection()}
                    </div>
                </>
            )}
        </div>
    )
}

export default TimelineHeader
