import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import Container from '@/components/shared/Container'
import DataTable from '@/components/shared/DataTable'
import Loading from '@/components/shared/Loading'
import Avatar from '@/components/ui/Avatar'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import Segment from '@/components/ui/Segment'
import Select from '@/components/ui/Select'
import Tag from '@/components/ui/Tag'
import Timeline from '@/components/ui/Timeline'
import { LiActivity, LiEye, LiTextAlignLeft } from '@/icons'
import { useSessionUser } from '@/store/authStore'
import { apiGetActivityLogs, apiGetUsers } from '@/services/LocationService'
import type { ActivityLog } from '@/@types/location'
import { isVerbGranted } from './PermissionChecklist'
import { formatDateTime, tagToneClass } from './shared'
import type { TagTone, Translator } from './shared'
import useTranslation from '@/utils/hooks/useTranslation'
import acronym from '@/utils/acronym'
import useRandomColor from '@/utils/hooks/useRandomColor'

/**
 * Audit modules that show up in the trail. Catalog names reuse the existing
 * `roles.module.*` labels; `auth` is the only module outside the catalog.
 */
const activityModules = [
    'reservations',
    'clients',
    'fleet',
    'pricing',
    'payments',
    'expenses',
    'financing',
    'users',
    'roles',
    'settings',
    'notifications',
    'auth',
]

const activityActions = [
    'created',
    'updated',
    'deleted',
    'activated',
    'completed',
    'cancelled',
    'no_show',
    'extended',
    'confirmed',
    'recorded',
    'refunded',
    'sent',
    'installment_paid',
    'login',
    'login_failed',
    'logout',
]

const moduleLabel = (t: Translator, module: string) =>
    module === 'auth'
        ? t('activity.module.auth', 'Authentication')
        : t(`roles.module.${module}`, module)

const actionLabel = (t: Translator, action: string) =>
    t(`activity.action.${action}`, action)

const actionTone: Record<string, TagTone> = {
    created: 'success',
    updated: 'primary',
    deleted: 'error',
    activated: 'success',
    completed: 'success',
    confirmed: 'success',
    cancelled: 'error',
    no_show: 'warning',
    extended: 'purple',
    recorded: 'primary',
    refunded: 'warning',
    sent: 'primary',
    installment_paid: 'success',
    login: 'neutral',
    login_failed: 'error',
    logout: 'neutral',
}

const actionToneFor = (action: string): TagTone =>
    actionTone[action] ?? 'neutral'

const moduleOptions = (t: Translator) => [
    { value: '', label: t('activity.filters.allModules', 'All modules') },
    ...activityModules.map((module) => ({
        value: module,
        label: moduleLabel(t, module),
    })),
]

const actionOptions = (t: Translator) => [
    { value: '', label: t('activity.filters.allActions', 'All actions') },
    ...activityActions.map((action) => ({
        value: action,
        label: actionLabel(t, action),
    })),
]

/** `App\Models\Reservation` renders as `Reservation`. */
const entityLabel = (entityType: string) =>
    entityType.split('\\').pop() ?? entityType

const formatValue = (value: unknown) => {
    if (value === null || value === undefined) {
        return '—'
    }
    if (typeof value === 'object') {
        return JSON.stringify(value)
    }
    return String(value)
}

const valueEntries = (values: Record<string, unknown> | null) =>
    Object.entries(values ?? {}).filter(([key]) => key !== 'password')

type LogAvatarProps = {
    name: string
}

/** Coloured initials badge used as the media node of each timeline entry. */
const LogAvatar = ({ name }: LogAvatarProps) => {
    const generateRandomColor = useRandomColor()

    return (
        <Avatar
            size={36}
            shape="circle"
            className={`border-0 text-gray-900 ${generateRandomColor(name).background}`}
        >
            {acronym(name)}
        </Avatar>
    )
}

type DetailRowProps = {
    label: string
    value: string
}

const DetailRow = ({ label, value }: DetailRowProps) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {label}
        </span>
        <span className="break-words dark:text-gray-100">{value}</span>
    </div>
)

type ValueBlockProps = {
    title: string
    entries: [string, unknown][]
}

const ValueBlock = ({ title, entries }: ValueBlockProps) => (
    <div>
        <p className="mb-1 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {title}
        </p>
        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
            {entries.map(([key, value]) => (
                <div
                    key={key}
                    className="flex items-start justify-between gap-4 px-3 py-2"
                >
                    <span className="text-gray-500 dark:text-gray-400">
                        {key}
                    </span>
                    <span className="break-words text-right dark:text-gray-100">
                        {formatValue(value)}
                    </span>
                </div>
            ))}
        </div>
    </div>
)

