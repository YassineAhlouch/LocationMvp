import formatCurrency from '@/utils/formatCurrency'
import { useCurrencyStore } from '@/store/currencyStore'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AppNotification } from '@/@types/location'

type NotificationMessageProps = {
    notification: AppNotification
    /** Trim the copy down to a single line (used by the compact drawer). */
    compact?: boolean
}

/**
 * Human copy for an inbox row. Only two event shapes exist server-side:
 * `announcement` (title/body, optionally signed) and `payment` (an amount tied
 * to a reservation).
 */
const NotificationMessage = ({
    notification,
    compact = false,
}: NotificationMessageProps) => {
    const { t } = useTranslation()
    const { code, decimals } = useCurrencyStore((state) => state.currency)

    if (notification.type === 'payment') {
        const { amount, reservation_number } = notification.data

        return (
            <span>
                {t(
                    'notifications.paymentRecorded',
                    'Payment of {{amount}} recorded',
                    {
                        amount: formatCurrency(
                            Number(amount ?? 0),
                            code,
                            'fr-MA',
                            decimals,
                        ),
                    },
                )}
                {reservation_number ? ` · ${reservation_number}` : ''}
            </span>
        )
    }

    const sender = notification.data.sent_by
    const senderName = sender
        ? `${sender.first_name} ${sender.last_name}`.trim()
        : ''

    return (
        <div className="space-y-0.5">
            <div className="font-medium heading-text">
                {notification.data.title ||
                    t('notifications.untitled', 'Notification')}
            </div>
            {notification.data.body && !compact ? (
                <p className="whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">
                    {notification.data.body}
                </p>
            ) : null}
            {senderName ? (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    {t('notifications.sentBy', 'From {{name}}', {
                        name: senderName,
                    })}
                </span>
            ) : null}
        </div>
    )
}

export default NotificationMessage
