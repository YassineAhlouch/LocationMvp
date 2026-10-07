import { useMemo } from 'react'
import useSWR from 'swr'
import DataTable from '@/components/shared/DataTable'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import { useAssetsStore } from '../store/assetsStore'
import { apiGetPortfolioAssets } from '@/services/CryptoService'
import classNames from '@/utils/classNames'
import { LuEllipsisVertical } from 'react-icons/lu'
import type { ColumnDef } from '@tanstack/react-table'
import type { OnSortParam } from '@/components/shared/DataTable'
import type { PortfolioAsset } from '../types'

const AssetsTable = () => {
    const openTradeModal = useAssetsStore((state) => state.openTradeModal)
    const openWithdrawModal = useAssetsStore((state) => state.openWithdrawModal)
    const assetsTableState = useAssetsStore((state) => state.tableState.assets)
    const setTablePagination = useAssetsStore(
        (state) => state.setTablePagination,
    )
    const setTablePageSize = useAssetsStore((state) => state.setTablePageSize)
    const setTableSort = useAssetsStore((state) => state.setTableSort)

    // SWR for assets data
    const { data: assetsResponse, isLoading } = useSWR(
        ['/api/crypto/portfolio/assets', assetsTableState],
        ([, tableState]) =>
            apiGetPortfolioAssets<{ data: PortfolioAsset[]; total: number }>({
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

    const assetsData = assetsResponse?.data
    const assetsPagination = {
        total: assetsResponse?.total || 0,
        pageIndex: assetsTableState.pageIndex,
        pageSize: assetsTableState.pageSize,
    }

    const columns: ColumnDef<PortfolioAsset>[] = useMemo(
        () => [
            {
                header: 'Asset Name',
                accessorKey: 'name',
                cell: ({ row }) => {
                    const asset = row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                size={25}
                                src={asset.icon}
                                alt={asset.name}
                                shape="circle"
                                className="border-0 bg-transparent"
                            />
                            <div>
                                <div className="font-medium heading-text">
                                    {asset.name}
                                </div>
                                <div className="text-xs font-medium">
                                    {asset.symbol}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Balance',
                accessorKey: 'balance',
                cell: ({ row }) => {
                    const asset = row.original
                    return (
                        <div className="heading-text">
                            {asset.balance.toLocaleString('en-US', {
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
                    const asset = row.original
                    return (
                        <div className="heading-text">
                            $
                            {asset.value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'Gain/Loss',
                accessorKey: 'priceChangePercentage24h',
                cell: ({ row }) => {
                    const asset = row.original
                    const isPositive = asset.priceChangePercentage24h >= 0
                    return (
                        <div className="flex gap-1">
                            <div
                                className={classNames(
                                    'font-medium',
                                    isPositive ? 'text-success' : 'text-error',
                                )}
                            >
                                {isPositive ? '+' : ''}
                                {asset.priceChangePercentage24h.toFixed(2)}%
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Allocation',
                accessorKey: 'allocation',
                cell: ({ row }) => {
                    const asset = row.original
                    return (
                        <span className="heading-text">
                            {asset.allocation.toFixed(1)}%
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => {
                    const asset = row.original
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <Dropdown
                                placement="bottom-end"
                                renderTitle={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<LuEllipsisVertical />}
                                    />
                                }
                            >
                                <Dropdown.Item
                                    eventKey="buy"
                                    onSelect={() =>
                                        openTradeModal('buy', asset.symbol)
                                    }
                                >
                                    Buy {asset.symbol}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    eventKey="sell"
                                    onSelect={() =>
                                        openTradeModal('sell', asset.symbol)
                                    }
                                >
                                    Sell {asset.symbol}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    eventKey="withdraw"
                                    onSelect={() =>
                                        openWithdrawModal(asset.symbol)
                                    }
                                >
                                    Withdraw {asset.symbol}
                                </Dropdown.Item>
                            </Dropdown>
                        </div>
                    )
                },
            },
        ],
        [openTradeModal, openWithdrawModal],
    )

    const handlePaginationChange = (page: number) => {
        setTablePagination('assets', page)
    }

    const handlePageSizeChange = (pageSize: number) => {
        setTablePageSize('assets', pageSize)
    }

    const handleSort = (sort: OnSortParam) => {
        setTableSort('assets', sort.sortKey as string, sort.sortOrder)
    }

    return (
        <DataTable
            hoverable={false}
            columns={columns}
            data={assetsData || []}
            loading={isLoading}
            pagingData={assetsPagination}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            onSort={handleSort}
        />
    )
}

export default AssetsTable
