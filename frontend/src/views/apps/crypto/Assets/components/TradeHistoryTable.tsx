import { useMemo } from 'react'
import useSWR from 'swr'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { useAssetsStore } from '../store/assetsStore'
import { apiGetPortfolioTrades } from '@/services/CryptoService'
import { tradeTypeColors, statusColors } from '../utils'
import classNames from '@/utils/classNames'
import formatCurrency from '@/utils/formatCurrency'
import type { ColumnDef } from '@tanstack/react-table'
import type { OnSortParam } from '@/components/shared/DataTable'
import type { TradeHistory } from '../types'

const TradeHistoryTable = () => {
    const tradesTableState = useAssetsStore((state) => state.tableState.trades)
    const setTablePagination = useAssetsStore(
        (state) => state.setTablePagination,
    )
    const setTablePageSize = useAssetsStore((state) => state.setTablePageSize)
    const setTableSort = useAssetsStore((state) => state.setTableSort)

    const { data: tradesResponse, isLoading } = useSWR(
        ['/api/crypto/portfolio/trades', tradesTableState],
        ([, tableState]) =>
            apiGetPortfolioTrades<{ data: TradeHistory[]; total: number }>({
                pageIndex: tableState.pageIndex,
                pageSize: tableState.pageSize,
                sortKey: tableState.sortKey,
                sortOrder: tableState.sortOrder,
                query: tableState.query,
            }),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
        },
    )

    const tradeHistoryData = tradesResponse?.data
    const tradesPagination = {
        total: tradesResponse?.total || 0,
        pageIndex: tradesTableState.pageIndex,
        pageSize: tradesTableState.pageSize,
    }

    const columns: ColumnDef<TradeHistory>[] = useMemo(
        () => [
            {
                header: 'Date',
                accessorKey: 'date',
                cell: ({ row }) => {
                    const trade = row.original
                    const date = new Date(trade.date)
                    return (
                        <div>
                            <div className="font-medium heading-text">
                                {date.toLocaleDateString()}
                            </div>
                            <div>
                                {date.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: ({ row }) => {
                    const trade = row.original
                    const config = tradeTypeColors[trade.type]
                    return (
                        <Tag className="bg-transparent gap-1">
                            <Badge
                                className={classNames(`w-2 h-2`, config.color)}
                            />
                            {config.label}
                        </Tag>
                    )
                },
            },
            {
                header: 'Asset',
                accessorKey: 'asset',
                cell: ({ row }) => {
                    const trade = row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={25}
                                src={trade.icon}
                                alt={trade.name}
                                shape="circle"
                                className="border-0 bg-transparent"
                            />
                            <div>
                                <div className="font-medium heading-text">
                                    {trade.name}
                                </div>
                                <div className="text-xs">{trade.asset}</div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: ({ row }) => {
                    const trade = row.original
                    return (
                        <div className="heading-text">
                            {trade.amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 6,
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'Value',
                accessorKey: 'value',
                cell: ({ row }) => {
                    const trade = row.original
                    return (
                        <div className="heading-text">
                            {formatCurrency(trade.value, 'USD')}
                        </div>
                    )
                },
            },
            {
                header: 'Fee',
                accessorKey: 'fee',
                cell: ({ row }) => {
                    const trade = row.original
                    return (
                        <span className="heading-text">
                            {formatCurrency(trade.fee, 'USD')}
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const trade = row.original
                    const config = statusColors[trade.status]
                    return (
                        <Tag className={classNames('border-0', config.color)}>
                            {config.label}
                        </Tag>
                    )
                },
            },
            {
                header: 'P&L',
                id: 'pnlAmount',
                cell: ({ row }) => {
                    const trade = row.original
                    if (
                        trade.type === 'buy' ||
                        trade.status !== 'completed' ||
                        trade.pnlPercentage === undefined ||
                        trade.pnlAmount === undefined
                    ) {
                        return <span>-</span>
                    }

                    const isPositive = trade.pnlAmount >= 0

                    return (
                        <div
                            className={classNames(
                                'font-medium',
                                isPositive ? 'text-success' : 'text-error',
                            )}
                        >
                            {isPositive ? '+' : ''}
                            {formatCurrency(trade.pnlAmount, 'USD')}
                        </div>
                    )
                },
            },
            {
                header: 'ROI',
                id: 'pnl',
                cell: ({ row }) => {
                    const trade = row.original

                    // Only show P&L for sell and swap trades that are completed
                    if (
                        trade.type === 'buy' ||
                        trade.status !== 'completed' ||
                        trade.pnlPercentage === undefined ||
                        trade.pnlAmount === undefined
                    ) {
                        return <span>-</span>
                    }

                    const isPositive = trade.pnlAmount >= 0

                    return (
                        <div
                            className={classNames(
                                'font-medium',
                                isPositive ? 'text-success' : 'text-error',
                            )}
                        >
                            {isPositive ? '+' : ''}
                            {trade.pnlPercentage.toFixed(2)}%
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const handlePaginationChange = (page: number) => {
        setTablePagination('trades', page)
    }

    const handlePageSizeChange = (pageSize: number) => {
        setTablePageSize('trades', pageSize)
    }

    const handleSort = (sort: OnSortParam) => {
        setTableSort('trades', sort.sortKey as string, sort.sortOrder)
    }

    return (
        <DataTable
            columns={columns}
            data={tradeHistoryData || []}
            loading={isLoading}
            pagingData={tradesPagination}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            onSort={handleSort}
        />
    )
}

export default TradeHistoryTable
