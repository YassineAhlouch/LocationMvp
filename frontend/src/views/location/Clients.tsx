import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import ActionBar from '@/components/ui/ActionBar'
import Container from '@/components/shared/Container'
import OverflowTabs from '@/components/shared/OverflowTabs'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { LuSearch, LuStar, LuUserCheck, LuUsers, LuUserX } from 'react-icons/lu'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import { apiGetClients, apiDeleteClient } from '@/services/LocationService'
import type { Client } from '@/@types/location'
import ClientForm from './forms/ClientForm'
import {
    clientSourceOptions,
    clientStatusTone,
    formatDate,
    tagToneClass,
} from './shared'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiEdit, LiTrash } from '@/icons'
import useRandomColor from '@/utils/hooks/useRandomColor'
import classNames from '@/utils/classNames'
import acronym from '@/utils/acronym'

type ClientFormDialogProps = {
    open: boolean
    client: Client | null
    onClose: () => void
    onSaved: () => void
}

const ClientFormDialog = ({
    open,
    client,
    onClose,
    onSaved,
}: ClientFormDialogProps) => (
    <Dialog
        isOpen={open}
        onClose={onClose}
        width={760}
        className="max-h-[90vh] overflow-y-auto"
    >
        <h5 className="mb-6 text-base font-bold dark:text-gray-100">
            {client ? 'Edit client' : 'Add client'}
        </h5>
        <ClientForm
            client={client}
            isOpen={open}
            onCancel={onClose}
            onSaved={onSaved}
        />
    </Dialog>
)

const statusTabList = [
    {
        label: (
            <span className="flex items-center gap-2">
                <LuUsers className="text-lg" />
                <span>All Clients</span>
            </span>
        ),
        value: '',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuUserCheck className="text-lg" />
                <span>Normal</span>
            </span>
        ),
        value: 'normal',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuStar className="text-lg" />
                <span>VIP</span>
            </span>
        ),
        value: 'vip',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuUserX className="text-lg" />
                <span>Blacklist</span>
            </span>
        ),
        value: 'blacklist',
    },
]

const ClientName = ({ row }: { row: Client }) => {
    const generateRandomColor = useRandomColor()

    return (
        <div className="flex items-center gap-2">
            <Avatar
                size={25}
                shape="circle"
                className={classNames(
                    'border-0 text-gray-900',
                    generateRandomColor(row.full_name).background,
                )}
            >
                {acronym(row.full_name)}
            </Avatar>
            <span className="text-nowrap font-medium text-gray-900 dark:text-gray-100">
                {row.full_name}
            </span>
        </div>
    )
}