type ActivityDetailDrawerProps = {
    entry: ActivityLog | null
    onClose: () => void
}

const ActivityDetailDrawer = ({
    entry,
    onClose,
}: ActivityDetailDrawerProps) => {
    const { t } = useTranslation()
    const oldEntries = valueEntries(entry?.old_values ?? null)
    const newEntries = valueEntries(entry?.new_values ?? null)
    const hasChanges = oldEntries.length > 0 || newEntries.length > 0

    return (
        <Drawer
            isOpen={Boolean(entry)}
            onClose={onClose}
            title={t('activity.drawer.title', 'Activity entry')}
            width={480}
        >
            {entry ? (
                <div className="space-y-4 text-sm">
                    <DetailRow
                        label={t('activity.drawer.date', 'Date')}
                        value={formatDateTime(entry.created_at)}
                    />
                    <DetailRow
                        label={t('activity.drawer.user', 'User')}
                        value={
                            entry.user?.full_name ??
                            t('activity.system', 'System')
                        }
                    />
                    <DetailRow
                        label={t('activity.drawer.module', 'Module')}
                        value={moduleLabel(t, entry.module)}
                    />
                    <DetailRow
                        label={t('activity.drawer.action', 'Action')}
                        value={actionLabel(t, entry.action)}
                    />
                    <DetailRow
                        label={t('activity.drawer.entity', 'Entity')}
                        value={`${entityLabel(entry.entity_type)} #${entry.entity_id}`}
                    />
                    {entry.description ? (
                        <DetailRow
                            label={t('activity.drawer.description', 'Description')}
                            value={entry.description}
                        />
                    ) : null}
                    <DetailRow
                        label={t('activity.drawer.ip', 'IP address')}
                        value={entry.ip_address ?? '—'}
                    />
                    <DetailRow
                        label={t('activity.drawer.userAgent', 'User agent')}
                        value={entry.user_agent ?? '—'}
                    />

                    {hasChanges ? (
                        <>
                            {oldEntries.length > 0 ? (
                                <ValueBlock
                                    title={t(
                                        'activity.drawer.oldValues',
                                        'Previous values',
                                    )}
                                    entries={oldEntries}
                                />
                            ) : null}
                            {newEntries.length > 0 ? (
                                <ValueBlock
                                    title={t(
                                        'activity.drawer.newValues',
                                        'New values',
                                    )}
                                    entries={newEntries}
                                />
                            ) : null}
                        </>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            {t(
                                'activity.drawer.noChanges',
                                'No value changes recorded.',
                            )}
                        </p>
                    )}
                </div>
            ) : null}
        </Drawer>
    )
}

