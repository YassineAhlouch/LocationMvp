import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, sendLandingContact } from '../api'

type ContactState = {
    full_name: string
    agency_name: string
    phone: string
    email: string
    message: string
}

const emptyContact = (): ContactState => ({
    full_name: '',
    agency_name: '',
    phone: '',
    email: '',
    message: '',
})

const stepKeys = ['step1', 'step2', 'step3'] as const

/**
 * Below the demonstration generator, same layout: centered intro, then two
 * cards — the onboarding steps on the left, the account-request form on the
 * right (POST /api/v1/landing/contacts). Staff then contact the agency and
 * open its dashboard account where fleet management + QR creation live.
 */
const ContactSection = () => {
    const { t } = useTranslation()
    const [form, setForm] = useState<ContactState>(emptyContact)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    const setField = (field: keyof ContactState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }))
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setError('')
        setFieldErrors({})

        if (form.full_name.trim().length === 0) {
            setError(t('contact.err_name'))

            return
        }

        if (form.phone.trim().length === 0) {
            setError(t('contact.err_phone'))

            return
        }

        setSending(true)

        try {
            await sendLandingContact({
                full_name: form.full_name.trim(),
                agency_name: form.agency_name.trim() || null,
                phone: form.phone.trim(),
                email: form.email.trim() || null,
                message: form.message.trim() || null,
            })
            setSent(true)
        } catch (cause) {
            if (cause instanceof ApiError) {
                setError(cause.message)
                setFieldErrors(cause.fieldErrors)
            } else {
                setError(t('contact.err_unexpected'))
            }
        } finally {
            setSending(false)
        }
    }

    if (sent) {
        return (
            <section className="mx-auto max-w-3xl px-4 py-16">
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-[0_0_24px_rgba(34,42,53,0.04)]">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                        ✅
                    </span>
                    <div className="flex flex-col gap-2 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            {t('contact.success_title')}
                        </h2>
                        <p className="max-w-md text-sm text-gray-500 md:text-base">
                            {t('contact.success_text', {
                                name: form.full_name.trim(),
                            })}
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative">
            {/* Centered intro — mirrors the generator hero */}
            <div className="relative flex flex-col items-center gap-4 px-4 pt-16 pb-10 text-center">
                <span className="rounded-full bg-[#135EF7]/10 px-3 py-1 text-xs font-semibold text-[#135EF7]">
                    {t('contact.badge')}
                </span>
                <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    {t('contact.heading')}
                </h2>
                <p className="max-w-2xl text-base text-gray-500 md:text-lg">
                    {t('contact.sub')}
                </p>
            </div>

            <div className="mx-auto max-w-3xl px-4 pb-16">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Steps card */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_24px_rgba(34,42,53,0.04)]">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {t('contact.steps_title')}
                        </h3>
                        <ol className="mt-2 flex flex-col">
                            {stepKeys.map((key, index) => (
                                <li
                                    key={key}
                                    className="flex items-start gap-3 py-2.5"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-lg">
                                        {['🔑', '🚗', '📱'][index]}
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {index + 1}. {t(`contact.${key}_title`)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {t(`contact.${key}_text`)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Request form card */}
                    <div
                        className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_24px_rgba(34,42,53,0.04)]"
                    >
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
                                <span className="font-medium text-gray-700">
                                    {t('contact.f_full')}
                                </span>
                                <input
                                    type="text"
                                    value={form.full_name}
                                    onChange={(event) =>
                                        setField(
                                            'full_name',
                                            event.target.value,
                                        )
                                    }
                                    className="rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-[#135EF7]"
                                    placeholder={t('contact.ph_full')}
                                />
                                {fieldErrors.full_name && (
                                    <span className="text-xs text-red-600">
                                        {fieldErrors.full_name}
                                    </span>
                                )}
                            </label>
                            <label className="flex flex-col gap-1 text-sm">
                                <span className="font-medium text-gray-700">
                                    {t('contact.f_agency')}
                                </span>
                                <input
                                    type="text"
                                    value={form.agency_name}
                                    onChange={(event) =>
                                        setField(
                                            'agency_name',
                                            event.target.value,
                                        )
                                    }
                                    className="rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-[#135EF7]"
                                    placeholder={t('contact.ph_agency')}
                                />
                                {fieldErrors.agency_name && (
                                    <span className="text-xs text-red-600">
                                        {fieldErrors.agency_name}
                                    </span>
                                )}
                            </label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-gray-700">
                                        {t('contact.f_phone')}
                                    </span>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(event) =>
                                            setField(
                                                'phone',
                                                event.target.value,
                                            )
                                        }
                                        className="rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-[#135EF7]"
                                        placeholder={t('contact.ph_phone')}
                                    />
                                    {fieldErrors.phone && (
                                        <span className="text-xs text-red-600">
                                            {fieldErrors.phone}
                                        </span>
                                    )}
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    <span className="font-medium text-gray-700">
                                        {t('contact.f_email')}
                                    </span>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            setField(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        className="rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-[#135EF7]"
                                        placeholder={t('contact.ph_email')}
                                    />
                                    {fieldErrors.email && (
                                        <span className="text-xs text-red-600">
                                            {fieldErrors.email}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <label className="flex flex-col gap-1 text-sm">
                                <span className="font-medium text-gray-700">
                                    {t('contact.f_message')}
                                </span>
                                <textarea
                                    value={form.message}
                                    onChange={(event) =>
                                        setField('message', event.target.value)
                                    }
                                    rows={3}
                                    maxLength={2000}
                                    className="rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-[#135EF7]"
                                    placeholder={t('contact.ph_message')}
                                />
                                {fieldErrors.message && (
                                    <span className="text-xs text-red-600">
                                        {fieldErrors.message}
                                    </span>
                                )}
                            </label>
                            <button
                                type="submit"
                                disabled={sending}
                                className="mt-1 rounded-xl bg-[#135EF7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f4ede] disabled:opacity-50"
                            >
                                {sending
                                    ? t('contact.sending')
                                    : t('contact.submit')}
                            </button>
                            <p className="text-center text-xs text-gray-400">
                                {t('contact.note')}
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSection
