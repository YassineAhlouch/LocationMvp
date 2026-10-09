import { useState } from 'react'
import type { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { NumericFormat } from 'react-number-format'
import { LiCar, LiEdit2 } from '@/icons'
import CarForm from './forms/CarForm'
import { MAD, carStatusTone, formatDate, tagToneClass } from './shared'
import type { Car } from '@/@types/location'

type CarDetailsInfoProps = {
    car: Car
    onUpdated: () => void
}

const InfoRow = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex items-start justify-between gap-3 py-1.5">
        <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
        </span>
        <span className="text-right text-sm font-medium heading-text">
            {children}
        </span>
    </div>
)

const CarDetailsInfo = ({ car, onUpdated }: CarDetailsInfoProps) => {
    const [editOpen, setEditOpen] = useState(false)

    const cover =
        (car.images?.find((img) => img.is_primary) ?? car.images?.[0])?.image ??
        ''
    const name = [car.brand?.name, car.model?.name].filter(Boolean).join(' ')

    return (
        <>
            <Card bodyClass="p-4">
                <div className="flex flex-col items-center text-center">
                    <div className="w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                        {cover ? (
                            <img
                                src={cover}
                                alt={name || car.registration_number}
                                loading="lazy"
                                className="h-44 w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-44 w-full items-center justify-center text-gray-400 dark:text-gray-500">
                                <LiCar className="text-4xl" />
                            </div>
                        )}
                    </div>
                    <h5 className="mt-3 dark:text-gray-100">
                        {name || car.registration_number}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {car.registration_number}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <Tag
                            className={`capitalize ${tagToneClass[carStatusTone[car.status]]}`}
                        >
                            {car.status}
                        </Tag>
                        {!car.is_active && (
                            <Tag className="border-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                Inactive
                            </Tag>
                        )}
                    </div>
                    <Button
                        className="mt-4 w-full"
                        variant="subtle"
                        icon={<LiEdit2 />}
                        onClick={() => setEditOpen(true)}
                    >
                        Edit vehicle
                    </Button>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <InfoRow label="Category">
                        {car.category?.name ?? '—'}
                    </InfoRow>
                    <InfoRow label="Year">{car.year ?? '—'}</InfoRow>
                    <InfoRow label="Color">
                        <span className="uppercase">{car.color ?? '—'}</span>
                    </InfoRow>
                    <InfoRow label="Transmission">
                        <span className="capitalize">
                            {car.transmission_type ?? '—'}
                        </span>
                    </InfoRow>
                    <InfoRow label="Fuel">
                        <span className="capitalize">
                            {car.fuel_type ?? '—'}
                        </span>
                    </InfoRow>
                    <InfoRow label="Seats / Doors">
                        {car.seats_count ?? '—'} / {car.doors_count ?? '—'}
                    </InfoRow>
                </div>

                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <InfoRow label="Daily price">
                        {MAD(car.daily_price)}
                    </InfoRow>
                    <InfoRow label="Purchase price">
                        {car.purchase_price != null
                            ? MAD(car.purchase_price)
                            : '—'}
                    </InfoRow>
                </div>

                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <InfoRow label="Current mileage">
                        {car.current_mileage != null ? (
                            <NumericFormat
                                displayType="text"
                                value={car.current_mileage}
                                thousandSeparator
                                suffix=" km"
                            />
                        ) : (
                            '—'
                        )}
                    </InfoRow>
                    <InfoRow label="Next service">
                        {car.next_service_mileage != null ? (
                            <NumericFormat
                                displayType="text"
                                value={car.next_service_mileage}
                                thousandSeparator
                                suffix=" km"
                            />
                        ) : (
                            '—'
                        )}
                    </InfoRow>
                    <InfoRow label="Fuel level">
                        {car.current_fuel_level != null
                            ? `${car.current_fuel_level}%`
                            : '—'}
                    </InfoRow>
                </div>

                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <InfoRow label="Insurance">
                        {car.insurance_company ?? '—'}
                    </InfoRow>
                    <InfoRow label="Policy">
                        {car.insurance_policy_number ?? '—'}
                    </InfoRow>
                    <InfoRow label="Insurance expiry">
                        {formatDate(car.insurance_expiry_date)}
                    </InfoRow>
                    <InfoRow label="Inspection expiry">
                        {formatDate(car.technical_inspection_expiry)}
                    </InfoRow>
                    <InfoRow label="VIN">
                        <span className="font-mono text-xs">
                            {car.vin ?? '—'}
                        </span>
                    </InfoRow>
                </div>

                {car.notes && (
                    <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Notes
                        </p>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                            {car.notes}
                        </p>
                    </div>
                )}
            </Card>

            <Dialog
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                width={760}
            >
                <CarForm
                    car={car}
                    isOpen={editOpen}
                    onCancel={() => setEditOpen(false)}
                    onSaved={() => {
                        setEditOpen(false)
                        onUpdated()
                    }}
                />
            </Dialog>
        </>
    )
}

export default CarDetailsInfo
