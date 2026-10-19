import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Container from '@/components/shared/Container'
import DataTable from '@/components/shared/DataTable'
import Button from '@/components/ui/Button'
import Segment from '@/components/ui/Segment'
import Select from '@/components/ui/Select'
import Tag from '@/components/ui/Tag'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { LiAdd } from '@/icons'
import { useSessionUser } from '@/store/authStore'
import {
    apiGetNotifications,
    apiMarkAllNotificationsRead,
    apiMarkNotificationRead,
} from '@/services/LocationService'
import type { AppNotification } from '@/@types/location'
import NotificationAvatar from '@/components/template/Notification/NotificationAvatar'
import NotificationMessage from '@/components/template/Notification/NotificationMessage'
import NotificationComposer from './NotificationComposer'
import { isVerbGranted } from './PermissionChecklist'
import { formatDateTime, tagToneClass } from './shared'
import type { TagTone, Translator } from './shared'
import useTranslation from '@/utils/hooks/useTranslation'

const typeTone: Record<string, TagTone> = {
    announcement: 'primary',
    payment: 'success',
}

const notificationTypeLabel = (t: Translator, type: string) =>
    type === 'payment'
        ? t('notifications.types.payment', 'Payment')
        : t('notifications.types.announcement', 'Announcement')

const Notifications = () => {
    const { t } = useTranslation()
    const { user } = useSessionUser()

    const permissions = user?.role?.permissions ?? []
    const canView = isVerbGranted(permissions, 'notifications', 'view')
    const canSend = isVerbGranted(permissions, 'notifications', 'send')

    const [notifications, setNotifications] = useState<AppNotification[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(15)

    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'unread'>('all')

    const [composerOpen, setComposerOpen] = useState(false)

    const fetchNotifications = useCallback(() => {
        setLoading(true)
        const params: Record<string, unknown> = {
            page: pageIndex,
            per_page: pageSize,
        }
        if (typeFilter) {
            params.type = typeFilter
        }
        if (statusFilter === 'unread') {
            params.unread = 1
        }
        apiGetNotifications(params)
            .then((res) => {
                setNotifications(res.data)
                setTotal(res.meta.total)
            })
            .catch(() => {
                setNotifications([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [pageIndex, pageSize, typeFilter, statusFilter])

    useEffect(() => {
        if (!canView) {
            setLoading(false)
            return
        }
        fetchNotifications()
    }, [canView, fetchNotifications])

    const typeOptions = useMemo(
        () => [
            {
                value: '',
                label: t('notifications.filters.allTypes', 'All types'),
            },
            {
                value: 'announcement',
                label: t('notifications.types.announcement', 'Announcement'),
            },
            {
                value: 'payment',
                label: t('notifications.types.payment', 'Payment'),
            },
        ],
        [t],
    )

    const handleMarkRead = useCallback(
        async (item: AppNotification) => {
            try {
                await apiMarkNotificationRead(item.id)
                fetchNotifications()
            } catch {
                toast.push(
                    <Notification
                        type="danger"
                        title={t(
                            'notifications.markReadError',
                            'Could not mark the notification as read',
                        )}
                    />,
                )
            }
        },
        [fetchNotifications, t],
    )

    const handleMarkAllRead = async () => {
        try {
            await apiMarkAllNotificationsRead()
            fetchNotifications()
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t(
                        'notifications.markAllError',
                        'Could not mark all notifications as read',
                    )}
                />,
            )
        }
    }

    const columns = useMemo<ColumnDef<AppNotification>[]>(
        () => [
            {
                header: t('notifications.columns.notification', 'Notification'),
                id: 'notification',
                cell: (props) => (
                    <div className="flex items-start gap-3">
                        <NotificationAvatar
                            notification={props.row.original}
                        />
                        <div className="min-w-0 flex-1">
                            <NotificationMessage
                                notification={props.row.original}
                            />
                        </div>
                    </div>
                ),
            },
            {
                header: t('notifications.columns.type', 'Type'),
                accessorKey: 'type',
                cell: (props) => (
                    <Tag
                        className={
                            tagToneClass[
                                typeTone[props.row.original.type] ?? 'neutral'
                            ]
                        }
                    >
                        {notificationTypeLabel(
                            t,
                            props.row.original.type,
                        )}
                    </Tag>
                ),
            },
            {
                header: t('notifications.columns.status', 'Status'),
                accessorKey: 'read',
                cell: (props) =>
                    props.row.original.read ? (
                        <Tag className={tagToneClass.neutral}>
                            {t('notifications.status.read', 'Read')}
                        </Tag>
                    ) : (
                        <Tag className={tagToneClass.warning}>
                            {t('notifications.status.unread', 'Unread')}
                        </Tag>
                    ),
            },
            {
                header: t('notifications.columns.date', 'Date'),
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDateTime(props.row.original.created_at)}
                    </span>
                ),
            },
            {
                header: '',
                id: 'actions',
                cell: (props) =>
                    props.row.original.read ? null : (
                        <Button
                            size="sm"
                            variant="link"
                            className="px-2"
                            onClick={() =>
                                handleMarkRead(props.row.original)
                            }
                        >
                            {t('notifications.markRead', 'Mark read')}
                        </Button>
                    ),
            },
        ],
        [t, handleMarkRead],
    )

    if (!canView) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-4 text-center">
                <h5 className="dark:text-gray-100">
                    {t('notifications.accessRestricted', 'Access restricted')}
                </h5>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t(
                        'notifications.accessRestrictedDescription',
                        'You do not have permission to view notifications.',
                    )}
                </p>
            </div>
        )
    }

    return (
        <div>
            <Container>
                <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h4>{t('notifications.title', 'Notifications')}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t(
                                    'notifications.description',
                                    'Announcements and system alerts addressed to you',
                                )}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button size="sm" onClick={handleMarkAllRead}>
                                {t(
                                    'notifications.markAllRead',
                                    'Mark all read',
                                )}
                            </Button>
                            {canSend ? (
                                <Button
                                    size="sm"
                                    variant="solid"
                                    icon={<LiAdd />}
                                    onClick={() => setComposerOpen(true)}
                                >
                                    {t(
                                        'notifications.compose',
                                        'New announcement',
                                    )}
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div className="w-56">
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t('notifications.filters.type', 'Type')}
                            </label>
                            <Select
                                isSearchable={false}
                                options={typeOptions}
                                value={
                                    typeOptions.find(
                                        (option) => option.value === typeFilter,
                                    ) ?? null
                                }
                                onChange={(option) => {
                                    setTypeFilter(option?.value ?? '')
                                    setPageIndex(1)
                                }}
                            />
                        </div>
                        <Segment
                            value={statusFilter}
                            onChange={(value) => {
                                setStatusFilter(value as 'all' | 'unread')
                                setPageIndex(1)
                            }}
                        >
                            <Segment.Item value="all">
                                {t('notifications.filters.all', 'All')}
                            </Segment.Item>
                            <Segment.Item value="unread">
                                {t('notifications.filters.unread', 'Unread')}
                            </Segment.Item>
                        </Segment>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('notifications.count', 'Notifications: {{n}}', {
                            n: total,
                        })}
                    </p>

                    <DataTable<AppNotification>
                        compact
                        verticalDivider={{ head: true, body: true }}
                        className="border-t border-b border-gray-200 dark:border-gray-700"
                        columns={columns}
                        data={notifications}
                        noData={!loading && notifications.length === 0}
                        loading={loading}
                        pagingData={{ total, pageIndex, pageSize }}
                        onPaginationChange={(page: number) =>
                            setPageIndex(page)
                        }
                        onPageSizeChange={(size: number) => {
                            setPageSize(size)
                            setPageIndex(1)
                        }}
                    />
                </div>
            </Container>

            <NotificationComposer
                isOpen={composerOpen}
                onClose={() => setComposerOpen(false)}
                onSent={fetchNotifications}
            />
        </div>
    )
}

export default Notifications
