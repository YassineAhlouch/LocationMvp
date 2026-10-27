import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import ActionBar from '@/components/ui/ActionBar'
import Container from '@/components/shared/Container'
import DebouceInput from '@/components/shared/DebouceInput'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { LuSearch } from 'react-icons/lu'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import { apiGetQrCodes, apiDeleteQrCode } from '@/services/LocationService'
import type { QrCode } from '@/@types/location'
import { formatDate } from '../shared'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiCopy, LiEdit2, LiTrash } from '@/icons'
import useTranslation from '@/utils/hooks/useTranslation'
import usePermissions from '@/utils/hooks/usePermissions'
import { buildQrLandingUrl } from './utils'

const carLabel = (car: QrCode['cars'][number]) =>
    [car.brand, car.model].filter(Boolean).join(' ') || car.registration_number

/** Fleet chip: '2 vehicles' or, at a glance, the poster's car names. */
const carSummary = (qr: QrCode) => {
    const names = qr.cars.map(carLabel).slice(0, 3)
    const more = qr.cars.length - names.length

    return [
        qr.cars.length > 0 ? names.join(', ') : '—',
        more > 0 ? ` +${more}` : '',
    ]
        .join('')
        .trim()
}

const QrNameColumn = ({ row }: { row: QrCode }) => (
    <div className="flex flex-col">
        <span className="text-nowrap font-medium text-gray-900 dark:text-gray-100">
            {row.name}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
            /r/{row.slug}
        </span>
    </div>
)

/**
 * QR posters catalog, laid out like the clients list: toolbar search, a
 * table with row actions and the same delete dialogs. Editing opens the
 * dedicated create/edit page where the PNG lives.
 */
