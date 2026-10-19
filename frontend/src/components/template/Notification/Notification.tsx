import { useMemo, useState } from 'react'
import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import Scroll from '@/components/ui/Scroll'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import NotificationMessage from './NotificationMessage'
import EmptyState from '@/components/shared/EmptyState'
import Elements from '@/components/svg/Elements'
import {
    apiGetNotifications,
    apiGetNotificationUnreadCount,
    apiMarkAllNotificationsRead,
    apiMarkNotificationRead,
} from '@/services/LocationService'
import { useSessionUser } from '@/store/authStore'
import useResponsive from '@/utils/hooks/useResponsive'
import useTranslation from '@/utils/hooks/useTranslation'
import useInterval from '@/utils/hooks/useInterval'
import { useNavigate } from 'react-router'
import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { LiCross } from '@/icons'
import type { AppNotification } from '@/@types/location'

dayjs.extend(relativeTime)

const { TabList, TabNav, TabContent } = Tabs

type NotificationFilter = 'all' | 'unread' | 'announcement' | 'payment'

const NOTIFICATIONS_ROUTE = '/apps/notifications'
const DRAWER_PAGE_SIZE = 20
const UNREAD_POLL_MS = 30000
const notificationHeight = 'h-[calc(100vh-200px)]'

/** The inbox is permission-gated server-side; don't poll what we can't read. */
const canViewNotifications = (permissions: string[]) =>
    permissions.includes('*') ||
    permissions.includes('notifications.*') ||
    permissions.includes('notifications.view')

const NotificationList = ({
    notifications,
    loading,
    onSelect,
}: {
    notifications: AppNotification[]
    loading: boolean
    onSelect: (item: AppNotification) => void
}) => {
    const { t } = useTranslation()

    if (loading) {
        return (
            <div
                className={classNames(
                    'flex items-center justify-center',
                    notificationHeight,
                )}
            >
                <Spinner size={40} />
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <div
                className={classNames(
                    'flex items-center justify-center',
                    notificationHeight,
                )}
            >
                <div className="text-center">
                    <EmptyState
                        size={250}
                        variant="grid"
                        offset={20}
                        illustration={
                            <div className="rounded-full bg-white p-2 shadow-white-xl dark:bg-gray-800">
                                <Elements height={120} width={120} />
                            </div>
                        }
                    >
                        <div className="text-center">
                            <h3>
                                {t('notifications.empty', 'No notifications')}
                            </h3>
                            <p className="text-base">
                                {t(
                                    'notifications.emptyDescription',
                                    'You are all caught up.',
                                )}
                            </p>
                        </div>
                    </EmptyState>
                </div>
            </div>
        )
    }

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={classNames(
                        'relative flex w-full p-4 text-start transition-colors',
                        item.read
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/60 dark:hover:bg-gray-800',
                    )}
                >
                    <NotificationAvatar notification={item} />
                    <div className="mx-3 flex-1">
                        <NotificationMessage notification={item} compact />
                        <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                            {item.created_at
                                ? dayjs(item.created_at).fromNow()
                                : ''}
                        </span>
                    </div>
                    {!item.read && (
                        <span className="absolute end-4 top-4 h-2 w-2 rounded-full bg-primary" />
                    )}
                </button>
            ))}
        </div>
    )
}

