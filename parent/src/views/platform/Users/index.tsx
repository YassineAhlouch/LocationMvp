import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Notification, Select, toast } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import StatusPill from '../components/StatusPill'
import UserFormDialog from './UserFormDialog'
import { apiGetAgencies, apiGetUsers } from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { LiAddCircle, LiEdit } from '@/icons'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { PlatformAgency, PlatformUser } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
]

const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString() : '—'

const Users = () => {
    const [data, setData] = useState<PlatformUser[]>([])
    const [agencies, setAgencies] = useState<PlatformAgency[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [agencyId, setAgencyId] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<PlatformUser | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetUsers({
                page,
                per_page: pageSize,
                ...(query ? { q: query } : {}),
                ...(status ? { is_active: status } : {}),
                ...(agencyId ? { agency_id: agencyId } : {}),
            })
            setData(response.data)
            setTotal(response.total)
        } catch (error) {
            toast.push(
                <Notification type="danger">{apiErrorMessage(error)}</Notification>,
            )
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, query, status, agencyId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        apiGetAgencies({ per_page: 100 })
            .then((response) => setAgencies(response.data))
            .catch(() => setAgencies([]))
    }, [])

    const agencyOptions = useMemo(
        () => [
            { label: 'All agencies', value: '' },
            ...agencies.map((agency) => ({
                value: String(agency.id),
                label: agency.name,
            })),
        ],
        [agencies],
    )

    const handleCreate = () => {
        setEditing(null)
        setDialogOpen(true)
    }

    const handleEdit = (user: PlatformUser) => {
        setEditing(user)
        setDialogOpen(true)
    }

    const columns = useMemo<ColumnDef<PlatformUser>[]>(
        () => [
            {
                header: 'Name',
                accessorKey: 'full_name',
                cell: ({ row }) => (
                    <span className="font-medium heading-text">
                        {row.original.full_name}
                    </span>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Agency',
                accessorKey: 'agency',
                cell: ({ row }) => row.original.agency?.name || '—',
            },
            {
                header: 'Role',
                accessorKey: 'role',
                cell: ({ row }) => row.original.role?.name || '—',
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: ({ row }) => (
                    <StatusPill active={row.original.is_active} />
                ),
            },
            {
                header: 'Last login',
                accessorKey: 'last_login_at',
                cell: ({ row }) => formatDate(row.original.last_login_at),
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            icon={<LiEdit />}
                            onClick={() => handleEdit(row.original)}
                        >
                            Edit
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    )

    return (
        <>
            <PageHeading
                title="Users"
                description="Manage the staff of every agency from one place."
                extra={
                    <Button
                        variant="solid"
                        icon={<LiAddCircle />}
                        onClick={handleCreate}
                    >
                        New user
                    </Button>
                }
            />

            <Card>
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <DebouceInput
                        placeholder="Search by name or email"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPage(1)
                            setQuery(e.target.value)
                        }}
                        className="w-full lg:w-72"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Select
                            isSearchable
                            className="w-full sm:w-56"
                            options={agencyOptions}
                            value={
                                agencyOptions.find(
                                    (option) => option.value === agencyId,
                                ) ?? agencyOptions[0]
                            }
                            onChange={(option) => {
                                setPage(1)
                                setAgencyId(String(option?.value ?? ''))
                            }}
                        />
                        <Select
                            isSearchable={false}
                            className="w-full sm:w-44"
                            options={statusOptions}
                            value={
                                statusOptions.find(
                                    (option) => option.value === status,
                                ) ?? statusOptions[0]
                            }
                            onChange={(option) => {
                                setPage(1)
                                setStatus(String(option?.value ?? ''))
                            }}
                        />
                    </div>
                </div>

                <DataTable<PlatformUser>
                    columns={columns}
                    data={data}
                    loading={loading}
                    pagingData={{ total, pageIndex: page, pageSize }}
                    onPaginationChange={(nextPage) => setPage(nextPage)}
                    onPageSizeChange={(size) => {
                        setPage(1)
                        setPageSize(size)
                    }}
                />
            </Card>

            <UserFormDialog
                isOpen={dialogOpen}
                user={editing}
                defaultAgencyId={agencyId ? Number(agencyId) : null}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchData}
            />
        </>
    )
}

export default Users
