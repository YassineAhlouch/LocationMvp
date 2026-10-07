import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Dialog from '@/components/ui/Dialog'
import Popover from '@/components/ui/Popover'
import ActionBar from '@/components/ui/ActionBar'
import Progress from '@/components/ui/Progress'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import { CSVLink } from 'react-csv'
import { NumericFormat } from 'react-number-format'
import { LuPlus, LuSearch } from 'react-icons/lu'
import { LiCar, LiDownload, LiEdit2, LiSetting4, LiTrash } from '@/icons'
import { apiGetCars, apiDeleteCar } from '@/services/LocationService'
import type { Car, CarStatus } from '@/@types/location'
import CarForm from './forms/CarForm'
import {
    MAD,
    carStatusOptions,
    carStatusTone,
    tagToneClass,
} from './shared'

type CarStatusOption = { value: string; label: string }

/** All fleet statuses — superset of carStatusOptions so the filter can match
 * any state a vehicle can be in, including system-set reserved/rented. */
const statusFilterOptions: CarStatusOption[] = [
    ...carStatusOptions,
    { value: 'reserved', label: 'Reserved' },
    { value: 'rented', label: 'Rented' },
]

/** Fuel-gauge color: danger below a quarter, warning at half, success above. */
const fuelLevelColor = (level: number) => {
    if (level <= 25) return 'bg-error'
    if (level <= 50) return 'bg-warning'
    return 'bg-success'
}

const VehicleColumn = ({ car }: { car: Car }) => {
    const cover =
        (car.images?.find((img) => img.is_primary) ?? car.images?.[0])?.image ??
        ''
    const name = [car.brand?.name, car.model?.name].filter(Boolean).join(' ')
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={35}
                className="vehicle-avatar"
                {...(cover ? { src: cover } : { icon: <LiCar /> })}
            />
            <span className="font-semibold heading-text">
                {name || car.registration_number}
            </span>
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
                    className="text-xl cursor-pointer select-none font-medium"
                    type="button"
                    onClick={onEdit}
                    size="sm"
                    variant="link"
                    icon={<LiEdit2 className="text-base" />}
                />
            </Tooltip>
            <Tooltip title="Delete">
                <Button
                    className="text-xl cursor-pointer select-none font-medium"
                    type="button"
                    onClick={onDelete}
                    size="sm"
                    variant="link"
                    icon={<LiTrash className="text-base" />}
                />
            </Tooltip>
        </div>
    )
}

type CarFormDialogProps = {
    open: boolean
    car: Car | null
    onClose: () => void
    onSaved: () => void
}

const CarFormDialog = ({ open, car, onClose, onSaved }: CarFormDialogProps) => (
    <Dialog
        isOpen={open}
        onClose={onClose}
        width={760}
        className="max-h-[90vh] overflow-y-auto"
    >
        <h5 className="mb-6 text-base font-bold dark:text-gray-100">
            {car ? 'Edit car' : 'Add car'}
        </h5>
        <CarForm car={car} isOpen={open} onCancel={onClose} onSaved={onSaved} />
    </Dialog>
)

