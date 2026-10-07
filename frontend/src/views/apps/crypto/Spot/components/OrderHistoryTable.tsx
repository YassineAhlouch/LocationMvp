import { useCallback, useMemo } from 'react'
import { apiGetOrderHistory } from '@/services/CryptoService'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import {
    converActivePairDisplay,
    sideTagClasses,
    statusTagClasses,
} from '../utils'
import classNames from '@/utils/classNames'
import { LiDocument } from '@/icons'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import useSWR from 'swr'
import type { OrderHistory } from '../types'
import type { ColumnDef } from '@tanstack/react-table'

const OrderHistoryTable = () => {
    const { data: orderHistoryData } = useSWR(
        '/api/crypto/spot/orders/history',
        () => apiGetOrderHistory<{ orders: OrderHistory[] }>(),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 2000,
        },
    )

    const orderHistory = orderHistoryData?.orders || []

    const formatDateTime = useCallback((date: Date) => {
        return new Date(date).toLocaleString(undefined, {
            month: 'short',
            day: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }, [])

    const formatPrice = useCallback((price: number) => {
        return price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        })
    }, [])

    const formatAmount = useCallback((amount: number) => {
        return amount.toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 6,
        })
    }, [])

    const formatTotal = useCallback((total: number) => {
        return total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }, [])

    const columns = useMemo<ColumnDef<OrderHistory>[]>(
        () => [
            {
                accessorKey: 'dateTime',
                header: 'Date/Time',
                cell: ({ row }) => (
                    <span className="text-nowrap">
                        {formatDateTime(row.original.dateTime)}
                    </span>
                ),
            },
            {
                accessorKey: 'pair',
                header: 'Pair',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {converActivePairDisplay(row.original.pair)}
                    </span>
                ),
            },
            {
                accessorKey: 'type',
                header: 'Type',
                cell: ({ row }) => (
                    <span className="capitalize text-gray-600 dark:text-gray-300">
                        {row.original.type}
                    </span>
                ),
            },
            {
                accessorKey: 'side',
                header: 'Side',
                cell: ({ row }) => (
                    <Tag
                        className={classNames(
                            'capitalize border-0',
                            sideTagClasses[row.original.side],
                        )}
                    >
                        {row.original.side}
                    </Tag>
                ),
            },
            {
                accessorKey: 'averagePrice',
                header: 'Avg Price',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {row.original.averagePrice > 0
                            ? formatPrice(row.original.averagePrice)
                            : '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'price',
                header: 'Price',
                cell: ({ row }) => (
                    <span className="heading-text">
                        {formatPrice(row.original.price)}
                    </span>
                ),
            },
            {
                accessorKey: 'executed',
                header: 'Executed/Amount',
                cell: ({ row }) => (
                    <div className="heading-text">
                        {formatAmount(row.original.executed)} /{' '}
                        {formatAmount(row.original.amount)}
                    </div>
                ),
            },
            {
                accessorKey: 'total',
                header: 'Total',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatTotal(row.original.total)}
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <Tag className="text-xs capitalize bg-white dark:bg-gray-800 gap-1">
                        <Badge
                            className={classNames(
                                'w-2 h-2 rounded-full',
                                statusTagClasses[row.original.status],
                            )}
                        />
                        {row.original.status}
                    </Tag>
                ),
            },
        ],
        [formatDateTime, formatPrice, formatAmount, formatTotal],
    )

    // Create table instance
    const table = useReactTable({
        data: orderHistory,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (orderHistory.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center my-8">
                <EmptyState
                    variant="dots"
                    size={250}
                    offset={-70}
                    illustration={
                        <IconFrame className="bg-white dark:bg-gray-700">
                            <LiDocument className="text-xl heading-text" />
                        </IconFrame>
                    }
                >
                    <div className="text-center">
                        <h5>No Orders</h5>
                        <p className="max-w-[400px] mt-2">
                            You don&apos;t have any orders yet.
                        </p>
                    </div>
                </EmptyState>
            </div>
        )
    }

    return (
        <Table hoverable>
            <Table.THead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Table.Th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                      )}
                            </Table.Th>
                        ))}
                    </Table.Tr>
                ))}
            </Table.THead>
            <Table.TBody>
                {table.getRowModel().rows.map((row) => (
                    <Table.Tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <Table.Td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            </Table.Td>
                        ))}
                    </Table.Tr>
                ))}
            </Table.TBody>
        </Table>
    )
}

export default OrderHistoryTable
