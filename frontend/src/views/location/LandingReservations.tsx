import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Dropdown from '@/components/ui/Dropdown'
import Tabs from '@/components/ui/Tabs'
import DataTable from '@/components/shared/DataTable'
import DebouceInput from '@/components/shared/DebouceInput'
import classNames from '@/utils/classNames'
import useTranslation from '@/utils/hooks/useTranslation'
import {
    apiGetLandingReservations,
    apiUpdateLandingReservationStatus,
} from '@/services/LocationService'
import { apiErrorMessage, formatDateTime, tagToneClass } from './shared'
import type { Translator, TagTone } from './shared'
import type { ColumnDef } from '@tanstack/react-table'
import type {
    LandingReservation,
    LandingReservationStatus,
} from '@/@types/location'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import {
    LiBarcode,
    LiCalendar,
    LiEllipsis,
    LiEye,
    LiMail,
    LiPhone,
    LiPhoneCalling,
    LiSearch,
    LiUser,
    LiWhatsapp,
} from '@/icons'

const { TabNav, TabList } = Tabs

type StatusFilterOption = { value: '' | LandingReservationStatus; label: string }

const statusFilterOptions = (t: Translator): StatusFilterOption[] => [
    { value: '', label: t('landingReservations.filter.all', 'All') },
    {
        value: 'new',
        label: t('landingReservations.status.new', 'New'),
    },
    {
        value: 'contacted',
        label: t('landingReservations.status.contacted', 'Contacted'),
    },
    {
        value: 'converted',
        label: t('landingReservations.status.converted', 'Converted'),
    },
    {
        value: 'rejected',
        label: t('landingReservations.status.rejected', 'Rejected'),
    },
]

const statusTone: Record<LandingReservationStatus, TagTone> = {
    new: 'warning',
    contacted: 'primary',
    converted: 'success',
    rejected: 'error',
}

const statusLabel = (t: Translator, status: LandingReservationStatus) =>
    t(`landingReservations.status.${status}`, status)

/** Pipeline moves the backend accepts (mirrors the status enum). */
const statusTransitions: Record<
    LandingReservationStatus,
    LandingReservationStatus[]
> = {
    new: ['contacted', 'converted', 'rejected'],
    contacted: ['converted', 'rejected'],
    converted: [],
    rejected: [],
}

/** The customer phone in international digits, as wa.me expects it. */
const waNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    return digits.startsWith('0') ? `212${digits.slice(1)}` : digits
}

const carName = (lead: LandingReservation) => {
    if (!lead.car) return null
    const label = [lead.car.brand, lead.car.model].filter(Boolean).join(' ')
    return label || lead.car.slug
}

type DetailRowProps = {
    icon: React.ReactNode
    label: string
    children: React.ReactNode
    className?: string
}

function DetailRow({ icon, label, children, className }: DetailRowProps) {
    return (
        <div className={classNames('flex items-start gap-3', className)}>
            <span className="mt-0.5 text-lg text-gray-400">{icon}</span>
            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <div className="text-sm font-medium break-words">{children}</div>
            </div>
        </div>
    )
}

