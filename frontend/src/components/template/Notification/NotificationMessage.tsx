import formatCurrency from '@/utils/formatCurrency'
import { useCurrencyStore } from '@/store/currencyStore'
import useTranslation from '@/utils/hooks/useTranslation'
import dayjs from 'dayjs'
import type { AppNotification } from '@/@types/location'

type NotificationMessageProps = {
    notification: AppNotification
    /** Trim the copy down to a single line (used by the compact drawer). */
    compact?: boolean
}

const isCarDocumentAlert = (type: string) =>
    type === 'car_insurance' || type === 'car_inspection'

/**
 * Human copy for an inbox row. Event shapes server-side:
 * `announcement` (title/body, optionally signed), `payment` (an amount tied
 * to a reservation), and the fleet alerts `car_insurance` / `car_inspection`
 * (an expiry date counting down, prompting a renewal expense) and
 * `car_fuel` (a low-fuel return).
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

    if (isCarDocumentAlert(notification.type)) {
        const insurance = notification.type === 'car_insurance'
        const { car_label, days_left, expiry_date } = notification.data
        const car =
            car_label ||
            t('notifications.fallbackCar', 'A vehicle')
        const expired = Number(days_left ?? 0) < 0
        const days = Math.abs(Number(days_left ?? 0))

        const title = expired
            ? t(
                  insurance
                      ? 'notifications.insuranceExpired'
                      : 'notifications.inspectionExpired',
                  insurance
                      ? 'Insurance of {{car}} expired {{days}} days ago'
                      : 'Technical inspection of {{car}} expired {{days}} days ago',
                  { car, days },
              )
            : t(
                  insurance
                      ? 'notifications.insuranceExpiring'
                      : 'notifications.inspectionExpiring',
                  insurance
                      ? 'Insurance of {{car}} expires in {{days}} days'
                      : 'Technical inspection of {{car}} expires in {{days}} days',
                  { car, days },
              )

        return (
            <div className="space-y-0.5">
                <div className="font-medium heading-text">{title}</div>
                {!compact && expiry_date ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            insurance
                                ? 'notifications.insuranceAction'
                                : 'notifications.inspectionAction',
                            insurance
                                ? 'Record the renewal as an expense — the due date updates the car automatically.'
                                : 'Record the inspection as an expense — the due date updates the car automatically.',
                        )}{' '}
                        {t('notifications.expiryOn', 'Expiry: {{date}}', {
                            date: dayjs(expiry_date).format('LL'),
                        })}
                    </p>
                ) : null}
            </div>
        )
    }

    if (notification.type === 'car_fuel') {
        const { car_label, fuel_level, reservation_number } = notification.data
        const title = t('notifications.carFuelLow', '{{car}} returned with {{level}}% fuel', {
            car: car_label || t('notifications.fallbackCar', 'A vehicle'),
            level: Number(fuel_level ?? 0),
        })

        return (
            <div className="space-y-0.5">
                <div className="font-medium heading-text">{title}</div>
                {!compact ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            'notifications.fuelAction',
                            'Refuel before the next rental.',
                        )}
                        {reservation_number ? ` · ${reservation_number}` : ''}
                    </p>
                ) : null}
            </div>
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
