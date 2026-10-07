import { useMemo } from 'react'
import ImposibleCube from '@/components/svg/icons/ImposibleCube'
import ImposibleSphere from '@/components/svg/icons/ImposibleSphere'
import ImposibleTriangle from '@/components/svg/icons/ImposibleTriangle'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import DataTable from '@/components/shared/DataTable'
import useReportsData from '../hooks/useReportsData'
import classNames from '@/utils/classNames'
import formatRelativeTime from '@/utils/formatRelativeTime'
import { useReportsStore } from '../store/reportStore'
import { colors } from '@/constants/colors.constant'
import { LiUser, LiDesktop, LiMobile, LiTablet } from '@/icons'
import dayjs from 'dayjs'
import type { JSX } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReportRecord } from '../types'

type UnifiedRow = ReportRecord

const ReportTables = () => {
    const visibleColumns = useReportsStore((state) => state.visibleColumns)
    const { data, isLoading, setQueryParams } = useReportsData()

    const allColumns: ColumnDef<UnifiedRow>[] = useMemo(
        () => [
            {
                id: 'plan',
                header: 'Plan',
                accessorKey: 'plan',
                cell: ({ row }) => {
                    const plan = row.original.plan
                    const planIcon: {
                        [key: string]: { icon: JSX.Element; className: string }
                    } = {
                        Basic: {
                            icon: (
                                <ImposibleSphere
                                    height={18}
                                    width={18}
                                    pathClass="stroke-10"
                                />
                            ),
                            className: 'text-primary',
                        },
                        Standard: {
                            icon: (
                                <ImposibleTriangle
                                    height={18}
                                    width={18}
                                    pathClass="stroke-10 "
                                />
                            ),
                            className: 'text-yellow-500',
                        },
                        Pro: {
                            icon: (
                                <ImposibleCube
                                    height={18}
                                    width={18}
                                    pathClass="stroke-10 "
                                />
                            ),
                            className: 'text-purple-500',
                        },
                    }
                    return (
                        <div className="flex items-center gap-2 text-nowrap">
                            <span className={planIcon[plan].className}>
                                {planIcon[plan].icon}
                            </span>
                            <span className="font-medium heading-text">
                                {plan}
                            </span>
                        </div>
                    )
                },
            },
            {
                id: 'customer',
                header: 'Customer',
                accessorKey: 'customer',
                cell: ({ row }) => {
                    const customer = row.original.customer
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={20}
                                shape="circle"
                                icon={<LiUser />}
                                alt={customer}
                            ></Avatar>
                            <div>
                                <div className="font-medium heading-text text-nowrap">
                                    {customer}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                id: 'email',
                header: 'Email',
                accessorKey: 'email',
                cell: ({ getValue }) => {
                    const email = getValue<string>()
                    return (
                        <span className="font-medium text-nowrap">{email}</span>
                    )
                },
            },
            {
                id: 'amount',
                header: 'Amount',
                accessorKey: 'amount',
                cell: ({ getValue }) => {
                    const amount = getValue<number>()
                    return (
                        <span className="font-medium  text-nowrap">
                            ${amount.toFixed(2)}
                        </span>
                    )
                },
            },
            {
                id: 'paymentMethod',
                header: 'Payment Method',
                accessorKey: 'paymentMethod',
                cell: ({ getValue }) => {
                    const paymentMethod = getValue<string>()
                    return (
                        <span className="font-medium text-nowrap">
                            {paymentMethod}
                        </span>
                    )
                },
            },
            {
                id: 'status',
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }) => {
                    const status = getValue<string>()
                    const colorMap: { [key: string]: string } = {
                        Paid: classNames(
                            colors.emerald.iconBg,
                            colors.emerald.iconText,
                        ),
                        Pending: classNames(
                            colors.yellow.iconBg,
                            colors.yellow.iconText,
                        ),
                        Failed: classNames(
                            colors.red.iconBg,
                            colors.red.iconText,
                        ),
                        Refunded: classNames(
                            colors.purple.iconBg,
                            colors.purple.iconText,
                        ),
                    }
                    return (
                        <Tag
                            className={classNames('border-0', colorMap[status])}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                id: 'signupDate',
                header: 'Signup Date',
                accessorKey: 'signupDate',
                cell: ({ getValue }) => {
                    const date = getValue<string>()
                    return (
                        <span className="font-medium text-nowrap">
                            {dayjs(date).format('MMM DD, YYYY')}
                        </span>
                    )
                },
            },
            {
                id: 'lastActive',
                header: 'Last Active',
                accessorKey: 'lastActive',
                cell: ({ getValue }) => {
                    const date = getValue<string>()

                    return (
                        <div className="flex flex-col gap-1 text-nowrap">
                            <span className="font-medium">
                                {formatRelativeTime(date)}
                            </span>
                        </div>
                    )
                },
            },
            {
                id: 'mrrRange',
                header: 'MRR Range',
                accessorKey: 'mrrRange',
                cell: ({ getValue }) => {
                    const range = getValue<string>()
                    return <Tag>{range}</Tag>
                },
            },
            {
                id: 'autoRenewal',
                header: 'Auto Renewal',
                accessorKey: 'autoRenewal',
                cell: ({ getValue }) => {
                    const autoRenewal = getValue<boolean>()
                    return (
                        <Tag
                            className={classNames(
                                autoRenewal ? ' text-success' : ' text-error',
                                'bg-transparent',
                            )}
                        >
                            {autoRenewal ? 'Enabled' : 'Disabled'}
                        </Tag>
                    )
                },
            },
            {
                id: 'featureUsed',
                header: 'Features Used',
                accessorKey: 'featureUsed',

                cell: ({ getValue }) => {
                    const features = getValue<string[] | string>()
                    const featureArray = Array.isArray(features)
                        ? features
                        : [features].filter(Boolean)

                    if (featureArray.length === 0) {
                        return <span>No features</span>
                    }
                    return (
                        <div className="flex gap-1">
                            {featureArray.map((feature, index) => (
                                <Tag key={index}>{feature}</Tag>
                            ))}
                        </div>
                    )
                },
            },
            {
                id: 'device',
                header: 'Device',
                accessorKey: 'device',
                cell: ({ getValue }) => {
                    const device = getValue<string>()
                    const colorMap: { [key: string]: JSX.Element } = {
                        Desktop: <LiDesktop />,
                        Mobile: <LiMobile />,
                        Tablet: <LiTablet />,
                    }
                    return (
                        <span className="flex items-center gap-1 font-medium heading-text text-nowrap">
                            <span className="text-lg">{colorMap[device]}</span>
                            <span>{device}</span>
                        </span>
                    )
                },
            },
            {
                id: 'country',
                header: 'Country',
                accessorKey: 'country',
                cell: ({ row }) => {
                    const country = row.original.country
                    const countryCode = row.original.countryCode
                    return (
                        <div className="flex items-center gap-2 text-nowrap">
                            <img
                                src={`/img/countries/${countryCode}.png`}
                                className="w-4 h-4"
                                alt={countryCode}
                            />
                            <span className="font-medium">{country}</span>
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const filteredColumns = useMemo(() => {
        return allColumns.filter((col) =>
            visibleColumns.includes(col.id as string),
        )
    }, [allColumns, visibleColumns])

    const rows: UnifiedRow[] = useMemo(
        () => (data?.list || []) as UnifiedRow[],
        [data],
    )

    return (
        <DataTable
            compact
            verticalDivider={{
                head: true,
                body: true,
                footer: true,
            }}
            className="border-b border-gray-200 dark:border-gray-800"
            columns={filteredColumns}
            data={rows}
            loading={isLoading}
            noData={!isLoading && (!rows || rows.length === 0)}
            pagingData={{
                total: data?.total || 0,
                pageIndex: data?.pageIndex || 1,
                pageSize: data?.pageSize || 10,
            }}
            onPaginationChange={(page) => setQueryParams({ pageIndex: page })}
            onPageSizeChange={(size) =>
                setQueryParams({ pageSize: size, pageIndex: 1 })
            }
            onSort={(sort) => setQueryParams(sort)}
        />
    )
}

export default ReportTables
