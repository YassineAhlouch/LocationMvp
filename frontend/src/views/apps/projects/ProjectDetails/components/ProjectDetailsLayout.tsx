import ProjectDetailsHeader from './ProjectDetailsHeader'
import ProjectDetailsContent from './ProjectDetailsContent'
import Loading from '@/components/shared/Loading'
import useProjectDetailsData from '../hooks/useProjectDetailsData'

const ProjectDetailsLayout = () => {
    const { data, isLoading } = useProjectDetailsData()

    return (
        <div className="flex flex-col h-full">
            <Loading loading={isLoading}>
                {data && (
                    <>
                        <ProjectDetailsHeader data={data} />
                        <ProjectDetailsContent data={data} />
                    </>
                )}
            </Loading>
        </div>
    )
}

export default ProjectDetailsLayout
