import OverflowTabs from '@/components/shared/OverflowTabs'
import classNames from '@/utils/classNames'
import { useNavigate, useLocation } from 'react-router'
import useTranslation from '@/utils/hooks/useTranslation'
import type { ComponentProps } from 'react'

type ProjectTabProps = ComponentProps<'div'> & {
    tabListClass?: string
    className?: string
}

const ProjectTab = ({ children, tabListClass, className }: ProjectTabProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const location = useLocation()
    const currentPath = location.pathname.split('/').pop()

    const handleTabChange = (value: string) => {
        navigate(`/apps/${value}`)
    }

    return (
        <OverflowTabs
            value={currentPath}
            onChange={handleTabChange}
            className={classNames('flex justify-between items-end', className)}
            tabListClass={tabListClass}
            tabList={[
                { label: t('tasks.projectTab.kanban', 'Kanban'), value: 'scrumboard' },
                { label: t('tasks.projectTab.task', 'Task'), value: 'tasks' },
            ]}
        >
            {children}
        </OverflowTabs>
    )
}

export default ProjectTab