const CarsHeader = ({ onAdd }: { onAdd: () => void }) => {
    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Container className="sm:px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h5>Cars</h5>
                        <p>
                            Manage your fleet availability, pricing & status in
                            real time
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button
                            className="w-full md:w-auto"
                            variant="subtle"
                            icon={<LuPlus />}
                            onClick={onAdd}
                        >
                            Add Car
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

const StatusFilter = ({
    value,
    onChange,
}: {
    value: string
    onChange: (value: string) => void
}) => {
    const [filterOpen, setFilterOpen] = useState(false)
    const { larger } = useResponsive()

    const handleSelect = (status: string) => {
        onChange(value === status ? '' : status)
        setFilterOpen(false)
    }

    const handleReset = () => {
        onChange('')
        setFilterOpen(false)
    }

    return (
        <Popover
            renderTrigger={
                <Button icon={<LiSetting4 />}>
                    {larger.sm && 'Filter'}
                </Button>
            }
            open={filterOpen}
            placement="bottom-start"
            onOpenChange={setFilterOpen}
            style={{ width: 260 }}
        >
            <div className="p-4">
                <h6 className="mb-3">Status</h6>
                <div className="flex flex-wrap gap-2">
                    {statusFilterOptions.map((status) => (
                        <button
                            key={status.value}
                            type="button"
                            onClick={() => handleSelect(status.value)}
                        >
                            <Tag
                                className={classNames(
                                    'bg-transparent capitalize',
                                    value === status.value
                                        ? 'border-primary text-primary'
                                        : 'opacity-50 hover:opacity-100',
                                )}
                            >
                                {status.label}
                            </Tag>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button size="sm" type="button" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>
        </Popover>
    )
}

const Cars = () => {
    const [cars, setCars] = useState<Car[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [selectedRows, setSelectedRows] = useState<Car[]>([])

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Car | null>(null)
    const [deleting, setDeleting] = useState<Car | null>(null)
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

    const { larger } = useResponsive()

    const fetchCars = useCallback(() => {
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
        apiGetCars(params)
            .then((res) => {
                setCars(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setCars([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, q, statusFilter])

    useEffect(() => {
        fetchCars()
    }, [fetchCars])

    const handlePageChange = (page: number) => {
        setSelectedRows([])
        setPageIndex(page)
    }

    const handlePageSizeChange = (size: number) => {
        setSelectedRows([])
        setPageSize(size)
        setPageIndex(1)
    }

    const handleRowSelect = (checked: boolean, row: Car) => {
        setSelectedRows((prev) =>
            checked
                ? [...prev.filter((s) => s.id !== row.id), row]
                : prev.filter((s) => s.id !== row.id),
        )
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Car>[]) => {
        setSelectedRows(checked ? rows.map((r) => r.original) : [])
    }

    const handleDelete = async () => {
        if (!deleting) {
            return
        }
        try {
            await apiDeleteCar(deleting.id)
            toast.push(
                <Notification
                    type="success"
                    title="Car deleted successfully!"
                />,
            )
            setDeleting(null)
            fetchCars()
        } catch {
            toast.push(
                <Notification type="danger" title="Could not delete car" />,
            )
        }
    }

    const handleBulkDelete = async () => {
        const ids = selectedRows.map((car) => car.id)
        try {
            const results = await Promise.allSettled(
                ids.map((id) => apiDeleteCar(id)),
            )
            const failed = results.filter(
                (result) => result.status === 'rejected',
            ).length
            toast.push(
                <Notification
                    type="success"
                    title={`${ids.length - failed} car(s) deleted successfully!`}
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
            fetchCars()
        } catch {
            toast.push(
                <Notification type="danger" title="Could not delete cars" />,
            )
            setBulkDeleteOpen(false)
        }
    }

    const exportData = useMemo(
        () =>
            cars.map((car) => ({
                registration_number: car.registration_number,
                brand: car.brand?.name ?? '',
                model: car.model?.name ?? '',
                color: car.color ?? '',
                category: car.category?.name ?? '',
                daily_price: car.daily_price ?? '',
                initial_mileage: car.initial_mileage ?? '',
                current_mileage: car.current_mileage ?? '',
                current_fuel_level: car.current_fuel_level ?? '',
                status: car.status,
            })),
        [cars],
    )

    const columns = useMemo<ColumnDef<Car>[]>(
        () => [
            {
                header: 'Vehicle',
                accessorKey: 'brand.name',
                cell: (props) => <VehicleColumn car={props.row.original} />,
            },
            {
                header: 'Registration',
                accessorKey: 'registration_number',
                cell: (props) => (
                    <span className="heading-text">
                        {props.row.original.registration_number}
                    </span>
                ),
            },
            {
                header: 'Color',
                accessorKey: 'color',
                cell: (props) => (
                    <span className="heading-text uppercase">
                        {props.row.original.color ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Price',
                accessorKey: 'daily_price',
                cell: (props) => (
                    <span className="font-medium heading-text">
                        {MAD(props.row.original.daily_price)}
                    </span>
                ),
            },
            {
                header: 'Category',
                accessorKey: 'category.name',
                cell: (props) => (
                    <Tag className="capitalize">
                        {props.row.original.category?.name ?? '—'}
                    </Tag>
                ),
            },
            {
                header: 'Mileage',
                accessorKey: 'current_mileage',
                cell: (props) => {
                    const { initial_mileage, current_mileage } =
                        props.row.original
                    return (
                        <div className="flex flex-col gap-0.5">
                            <span className="heading-text whitespace-nowrap">
                                <NumericFormat
                                    displayType="text"
                                    value={current_mileage ?? 0}
                                    thousandSeparator
                                />{' '}
                                km
                            </span>
                            {initial_mileage != null && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    initial:{' '}
                                    <NumericFormat
                                        displayType="text"
                                        value={initial_mileage}
                                        thousandSeparator
                                    />
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Fuel',
                accessorKey: 'current_fuel_level',
                cell: (props) => {
                    const fuel = props.row.original.current_fuel_level ?? 0
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="heading-text font-medium">
                                {fuel}%
                            </span>
                            <Progress
                                size="sm"
                                percent={fuel}
                                strokeClass={fuelLevelColor(fuel)}
                                showInfo={false}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status as CarStatus
                    return (
                        <Tag
                            className={`capitalize ${tagToneClass[carStatusTone[status]]}`}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => {
                            setEditing(props.row.original)
                            setDialogOpen(true)
                        }}
                        onDelete={() => setDeleting(props.row.original)}
                    />
                ),
            },
        ],
        [],
    )

    return (
        <div>
            <CarsHeader
                onAdd={() => {
                    setEditing(null)
                    setDialogOpen(true)
                }}
            />

            <Container className="p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 sm:flex-none">
                            <DebouceInput
                                placeholder="Search"
                                prefix={<LuSearch className="text-lg" />}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                    setSelectedRows([])
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div>
                                <StatusFilter
                                    value={statusFilter}
                                    onChange={(value) => {
                                        setStatusFilter(value)
                                        setSelectedRows([])
                                        setPageIndex(1)
                                    }}
                                />
                            </div>
                            <div>
                                <CSVLink
                                    className="w-full"
                                    filename="cars.csv"
                                    data={exportData}
                                >
                                    <Button icon={<LiDownload />}>
                                        {larger.sm ? 'Export' : ''}
                                    </Button>
                                </CSVLink>
                            </div>
                        </div>
                    </div>

                    <DataTable<Car>
                        selectable
                        className="table-vehicles"
                        columns={columns}
                        data={cars}
                        loading={loading}
                        noData={!loading && cars.length === 0}
                        skeletonAvatarColumns={[1]}
                        skeletonAvatarProps={{ width: 28, height: 28 }}
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

            <CarFormDialog
                open={dialogOpen}
                car={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchCars}
            />

            <ConfirmDialog
                isOpen={Boolean(deleting)}
                type="danger"
                title="Delete car"
                onClose={() => setDeleting(null)}
                onCancel={() => setDeleting(null)}
                onConfirm={handleDelete}
                confirmButtonProps={{ children: 'Delete' }}
            >
                <p>
                    Delete {deleting?.registration_number}? This removes the
                    vehicle from the fleet.
                </p>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={bulkDeleteOpen}
                type="danger"
                title="Delete cars"
                onClose={() => setBulkDeleteOpen(false)}
                onCancel={() => setBulkDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                confirmButtonProps={{ children: 'Delete' }}
            >
                <p>
                    Are you sure you want to remove {selectedRows.length}{' '}
                    car(s)? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default Cars