import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import classNames from '@/utils/classNames'
import useMarketData from '../hooks/useMarketData'
import { formatPrice, formatPercentage } from '../utils'
import formatCurrencyCompact from '@/utils/formatCurrencyCompact'
import formatNumber from '@/utils/formatNumber'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import type { CryptoMarketData } from '../types'

const MarketTableSpot = () => {
    const { marketData, isLoading, pagingState, setQueryParams } =
        useMarketData()

    const spotMarketData = useMemo(() => {
        if (!marketData) return []
        return marketData.filter(
            (crypto) =>
                crypto.marketType === 'spot' || crypto.marketType === 'all',
        )
    }, [marketData])

    const columns: ColumnDef<CryptoMarketData>[] = useMemo(
        () => [
            {
                accessorKey: 'rank',
                header: '#',
                size: 60,
                cell: ({ row }) => (
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                        {row.original.rank}
                    </span>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Market',
                size: 200,
                cell: ({ row }) => (
                    <Link
                        to={`/apps/crypto/coin/${row.original.symbol.toLowerCase()}`}
                        className="flex items-center gap-3"
                    >
                        <Avatar
                            size={25}
                            className="border-0 bg-white flex-shrink-0"
                            shape="circle"
                            src={row.original.image}
                            alt={row.original.name}
                        >
                            {row.original.symbol.slice(0, 2)}
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium heading-text">
                                {row.original.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {row.original.symbol}/USDT
                            </span>
                        </div>
                    </Link>
                ),
            },
            {
                accessorKey: 'price',
                header: 'Price',
                size: 120,
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatPrice(row.original.price)}
                    </span>
                ),
            },
            {
                accessorKey: 'priceChangePercentage24h',
                header: '24H Change',
                size: 120,
                cell: ({ row }) => {
                    const isPositive =
                        row.original.priceChangePercentage24h >= 0
                    return (
                        <div
                            className={classNames(
                                'flex items-center gap-1 font-medium',
                                isPositive ? 'text-success' : 'text-error',
                            )}
                        >
                            {formatPercentage(
                                row.original.priceChangePercentage24h,
                            )}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'priceChangePercentage30d',
                header: '30D Change',
                size: 120,
                cell: ({ row }) => {
                    const isPositive =
                        row.original.priceChangePercentage30d >= 0
                    return (
                        <div
                            className={classNames(
                                'flex items-center gap-1 font-medium',
                                isPositive ? 'text-success' : 'text-error',
                            )}
                        >
                            {formatPercentage(
                                row.original.priceChangePercentage30d,
                            )}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'volume24h',
                header: '24H Volume',
                size: 140,
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatCurrencyCompact(row.original.volume24h)}
                    </span>
                ),
            },
            {
                accessorKey: 'circulatingSupply',
                header: 'Circulation',
                size: 140,
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium heading-text">
                            {formatNumber(row.original.circulatingSupply)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {row.original.symbol}
                        </span>
                    </div>
                ),
            },
        ],
        [],
    )

    const handleSort = ({
        sortKey,
        sortOrder,
    }: {
        sortKey: string | number
        sortOrder: string
    }) => {
        setQueryParams({ sortKey, sortOrder })
    }

    const handlePaginationChange = (page: number) => {
        setQueryParams({ pageIndex: page })
    }

    const handlePageSizeChange = (pageSize: number) => {
        setQueryParams({ pageSize, pageIndex: 1 })
    }

    return (
        <DataTable
            compact
            columns={columns}
            data={spotMarketData}
            loading={isLoading}
            noData={!spotMarketData || spotMarketData.length === 0}
            onSort={handleSort}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            pagingData={{
                total: spotMarketData.length,
                pageIndex: pagingState.pageIndex as number,
                pageSize: pagingState.pageSize as number,
            }}
            skeletonAvatarColumns={[1]}
            pageSizes={[10, 20, 50, 100]}
        />
    )
}

export default MarketTableSpot
