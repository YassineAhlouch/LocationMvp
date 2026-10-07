import ProjectListHeader from './components/ProjectListHeader'
import ProjectListContent from './components/ProjectListContent'
import ProjectListContext from './components/ProjectListContext'

const ProjectList = () => {
    return (
        <ProjectListContext>
            <div className="flex flex-col h-full">
                <ProjectListHeader />
                <ProjectListContent />
            </div>
        </ProjectListContext>
    )
}

export default ProjectList