const ActivityLogs = () => {
    const { t } = useTranslation()
    const { user } = useSessionUser()
    const canView = isVerbGranted(
        user?.role?.permissions ?? [],
        'activity_logs',
        'view',
    )

    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [users, setUsers] = useState<{ value: string; label: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(15)

    const [moduleFilter, setModuleFilter] = useState('')
    const [actionFilter, setActionFilter] = useState('')
    const [userFilter, setUserFilter] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const [selected, setSelected] = useState<ActivityLog | null>(null)
    const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table')

    const fetchLogs = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            page: pageIndex,
            per_page: pageSize,
        }
        if (moduleFilter) {
            params.module = moduleFilter
        }
        if (actionFilter) {
            params.action = actionFilter
        }
        if (userFilter) {
            params.user_id = Number(userFilter)
        }
        if (fromDate) {
            params.from = fromDate
        }
        if (toDate) {
            params.to = toDate
        }
        apiGetActivityLogs(params)
            .then((res) => {
                setLogs(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setLogs([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [
        pageIndex,
        pageSize,
        moduleFilter,
        actionFilter,
        userFilter,
        fromDate,
        toDate,
    ])

    useEffect(() => {
        if (!canView) {
            setLoading(false)
            return
        }
        fetchLogs()
    }, [canView, fetchLogs])

    useEffect(() => {
        if (!canView) {
            return
        }
        apiGetUsers({ per_page: 100 })
            .then((res) =>
                setUsers(
                    res.data.map((staff) => ({
                        value: String(staff.id),
                        label: staff.full_name,
                    })),
                ),
            )
            .catch(() => setUsers([]))
    }, [canView])

    const moduleSelect = useMemo(() => moduleOptions(t), [t])
    const actionSelect = useMemo(() => actionOptions(t), [t])
    const userSelect = useMemo(
        () => [
            { value: '', label: t('activity.filters.allUsers', 'All users') },
            ...users,
        ],
        [t, users],
    )

    const resetFilters = () => {
        setModuleFilter('')
        setActionFilter('')
        setUserFilter('')
        setFromDate('')
        setToDate('')
        setPageIndex(1)
    }

    /** The current page of entries grouped into day buckets for the timeline. */
    const groupedLogs = useMemo(() => {
        const groups = new Map<string, ActivityLog[]>()
        logs.forEach((log) => {
            const key = dayjs(log.created_at).format('YYYY-MM-DD')
            const entries = groups.get(key) ?? []
            entries.push(log)
            groups.set(key, entries)
        })
        return Array.from(groups.entries())
    }, [logs])

    const columns = useMemo<ColumnDef<ActivityLog>[]>(
        () => [
            {
                header: t('activity.columns.date', 'Date'),
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDateTime(props.row.original.created_at)}
                    </span>
                ),
            },
            {
                header: t('activity.columns.user', 'User'),
                accessorKey: 'user.full_name',
                cell: (props) => (
                    <span className="text-sm dark:text-gray-100">
                        {props.row.original.user?.full_name ??
                            t('activity.system', 'System')}
                    </span>
                ),
            },
            {
                header: t('activity.columns.module', 'Module'),
                accessorKey: 'module',
                cell: (props) => (
                    <Tag className="border-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {moduleLabel(t, props.row.original.module)}
                    </Tag>
                ),
            },
            {
                header: t('activity.columns.action', 'Action'),
                accessorKey: 'action',
                cell: (props) => (
                    <Tag
                        className={
                            tagToneClass[actionToneFor(props.row.original.action)]
                        }
                    >
                        {actionLabel(t, props.row.original.action)}
                    </Tag>
                ),
            },
            {
                header: t('activity.columns.description', 'Description'),
                accessorKey: 'description',
                cell: (props) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {props.row.original.description ?? '—'}
                    </span>
                ),
            },
            {
                header: '',
                id: 'details',
                cell: (props) => (
                    <div className="flex items-center justify-center">
                        <Button
                            size="sm"
                            variant="link"
                            className="px-2 hover:text-gray-900 dark:hover:text-gray-100"
                            title={t('activity.columns.details', 'Details')}
                            onClick={() => setSelected(props.row.original)}
                        >
                            <LiEye className="text-base" />
                        </Button>
                    </div>
                ),
            },
        ],
        [t],
    )

    if (!canView) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-4 text-center">
                <h5 className="dark:text-gray-100">
                    {t('activity.accessRestricted', 'Access restricted')}
                </h5>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t(
                        'activity.accessRestrictedDescription',
                        'You do not have permission to view the activity log.',
                    )}
                </p>
            </div>
        )
    }

    return (
        <div>
            <Container className="">
                <div className="space-y-4">
                    <div>
                        <h4>{t('activity.title', 'Activity log')}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t(
                                'activity.description',
                                'Audit trail of every staff action across the workspace',
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t('activity.filters.module', 'Module')}
                            </label>
                            <Select
                                options={moduleSelect}
                                value={
                                    moduleSelect.find(
                                        (option) =>
                                            option.value === moduleFilter,
                                    ) ?? null
                                }
                                isSearchable={false}
                                onChange={(option) => {
                                    setModuleFilter(option?.value ?? '')
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t('activity.filters.action', 'Action')}
                            </label>
                            <Select
                                options={actionSelect}
                                value={
                                    actionSelect.find(
                                        (option) =>
                                            option.value === actionFilter,
                                    ) ?? null
                                }
                                isSearchable={false}
                                onChange={(option) => {
                                    setActionFilter(option?.value ?? '')
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t('activity.filters.user', 'User')}
                            </label>
                            <Select
                                options={userSelect}
                                value={
                                    userSelect.find(
                                        (option) => option.value === userFilter,
                                    ) ?? null
                                }
                                onChange={(option) => {
                                    setUserFilter(option?.value ?? '')
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t('activity.filters.from', 'From')}
                            </label>
                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e) => {
                                    setFromDate(e.target.value)
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t('activity.filters.to', 'To')}
                            </label>
                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value)
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('activity.count', 'Entries: {{n}}', {
                                n: total,
                            })}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={resetFilters}
                            >
                                {t('activity.filters.reset', 'Reset')}
                            </Button>
                            <Segment
                                value={viewMode}
                                onChange={(value) =>
                                    setViewMode(value as 'table' | 'timeline')
                                }
                            >
                                <Segment.Item
                                    value="table"
                                    className="px-2"
                                    title={t('activity.view.table', 'Table')}
                                >
                                    <LiTextAlignLeft />
                                </Segment.Item>
                                <Segment.Item
                                    value="timeline"
                                    className="px-2"
                                    title={t(
                                        'activity.view.timeline',
                                        'Timeline',
                                    )}
                                >
                                    <LiActivity />
                                </Segment.Item>
                            </Segment>
                        </div>
                    </div>

                    <div className="mb-4">
                        {viewMode === 'table' ? (
                            <DataTable<ActivityLog>
                                compact
                                verticalDivider={{
                                    head: true,
                                    body: true,
                                }}
                                className="border-t border-b border-gray-200 dark:border-gray-700"
                                columns={columns}
                                data={logs}
                                noData={!loading && logs.length === 0}
                                loading={loading}
                                pagingData={{
                                    total,
                                    pageIndex,
                                    pageSize,
                                }}
                                onPaginationChange={(page: number) =>
                                    setPageIndex(page)
                                }
                                onPageSizeChange={(size: number) => {
                                    setPageSize(size)
                                    setPageIndex(1)
                                }}
                            />
                        ) : (
                            <Loading loading={loading}>
                                {!loading && logs.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <h6 className="mb-1 font-semibold">
                                            {t(
                                                'activity.empty',
                                                'No activity found',
                                            )}
                                        </h6>
                                        <p className="text-sm text-gray-400">
                                            {t(
                                                'activity.emptyDescription',
                                                'Try widening the filters or come back later.',
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {groupedLogs.map(([day, entries]) => (
                                            <div key={day}>
                                                <div className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                                                    {dayjs(day).format(
                                                        'dddd, DD MMMM',
                                                    )}
                                                </div>
                                                <Timeline>
                                                    {entries.map((log) => (
                                                        <Timeline.Item
                                                            key={log.id}
                                                            media={
                                                                <LogAvatar
                                                                    name={
                                                                        log.user
                                                                            ?.full_name ??
                                                                        t(
                                                                            'activity.system',
                                                                            'System',
                                                                        )
                                                                    }
                                                                />
                                                            }
                                                        >
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="heading-text font-semibold">
                                                                    {log.user
                                                                        ?.full_name ??
                                                                        t(
                                                                            'activity.system',
                                                                            'System',
                                                                        )}
                                                                </span>
                                                                <Tag
                                                                    className={
                                                                        tagToneClass[
                                                                            actionToneFor(
                                                                                log.action,
                                                                            )
                                                                        ]
                                                                    }
                                                                >
                                                                    {actionLabel(
                                                                        t,
                                                                        log.action,
                                                                    )}
                                                                </Tag>
                                                                <Tag className="border-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                                    {moduleLabel(
                                                                        t,
                                                                        log.module,
                                                                    )}
                                                                </Tag>
                                                                <span className="text-sm text-gray-400 dark:text-gray-500">
                                                                    {entityLabel(
                                                                        log.entity_type,
                                                                    )}{' '}
                                                                    #
                                                                    {
                                                                        log.entity_id
                                                                    }
                                                                </span>
                                                            </div>
                                                            {log.description ? (
                                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                    {
                                                                        log.description
                                                                    }
                                                                </p>
                                                            ) : null}
                                                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                                                                <span>
                                                                    {dayjs(
                                                                        log.created_at,
                                                                    ).format(
                                                                        'HH:mm',
                                                                    )}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="hover:underline"
                                                                    onClick={() =>
                                                                        setSelected(
                                                                            log,
                                                                        )
                                                                    }
                                                                >
                                                                    {t(
                                                                        'activity.columns.details',
                                                                        'Details',
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </Timeline.Item>
                                                    ))}
                                                </Timeline>
                                            </div>
                                        ))}
                                        <div className="flex justify-end px-2">
                                            <Pagination
                                                pageSize={pageSize}
                                                currentPage={pageIndex}
                                                total={total}
                                                onChange={(page) =>
                                                    setPageIndex(page)
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </Loading>
                        )}
                    </div>
                </div>
            </Container>

            <ActivityDetailDrawer
                entry={selected}
                onClose={() => setSelected(null)}
            />
        </div>
    )
}

export default ActivityLogs
