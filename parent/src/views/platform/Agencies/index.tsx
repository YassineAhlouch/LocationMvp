import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Select, toast } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import DebouceInput from '@/components/shared/DebouceInput'
import PageHeading from '../components/PageHeading'
import StatusPill from '../components/StatusPill'
import AgencyFormDialog from './AgencyFormDialog'
import { apiGetAgencies } from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { LiAddCircle, LiEdit } from '@/icons'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { PlatformAgency } from '@/@types/platform'
import type { ChangeEvent } from 'react'

const statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
]

const Agencies = () => {
    const [data, setData] = useState<PlatformAgency[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<PlatformAgency | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiGetAgencies({
                page,
                per_page: pageSize,
                ...(query ? { q: query } : {}),
                ...(status ? { is_active: status } : {}),
            })
            setData(response.data)
            setTotal(response.total)
        } catch (error) {
            toast.push(
                <div className="text-red-600 font-medium">
                    {apiErrorMessage(error)}
                </div>,
            )
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, query, status])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleCreate = () => {
        setEditing(null)
        setDialogOpen(true)
    }

    const handleEdit = (agency: PlatformAgency) => {
        setEditing(agency)
        setDialogOpen(true)
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setPage(1)
        setQuery(e.target.value)
    }

    const handleStatusChange = (value: string | number | null) => {
        setPage(1)
        setStatus(String(value ?? ''))
    }

    const columns = useMemo<ColumnDef<PlatformAgency>[]>(
        () => [
            {
                header: 'Agency',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div>
                        <span className="font-medium heading-text">
                            {row.original.name}
                        </span>
                        {row.original.city && (
                            <div className="text-xs">{row.original.city}</div>
                        )}
                    </div>
                ),
            },
            {
                header: 'Contact',
                accessorKey: 'email',
                cell: ({ row }) => (
                    <div>
                        <div>{row.original.email || '—'}</div>
                        {row.original.phone && (
                            <div className="text-xs">{row.original.phone}</div>
                        )}
                    </div>
                ),
            },
            {
                header: 'Users',
                accessorKey: 'users_count',
                cell: ({ row }) => row.original.users_count ?? 0,
            },
            {
                header: 'Cars',
                accessorKey: 'cars_count',
                cell: ({ row }) => row.original.cars_count ?? 0,
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: ({ row }) => (
                    <StatusPill active={row.original.is_active} />
                ),
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
                title="Agencies"
                description="Create and manage every tenant on the platform."
                extra={
                    <Button
                        variant="solid"
                        icon={<LiAddCircle />}
                        onClick={handleCreate}
                    >
                        New agency
                    </Button>
                }
            />

            <Card>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <DebouceInput
                        placeholder="Search by name, email or city"
                        onChange={handleSearch}
                        className="w-full sm:w-72"
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
                        onChange={(option) =>
                            handleStatusChange(option?.value ?? '')
                        }
                    />
                </div>

                <DataTable<PlatformAgency>
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

            <AgencyFormDialog
                isOpen={dialogOpen}
                agency={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchData}
            />
        </>
    )
}

export default Agencies
