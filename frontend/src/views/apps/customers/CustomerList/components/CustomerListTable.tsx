import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import useDataTableState from '@/utils/hooks/useDataTableState'
import acronym from '@/utils/acronym'
import formatCurrency from '@/utils/formatCurrency'
import classNames from '@/utils/classNames'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Customer } from '../types'

const statusColor: Record<string, string> = {
    active: ' bg-success',
    inactive: 'bg-warning',
    suspended: 'bg-error',
}

const NameColumn = ({ row }: { row: Customer }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar size={30} shape="circle" src={row.img}>
                {acronym(row.name)}
            </Avatar>
            <Link
                className="hover:text-primary font-medium text-gray-900 dark:text-gray-100"
                to={`/apps/customers/${row.id}/overview`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const CustomerListTable = () => {
    const {
        customerList,
        customerListTotal,
        pagingState,
        isLoading,
        setPagingState,
        setSelectAllRows,
        setSelectedRows,
        selectedRows,
    } = useCustomerList()

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Total Order',
                accessorKey: 'totalSpending',
                cell: (props) => {
                    return (
                        <span>
                            {formatCurrency(
                                props.row.original.totalSpending,
                                'USD',
                            )}
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag
                                className={classNames(
                                    'rounded-full bg-transparent flex items-center gap-1 font-medium',
                                )}
                            >
                                <span
                                    className={classNames(
                                        'w-2 h-2 rounded-full',
                                        statusColor[row.status],
                                    )}
                                ></span>
                                <span className="capitalize">{row.status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Last order',
                accessorKey: 'lastOnline',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {dayjs(row.lastOnline).format('DD MMM YYYY')}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const pagingStateHandler = useDataTableState({
        selectedRows,
        pagingState,
        onPagingChange: setPagingState,
        onRowSelectionChange: setSelectedRows,
        onAllRowSelectChange: setSelectAllRows,
    })

    return (
        <DataTable
            selectable
            columns={columns}
            data={customerList}
            noData={!isLoading && customerList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: customerListTotal,
                pageIndex: pagingState.pageIndex as number,
                pageSize: pagingState.pageSize as number,
            }}
            {...pagingStateHandler}
        />
    )
}

export default CustomerListTable
