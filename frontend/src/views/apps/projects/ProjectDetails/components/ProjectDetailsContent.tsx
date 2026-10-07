import CollaborationSection from './CollaborationSection'
import SummaryPanel from './SummaryPanel'
import Container from '@/components/shared/Container'
import ReactHtmlParser from 'html-react-parser'
import type { Project } from '../types'

type ProjectDetailsContentProps = {
    data: Project
}

const ProjectDetailsContent = ({ data }: ProjectDetailsContentProps) => {
    return (
        <Container className="h-full">
            <div className="flex justify-between gap-4 h-full">
                <div className="p-4 flex-1 min-w-0">
                    <div className="prose max-w-[900px] prose-p:text-sm prose-p:my-0 prose-ul:my-0 prose-ul:text-sm prose-h6:mb-2 prose-h6:font-semibold my-4 ">
                        {ReactHtmlParser(data.detailDescription)}
                    </div>
                    <div className="mt-12">
                        <CollaborationSection data={data} />
                    </div>
                </div>
                <div className="hidden lg:block w-[250px] lg:w-[400px] ltr:border-l rtl:border-r border-gray-200 dark:border-gray-800 p-4">
                    <SummaryPanel data={data} />
                </div>
            </div>
        </Container>
    )
}

export default ProjectDetailsContent
