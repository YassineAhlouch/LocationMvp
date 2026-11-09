import Table from '@/components/ui/Table'
import useTranslation from '@/utils/hooks/useTranslation'
import type { ComponentProps } from 'react'

const ListContainer = ({ children }: ComponentProps<'div'>) => {
    const { t } = useTranslation()

    return (
        <>
            <Table.THead>
                <Table.Tr className="bg-transparent">
                    <Table.Th>
                        {t('tasks.columns.ticket', 'Ticket')}
                    </Table.Th>
                    <Table.Th>
                        {t('tasks.columns.subject', 'Subject')}
                    </Table.Th>
                    <Table.Th>
                        {t('tasks.columns.priority', 'Priority')}
                    </Table.Th>
                    <Table.Th>
                        {t('tasks.columns.dueDate', 'Due Date')}
                    </Table.Th>
                    <Table.Th>
                        {t('tasks.columns.labels', 'Labels')}
                    </Table.Th>
                    <Table.Th>
                        {t('tasks.columns.assignee', 'Assignee')}
                    </Table.Th>
                </Table.Tr>
            </Table.THead>
            {children}
        </>
    )
}

export default ListContainer
