import ProjectDetailsContext from './components/ProjectDetailsContext'
import ProjectDetailsLayout from './components/ProjectDetailsLayout'
const ProjectDetails = () => {
    return (
        <ProjectDetailsContext>
            <ProjectDetailsLayout />
        </ProjectDetailsContext>
    )
}

export default ProjectDetails
