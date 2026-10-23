import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Drawer from '@/components/ui/Drawer'
import Skeleton from '@/components/ui/Skeleton'
import Tag from '@/components/ui/Tag'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { apiGetReservations } from '@/services/LocationService'
import useResponsive from '@/utils/hooks/useResponsive'
import useTranslation from '@/utils/hooks/useTranslation'
import {
    formatDateTime,
    money,
    reservationStatusTone,
    tagToneClass,
} from '../shared'
import type { Reservation } from '@/@types/location'

type ReservationHistoryDrawerProps = {
    isOpen: boolean
    onClose: () => void
    /** Show only this client's reservations. */
    clientId?: number
    /** Show only this car's reservations. */
    carId?: number
    title: string
    subtitle?: string
}

/**
 * Reservation history for one client or car. The list is independent of the
 * report period: it is the full history behind the row, newest first.
 */
const ReservationHistoryDrawer = ({
    isOpen,
    onClose,
    clientId,
    carId,
    title,
    subtitle,
}: ReservationHistoryDrawerProps) => {
    const { t } = useTranslation()
    const { smaller } = useResponsive()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        let ignore = false

        setLoading(true)

        apiGetReservations({
            client_id: clientId,
            car_id: carId,
            per_page: 100,
            sort_by: 'pickup_datetime',
            sort_dir: 'desc',
        })
            .then((response) => {
                if (ignore) {
                    return
                }
                setReservations(response.data)
                setTotal(response.meta.total)
            })
            .catch(() => {
                if (ignore) {
                    return
                }
                setReservations([])
                setTotal(0)
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false)
                }
            })

        return () => {
            ignore = true
        }
    }, [isOpen, clientId, carId])

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            width={smaller.sm ? 340 : 520}
        >
            <div className="space-y-4">
                {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                            >
                                <Skeleton height={14} width={140} />
                                <div className="mt-2 space-y-1.5">
                                    <Skeleton height={12} width="80%" />
                                    <Skeleton height={12} width="60%" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : reservations.length > 0 ? (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('reports.history.count', {
                                count: total,
                                defaultValue: 'Reservations: {{count}}',
                            })}
                        </p>
                        {reservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <Link
                                        to={`${APPS_PREFIX_PATH}/reservations/${reservation.id}/modifier`}
                                        className="font-semibold text-primary hover:underline"
                                    >
                                        {reservation.reservation_number}
                                    </Link>
                                    <Tag
                                        className={`capitalize ${tagToneClass[reservationStatusTone[reservation.status]]}`}
                                    >
                                        {t(
                                            `reservations.status.${reservation.status}`,
                                            reservation.status,
                                        )}
                                    </Tag>
                                </div>
                                <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                                    <div>
                                        {formatDateTime(
                                            reservation.pickup_datetime,
                                        )}{' '}
                                        →{' '}
                                        {formatDateTime(
                                            reservation.expected_return_datetime,
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {reservation.car
                                                ?.registration_number ?? '—'}
                                            {' · '}
                                            {reservation.primary_client
                                                ?.full_name ?? '—'}
                                        </span>
                                        <span className="font-semibold heading-text">
                                            {money(reservation.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {total > reservations.length && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                {t('reports.history.truncated', {
                                    shown: reservations.length,
                                    total,
                                    defaultValue:
                                        'Showing the latest {{shown}} of {{total}} reservations',
                                })}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-8 text-sm text-gray-400">
                        {t(
                            'reports.history.noReservations',
                            'No reservations found',
                        )}
                    </div>
                )}
            </div>
        </Drawer>
    )
}

export default ReservationHistoryDrawer
