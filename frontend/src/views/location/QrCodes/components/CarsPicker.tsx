import Avatar from '@/components/ui/Avatar'
import Skeleton from '@/components/ui/Skeleton'
import Tag from '@/components/ui/Tag'
import Checkbox from '@/components/ui/Checkbox'
import DebouceInput from '@/components/shared/DebouceInput'
import { LiCar, LiSearch } from '@/icons'
import useTranslation from '@/utils/hooks/useTranslation'
import { useMemo, useState } from 'react'
import { money } from '../../shared'
import type { Car } from '@/@types/location'

type CarsPickerProps = {
    cars: Car[]
    selected: number[]
    isLoading: boolean
    /** Optional cap (a poster can advertise at most 24 vehicles). */
    max?: number
    onToggle: (carId: number) => void
}

/**
 * Left column of the QR editor: pick the vehicles the QR advertises. Local
 * search only — the fleet rolls in on one page (see useFleetCars).
 */
const CarsPicker = ({ cars, selected, isLoading, max, onToggle }: CarsPickerProps) => {
    const { t } = useTranslation()

    const [query, setQuery] = useState('')

    const filtered = useMemo(() => {
        const term = query.trim().toLocaleLowerCase()

        if (!term) {
            return cars
        }

        return cars.filter((car) =>
            [
                car.brand?.name,
                car.model?.name,
                car.category?.name,
                car.registration_number,
            ]
                .filter(Boolean)
                .join(' ')
                .toLocaleLowerCase()
                .includes(term),
        )
    }, [cars, query])

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <h5>{t('qrCodes.pick.title', 'Select vehicles')}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('qrCodes.pick.selected', '{{count}} selected', {
                        count: selected.length,
                    })}
                </span>
            </div>
            <DebouceInput
                placeholder={t('qrCodes.pick.search', 'Search fleet')}
                prefix={<LiSearch />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="max-h-[560px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800">
                {isLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3">
                            <Skeleton
                                className="!h-10 !w-16 rounded-lg"
                                animation
                            />
                            <Skeleton className="!h-4 w-40" animation />
                        </div>
                    ))}
                {!isLoading && filtered.length === 0 && (
                    <div className="flex flex-col items-center gap-2 p-8 text-center text-gray-400 dark:text-gray-500">
                        <LiCar className="text-3xl" />
                        <p>
                            {t('qrCodes.pick.empty', 'No vehicle matches your search')}
                        </p>
                    </div>
                )}
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filtered.map((car) => {
                        const cover =
                            (car.images?.find((img) => img.is_primary) ??
                                car.images?.[0])?.image ?? ''
                        const name = [car.brand?.name, car.model?.name]
                            .filter(Boolean)
                            .join(' ')

                        return (
                            <li
                                key={car.id}
                                className="flex items-center gap-3 p-3"
                            >
                                <Avatar
                                    shape="round"
                                    size={42}
                                    {...(cover
                                        ? { src: cover }
                                        : { icon: <LiCar /> })}
                                />
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate font-semibold heading-text">
                                        {name || car.registration_number}
                                    </span>
                                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                        {car.registration_number} ·{' '}
                                        {money(car.daily_price)}/
                                        {t('qrCodes.pick.perDay', 'day')}
                                    </span>
                                </div>
                                <Tag
                                    className="capitalize"
                                    prefix
                                    prefixClass={
                                        car.status === 'available'
                                            ? 'bg-emerald-500'
                                            : 'bg-gray-400 dark:bg-gray-500'
                                    }
                                >
                                    {car.status}
                                </Tag>
                                <Checkbox
                                    checked={selected.includes(car.id)}
                                    disabled={
                                        max !== undefined &&
                                        selected.length >= max &&
                                        !selected.includes(car.id)
                                    }
                                    onChange={() => onToggle(car.id)}
                                />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default CarsPicker