const Notification = ({ className }: { className?: string }) => {
    const [activeTab, setActiveTab] = useState<NotificationFilter>('all')
    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()
    const { t } = useTranslation()
    const { larger } = useResponsive()
    const { user } = useSessionUser()

    const canView = canViewNotifications(user?.role?.permissions ?? [])

    const { data: countData, mutate: mutateCount } = useSWR(
        canView ? '/v1/notifications/unread-count' : null,
        apiGetNotificationUnreadCount,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        },
    )

    const {
        data: listData,
        isLoading,
        mutate: mutateList,
    } = useSWR(
        canView ? ['/v1/notifications/inbox', DRAWER_PAGE_SIZE] : null,
        () => apiGetNotifications({ per_page: DRAWER_PAGE_SIZE }),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    // Keep the navbar badge honest without a page reload.
    useInterval(() => mutateCount(), canView ? UNREAD_POLL_MS : null)

    const unreadCount = countData?.unread_count ?? 0
    const hasUnread = unreadCount > 0
    const notifications = useMemo(() => listData?.data ?? [], [listData])

    const filteredNotifications = useMemo(() => {
        switch (activeTab) {
            case 'unread':
                return notifications.filter((item) => !item.read)
            case 'announcement':
            case 'payment':
                return notifications.filter((item) => item.type === activeTab)
            default:
                return notifications
        }
    }, [notifications, activeTab])

    const onDrawerOpen = () => {
        setIsOpen(true)
        mutateList()
        mutateCount()
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const handleSelect = async (item: AppNotification) => {
        if (item.read) {
            return
        }
        try {
            await apiMarkNotificationRead(item.id)
            mutateList()
            mutateCount()
        } catch {
            // Leave the row unread; the next poll reconciles the badge.
        }
    }

    const onMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return
        }
        try {
            await apiMarkAllNotificationsRead()
            mutateList()
            mutateCount({ unread_count: 0 }, false)
        } catch {
            mutateCount()
        }
    }

    const handleViewAll = () => {
        setIsOpen(false)
        navigate(NOTIFICATIONS_ROUTE)
    }

    const tabs: { value: NotificationFilter; label: string }[] = [
        { value: 'all', label: t('notifications.tabs.all', 'All') },
        { value: 'unread', label: t('notifications.tabs.unread', 'Unread') },
        {
            value: 'announcement',
            label: t('notifications.tabs.announcements', 'Announcements'),
        },
        {
            value: 'payment',
            label: t('notifications.tabs.payments', 'Payments'),
        },
    ]

    return (
        <>
            <NotificationToggle
                dot={hasUnread}
                className={className}
                onClick={onDrawerOpen}
            />
            <Drawer
                isOpen={isOpen}
                onClose={onDrawerClose}
                width={larger.lg ? 520 : 370}
                closable={false}
                shouldCloseOnOverlayClick
                shouldCloseOnEsc
                bodyClass="p-0"
                footer={
                    <div className="flex w-full justify-end gap-2">
                        <Button
                            onClick={onMarkAllAsRead}
                            disabled={!hasUnread}
                        >
                            {t('notifications.markAllRead', 'Mark all read')}
                        </Button>
                        <Button variant="solid" onClick={handleViewAll}>
                            {t('notifications.viewAll', 'View all')}
                        </Button>
                    </div>
                }
            >
                <div className="flex items-center justify-between px-4 py-4">
                    <h5>{t('notifications.title', 'Notifications')}</h5>
                    <Button
                        size="sm"
                        variant="subtle"
                        icon={<LiCross className="text-xl" />}
                        onClick={onDrawerClose}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Tabs
                        value={activeTab}
                        onChange={(val) =>
                            setActiveTab(val as NotificationFilter)
                        }
                        className="flex-1"
                    >
                        <TabList className="px-2">
                            {tabs.map((tab) => (
                                <TabNav key={tab.value} value={tab.value}>
                                    {tab.label}
                                </TabNav>
                            ))}
                        </TabList>
                    </Tabs>
                </div>
                <Scroll
                    scrollbars="vertical"
                    className={classNames(
                        'overflow-y-auto',
                        notificationHeight,
                    )}
                >
                    <Tabs value={activeTab}>
                        {tabs.map((tab) => (
                            <TabContent key={tab.value} value={tab.value}>
                                <NotificationList
                                    notifications={filteredNotifications}
                                    loading={isLoading}
                                    onSelect={handleSelect}
                                />
                            </TabContent>
                        ))}
                    </Tabs>
                </Scroll>
            </Drawer>
        </>
    )
}

export default Notification
