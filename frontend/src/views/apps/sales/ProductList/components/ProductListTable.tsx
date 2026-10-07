import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Progress from '@/components/ui/Progress'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useProductListData from '../hooks/useProductListData'
import { useProductListStore } from '../store/productListStore'
import { getStockLevel, stockLevelMap } from '../utils'
import classNames from '@/utils/classNames'
import useDataTableState from '@/utils/hooks/useDataTableState'
import { LiEdit2, LiTrash, LiBox } from '@/icons'
import { Link } from 'react-router'
import { NumericFormat } from 'react-number-format'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { Product } from '../types'

const ProductColumn = ({ row }: { row: Product }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={35}
                {...(row.imgList.length > 0
                    ? { src: row.imgList[0].src }
                    : { icon: <LiBox /> })}
            />
            <Link
                to={`/apps/sales/products/${row.id}`}
                className="font-semibold heading-text"
            >
                {row.name}
            </Link>
        </div>
    )
}

const ActionColumn = ({
    onEdit,
    onDelete,
}: {
    onEdit: () => void
    onDelete: () => void
}) => {
    return (
        <div className="flex items-center justify-end gap-1">
            <Tooltip title="Edit">
                <Button
                    className={`text-xl cursor-pointer select-none font-medium`}
                    type="button"
                    onClick={onEdit}
                    size="sm"
                    variant="link"
                    icon={<LiEdit2 className="text-base" />}
                ></Button>
            </Tooltip>
            <Tooltip title="Delete">
                <Button
                    className={`text-xl cursor-pointer select-none font-medium`}
                    type="button"
                    onClick={onDelete}
                    size="sm"
                    variant="link"
                    icon={<LiTrash className="text-base" />}
                ></Button>
            </Tooltip>
        </div>
    )
}

const ProductListTable = () => {
    const { data, pagingState, setQueryParams, isLoading, setData } =
        useProductListData()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const selectedRows = useProductListStore((state) => state.selectedRows)
    const setQuickEditDrawer = useProductListStore(
        (state) => state.setQuickEditDrawer,
    )
    const setSelectedRows = useProductListStore(
        (state) => state.setSelectedRows,
    )
    const setSelectAllRows = useProductListStore(
        (state) => state.setSelectAllRows,
    )

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (product: Product) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(product.id)
    }

    const handleEdit = (product: Product) => {
        setQuickEditDrawer({
            open: true,
            product,
        })
    }

    const handleConfirmDelete = () => {
        setData((prev) => ({
            ...prev,
            list: prev.list.filter((product) => product.id !== toDeleteId),
        }))
        setSelectAllRows([])
        /** setData */
        setDeleteConfirmationOpen(false)
        setToDeleteId('')
    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Product',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'SKU',
                accessorKey: 'productCode',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="heading-text">{row.productCode}</span>
                    )
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const { price } = props.row.original
                    return (
                        <span className="font-medium heading-text">
                            <NumericFormat
                                fixedDecimalScale
                                prefix="$"
                                displayType="text"
                                value={price}
                                decimalScale={2}
                                thousandSeparator={true}
                            />
                        </span>
                    )
                },
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (props) => {
                    const row = props.row.original
                    return <Tag className="capitalize">{row.category}</Tag>
                },
            },
            {
                header: 'Stock',
                accessorKey: 'stock',
                cell: (props) => {
                    const { stock, stockPercentage } = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 heading-text">
                                <span>
                                    <span className="font-medium">
                                        <NumericFormat
                                            displayType="text"
                                            value={stock}
                                            thousandSeparator={true}
                                        />
                                    </span>{' '}
                                    <span>unit</span>
                                </span>
                                <span>•</span>
                                <span className="font-medium">
                                    {
                                        stockLevelMap[
                                            getStockLevel(stockPercentage)
                                        ]?.label
                                    }
                                </span>
                            </span>
                            <Progress
                                size="sm"
                                percent={stockPercentage}
                                strokeClass={classNames(
                                    stockLevelMap[
                                        getStockLevel(stockPercentage)
                                    ]?.color,
                                )}
                                showInfo={false}
                            />
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const pagingStateHandler = useDataTableState({
        selectedRows,
        pagingState,
        onPagingChange: (data) => {
            setQueryParams(data)
        },
        onRowSelectionChange: setSelectedRows,
        onAllRowSelectChange: setSelectAllRows,
    })

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={data?.list || []}
                noData={!isLoading && data?.list.length === 0}
                skeletonAvatarColumns={[1]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: data?.total || 0,
                    pageIndex: pagingState.pageIndex as number,
                    pageSize: pagingState.pageSize as number,
                }}
                {...pagingStateHandler}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove products"
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this product? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProductListTable
