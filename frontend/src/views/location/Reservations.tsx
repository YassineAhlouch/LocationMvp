import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import {
    apiGetReservations,
    apiConfirmReservation,
    apiCancelReservation,
} from '@/services/LocationService'
import type { Reservation } from '@/@types/location'
import ReservationForm from './forms/ReservationForm'
import {
    MAD,
    reservationStatusTone,
    reservationStatusOptions,
    paymentStatusTone,
    tagToneClass,
    formatDateTime,
} from './shared'

type ReservationFormDialogProps = {
    open: boolean
    reservation: Reservation | null
    onClose: () => void
    onSaved: () => void
}

const ReservationFormDialog = ({
    open,
    reservation,
    onClose,
    onSaved,
}: ReservationFormDialogProps) => (
    <Dialog
        isOpen={open}
        onClose={onClose}
        width={720}
        className="max-h-[90vh] overflow-y-auto"
    >
        <h5 className="mb-6 text-base font-bold dark:text-gray-100">
            {reservation ? 'Edit reservation' : 'New reservation'}
        </h5>
        <ReservationForm
            reservation={reservation}
            isOpen={open}
            onCancel={onClose}
            onSaved={onSaved}
        />
    </Dialog>
)

type CancelDialogProps = {
    reservation: Reservation | null
    onClose: () => void
    onCancelled: () => void
}

const CancelDialog = ({
    reservation,
    onClose,
    onCancelled,
}: CancelDialogProps) => {
    const [reason, setReason] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleCancel = async () => {
        if (!reservation || !reason.trim()) {
            return
        }
        setSubmitting(true)
        try {
            await apiCancelReservation(reservation.id, {
                reason: reason.trim(),
            })
            toast.push(
                <Notification type="success" title="Reservation cancelled" />,
            )
            onCancelled()
            onClose()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not cancel reservation"
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog isOpen={Boolean(reservation)} onClose={onClose} width={480}>
            <h5 className="mb-4 text-base font-bold dark:text-gray-100">
                Cancel reservation {reservation?.reservation_number}
            </h5>
            <Form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleCancel()
                }}
            >
                <FormItem label="Reason (required)">
                    <Input
                        textArea
                        placeholder="e.g. Client changed plans"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </FormItem>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        Back
                    </Button>
                    <Button
                        variant="solid"
                        loading={submitting}
                        disabled={!reason.trim()}
                        onClick={handleCancel}
                    >
                        Cancel reservation
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

const Reservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<Reservation | null>(null)
    const [cancelling, setCancelling] = useState<Reservation | null>(null)

    const fetchReservations = useCallback(() => {
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
        apiGetReservations(params)
            .then((res) => {
                setReservations(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setReservations([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, q, statusFilter])

    useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const handleConfirm = async (reservation: Reservation) => {
        try {
            await apiConfirmReservation(reservation.id)
            toast.push(
                <Notification
                    type="success"
                    title={`${reservation.reservation_number} confirmed`}
                />,
            )
            fetchReservations()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not confirm reservation"
                />,
            )
        }
    }

    const columns = useMemo<ColumnDef<Reservation>[]>(
        () => [
            {
                header: 'Reservation',
                accessorKey: 'reservation_number',
                cell: (props) => (
                    <span className="font-semibold dark:text-gray-100">
                        {props.row.original.reservation_number}
                    </span>
                ),
            },
            {
                header: 'Car',
                accessorKey: 'car.registration_number',
                cell: (props) => (
                    <span className="text-sm dark:text-gray-200">
                        {props.row.original.car?.registration_number ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Client',
                accessorKey: 'primary_client.name',
                cell: (props) => (
                    <span className="text-sm dark:text-gray-200">
                        {props.row.original.primary_client?.name ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Period',
                accessorKey: 'pickup_datetime',
                cell: (props) => {
                    const r = props.row.original
                    return (
                        <div className="flex flex-col text-sm">
                            <span className="dark:text-gray-200">
                                {formatDateTime(r.pickup_datetime)}
                            </span>
                            <span className="text-xs text-gray-400">
                                → {formatDateTime(r.expected_return_datetime)}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Total',
                accessorKey: 'total_amount',
                cell: (props) => (
                    <span className="font-semibold dark:text-gray-100">
                        {MAD(props.row.original.total_amount)}
                    </span>
                ),
            },
            {
                header: 'Payment',
                accessorKey: 'payment_status',
                cell: (props) => {
                    const status = props.row.original.payment_status
                    return (
                        <Tag
                            className={`capitalize ${tagToneClass[paymentStatusTone[status]]}`}
                        >
                            {status}
                        </Tag>
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
                            className={`capitalize ${tagToneClass[reservationStatusTone[status]]}`}
                        >
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => {
                    const reservation = props.row.original
                    const status = reservation.status
                    return (
                        <div className="flex items-center justify-end gap-1">
                            {status === 'pending' && (
                                <Button
                                    size="sm"
                                    variant="subtle"
                                    onClick={() => handleConfirm(reservation)}
                                >
                                    Confirm
                                </Button>
                            )}
                            {['pending', 'confirmed', 'active'].includes(
                                status,
                            ) && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-error hover:bg-error-subtle"
                                    onClick={() => setCancelling(reservation)}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setEditing(reservation)
                                    setDialogOpen(true)
                                }}
                            >
                                Edit
                            </Button>
                        </div>
                    )
                },
            },
        ],
        [],
    )

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-bold dark:text-gray-100">
                                Reservations
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {total} reservations
                            </p>
                        </div>
                        <Button
                            variant="solid"
                            onClick={() => {
                                setEditing(null)
                                setDialogOpen(true)
                            }}
                        >
                            New reservation
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <DebouceInput
                            className="w-full sm:w-64"
                            placeholder="Search reservation…"
                            onChange={(e) => {
                                setQ(e.target.value)
                                setPageIndex(1)
                            }}
                        />
                        <div className="w-full sm:w-48">
                            <Select
                                options={[
                                    { value: '', label: 'All statuses' },
                                    ...reservationStatusOptions,
                                ]}
                                value={
                                    [
                                        { value: '', label: 'All statuses' },
                                        ...reservationStatusOptions,
                                    ].find((o) => o.value === statusFilter) ??
                                    null
                                }
                                onChange={(option) => {
                                    setStatusFilter(option?.value ?? '')
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>

                    <DataTable<Reservation>
                        columns={columns}
                        data={reservations}
                        loading={loading}
                        pagingData={{
                            total,
                            pageIndex,
                            pageSize,
                        }}
                        onPaginationChange={(page) => setPageIndex(page)}
                        onPageSizeChange={(size) => {
                            setPageSize(size)
                            setPageIndex(1)
                        }}
                    />
                </div>
            </Card>

            <ReservationFormDialog
                open={dialogOpen}
                reservation={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchReservations}
            />

            <CancelDialog
                reservation={cancelling}
                onClose={() => setCancelling(null)}
                onCancelled={fetchReservations}
            />
        </Container>
    )
}

export default Reservations
