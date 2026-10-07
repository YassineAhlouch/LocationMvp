import { useState, useCallback, useMemo } from 'react'
import Progress from '@/components/ui/Progress'
import useSpotOrders from '../hooks/useSpotOrders'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { converActivePairDisplay, sideTagClasses } from '../utils'
import sleep from '@/utils/sleep'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import { LiDocument } from '@/icons'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import type { OpenOrder } from '../types'
import type { ColumnDef } from '@tanstack/react-table'

const OpenOrdersTable = () => {
    const [cancellingOrders, setCancellingOrders] = useState<Set<string>>(
        new Set(),
    )

    const { openOrders, mutate } = useSpotOrders()

    const handleCancelOrder = useCallback(
        async (orderId: string) => {
            setCancellingOrders((prev) => new Set(prev).add(orderId))

            try {
                await sleep(500) // Simulate API delay
                mutate(
                    {
                        orders: openOrders.filter(
                            (order) => order.id !== orderId,
                        ),
                    },
                    false,
                )

                console.log(`Order ${orderId} cancelled successfully`)
            } catch (error) {
                console.error('Failed to cancel order:', error)
            } finally {
                setCancellingOrders((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(orderId)
                    return newSet
                })
            }
        },
        [mutate, openOrders],
    )

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

    // Column definitions for open orders
    const columns = useMemo<ColumnDef<OpenOrder>[]>(
        () => [
            {
                accessorKey: 'date',
                header: 'Date',
                cell: ({ row }) => (
                    <span className="text-nowrap">
                        {dayjs(row.original.date).format('MMM DD, HH:mm A')}
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
                accessorKey: 'price',
                header: 'Price',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatPrice(row.original.price)}
                    </span>
                ),
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                cell: ({ row }) => (
                    <span className="heading-text">
                        {formatAmount(row.original.amount)}
                    </span>
                ),
            },
            {
                accessorKey: 'filled',
                header: 'Filled',
                cell: ({ row }) => {
                    const percentage =
                        (row.original.filled / row.original.amount) * 100
                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                <Progress
                                    showInfo={false}
                                    size="sm"
                                    variant="circle"
                                    strokeWidth={10}
                                    width={28}
                                    percent={percentage}
                                />
                            </div>
                            <div className="text-xs text-nowrap">
                                <div className="heading-text">
                                    {formatAmount(row.original.filled)} /{' '}
                                    {formatAmount(row.original.amount)}
                                </div>
                                <div>{percentage.toFixed(1)}%</div>
                            </div>
                        </div>
                    )
                },
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
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => (
                    <Button
                        className="text-error hover:bg-transparent h-5 border-0"
                        onClick={() => handleCancelOrder(row.original.id)}
                        disabled={cancellingOrders.has(row.original.id)}
                    >
                        Cancel Order
                    </Button>
                ),
            },
        ],
        [
            formatPrice,
            formatAmount,
            formatTotal,
            handleCancelOrder,
            cancellingOrders,
        ],
    )

    // Create table instance
    const table = useReactTable({
        data: openOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (openOrders.length === 0) {
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
                            You don&apos;t have any open orders.
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

export default OpenOrdersTable
