import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import PeriodPicker from '@/components/shared/PeriodPicker'
import ProjectTab from '@/components/view/ProjectTab'
import useTasksData from '../hooks/useTasksData'
import { useTasksStore } from '../store/tasksStore'

const TasksHeader = () => {
    const { projectMeta } = useTasksData()

    const dateRange = useTasksStore((state) => state.dateRange)
    const setDateRange = useTasksStore((state) => state.setDateRange)

    return (
        <div className="pt-4 px-4 border-b border-gray-200 dark:border-gray-800">
            {projectMeta && (
                <>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                            <h4 className="">{projectMeta.title}</h4>
                            <p className="mt-2">{projectMeta.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <UsersAvatarGroup
                                users={projectMeta.participantMembers}
                            />
                            <PeriodPicker
                                value={dateRange}
                                onChange={setDateRange}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <ProjectTab tabListClass="border-0" />
                    </div>
                </>
            )}
        </div>
    )
}

export default TasksHeader
