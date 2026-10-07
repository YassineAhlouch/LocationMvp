import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Progress from '@/components/ui/Progress'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import Dialog from '@/components/ui/Dialog'
import IconFrame from '@/components/shared/IconFrame'
import CreditCardForm from '@/components/view/CreditCardForm'
import SettingsHeader from './SettingsHeader'
import useProjectSettingData from '../hooks/useProjectSettingData'
import { LiDownload, LiExport, LiCard, LiCross } from '@/icons'
import dayjs from 'dayjs'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import type { CreditCardInfo, Transaction } from '../types'
import classNames from '@/utils/classNames'

const { Tr, Th, Td, THead, TBody } = Table

const statusColor: Record<string, string> = {
    paid: 'bg-emerald-500',
    pending: 'bg-amber-400',
}

const columnHelper = createColumnHelper<Transaction>()

const columns = [
    columnHelper.accessor('id', {
        header: 'Invoice',
        cell: (props) => {
            const row = props.row.original
            return (
                <span className="heading-text font-medium cursor-pointer">
                    {row.id}
                </span>
            )
        },
    }),
    columnHelper.accessor('item', {
        header: 'Product',
        cell: (props) => {
            const row = props.row.original
            return <span className="font-medium">{row.item}</span>
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (props) => {
            const row = props.row.original
            return (
                <Tag className="inline-flex items-center gap-1 py-0.5 px-1 bg-transparent">
                    <Badge
                        className={classNames(
                            statusColor[row.status],
                            'w-2.5 h-2.5',
                        )}
                    />
                    <span className="heading-text font-medium capitalize">
                        {row.status}
                    </span>
                </Tag>
            )
        },
    }),
    columnHelper.accessor('date', {
        header: 'Date',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    {dayjs.unix(row.date).format('MMM DD YYYY')}
                </div>
            )
        },
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    ${row.amount.toFixed(2)}
                </div>
            )
        },
    }),
]

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const BillingAndUsage = () => {
    const { data, setData } = useProjectSettingData()

    const [selectedCard, setSelectedCard] = useState<{
        dialogOpen: boolean
        cardInfo: Partial<CreditCardInfo>
    }>({
        dialogOpen: false,
        cardInfo: {},
    })

    const table = useReactTable({
        data: data?.billing.transactionHistory || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleEditCreditCard = (card: Partial<CreditCardInfo>) => {
        setSelectedCard({
            dialogOpen: true,
            cardInfo: card,
        })
    }

    const handleDialogClose = () => {
        setSelectedCard({
            dialogOpen: false,
            cardInfo: {},
        })
    }

    const handleUpdateCreditCard = (card: Partial<CreditCardInfo>) => {
        setData((prevData) => ({
            ...prevData,
            billing: {
                ...prevData.billing,
                creditCard: card,
            },
        }))
        handleDialogClose()
    }

    return (
        <>
            <div className="space-y-4">
                <SettingsHeader
                    title="Billing & Usage"
                    description="Manage your billing and usage information"
                />
                {data && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card
                                className="flex flex-col justify-between"
                                footer={{
                                    className: 'py-1',
                                    content: (
                                        <div className="flex justify-end">
                                            <Button
                                                className="px-0 opacity-70 hover:opacity-100"
                                                variant="link"
                                                iconAlignment="end"
                                                icon={
                                                    <LiExport className="text-base" />
                                                }
                                            >
                                                Upgrade Plan
                                            </Button>
                                        </div>
                                    ),
                                }}
                            >
                                <div>
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h6 className="font-semibold ">
                                                    {
                                                        data.billing.currentPlan
                                                            .plan
                                                    }
                                                </h6>
                                                <Tag className="bg-success-subtle text-success border-0 capitalize text-xs px-2 py-1">
                                                    {
                                                        data.billing.currentPlan
                                                            .status
                                                    }
                                                </Tag>
                                            </div>
                                            <span>
                                                Renewal on{' '}
                                                {dayjs(
                                                    data.billing.currentPlan
                                                        .nextPaymentDate,
                                                ).format('MMM DD, YYYY')}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex flex-col items-end">
                                                <span className="heading-text font-semibold text-lg">
                                                    $
                                                    {data.billing.currentPlan.amount.toFixed(
                                                        2,
                                                    )}
                                                </span>
                                                <span className="text-xs">
                                                    per Month
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="heading-text font-medium">
                                            {data.billing.currentPlan.usage
                                                .membersUsed || 0}{' '}
                                            of{' '}
                                            {data.billing.currentPlan
                                                .planDetails.maxMembers ||
                                                'Unlimited'}{' '}
                                            users
                                        </div>
                                        <Progress
                                            className="mt-1"
                                            showInfo={false}
                                            percent={
                                                ((data.billing.currentPlan.usage
                                                    .membersUsed || 0) /
                                                    (data.billing.currentPlan
                                                        .planDetails
                                                        .maxMembers || 1)) *
                                                100
                                            }
                                        />
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div>
                                    <div>
                                        <h6 className="font-semibold ">
                                            Payment Method
                                        </h6>
                                        <span>
                                            Manage your payment information
                                        </span>
                                    </div>
                                    <div className="rounded-md px-2 py-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-700 mt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {data.billing.paymentMethods
                                                    .cardType === 'VISA' && (
                                                    <img
                                                        src="/img/thumbs/payment/visa.png"
                                                        alt="visa"
                                                        className="w-10"
                                                    />
                                                )}
                                                {data.billing.paymentMethods
                                                    .cardType === 'MASTER' && (
                                                    <img
                                                        src="/img/others/img-9.png"
                                                        alt="master"
                                                    />
                                                )}
                                                <div className="ml-3 rtl:mr-3">
                                                    <div className="flex items-center">
                                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                            {
                                                                data.billing
                                                                    .paymentMethods
                                                                    .cardHolderName
                                                            }{' '}
                                                            ••••{' '}
                                                            {
                                                                data.billing
                                                                    .paymentMethods
                                                                    .last4Number
                                                            }
                                                        </div>
                                                    </div>
                                                    <span>
                                                        Expired{' '}
                                                        {
                                                            months[
                                                                parseInt(
                                                                    data.billing
                                                                        .paymentMethods
                                                                        .expMonth,
                                                                ) - 1
                                                            ]
                                                        }{' '}
                                                        20
                                                        {
                                                            data.billing
                                                                .paymentMethods
                                                                .expYear
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <Button
                                                    variant="subtle"
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditCreditCard(
                                                            data.billing
                                                                .paymentMethods,
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <div className="heading-text font-semibold">
                                        Billing History
                                    </div>
                                    <p>View a record of all past charges.</p>
                                </div>
                                <div>
                                    <Button
                                        icon={
                                            <LiDownload className="text-base" />
                                        }
                                    >
                                        Download All
                                    </Button>
                                </div>
                            </div>
                            {/* Mobile view */}
                            <div className="md:hidden space-y-3 mt-4">
                                {data.billing.transactionHistory.map(
                                    (transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="heading-text font-medium">
                                                    {transaction.id}
                                                </span>
                                                <Tag className="inline-flex items-center gap-1 py-0.5 px-1 bg-transparent">
                                                    <Badge
                                                        className={classNames(
                                                            statusColor[
                                                                transaction
                                                                    .status
                                                            ],
                                                            'w-2.5 h-2.5',
                                                        )}
                                                    />
                                                    <span className="heading-text font-medium capitalize text-sm">
                                                        {transaction.status}
                                                    </span>
                                                </Tag>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">
                                                    {transaction.item}
                                                </span>
                                                <span className="heading-text font-semibold">
                                                    $
                                                    {transaction.amount.toFixed(
                                                        2,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                {dayjs
                                                    .unix(transaction.date)
                                                    .format('MMM DD YYYY')}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                            {/* Desktop view */}
                            <Card
                                bodyClass="p-0 overflow-hidden rounded-md"
                                className="mt-4 hidden md:block"
                            >
                                <Table overflow={false}>
                                    <THead>
                                        {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <Tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => {
                                                            return (
                                                                <Th
                                                                    key={
                                                                        header.id
                                                                    }
                                                                    colSpan={
                                                                        header.colSpan
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        header
                                                                            .column
                                                                            .columnDef
                                                                            .header,
                                                                        header.getContext(),
                                                                    )}
                                                                </Th>
                                                            )
                                                        },
                                                    )}
                                                </Tr>
                                            ))}
                                    </THead>
                                    <TBody>
                                        {table.getRowModel().rows.map((row) => {
                                            return (
                                                <Tr key={row.id}>
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => {
                                                            return (
                                                                <Td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </Td>
                                                            )
                                                        })}
                                                </Tr>
                                            )
                                        })}
                                    </TBody>
                                </Table>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
            <Dialog
                isOpen={selectedCard.dialogOpen}
                onClose={handleDialogClose}
                className="p-0"
                closable={false}
            >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <IconFrame variant="thick">
                            <LiCard className="text-xl heading-text" />
                        </IconFrame>
                        <div>
                            <h5>Edit Credit Card</h5>
                            <p className="pr-12">
                                Update your credit card details
                            </p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="subtle"
                        type="button"
                        icon={<LiCross className="text-2xl" />}
                        onClick={handleDialogClose}
                    />
                </div>
                <div className="p-4">
                    <CreditCardForm
                        defaultValues={selectedCard.cardInfo as CreditCardInfo}
                        onSubmit={handleUpdateCreditCard}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default BillingAndUsage
