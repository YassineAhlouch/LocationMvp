import { type FormEvent, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { TbCalendarCheck, TbCarSuv, TbPhoneCall } from 'react-icons/tb'
import type { IconType } from 'react-icons'
import useLocale from '@/utils/hooks/useLocale'
import { useThemeStore } from '@/store/themeStore'
import { getLandingPageContent } from './content-data'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import { TAG_ICONS } from './components/ColoniaTag'
import type { Tab } from './components/NavList'
import type { LandingPageContent } from './types'
import { ApiError, sendLandingContact } from '@/api/contact'

/**
 * The dedicated /contact SPA route — a full port of the Colonia template's
 * contact section: a 470px centered intro (tag → h1 → subtext) over a row of
 * three grey info boxes (golden icon tile + h5 + text + the dark button-01
 * pill), then the 660px form block (contaict-title + Webflow-style form:
 * label + .text-field rows with the .form-feld-wrap two-column pairs, the
 * dark gradient submit with its orange dot and the orange success/red error
 * banners). The form POSTs to /api/v1/landing/contacts through api/contact.ts
 * (the pipeline behind the Transparency banner); client-side required checks
 * for name/phone, per-field 422 errors and the template's success/error
 * blocks in place. Content comes from the app's landing.locales under
 * `contactPage`;
 * styling lives in src/assets/styles/others/_colonia-contactpage.css.
 */

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
})

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

/** One icon per info box (sales / demo / features). */
const BOX_ICONS: IconType[] = [TbPhoneCall, TbCalendarCheck, TbCarSuv]

/** The platform's WhatsApp business line (same chat the QR launcher opens). */
const WHATSAPP_NUMBER = '212645249446'

