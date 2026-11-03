import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, sendLandingReservation } from '../api'
import type { LandingCar } from '../types'
import { formatDailyPrice, nowLocal, toLocalInput } from '../format'

type ReservationDialogProps = {
    car: LandingCar | null
    onClose: () => void
}

type FormState = {
    full_name: string
    phone: string
    email: string
    pickup_datetime: string
    expected_return_datetime: string
    message: string
}

const emptyForm = (): FormState => ({
    full_name: '',
    phone: '',
    email: '',
    pickup_datetime: '',
    expected_return_datetime: '',
    message: '',
})

const carName = (car: LandingCar, fallback: string) =>
    [car.brand, car.model].filter(Boolean).join(' ') || fallback

/**
 * Modal reservation request: the visitor leaves contact details and intended
 * dates, the API stores a landing_reservations lead — no client record is
 * created, staff confirm afterward (per StoreLandingReservationRequest).
 */
const ReservationDialog = ({ car, onClose }: ReservationDialogProps) => {
    const { t } = useTranslation()
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    useEffect(() => {
        if (car) {
            setForm(emptyForm())
            setError('')
            setFieldErrors({})
            setSent(false)
        }
    }, [car])

    const minPickup = useMemo(() => nowLocal(), [car])

    if (!car) {
        return null
    }

    const setField = (field: keyof FormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }))
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setError('')
        setFieldErrors({})

        if (form.full_name.trim().length === 0) {
            setError(t('dialog.err_name'))
            return
        }
        if (form.phone.trim().length === 0) {
            setError(t('dialog.err_phone'))
            return
        }
        if (!form.pickup_datetime || !form.expected_return_datetime) {
            setError(t('dialog.err_dates'))
            return
        }
        if (form.expected_return_datetime <= form.pickup_datetime) {
            setError(t('dialog.err_return'))
            return
        }

        setSending(true)
        try {
            await sendLandingReservation({
                car_id: car.id,
                full_name: form.full_name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim() || null,
                pickup_datetime: form.pickup_datetime,
                expected_return_datetime: form.expected_return_datetime,
                message: form.message.trim() || null,
            })
            setSent(true)
        } catch (cause) {
            if (cause instanceof ApiError) {
                setError(cause.message)
                setFieldErrors(cause.fieldErrors)
            } else {
                setError(t('dialog.err_unexpected'))
            }
        } finally {
            setSending(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {sent ? (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                            ✅
                        </span>
                        <h3 className="text-lg font-bold text-neutral-900">
                            {t('dialog.success_title')}
                        </h3>
                        <p className="max-w-xs text-sm text-neutral-500">
                            {t('dialog.success_text', {
                                name: form.full_name.trim(),
                                agency: car.agency.name,
                            })}
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                            {t('dialog.close')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900">
                                    {t('dialog.title', {
                                        car: carName(car, t('car.fallback_name')),
                                    })}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    {formatDailyPrice(
                                        car.daily_price,
                                        car.agency.currency_code,
                                    )}{' '}
                                    {t('car.per_day')} · {car.agency.name}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-1 text-neutral-400 transition hover:text-neutral-700"
                                aria-label={t('dialog.close')}
                            >
                                ✕
                            </button>
                        </div>
                        {error && (
                            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(event) => {
                                void handleSubmit(event)
                            }}
                        >
                            <label className="flex flex-col gap-1 text-sm">
                                <span className="font-medium text-neutral-700">
                                    {t('dialog.full_name')}
                                </span>
                                <input
                                    type="text"
                                    value={form.full_name}
                                    onChange={(e) =>
                                        setField('full_name', e.target.value)
                                    }
                                    className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-[#135EF7]"
                                    placeholder={t('dialog.ph_full')}
                                />
                                {fieldErrors.full_name && (
                                    <span className="text-xs text-red-600">
                                        {fieldErrors.full_name}
                                    </span>
                                )}
                            </label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-neutral-700">
                                        {t('dialog.phone')}
                                    </span>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            setField('phone', e.target.value)
                                        }
                                        className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-[#135EF7]"
                                        placeholder={t('dialog.ph_phone')}
                                    />
                                    {fieldErrors.phone && (
                                        <span className="text-xs text-red-600">
                                            {fieldErrors.phone}
                                        </span>
                                    )}
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-neutral-700">
                                        Email (optionnel)
                                    </span>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setField('email', e.target.value)
                                        }
                                        className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-[#135EF7]"
                                        placeholder={t('dialog.ph_email')}
                                    />
                                    {fieldErrors.email && (
                                        <span className="text-xs text-red-600">
                                            {fieldErrors.email}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-neutral-700">
                                        {t('dialog.pickup')}
                                    </span>
                                    <input
                                        type="datetime-local"
                                        min={minPickup}
                                        value={form.pickup_datetime}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setForm((current) => ({
                                                ...current,
                                                pickup_datetime: value,
                                                expected_return_datetime:
                                                    current.expected_return_datetime &&
                                                    current.expected_return_datetime <=
                                                        value
                                                        ? toLocalInput(
                                                              new Date(
                                                                  new Date(
                                                                      value,
                                                                  ).getTime() +
                                                                      24 *
                                                                          60 *
                                                                          60 *
                                                                          1000,
                                                              ),
                                                          )
                                                        : current.expected_return_datetime,
                                            }))
                                        }}
                                        className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-[#135EF7]"
                                    />
                                    {fieldErrors.pickup_datetime && (
                                        <span className="text-xs text-red-600">
                                            {fieldErrors.pickup_datetime}
                                        </span>
                                    )}
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-neutral-700">
                                        {t('dialog.ret')}
                                    </span>
                                    <input
                                        type="datetime-local"
                                        min={minPickup}
                                        value={form.expected_return_datetime}
                                        onChange={(e) =>
                                            setField(
                                                'expected_return_datetime',
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-[#135EF7]"
                                    />
                                    {fieldErrors.expected_return_datetime && (
                                        <span className="text-xs text-red-600">
                                            {
                                                fieldErrors.expected_return_datetime
                                            }
                                        </span>
                                    )}
                                </label>
                            </div>
                            <label className="flex flex-col gap-1 text-sm">
                                <span className="font-medium text-neutral-700">
                                    {t('dialog.message')}
                                </span>
                                <textarea
                                    value={form.message}
                                    onChange={(e) =>
                                        setField('message', e.target.value)
                                    }
                                    rows={3}
                                    maxLength={2000}
                                    className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-[#135EF7]"
                                    placeholder={t('dialog.ph_message')}
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={sending}
                                className="mt-1 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
                            >
                                {sending
                                    ? t('dialog.sending')
                                    : t('dialog.submit')}
                            </button>
                            <p className="text-center text-xs text-neutral-400">
                                {t('dialog.note')}
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default ReservationDialog
