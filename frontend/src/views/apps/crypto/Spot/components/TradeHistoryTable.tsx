import { useCallback, useMemo } from 'react'
import { apiGetTradeHistory } from '@/services/CryptoService'
import Tag from '@/components/ui/Tag'
import Table from '@/components/ui/Table'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { converActivePairDisplay, sideTagClasses } from '../utils'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import { LiDocument } from '@/icons'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import useSWR from 'swr'
import type { TradeHistory } from '../types'
import type { ColumnDef } from '@tanstack/react-table'

const TradeHistoryTable = () => {
    const { data: tradeHistoryData } = useSWR(
        '/api/crypto/spot/trades/history',
        () => apiGetTradeHistory<{ trades: TradeHistory[] }>(),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 2000,
        },
    )

    const tradeHistory = useMemo(
        () => tradeHistoryData?.trades || [],
        [tradeHistoryData],
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

    // Column definitions for trade history
    const columns = useMemo<ColumnDef<TradeHistory>[]>(
        () => [
            {
                accessorKey: 'dateTime',
                header: 'Date/Time',
                cell: ({ row }) => (
                    <span className="text-nowrap">
                        {dayjs(row.original.dateTime).format('MMM DD, HH:mm A')}
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
                accessorKey: 'total',
                header: 'Total',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatTotal(row.original.total)}
                    </span>
                ),
            },
            {
                accessorKey: 'fee',
                header: 'Fee',
                cell: ({ row }) => (
                    <span className="text-gray-600 dark:text-gray-300">
                        {row.original.fee.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                        })}
                    </span>
                ),
            },
            {
                accessorKey: 'feeAsset',
                header: 'Fee Asset',
                cell: ({ row }) => (
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {row.original.feeAsset}
                    </span>
                ),
            },
        ],
        [formatPrice, formatAmount, formatTotal],
    )

    const table = useReactTable({
        data: tradeHistory,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="h-full flex flex-col">
            <div>
                {tradeHistory.length === 0 ? (
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
                                <h5>No Trades Record</h5>
                                <p className="max-w-[400px] mt-2">
                                    You don&apos;t have any orders yet.
                                </p>
                            </div>
                        </EmptyState>
                    </div>
                ) : (
                    <Table>
                        <Table.THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Table.Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Table.Th key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
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
                )}
            </div>
        </div>
    )
}

export default TradeHistoryTable
