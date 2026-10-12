import OverflowTabs from '@/components/shared/OverflowTabs'
import classNames from '@/utils/classNames'
import { useNavigate, useLocation } from 'react-router'
import type { ComponentProps } from 'react'

type ProjectTabProps = ComponentProps<'div'> & {
    tabListClass?: string
    className?: string
}

const ProjectTab = ({ children, tabListClass, className }: ProjectTabProps) => {
    const navigate = useNavigate()

    const location = useLocation()
    const currentPath = location.pathname.split('/').pop()

    const handleTabChange = (value: string) => {
        navigate(`/apps/projects/${value}`)
    }

    return (
        <OverflowTabs
            value={currentPath}
            onChange={handleTabChange}
            className={classNames('flex justify-between items-end', className)}
            tabListClass={tabListClass}
            tabList={[
                { label: 'Kanban', value: 'scrumboard' },
                { label: 'Task', value: 'tasks' },
                { label: 'Timeline', value: 'timeline' },
            ]}
        >
            {children}
        </OverflowTabs>
    )
}

export default ProjectTab
