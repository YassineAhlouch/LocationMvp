import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ProjectTab from '@/components/view/ProjectTab'
import ShareProjectDialog from '@/components/view/ShareProjectDialog'
import useTasksData from '../hooks/useTasksData'
import { permissionRoleMap } from '../utils'

const TasksHeader = () => {
    const { projectMeta, setProjectMeta } = useTasksData()

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
                            <ShareProjectDialog
                                data={projectMeta}
                                setData={setProjectMeta}
                                permissionRoleMap={permissionRoleMap}
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