const Clients = () => {
    const navigate = useNavigate()

    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [sourceFilter, setSourceFilter] = useState('')
    const [selectedRows, setSelectedRows] = useState<Client[]>([])

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Client | null>(null)
    const [deleting, setDeleting] = useState<Client | null>(null)
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

    const fetchClients = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            page: pageIndex,
            per_page: pageSize,
        }
        if (q.trim()) {
            params.q = q.trim()
        }
        if (statusFilter) {
            params.status = statusFilter
        }
        if (sourceFilter) {
            params.source = sourceFilter
        }
        apiGetClients(params)
            .then((res) => {
                setClients(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setClients([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, q, statusFilter, sourceFilter])

    useEffect(() => {
        fetchClients()
    }, [fetchClients])

    const handlePageChange = (page: number) => {
        setSelectedRows([])
        setPageIndex(page)
    }

    const handlePageSizeChange = (size: number) => {
        setSelectedRows([])
        setPageSize(size)
        setPageIndex(1)
    }

    const handleRowSelect = (checked: boolean, row: Client) => {
        setSelectedRows((prev) =>
            checked
                ? [...prev.filter((s) => s.id !== row.id), row]
                : prev.filter((s) => s.id !== row.id),
        )
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Client>[]) => {
        setSelectedRows(checked ? rows.map((r) => r.original) : [])
    }

    const handleDelete = async () => {
        if (!deleting) {
            return
        }
        try {
            await apiDeleteClient(deleting.id)
            toast.push(
                <Notification
                    type="success"
                    title="Client deleted successfully!"
                />,
            )
            setDeleting(null)
            fetchClients()
        } catch {
            toast.push(
                <Notification type="danger" title="Could not delete client" />,
            )
        }
    }

    const handleBulkDelete = async () => {
        const ids = selectedRows.map((client) => client.id)
        try {
            const results = await Promise.allSettled(
                ids.map((id) => apiDeleteClient(id)),
            )
            const failed = results.filter(
                (result) => result.status === 'rejected',
            ).length
            toast.push(
                <Notification
                    type="success"
                    title={`${ids.length - failed} client(s) deleted successfully!`}
                />,
            )
            if (failed > 0) {
                toast.push(
                    <Notification
                        type="danger"
                        title={`${failed} deletion(s) failed`}
                    />,
                )
            }
            setSelectedRows([])
            setBulkDeleteOpen(false)
            fetchClients()
        } catch {
            toast.push(
                <Notification type="danger" title="Could not delete clients" />,
            )
            setBulkDeleteOpen(false)
        }
    }

    const columns = useMemo<ColumnDef<Client>[]>(
        () => [
            {
                header: 'Client',
                accessorKey: 'full_name',
                cell: (props) => <ClientName row={props.row.original} />,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {props.row.original.email ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => (
                    <span className="text-nowrap text-gray-600 dark:text-gray-300">
                        {props.row.original.phone}
                    </span>
                ),
            },
            {
                header: 'Source',
                accessorKey: 'source',
                cell: (props) => {
                    const source = props.row.original.source
                    return source ? (
                        <Tag className="bg-white font-medium shadow dark:bg-gray-800">
                            <span className="capitalize">{source}</span>
                        </Tag>
                    ) : (
                        <span className="text-sm text-gray-400">—</span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    return (
                        <Tag
                            className={`capitalize ${tagToneClass[clientStatusTone[status]]}`}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: 'Last rental',
                accessorKey: 'last_reservation_at',
                cell: (props) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(props.row.original.last_reservation_at)}
                    </span>
                ),
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => (
                    <div className="flex items-center justify-center gap-1">
                        <Button
                            size="sm"
                            variant="link"
                            className="px-2 hover:text-gray-900 dark:hover:text-gray-100"
                            role="button"
                            title="Edit"
                            onClick={() => {
                                setEditing(props.row.original)
                                setDialogOpen(true)
                            }}
                        >
                            <LiEdit className="text-base" />
                        </Button>
                        <Button
                            size="sm"
                            variant="link"
                            className="px-2 hover:text-error"
                            role="button"
                            title="Delete"
                            onClick={() => setDeleting(props.row.original)}
                        >
                            <LiTrash className="text-base" />
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    )

    return (
        <div>
            <Container className="">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h4>Clients</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {total} clients
                                </p>
                            </div>
                            <Button
                                variant="solid"
                                onClick={() =>
                                    navigate(
                                        `${APPS_PREFIX_PATH}/clients/ajouter`,
                                    )
                                }
                            >
                                Add client
                            </Button>
                        </div>
                    </div>

                    <OverflowTabs
                        tabList={statusTabList}
                        value={statusFilter}
                        onChange={(value) => {
                            setSelectedRows([])
                            setStatusFilter(value)
                            setPageIndex(1)
                        }}
                        tabListClass="dark:border-gray-800"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <DebouceInput
                                placeholder="Search clients…"
                                prefix={<LuSearch className="text-lg" />}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                    setSelectedRows([])
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div className="w-48">
                            <Select
                                options={[
                                    { value: '', label: 'All sources' },
                                    ...clientSourceOptions,
                                ]}
                                value={
                                    [
                                        { value: '', label: 'All sources' },
                                        ...clientSourceOptions,
                                    ].find((o) => o.value === sourceFilter) ??
                                    null
                                }
                                onChange={(option) => {
                                    setSourceFilter(option?.value ?? '')
                                    setSelectedRows([])
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <DataTable<Client>
                            compact
                            selectable
                            verticalDivider={{
                                head: true,
                                body: true,
                            }}
                            className="border-t border-b border-gray-200 dark:border-gray-700"
                            columns={columns}
                            data={clients}
                            noData={!loading && clients.length === 0}
                            skeletonAvatarColumns={[1]}
                            skeletonAvatarProps={{ width: 28, height: 28 }}
                            loading={loading}
                            checkboxChecked={(row) =>
                                selectedRows.some(
                                    (selected) => selected.id === row.id,
                                )
                            }
                            pagingData={{
                                total,
                                pageIndex,
                                pageSize,
                            }}
                            onPaginationChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            onRowSelect={handleRowSelect}
                            onAllRowSelect={handleAllRowSelect}
                        />
                    </div>
                </div>
            </Container>

            <ActionBar open={selectedRows.length > 0}>
                <div className="flex items-center justify-between">
                    <span className="font-medium">
                        <span className="heading-text font-semibold">
                            {selectedRows.length} Items
                        </span>{' '}
                        selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            className={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                            }
                            onClick={() => setBulkDeleteOpen(true)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </ActionBar>

            <ClientFormDialog
                open={dialogOpen}
                client={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchClients}
            />

            <ConfirmDialog
                isOpen={Boolean(deleting)}
                type="danger"
                title="Delete client"
                onClose={() => setDeleting(null)}
                onCancel={() => setDeleting(null)}
                onConfirm={handleDelete}
                confirmButtonProps={{ children: 'Delete' }}
            >
                <p>
                    Delete {deleting?.full_name}? Their rental history will not
                    be recoverable.
                </p>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={bulkDeleteOpen}
                type="danger"
                title="Delete clients"
                onClose={() => setBulkDeleteOpen(false)}
                onCancel={() => setBulkDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                confirmButtonProps={{ children: 'Delete' }}
            >
                <p>
                    Are you sure you want to remove {selectedRows.length}{' '}
                    client(s)? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default Clients
