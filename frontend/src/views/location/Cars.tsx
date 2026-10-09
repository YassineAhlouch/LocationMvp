import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Dialog from '@/components/ui/Dialog'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import Segment from '@/components/ui/Segment'
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
import {
    LiCar,
    LiDownload,
    LiEdit2,
    LiElement3,
    LiEye,
    LiKey,
    LiSetting4,
    LiTextAlignLeft,
    LiTickCircle,
    LiTrash,
} from '@/icons'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import {
    apiGetCars,
    apiDeleteCar,
    apiGetDashboardSummary,
} from '@/services/LocationService'
import type { Car, CarStatus, DashboardSummary } from '@/@types/location'
import CarForm from './forms/CarForm'
import StatCards from './StatCards'
import { MAD, carStatusOptions, carStatusTone, tagToneClass } from './shared'

type CarStatusOption = { value: string; label: string }

/** All fleet statuses, including the lifecycle-owned reserved/rented states,
 * so the filter can match any state a vehicle can be in. */
const statusFilterOptions: CarStatusOption[] = [...carStatusOptions]

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
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
                <Link
                    to={`${APPS_PREFIX_PATH}/vehicules/${car.id}/overview`}
                    className="hover:text-primary"
                >
                    {name || car.registration_number}
                </Link>
            </span>
        </div>
    )
}

const ActionColumn = ({
    car,
    onEdit,
    onDelete,
}: {
    car: Car
    onEdit: () => void
    onDelete: () => void
}) => {
    return (
        <div className="flex items-center justify-end gap-1">
            <Tooltip title="View details">
                <Link
                    to={`${APPS_PREFIX_PATH}/vehicules/${car.id}/overview`}
                    className="cursor-pointer select-none font-medium text-gray-500 hover:text-primary"
                >
                    <LiEye className="text-base" />
                </Link>
            </Tooltip>
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

const CarCard = ({
    car,
    onEdit,
    onDelete,
}: {
    car: Car
    onEdit: () => void
    onDelete: () => void
}) => {
    const cover =
        (car.images?.find((img) => img.is_primary) ?? car.images?.[0])?.image ??
        ''
    const name =
        [car.brand?.name, car.model?.name].filter(Boolean).join(' ') ||
        car.registration_number
    const fuel = car.current_fuel_level ?? 0
    const detailsUrl = `${APPS_PREFIX_PATH}/vehicules/${car.id}/overview`

    return (
        <Card bodyClass="p-0">
            <div className="relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
                <Link to={detailsUrl}>
                    {cover ? (
                        <img
                            src={cover}
                            alt={name}
                            loading="lazy"
                            className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-44 w-full items-center justify-center text-gray-400 dark:text-gray-500">
                            <LiCar className="text-4xl" />
                        </div>
                    )}
                </Link>
                <Tag
                    className={`absolute left-3 top-3 capitalize ${tagToneClass[carStatusTone[car.status as CarStatus]]}`}
                >
                    {car.status}
                </Tag>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h6 className="truncate">
                            <Link
                                to={detailsUrl}
                                className="hover:text-primary"
                            >
                                {name}
                            </Link>
                        </h6>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {car.registration_number}
                        </p>
                    </div>
                    <span className="heading-text whitespace-nowrap font-semibold">
                        {MAD(car.daily_price)}
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                            {' '}
                            / day
                        </span>
                    </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="truncate">
                        {car.category?.name ?? '—'}
                    </span>
                    <span className="whitespace-nowrap">
                        <NumericFormat
                            displayType="text"
                            value={car.current_mileage ?? 0}
                            thousandSeparator
                        />{' '}
                        km
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <Progress
                        size="sm"
                        percent={fuel}
                        strokeClass={fuelLevelColor(fuel)}
                        showInfo={false}
                    />
                    <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {fuel}%
                    </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                    <span className="text-xs uppercase tracking-wide text-gray-400">
                        {car.color ?? ''}
                    </span>
                    <ActionColumn
                        car={car}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </div>
        </Card>
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
                <Button icon={<LiSetting4 />}>{larger.sm && 'Filter'}</Button>
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
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [selectedRows, setSelectedRows] = useState<Car[]>([])
    const [viewMode, setViewMode] = useState<'card' | 'table'>('table')

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

    useEffect(() => {
        setSummaryLoading(true)
        apiGetDashboardSummary()
            .then(setSummary)
            .catch(() => setSummary(null))
            .finally(() => setSummaryLoading(false))
    }, [])

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
                        car={props.row.original}
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

    const statCards = useMemo(
        () => [
            {
                id: 'total',
                label: 'Total',
                value: summary?.fleet.total_cars ?? 0,
                icon: <LiCar />,
            },
            {
                id: 'available',
                label: 'Available',
                value: summary?.fleet.by_status.available ?? 0,
                icon: <LiTickCircle />,
            },
            {
                id: 'rented',
                label: 'Rented',
                value: summary?.fleet.by_status.rented ?? 0,
                icon: <LiKey />,
            },
            {
                id: 'maintenance',
                label: 'Maintenance',
                value: summary?.fleet.by_status.maintenance ?? 0,
                icon: <LiSetting4 />,
            },
        ],
        [summary],
    )

    return (
        <div>
            <Container className="">
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h4>Cars</h4>
                        <Button
                            variant="subtle"
                            icon={<LuPlus />}
                            onClick={() => {
                                setEditing(null)
                                setDialogOpen(true)
                            }}
                        >
                            Add Car
                        </Button>
                    </div>

                    <StatCards items={statCards} loading={summaryLoading} />

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
                            <Segment
                                value={viewMode}
                                onChange={(value) =>
                                    setViewMode(value as 'card' | 'table')
                                }
                            >
                                <Segment.Item value="card" className="px-2">
                                    <LiElement3 />
                                </Segment.Item>
                                <Segment.Item value="table" className="px-2">
                                    <LiTextAlignLeft />
                                </Segment.Item>
                            </Segment>
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

                    {viewMode === 'table' ? (
                        <DataTable<Car>
                            selectable
                            className="table-vehicles rounded-xs border border-gray-300 dark:border-gray-600"
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
                    ) : loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Card key={index}>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-3">
                                            <Skeleton
                                                variant="circle"
                                                className="w-9 h-9"
                                            />
                                            <div className="flex flex-col gap-2">
                                                <Skeleton className="w-32 h-3" />
                                                <Skeleton className="w-48 h-2" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <Skeleton className="w-20" />
                                            <Skeleton className="w-16 h-2" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="text-center py-16">
                            <h6 className="font-semibold mb-1">
                                No cars found
                            </h6>
                            <p className="text-sm text-gray-400">
                                Try widening the filters or add a new car.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {cars.map((car) => (
                                    <CarCard
                                        key={car.id}
                                        car={car}
                                        onEdit={() => {
                                            setEditing(car)
                                            setDialogOpen(true)
                                        }}
                                        onDelete={() => setDeleting(car)}
                                    />
                                ))}
                            </div>
                            <div className="py-4 flex justify-between">
                                <Pagination
                                    pageSize={pageSize}
                                    currentPage={pageIndex}
                                    total={total}
                                    onChange={handlePageChange}
                                />
                                <Select
                                    size="sm"
                                    className="w-[120px]"
                                    placement="top"
                                    isSearchable={false}
                                    value={
                                        pageSizeOption.find(
                                            (option) =>
                                                option.value === pageSize,
                                        ) ?? null
                                    }
                                    options={pageSizeOption}
                                    onChange={(option) => {
                                        if (option?.value) {
                                            handlePageSizeChange(option.value)
                                        }
                                    }}
                                />
                            </div>
                        </>
                    )}
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
