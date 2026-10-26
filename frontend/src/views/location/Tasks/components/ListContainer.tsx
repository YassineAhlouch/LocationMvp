import Table from '@/components/ui/Table'
import type { ComponentProps } from 'react'

const ListContainer = ({ children }: ComponentProps<'div'>) => {
    return (
        <>
            <Table.THead>
                <Table.Tr className="bg-transparent">
                    <Table.Th>Ticket</Table.Th>
                    <Table.Th>Subject</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Labels</Table.Th>
                    <Table.Th>Assignee</Table.Th>
                </Table.Tr>
            </Table.THead>
            {children}
        </>
    )
}

export default ListContainer