const QrList = () => {
    const { t } = useTranslation()
    const { can } = usePermissions()
    const navigate = useNavigate()

    const [qrCodes, setQrCodes] = useState<QrCode[]>([])
    const [loading, setLoading] = useState(true)
    const [q, setQ] = useState('')
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [selectedRows, setSelectedRows] = useState<QrCode[]>([])

    const [deleting, setDeleting] = useState<QrCode | null>(null)
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

    const fetchQrCodes = useCallback(() => {
        setLoading(true)
        apiGetQrCodes()
            .then(setQrCodes)
            .catch(() => setQrCodes([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        fetchQrCodes()
    }, [fetchQrCodes])

    /** The catalog is served whole (tiny); search+digits are local. */
    const filtered = useCallback(
        (list: QrCode[]) => {
            const term = q.trim().toLocaleLowerCase()

            if (!term) {
                return list
            }

            return list.filter((qr) =>
                [qr.name, qr.slug, ...qr.cars.map(carLabel)]
                    .join(' ')
                    .toLocaleLowerCase()
                    .includes(term),
            )
        },
        [q],
    )

    const visible = filtered(qrCodes)
    const rows = visible.slice(
        (pageIndex - 1) * pageSize,
        pageIndex * pageSize,
    )

    const handlePageChange = (page: number) => {
        setSelectedRows([])
        setPageIndex(page)
    }

    const handlePageSizeChange = (size: number) => {
        setSelectedRows([])
        setPageSize(size)
        setPageIndex(1)
    }

    const handleRowSelect = (checked: boolean, row: QrCode) => {
        setSelectedRows((prev) =>
            checked
                ? [...prev.filter((s) => s.id !== row.id), row]
                : prev.filter((s) => s.id !== row.id),
        )
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<QrCode>[]) => {
        setSelectedRows(checked ? rows.map((r) => r.original) : [])
    }

    const goCreate = useCallback(
        () => navigate(`${APPS_PREFIX_PATH}/qr/create`),
        [navigate],
    )

    const goEdit = useCallback(
        (qr: QrCode) => navigate(`${APPS_PREFIX_PATH}/qr/${qr.id}/modifier`),
        [navigate],
    )

    const copyLink = useCallback(
        async (qr: QrCode) => {
            try {
                await navigator.clipboard.writeText(buildQrLandingUrl(qr.slug))
                toast.push(
                    <Notification
                        type="success"
                        title={t('qrCodes.qr.copied', 'Landing link copied')}
                    />,
                )
            } catch {
                toast.push(
                    <Notification
                        type="danger"
                        title={t(
                            'qrCodes.qr.copyFailed',
                            'Could not copy the link',
                        )}
                    />,
                )
            }
        },
        [t],
    )

    const handleDelete = async () => {
        if (!deleting) {
            return
        }

        try {
            await apiDeleteQrCode(deleting.id)
            toast.push(
                <Notification
                    type="success"
                    title={t('qrCodes.list.toast.deleted', 'QR code deleted')}
                />,
            )
            setSelectedRows([])
            setDeleting(null)
            fetchQrCodes()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t(
                        'qrCodes.list.toast.deleteFailed',
                        'Could not delete the QR code',
                    )}
                />,
            )
        }
    }

    const handleBulkDelete = async () => {
        const ids = selectedRows.map((qr) => qr.id)
        const results = await Promise.allSettled(
            ids.map((id) => apiDeleteQrCode(id)),
        )
        const failed = results.filter(
            (result) => result.status === 'rejected',
        ).length

        toast.push(
            <Notification
                type="success"
                title={t(
                    'qrCodes.list.toast.bulkDeleted',
                    '{{n}} QR code(s) deleted',
                    { n: ids.length - failed },
                )}
            />,
        )
        if (failed > 0) {
            toast.push(
                <Notification
                    type="danger"
                    title={t(
                        'qrCodes.list.toast.bulkDeleteFailed',
                        '{{n}} deletion(s) failed',
                        { n: failed },
                    )}
                />,
            )
        }
        setSelectedRows([])
        setBulkDeleteOpen(false)
        fetchQrCodes()
    }

    const columns = useMemo<ColumnDef<QrCode>[]>(
        () => [
            {
                header: t('qrCodes.list.columns.code', 'QR code'),
                cell: (props) => <QrNameColumn row={props.row.original} />,
            },
            {
                header: t('qrCodes.list.columns.vehicles', 'Vehicles'),
                cell: (props) => {
                    const qr = props.row.original

                    return (
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {t(
                                'qrCodes.list.vehicles',
                                '{{count}} vehicle(s)',
                                { count: qr.cars.length },
                            )}{' '}
                            <span className="text-xs text-gray-400">
                                {carSummary(qr)}
                            </span>
                        </span>
                    )
                },
            },
            {
                header: t('qrCodes.list.columns.landingLink', 'Landing page'),
                cell: (props) => (
                    <span className="break-all text-sm text-gray-600 dark:text-gray-300">
                        /r/{props.row.original.slug}
                    </span>
                ),
            },
            {
                header: t('qrCodes.list.columns.updated', 'Updated'),
                cell: (props) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(props.row.original.updated_at)}
                    </span>
                ),
            },
            {
                header: '',
                id: 'actions',
                cell: (props) => {
                    const qr = props.row.original

                    return (
                        <div className="flex items-center justify-center gap-1">
                            <Button
                                size="sm"
                                variant="link"
                                className="px-2 hover:text-gray-900 dark:hover:text-gray-100"
                                role="button"
                                title={t('qrCodes.list.actions.copy', 'Copy landing link')}
                                onClick={() => copyLink(qr)}
                            >
                                <LiCopy className="text-base" />
                            </Button>
                            {can('fleet.update') && (
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="px-2 hover:text-gray-900 dark:hover:text-gray-100"
                                    role="button"
                                    title={t('qrCodes.list.actions.edit', 'Edit')}
                                    onClick={() => goEdit(qr)}
                                >
                                    <LiEdit2 className="text-base" />
                                </Button>
                            )}
                            {can('fleet.delete') && (
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="px-2 hover:text-error"
                                    role="button"
                                    title={t('qrCodes.list.actions.delete', 'Delete')}
                                    onClick={() => setDeleting(qr)}
                                >
                                    <LiTrash className="text-base" />
                                </Button>
                            )}
                        </div>
                    )
                },
            },
        ],
        [can, copyLink, goEdit, t],
    )

    return (
        <div>
            <Container className="">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h4>{t('qrCodes.list.title', 'QR codes')}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('qrCodes.list.count', '{{n}} QR code(s)', {
                                        n: visible.length,
                                    })}
                                </p>
                            </div>
                            {can('fleet.create') && (
                                <Button variant="solid" onClick={goCreate}>
                                    {t('qrCodes.list.create', 'New QR')}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <DebouceInput
                                placeholder={t(
                                    'qrCodes.list.search',
                                    'Search QR codes…',
                                )}
                                prefix={<LuSearch className="text-lg" />}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                    setSelectedRows([])
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <DataTable<QrCode>
                            compact
                            selectable={can('fleet.delete')}
                            verticalDivider={{
                                head: true,
                                body: true,
                            }}
                            className="border-t border-b border-gray-200 dark:border-gray-700"
                            columns={columns}
                            data={rows}
                            noData={!loading && visible.length === 0}
                            loading={loading}
                            checkboxChecked={(row) =>
                                selectedRows.some(
                                    (selected) => selected.id === row.id,
                                )
                            }
                            pagingData={{
                                total: visible.length,
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

            <ActionBar open={can('fleet.delete') && selectedRows.length > 0}>
                <div className="flex items-center justify-between">
                    <span className="font-medium">
                        <span className="heading-text font-semibold">
                            {selectedRows.length}
                        </span>{' '}
                        {t('qrCodes.list.selected', 'selected')}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            className={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                            }
                            onClick={() => setBulkDeleteOpen(true)}
                        >
                            {t('qrCodes.list.actions.delete', 'Delete')}
                        </Button>
                    </div>
                </div>
            </ActionBar>

            <ConfirmDialog
                isOpen={Boolean(deleting)}
                type="danger"
                title={t(
                    'qrCodes.list.deleteTitle',
                    'Delete {{name}}?',
                    { name: deleting?.name ?? '' },
                )}
                onClose={() => setDeleting(null)}
                onCancel={() => setDeleting(null)}
                onConfirm={handleDelete}
                confirmButtonProps={{
                    children: t('qrCodes.list.actions.delete', 'Delete'),
                }}
            >
                <p>
                    {t(
                        'qrCodes.list.deleteMessage',
                        'The printed link /r/{{slug}} will stop opening a page. This cannot be undone.',
                        { slug: deleting?.slug ?? '' },
                    )}
                </p>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={bulkDeleteOpen}
                type="danger"
                title={t(
                    'qrCodes.list.bulkDeleteTitle',
                    'Delete QR codes',
                )}
                onClose={() => setBulkDeleteOpen(false)}
                onCancel={() => setBulkDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                confirmButtonProps={{
                    children: t('qrCodes.list.actions.delete', 'Delete'),
                }}
            >
                <p>
                    {t(
                        'qrCodes.list.bulkDeleteMessage',
                        'Are you sure you want to remove {{n}} QR code(s)? Their printed links will stop opening a page.',
                        { n: selectedRows.length },
                    )}
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default QrList
