import React, { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import { ChartContainer, defaultChartConfig } from '@/components/shared/Chart'
import { ComposedChart, Line } from 'recharts'
import classNames from '@/utils/classNames'
import useMarketData from '../hooks/useMarketData'
import { formatPrice, formatPercentage } from '../utils'
import formatCurrencyCompact from '@/utils/formatCurrencyCompact'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import type { CryptoMarketData } from '../types'

const SparklineChart = React.memo(
    ({ data, isPositive }: { data: number[]; isPositive: boolean }) => {
        const chartData = useMemo(
            () =>
                data.map((value, index) => ({
                    name: `Day ${index + 1}`,
                    value,
                })),
            [data],
        )

        return (
            <div className="w-20 h-8">
                <ChartContainer height={32} width={80}>
                    <ComposedChart data={chartData}>
                        <Line
                            dataKey="value"
                            stroke={isPositive ? '#00a85b' : '#eb4137'}
                            {...defaultChartConfig.line}
                        />
                    </ComposedChart>
                </ChartContainer>
            </div>
        )
    },
)

const MarketTableAll = () => {
    const { marketData, isLoading, pagingState, setQueryParams } =
        useMarketData()

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
                header: 'Coin',
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
                                {row.original.symbol}
                            </span>
                        </div>
                    </Link>
                ),
            },
            {
                accessorKey: 'price',
                header: 'Price (USD)',
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
                accessorKey: 'marketCap',
                header: 'Value (USD)',
                size: 140,
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatCurrencyCompact(row.original.marketCap)}
                    </span>
                ),
            },
            {
                accessorKey: 'volume24h',
                header: '24H Volume (USD)',
                size: 140,
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {formatCurrencyCompact(row.original.volume24h)}
                    </span>
                ),
            },
            {
                accessorKey: 'sparklineData',
                header: '7-Day Price Trend',
                size: 120,
                enableSorting: false,
                cell: ({ row }) => {
                    const isPositive =
                        row.original.priceChangePercentage24h >= 0
                    return (
                        <SparklineChart
                            data={row.original.sparklineData}
                            isPositive={isPositive}
                        />
                    )
                },
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
            data={marketData || []}
            loading={isLoading}
            noData={!marketData || marketData.length === 0}
            onSort={handleSort}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            pagingData={{
                total: marketData?.length || 0,
                pageIndex: pagingState.pageIndex as number,
                pageSize: pagingState.pageSize as number,
            }}
            skeletonAvatarColumns={[1]}
            pageSizes={[10, 20, 50, 100]}
        />
    )
}

export default MarketTableAll
