import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Table from '@/components/ui/Table'

const { THead, Tr, Th } = Table

const TableRowSkeletonDemo = () => {
    return (
        <Table>
            <THead>
                <Tr>
                    <Th>User</Th>
                    <Th>Email</Th>
                    <Th>Status</Th>
                </Tr>
            </THead>
            <TableRowSkeleton columns={3} rows={3} avatarInColumns={[0]} />
        </Table>
    )
}

export default TableRowSkeletonDemo
