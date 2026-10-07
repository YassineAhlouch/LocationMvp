import { useMemo } from 'react'
import useSWR from 'swr'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { transactionTypeColors, statusColors } from '../utils'
import { useAssetsStore } from '../store/assetsStore'
import { apiGetPortfolioTransactions } from '@/services/CryptoService'
import classNames from '@/utils/classNames'
import { LiDocumentCopy } from '@/icons'
import type { ColumnDef } from '@tanstack/react-table'
import type { OnSortParam } from '@/components/shared/DataTable'
import type { Transaction } from '../types'

const TransactionsTable = () => {
    const transactionsTableState = useAssetsStore(
        (state) => state.tableState.transactions,
    )
    const setTablePagination = useAssetsStore(
        (state) => state.setTablePagination,
    )
    const setTablePageSize = useAssetsStore((state) => state.setTablePageSize)
    const setTableSort = useAssetsStore((state) => state.setTableSort)

    const { data: transactionsResponse, isLoading } = useSWR(
        ['/api/crypto/portfolio/transactions', transactionsTableState],
        ([, tableState]) =>
            apiGetPortfolioTransactions<{ data: Transaction[]; total: number }>(
                {
                    pageIndex: tableState.pageIndex,
                    pageSize: tableState.pageSize,
                    sortKey: tableState.sortKey,
                    sortOrder: tableState.sortOrder,
                    query: tableState.query,
                },
            ),
        {
            revalidateOnFocus: false,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
        },
    )

    const transactionsData = transactionsResponse?.data
    const transactionsPagination = {
        total: transactionsResponse?.total || 0,
        pageIndex: transactionsTableState.pageIndex,
        pageSize: transactionsTableState.pageSize,
    }

    const columns: ColumnDef<Transaction>[] = useMemo(
        () => [
            {
                header: 'Date',
                accessorKey: 'date',
                cell: ({ row }) => {
                    const transaction = row.original
                    const date = new Date(transaction.date)
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
                    const config = transactionTypeColors[trade.type]
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
                    const transaction = row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={25}
                                src={transaction.icon}
                                alt={transaction.name}
                                shape="circle"
                                className="border-0 bg-transparent"
                            />
                            <div>
                                <div className="font-medium heading-text">
                                    {transaction.name}
                                </div>
                                <div className="text-xs">
                                    {transaction.asset}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: ({ row }) => {
                    const transaction = row.original
                    return (
                        <div>
                            <div className="heading-text">
                                {transaction.amount.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 6,
                                })}
                            </div>
                            <div>{transaction.asset}</div>
                        </div>
                    )
                },
            },
            {
                header: 'Value',
                accessorKey: 'value',
                cell: ({ row }) => {
                    const transaction = row.original
                    return (
                        <div className="heading-text">
                            $
                            {transaction.value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'Fee',
                accessorKey: 'fee',
                cell: ({ row }) => {
                    const transaction = row.original
                    return (
                        <div className="heading-text">
                            $
                            {transaction.fee.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                            })}
                        </div>
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
                header: 'Tx Hash',
                accessorKey: 'txHash',
                cell: ({ row }) => {
                    const transaction = row.original
                    if (!transaction.txHash) {
                        return <span className="text-gray-400">-</span>
                    }
                    return (
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    transaction.txHash!,
                                )
                                toast.push(
                                    <Notification
                                        title="Transaction hash copied"
                                        type="success"
                                    ></Notification>,
                                    {
                                        placement: 'top-center',
                                    },
                                )
                            }}
                            className="heading-text font-mono hover:text-primary flex items-center gap-1"
                            title="Click to copy"
                        >
                            {transaction.txHash.slice(0, 6)}...
                            {transaction.txHash.slice(-4)}
                            <LiDocumentCopy className="text-lg" />
                        </button>
                    )
                },
            },
        ],
        [],
    )

    const handlePaginationChange = (page: number) => {
        setTablePagination('transactions', page)
    }

    const handlePageSizeChange = (pageSize: number) => {
        setTablePageSize('transactions', pageSize)
    }

    const handleSort = (sort: OnSortParam) => {
        setTableSort('transactions', sort.sortKey as string, sort.sortOrder)
    }

    return (
        <DataTable
            columns={columns}
            data={transactionsData || []}
            loading={isLoading}
            pagingData={transactionsPagination}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            onSort={handleSort}
        />
    )
}

export default TransactionsTable
