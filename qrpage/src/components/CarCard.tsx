import { useTranslation } from 'react-i18next'
import type { LandingCar } from '../types'
import { formatDailyPrice } from '../format'

type CarCardProps = {
    car: LandingCar
    onReserve: (car: LandingCar) => void
}

const carName = (car: LandingCar, fallback: string) =>
    [car.brand, car.model].filter(Boolean).join(' ') || fallback

/** Fleet card on the public page: photo, headline specs, price, CTA. */
const CarCard = ({ car, onReserve }: CarCardProps) => {
    const { t } = useTranslation()

    const specs = [
        car.year ? String(car.year) : null,
        car.transmission_type
            ? t(`car.${car.transmission_type}`)
            : null,
        car.fuel_type ? t(`car.${car.fuel_type}`) : null,
        car.color,
    ].filter(Boolean)

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-[16/10] bg-gray-100">
                {car.cover_image ? (
                    <img
                        src={car.cover_image}
                        alt={carName(car, t('car.fallback_name'))}
                        className="aspect-[16/10] object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-4xl">
                        🚗
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <h3 className="text-base font-bold text-gray-900">
                        {carName(car, t('car.fallback_name'))}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {specs.join(' · ') || car.category || t('car.options')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-gray-600">
                    {car.transmission_type && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1">
                            🔧 {t(`car.${car.transmission_type}`)}
                        </span>
                    )}
                    {car.fuel_type && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1">
                            ⛽ {t(`car.${car.fuel_type}`)}
                        </span>
                    )}
                    {car.seats_count && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1">
                            👥 {t('car.seats', { count: car.seats_count })}
                        </span>
                    )}
                    {car.doors_count && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1">
                            🚪 {t('car.doors', { count: car.doors_count })}
                        </span>
                    )}
                </div>
                <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                    <div>
                        <span className="text-lg font-bold text-gray-900">
                            {formatDailyPrice(
                                car.daily_price,
                                car.agency.currency_code,
                            )}
                        </span>
                        <span className="text-xs text-gray-500">
                            {' '}
                            {t('car.per_day')}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => onReserve(car)}
                        className="rounded-xl bg-[#135EF7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4ede]"
                    >
                        {t('car.reserve')}
                    </button>
                </div>
            </div>
        </article>
    )
}

export default CarCard
