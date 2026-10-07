import Avatar from '@/components/ui/Avatar'
import Container from '@/components/shared/Container'
import ToggleDrawer from '@/components/shared/ToggleDrawer'
import SummaryPanel from './SummaryPanel'
import useResponsive from '@/utils/hooks/useResponsive'
import type { Project } from '../types'

type ProjectDetailsContentProps = {
    data: Project
}

const ProjectDetailsHeader = ({ data }: ProjectDetailsContentProps) => {
    const { larger } = useResponsive()

    return (
        <div className="px-2 py-4 md:px-4 border-b border-gray-200 dark:border-gray-800">
            <Container className="px-4">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Avatar src={data.img} size={40} />
                        <div>
                            <h5>{data.name}</h5>
                            <p className="hidden sm:block">
                                {data.description}
                            </p>
                        </div>
                    </div>
                    {!larger.lg && (
                        <ToggleDrawer placement="right" title="Project Summary">
                            <div className="p-4">
                                <SummaryPanel data={data} />
                            </div>
                        </ToggleDrawer>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default ProjectDetailsHeader