/** wa: hrefs build a wa.me deep link with the language-prefilled message. */
const boxHref = (href: string) => {
    if (href.startsWith('wa:')) {
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            href.slice(3).trim(),
        )}`
    }
    return href
}

const ContactClient = ({ content }: { content: LandingPageContent }) => {
    const page = content.contactPage
    const mode = useThemeStore((t) => t.mode)
    const setMode = useThemeStore((t) => t.setMode)
    const { direction } = useLocale()

    const resolvedMode =
        mode === 'system'
            ? ((window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light') as 'dark' | 'light')
            : (mode as 'dark' | 'light')

    /* the pills route back to the landing's sections; Contact marks home */
    const navMenu: Tab[] = content.nav.items.map((item) => ({
        title: item.title,
        value: item.value,
        route:
            item.value === 'contact'
                ? '/contact'
                : `/#${item.anchor ?? item.value}`,
    }))

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
            setError(page.errors.name)
            return
        }

        if (form.phone.trim().length === 0) {
            setError(page.errors.phone)
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
                setError(page.errors.unexpected)
            }
        } finally {
            setSending(false)
        }
    }

    /* one form-feld: label (.paragraph-02) + input/textarea + a 422 message */
    const feld = (
        key: keyof ContactState,
        inputId: string,
        label: string,
        placeholder: string,
        multiline = false,
    ) => {
        const props = {
            id: inputId,
            value: form[key],
            onChange: (event: { target: { value: string } }) =>
                setField(key, event.target.value),
            placeholder,
        }

        return (
            <div className="form-feld">
                <label className="paragraph-02" htmlFor={inputId}>
                    {label}
                </label>
                {multiline ? (
                    <textarea {...props} className="text-area-field" rows={4} />
                ) : (
                    <input {...props} className="text-field" />
                )}
                {fieldErrors[key] ? (
                    <p className="contact-field-error">{fieldErrors[key]}</p>
                ) : null}
            </div>
        )
    }

    return (
        <main className="colonia-root bg-white dark:bg-gray-900">
            <NavigationBar
                toggleMode={() =>
                    setMode(resolvedMode === 'light' ? 'dark' : 'light')
                }
                mode={resolvedMode}
                navMenu={navMenu}
                direction={direction}
                ctaHref="/#contact"
                navActiveValue="contact"
            />
            <section className="contact">
                <div className="colonia-container">
                    {/* contact-top — heading + the three info boxes */}
                    <div className="contact-top-heading">
                        <motion.div className="tag-wrap" {...rise(0.05)}>
                            <img
                                src={TAG_ICONS.contact}
                                alt=""
                                className="tag-icon"
                            />
                            <div className="teg text-grey-02">{page.tag}</div>
                        </motion.div>
                        <div className="title-wrap">
                            <motion.div className="heading-wrap" {...rise(0.08)}>
                                <h1 className="col-h1">{page.heading}</h1>
                            </motion.div>
                            <motion.div
                                className="sub-heading-wrap"
                                {...rise(0.12)}
                            >
                                <p className="paragraph-02 text-grey-01">
                                    {page.subtext}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                    <motion.div className="contact-info-wrap" {...rise(0.16)}>
                        {page.boxes.map((box, index) => {
                            const Icon = BOX_ICONS[index] ?? BOX_ICONS[0]
                            const href = boxHref(box.href)
                            const external = box.href.startsWith('wa:')

                            return (
                                <div className="contact-info-box" key={box.title}>
                                    <span className="plan-icon-wrap-02">
                                        <Icon size={20} />
                                    </span>
                                    <div className="contact-info-box-text">
                                        <div className="col-h5">{box.title}</div>
                                        <p className="paragraph-02">{box.text}</p>
                                    </div>
                                    <a
                                        className="button-01"
                                        href={href}
                                        {...(external
                                            ? {
                                                  target: '_blank',
                                                  rel: 'noopener noreferrer',
                                              }
                                            : {})}
                                    >
                                        <span className="button-dot" />
                                        <span className="button-text-wrap">
                                            <span className="paragraph-03">
                                                {box.pill}
                                            </span>
                                            <span
                                                className="paragraph-03"
                                                aria-hidden="true"
                                            >
                                                {box.pill}
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            )
                        })}
                    </motion.div>
                    {/* contact-bottom — Say Hello title + the lead form */}
                    <div className="contact-bottom">
                        <div className="contaict-title">
                            <motion.div className="tag-wrap" {...rise(0.05)}>
                                <img
                                    src={TAG_ICONS.testimonials}
                                    alt=""
                                    className="tag-icon"
                                />
                                <div className="teg text-grey-02">
                                    {page.formIntro.tag}
                                </div>
                            </motion.div>
                            <div className="title-wrap">
                                <motion.div
                                    className="heading-wrap"
                                    {...rise(0.08)}
                                >
                                    <h2 className="text-h3">
                                        {page.formIntro.heading}
                                    </h2>
                                </motion.div>
                                <motion.div
                                    className="sub-heading-wrap"
                                    {...rise(0.12)}
                                >
                                    <p className="paragraph-02 text-grey-01">
                                        {page.formIntro.subtext}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                        <div className="form-block" id="contact-form">
                            {sent ? (
                                <div
                                    className="success-message"
                                    role="status"
                                >
                                    <p className="paragraph-02 text-light">
                                        {page.successText}
                                    </p>
                                </div>
                            ) : (
                                <form
                                    className="form"
                                    onSubmit={(event) => {
                                        void handleSubmit(event)
                                    }}
                                    noValidate
                                >
                                    {error ? (
                                        <div
                                            className="error-message-v2"
                                            role="alert"
                                        >
                                            <p className="paragraph-03">
                                                {error}
                                            </p>
                                        </div>
                                    ) : null}
                                    <div className="form-feld-wrap">
                                        {feld(
                                            'full_name',
                                            'contact-full-name',
                                            page.form.fullName,
                                            page.form.phFullName,
                                        )}
                                        {feld(
                                            'phone',
                                            'contact-phone',
                                            page.form.phone,
                                            page.form.phPhone,
                                        )}
                                    </div>
                                    <div className="form-feld-wrap">
                                        {feld(
                                            'agency_name',
                                            'contact-agency',
                                            page.form.agency,
                                            page.form.phAgency,
                                        )}
                                        {feld(
                                            'email',
                                            'contact-email',
                                            page.form.email,
                                            page.form.phEmail,
                                        )}
                                    </div>
                                    <div className="form-feld-wrap">
                                        {feld(
                                            'message',
                                            'contact-message',
                                            page.form.message,
                                            page.form.phMessage,
                                            true,
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="normal-submit-button"
                                        disabled={sending}
                                    >
                                        <span className="button-dot" />
                                        <span>
                                            {sending
                                                ? page.form.sending
                                                : page.form.submit}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer content={content.footer} ctaHref="/#contact" />
        </main>
    )
}

const Contact = () => {
    const { i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const content = useMemo(
        () => getLandingPageContent(language),
        [language],
    )

    return <ContactClient content={content} />
}

export default Contact
