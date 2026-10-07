import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import InfoBar from '@/components/shared/InfoBar'
import ImposibleCube from '@/components/svg/icons/ImposibleCube'
import ImposibleSphere from '@/components/svg/icons/ImposibleSphere'
import ImposibleTriangle from '@/components/svg/icons/ImposibleTriangle'
import { NumericFormat } from 'react-number-format'
import type { ColumnDef } from '@tanstack/react-table'
import type { SubscriberPersona } from '../types'
import type { JSX } from 'react'

type PersonaTableSectionProps = {
    title: string
    subtitle: string
    data: SubscriberPersona[]
    type: 'recent' | 'highValue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tableState: any
    pagingData: {
        total: number
        pageIndex: number
        pageSize: number
    }
    selectedRows: SubscriberPersona[]
    loading?: boolean
}

const PersonaTableSection = ({
    data,
    tableState,
    pagingData,
    loading = false,
}: PersonaTableSectionProps) => {
    const columns = useMemo<ColumnDef<SubscriberPersona>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => {
                    const subscriber = row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                size={30}
                                shape="circle"
                                src={subscriber.img}
                                alt={subscriber.name}
                            >
                                {subscriber.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </Avatar>
                            <div>
                                <div className="font-medium heading-text">
                                    {subscriber.name}
                                </div>
                                <div className="text-sm">
                                    {subscriber.email}
                                </div>
                            </div>
                        </div>
                    )
                },
                enableSorting: true,
            },
            {
                accessorKey: 'plan',
                header: 'Plan',
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
                        <div className="flex items-center gap-2">
                            <span className={planIcon[plan].className}>
                                {planIcon[plan].icon}
                            </span>
                            <span className="font-medium heading-text">
                                {plan}
                            </span>
                        </div>
                    )
                },
                enableSorting: true,
            },
            {
                accessorKey: 'subscribeDuration',
                header: 'Subscribe Duration',
                cell: ({ row }) => (
                    <span className="heading-text">
                        {row.original.subscribeDuration}
                    </span>
                ),
                enableSorting: false,
            },
            {
                accessorKey: 'accumulatedAmount',
                header: 'Accumulated Amount',
                cell: ({ row }) => (
                    <span className="heading-text">
                        <NumericFormat
                            displayType="text"
                            value={row.original.accumulatedAmount}
                            prefix="$"
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator={true}
                        />
                    </span>
                ),
                enableSorting: true,
            },
            {
                accessorKey: 'engagement',
                header: 'Engagement',
                cell: ({ row }) => (
                    <span className="flex items-center gap-1">
                        <InfoBar level={row.original.engagement} />
                        <span className="heading-text capitalize">
                            {row.original.engagement}
                        </span>
                    </span>
                ),
                enableSorting: true,
            },
        ],
        [],
    )

    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={pagingData}
                skeletonAvatarColumns={[1]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                {...tableState}
            />
        </div>
    )
}

export default PersonaTableSection
