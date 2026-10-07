import { useState } from 'react'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Select from '@/components/ui/Select'
import Skeleton from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'
import ExpandableOrderDetails from './ExpandableOrderDetails'
import useOrderListData from '../hooks/useOrderListData'
import { statusMap, paymentStatusMap } from '../utils'
import useDataTableState from '@/utils/hooks/useDataTableState'
import classNames from '@/utils/classNames'
import { LiBox, LiUser, LiCalendar } from '@/icons'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const List = () => {
    const { data, isLoading, pagingState, setQueryParams } = useOrderListData()

    const [expandedOrderId, setExpandedOrderId] = useState('')

    const pagingStateHandler = useDataTableState({
        pagingState,
        onPagingChange: (data) => {
            setQueryParams(data)
        },
    })

    const handleExpand = (orderId: string) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId('')
        } else {
            setExpandedOrderId(orderId)
        }
    }

    return (
        <div>
            {isLoading && (
                <>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Card
                            key={index}
                            className="mb-4"
                            footer={{
                                className:
                                    'group cursor-pointer p-0 border-dashed',
                                content: (
                                    <div className="flex justify-between px-4 py-2.5">
                                        <Skeleton className="w-24 h-2" />
                                        <Skeleton className="w-10 h-2" />
                                    </div>
                                ),
                            }}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton
                                            variant="circle"
                                            className="w-6 h-6"
                                        />
                                        <Skeleton className="w-24 h-2" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Skeleton className="w-16 h-2" />
                                        <Skeleton className="w-16 h-2" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <Skeleton className="w-20" />
                                    <Skeleton className="w-10" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </>
            )}
            {data && !isLoading && (
                <>
                    <div className="space-y-4">
                        {data.list.map((order) => (
                            <Card
                                className={classNames(
                                    expandedOrderId !== order.id &&
                                        'print:hidden',
                                )}
                                footer={{
                                    className: 'p-0 border-dashed',
                                    content: (
                                        <ExpandableOrderDetails
                                            expand={
                                                expandedOrderId === order.id
                                            }
                                            orderId={expandedOrderId}
                                            onExpand={() =>
                                                handleExpand(order.id)
                                            }
                                        />
                                    ),
                                }}
                                key={order.id}
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="print:hidden">
                                                <Avatar
                                                    size={20}
                                                    className={classNames(
                                                        'border-0',
                                                        statusMap[order.status]
                                                            ?.color.bg,
                                                        statusMap[order.status]
                                                            ?.color.text,
                                                    )}
                                                    icon={
                                                        <span className="text-base">
                                                            {
                                                                statusMap[
                                                                    order.status
                                                                ]?.icon
                                                            }
                                                        </span>
                                                    }
                                                />
                                            </div>
                                            <h6>#{order.id}</h6>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 mt-2">
                                            <span
                                                className={classNames(
                                                    'font-medium',
                                                )}
                                            >
                                                {statusMap[order.status]?.label}
                                            </span>
                                            <span className="hidden sm:inline">
                                                •
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <LiCalendar className="text-base" />
                                                <span className="leading-none font-medium">
                                                    {dayjs(order.date).format(
                                                        'MMM DD, YYYY',
                                                    )}
                                                </span>
                                            </span>
                                            <span className="hidden sm:inline">
                                                •
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <LiBox className="text-base" />
                                                <span className="leading-none font-medium">
                                                    {order.productCount} item
                                                    {order.productCount > 1 &&
                                                        's'}
                                                </span>
                                            </span>
                                            <span className="hidden sm:inline">
                                                •
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <LiUser className="text-base" />
                                                <span className="leading-none font-medium">
                                                    {order.customer.name}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col gap-2">
                                            <h6>
                                                <NumericFormat
                                                    displayType="text"
                                                    value={order.totalAmount}
                                                    prefix={'$'}
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    thousandSeparator={true}
                                                />
                                            </h6>
                                            <div className="flex justify-end">
                                                <Tag
                                                    className={classNames(
                                                        'bg-transparent',
                                                        paymentStatusMap[
                                                            order.paymentStatus
                                                        ]?.color.text,
                                                    )}
                                                >
                                                    {
                                                        paymentStatusMap[
                                                            order.paymentStatus
                                                        ]?.label
                                                    }
                                                </Tag>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div className="py-4 flex justify-between print:hidden">
                        <Pagination
                            pageSize={pagingState.pageSize}
                            currentPage={pagingState.pageIndex}
                            total={data.total}
                            onChange={pagingStateHandler.onPaginationChange}
                        />
                        <Select
                            size="sm"
                            className="w-[120px]"
                            placement="top"
                            isSearchable={false}
                            value={pageSizeOption.find(
                                (option) =>
                                    option.value === pagingState.pageSize,
                            )}
                            options={pageSizeOption}
                            onChange={(option) =>
                                pagingStateHandler.onPageSizeChange(
                                    option?.value,
                                )
                            }
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default List