/** Kebab menu offering only the pipeline moves the backend still allows. */
function StatusMenu({
    lead,
    onSaved,
}: {
    lead: LandingReservation
    onSaved: () => void
}) {
    const { t } = useTranslation()
    const [busy, setBusy] = useState(false)

    const nextStatuses = statusTransitions[lead.status]

    if (nextStatuses.length === 0) {
        return null
    }

    const changeStatus = async (next: LandingReservationStatus) => {
        if (busy) {
            return
        }
        setBusy(true)
        try {
            await apiUpdateLandingReservationStatus(lead.id, next)
            toast.push(
                <Notification
                    type="success"
                    title={t(
                        'landingReservations.toasts.updated',
                        'Status updated',
                    )}
                />,
            )
            onSaved()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        t(
                            'landingReservations.toasts.couldNotUpdate',
                            'Could not update status',
                        ),
                    )}
                />,
            )
        } finally {
            setBusy(false)
        }
    }

    return (
        <Dropdown
            placement="bottom-end"
            renderTitle={
                <Button
                    size="sm"
                    variant="ghost"
                    icon={<LiEllipsis />}
                    loading={busy}
                    aria-label={t(
                        'landingReservations.actions.changeStatus',
                        'Change status',
                    )}
                />
            }
        >
            {nextStatuses.map((next) => (
                <Dropdown.Item key={next} onClick={() => changeStatus(next)}>
                    <span className="flex items-center">
                        <Tag
                            className={classNames(
                                'capitalize',
                                tagToneClass[statusTone[next]],
                            )}
                        >
                            {statusLabel(t, next)}
                        </Tag>
                    </span>
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

function LeadDetailDialog({
    lead,
    onClose,
    onSaved,
}: {
    lead: LandingReservation | null
    onClose: () => void
    onSaved: () => void
}) {
    const { t } = useTranslation()

    const waMessage = lead
        ? encodeURIComponent(
            t(
                'landingReservations.dialog.waMessage',
                'Hello {{name}}, about your reservation request for the {{car}}…',
                {
                    name: lead.full_name,
                    car: carName(lead)
                        ? carName(lead)
                        : t('landingReservations.table.noCar', '—'),
                },
            ),
        )
        : ''

    return (
        <Dialog isOpen={Boolean(lead)} onClose={onClose} width={540}>
            {lead && (
                <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h5 className="mb-1">{lead.full_name}</h5>
                            <p className="text-xs text-gray-400">
                                {t(
                                    'landingReservations.table.created',
                                    'Received',
                                )}{' '}
                                {formatDateTime(lead.created_at)}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 pt-1">
                            <Tag
                                className={classNames(
                                    'capitalize',
                                    tagToneClass[statusTone[lead.status]],
                                )}
                            >
                                {statusLabel(t, lead.status)}
                            </Tag>
                            <StatusMenu lead={lead} onSaved={onSaved} />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <DetailRow
                            icon={<LiPhone />}
                            label={t('landingReservations.dialog.phone', 'Phone')}
                        >
                            <a
                                className="hover:text-primary"
                                href={`tel:${lead.phone.replace(/\s/g, '')}`}
                            >
                                {lead.phone}
                            </a>
                        </DetailRow>
                        <DetailRow
                            icon={<LiMail />}
                            label={t('landingReservations.dialog.email', 'Email')}
                        >
                            {lead.email ? (
                                <a
                                    className="hover:text-primary"
                                    href={`mailto:${lead.email}`}
                                >
                                    {lead.email}
                                </a>
                            ) : (
                                <span className="text-gray-400">—</span>
                            )}
                        </DetailRow>
                        <DetailRow
                            icon={<LiBarcode />}
                            label={t('landingReservations.dialog.car', 'Requested car')}
                        >
                            {carName(lead) ?? (
                                <span className="text-gray-400">
                                    {t('landingReservations.table.noCar', '—')}
                                </span>
                            )}
                        </DetailRow>
                        <DetailRow
                            className="sm:col-span-2"
                            icon={<LiCalendar />}
                            label={t('landingReservations.dialog.dates', 'Pickup → return')}
                        >
                            <span className="whitespace-nowrap">
                                {formatDateTime(lead.pickup_datetime)}
                                {' → '}
                                {formatDateTime(lead.expected_return_datetime)}
                            </span>
                        </DetailRow>
                    </div>

                    {lead.message && (
                        <div className="mt-5">
                            <p className="text-xs text-gray-400 mb-1">
                                {t('landingReservations.dialog.message', 'Customer message')}
                            </p>
                            <p className="text-sm rounded-lg bg-gray-50 dark:bg-gray-800 p-3 whitespace-preline">
                                {lead.message}
                            </p>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            icon={<LiPhoneCalling />}
                            onClick={() => window.open(`tel:${lead.phone.replace(/\s/g, '')}`)}
                        >
                            {t('landingReservations.dialog.call', 'Call')}
                        </Button>
                        <Button
                            variant="solid"
                            icon={<LiWhatsapp />}
                            onClick={() =>
                                window.open(
                                    `https://wa.me/${waNumber(lead.phone)}?text=${waMessage}`,
                                    '_blank',
                                    'noopener,noreferrer',
                                )
                            }
                        >
                            {t('landingReservations.dialog.whatsapp', 'WhatsApp')}
                        </Button>
                    </div>
                </div>
            )}
        </Dialog>
    )
}

const PAGE_SIZE = 10

function LeadRowActions({
    lead,
    onDetails,
    onSaved,
}: {
    lead: LandingReservation
    onDetails: (lead: LandingReservation) => void
    onSaved: () => void
}) {
    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-1">
            <Button
                size="sm"
                variant="ghost"
                icon={<LiEye />}
                aria-label={t('landingReservations.actions.details', 'Details')}
                onClick={() => onDetails(lead)}
            />
            <StatusMenu lead={lead} onSaved={onSaved} />
        </div>
    )
}

const LandingReservations = () => {
    const { t } = useTranslation()

    const [leads, setLeads] = useState<LandingReservation[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(PAGE_SIZE)
    const [statusFilter, setStatusFilter] = useState<'' | LandingReservationStatus>('')
    const [q, setQ] = useState('')
    const [selected, setSelected] = useState<LandingReservation | null>(null)

    const fetchLeads = useCallback(() => {
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
        apiGetLandingReservations(params)
            .then((res) => {
                setLeads(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setLeads([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, q, statusFilter])

    useEffect(() => {
        fetchLeads()
    }, [fetchLeads])

    const columns = useMemo<ColumnDef<LandingReservation>[]>(
        () => [
            {
                header: t('landingReservations.table.client', 'Customer'),
                accessorKey: 'full_name',
                cell: (props) => (
                    <div className="min-w-[160px]">
                        <div className="flex items-center gap-2">
                            <LiUser className="text-lg text-gray-400" />
                            <span className="font-semibold heading-text">
                                {props.row.original.full_name}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {props.row.original.phone}
                        </p>
                    </div>
                ),
            },
            {
                header: t('landingReservations.table.car', 'Car'),
                id: 'car',
                cell: (props) => {
                    const name = carName(props.row.original)
                    if (!name) {
                        return <span className="text-gray-400">—</span>
                    }
                    return (
                        <div>
                            <span className="font-medium">{name}</span>
                            {props.row.original.car?.slug && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {props.row.original.car.slug}
                                </p>
                            )}
                        </div>
                    )
                },
            },
            {
                header: t('landingReservations.table.pickup', 'Pickup'),
                accessorKey: 'pickup_datetime',
                cell: (props) => (
                    <span className="text-nowrap">
                        {formatDateTime(props.row.original.pickup_datetime)}
                    </span>
                ),
            },
            {
                header: t('landingReservations.table.return', 'Return'),
                accessorKey: 'expected_return_datetime',
                cell: (props) => (
                    <span className="text-nowrap">
                        {formatDateTime(props.row.original.expected_return_datetime)}
                    </span>
                ),
            },
            {
                header: t('landingReservations.table.message', 'Message'),
                accessorKey: 'message',
                cell: (props) =>
                    props.row.original.message ? (
                        <span
                            className="block max-w-[220px] truncate text-gray-500"
                            title={props.row.original.message}
                        >
                            {props.row.original.message}
                        </span>
                    ) : (
                        <span className="text-gray-400">—</span>
                    ),
            },
            {
                header: t('landingReservations.table.status', 'Status'),
                accessorKey: 'status',
                cell: (props) => (
                    <Tag
                        className={classNames(
                            'capitalize',
                            tagToneClass[statusTone[props.row.original.status]],
                        )}
                    >
                        {statusLabel(t, props.row.original.status)}
                    </Tag>
                ),
            },
            {
                header: t('landingReservations.table.created', 'Received'),
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="text-nowrap text-gray-500">
                        {formatDateTime(props.row.original.created_at)}
                    </span>
                ),
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => (
                    <LeadRowActions
                        lead={props.row.original}
                        onDetails={(lead) => setSelected(lead)}
                        onSaved={fetchLeads}
                    />
                ),
            },
        ],
        [t],
    )

    return (
        <Container className="">
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h4>
                            {t('landingReservations.title', 'QR reservations')}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {t(
                                'landingReservations.description',
                                'Reservation requests left on the public QR landing page.',
                            )}
                        </p>
                    </div>
                </div>

                <Tabs
                    value={statusFilter}
                    onChange={(val) => {
                        setStatusFilter(val as '' | LandingReservationStatus)
                        setPageIndex(1)
                    }}
                >
                    <TabList>
                        {statusFilterOptions(t).map((option) => (
                            <TabNav key={option.value || 'all'} value={option.value}>
                                {option.label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 sm:flex-none sm:min-w-[250px]">
                        <DebouceInput
                            prefix={<LiSearch className="heading-text" />}
                            placeholder={t(
                                'landingReservations.searchPlaceholder',
                                'Search by name, phone, email…',
                            )}
                            onChange={(e) => {
                                setQ(e.target.value)
                                setPageIndex(1)
                            }}
                        />
                    </div>
                </div>

                <DataTable
                    compact
                    columns={columns}
                    data={leads}
                    loading={loading}
                    noData={!loading && leads.length === 0}
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

            <LeadDetailDialog
                lead={selected}
                onClose={() => setSelected(null)}
                onSaved={() => {
                    setSelected(null)
                    fetchLeads()
                }}
            />
        </Container>
    )
}

export default LandingReservations
