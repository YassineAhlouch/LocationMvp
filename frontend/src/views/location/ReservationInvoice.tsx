import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { LiChevronLeft, LiPrinter } from '@/icons'
import { apiGetReservationContract } from '@/services/LocationService'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { MAD, formatDate, formatDateTime } from './shared'
import type { Client, ReservationContract } from '@/@types/location'

const EM_DASH = '—'

const text = (value: string | number | null | undefined) =>
    value === null || value === undefined || value === '' ? EM_DASH : String(value)

const km = (value: number | null | undefined) =>
    value === null || value === undefined
        ? EM_DASH
        : `${value.toLocaleString('fr-FR')} km`

const percent = (value: number | null | undefined) =>
    value === null || value === undefined ? EM_DASH : `${value}%`

const methodLabel: Record<string, string> = {
    cash: 'Espèces',
    card: 'Carte',
    transfer: 'Virement',
}

const recordStatusLabel: Record<string, string> = {
    paid: 'Payé',
    pending: 'En attente',
    refunded: 'Remboursé',
}

const fullAddress = (client: Client | null) => {
    if (!client) {
        return EM_DASH
    }

    return (
        [client.address, client.city, client.country].filter(Boolean).join(', ') ||
        EM_DASH
    )
}

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="space-y-0.5">
        <div className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
            {label}
        </div>
        <div className="text-sm text-gray-900">
            {value === null || value === undefined || value === '' ? EM_DASH : value}
        </div>
    </div>
)

const SectionTitle = ({ children }: { children: ReactNode }) => (
    <h3 className="mb-3 border-b border-gray-300 pb-1.5 text-xs font-bold tracking-wider text-gray-700 uppercase">
        {children}
    </h3>
)

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex justify-between text-gray-700">
        <span>{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
    </div>
)

const Checkbox = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 text-sm text-gray-800">
        <span className="inline-block h-4 w-4 shrink-0 border border-gray-400" />
        <span>{label}</span>
    </div>
)

const TermsItem = ({ children }: { children: ReactNode }) => (
    <li className="flex gap-2 text-xs leading-relaxed text-gray-700">
        <span className="text-gray-400">•</span>
        <span>{children}</span>
    </li>
)

const TERMS = [
    "The driver must have held a valid driver's license for more than 2 years.",
    'A security deposit is mandatory upon vehicle handover.',
    'The vehicle must be returned in identical condition and at the agreed contract time.',
    'Any damages or scratches will be deducted directly from the deposit.',
    'A 2,000 DH penalty applies for lost vehicle documents or keys.',
    'No repairs may be made to the vehicle without prior written consent from the company.',
    'Signing an amicable accident report without an expert present is strictly prohibited.',
    'Driving the vehicle into Melilla is strictly forbidden; the renter assumes full responsibility for any attempt.',
    'Driving by unauthorized individuals not listed on the contract is strictly prohibited.',
]

const ReservationInvoice = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/reservations/liste`)

    const [contract, setContract] = useState<ReservationContract | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        if (!id) {
            setFailed(true)
            setLoading(false)
            return
        }
        let active = true
        setLoading(true)
        setFailed(false)
        setContract(null)
        apiGetReservationContract(Number(id))
            .then((res) => {
                if (active) {
                    setContract(res)
                }
            })
            .catch(() => {
                if (active) {
                    setFailed(true)
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false)
                }
            })
        return () => {
            active = false
        }
    }, [id])

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (failed || !contract) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-4 text-center">
                <h5 className="dark:text-gray-100">Reservation not found</h5>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    It may have been deleted or you don't have access to it.
                </p>
                <Button onClick={goToListe}>Back to reservations</Button>
            </div>
        )
    }

    const {
        reservation,
        agency,
        car,
        primary_client,
        secondary_client,
        payments,
        mileage,
    } = contract

    const extras = reservation.extras ?? []
    const paidTotal = payments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0)
    const balance = reservation.total_amount - paidTotal

    const hasSecondaryDriver = Boolean(
        secondary_client || reservation.secondary_driver.name,
    )
    const agencyInitial = (agency?.name ?? 'A').charAt(0).toUpperCase()

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6 print:bg-white print:p-0 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex max-w-[1000px] items-center justify-between gap-3 print:hidden">
                <Button
                    variant="subtle"
                    size="sm"
                    icon={<LiChevronLeft />}
                    onClick={goToListe}
                >
                    Back to reservations
                </Button>
                <Button
                    variant="solid"
                    size="sm"
                    icon={<LiPrinter />}
                    onClick={() => window.print()}
                >
                    Print
                </Button>
            </div>

            <div className="mx-auto max-w-[1000px] rounded-lg border border-gray-300 bg-white p-8 text-gray-900 shadow-sm print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
                <header className="flex items-start justify-between gap-6 border-b-2 border-gray-800 pb-6">
                    <div className="flex items-start gap-4">
                        {agency?.logo ? (
                            <img
                                src={agency.logo}
                                alt={agency.name}
                                className="h-16 w-16 rounded object-contain"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-800 text-2xl font-bold text-white">
                                {agencyInitial}
                            </div>
                        )}
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold tracking-wide uppercase">
                                {text(agency?.name)}
                            </h1>
                            {agency?.address && (
                                <p className="text-sm text-gray-600">
                                    {agency.address}
                                </p>
                            )}
                            <p className="text-sm text-gray-600">
                                {[agency?.city, agency?.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </p>
                            <p className="text-sm text-gray-600">
                                {[agency?.phone, agency?.email]
                                    .filter(Boolean)
                                    .join('  •  ')}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold tracking-wide uppercase">
                            Contrat de location
                        </h2>
                        <p className="text-xs text-gray-500">
                            Car Rental Agreement
                        </p>
                        <div className="mt-3 space-y-1 text-sm">
                            <p>
                                <span className="text-gray-500">
                                    Contrat N° :{' '}
                                </span>
                                <span className="font-semibold">
                                    {reservation.reservation_number}
                                </span>
                            </p>
                            <p>
                                <span className="text-gray-500">Date : </span>
                                <span className="font-medium">
                                    {formatDate(reservation.created_at)}
                                </span>
                            </p>
                        </div>
                    </div>
                </header>

                <section className="mt-6">
                    <SectionTitle>1. Agence &amp; document</SectionTitle>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Field label="Agence" value={agency?.name} />
                        <Field label="ICE" value={agency?.ice} />
                        <Field label="RC" value={agency?.rc} />
                        <Field
                            label="Contrat N°"
                            value={reservation.reservation_number}
                        />
                        <Field
                            label="Adresse"
                            value={[agency?.address, agency?.city, agency?.country]
                                .filter(Boolean)
                                .join(', ')}
                        />
                        <Field label="Téléphone" value={agency?.phone} />
                        <Field label="Email" value={agency?.email} />
                        <Field
                            label="Date d'émission"
                            value={formatDate(reservation.created_at)}
                        />
                    </div>
                </section>

                <section className="mt-6">
                    <SectionTitle>2. Locataire / Renter</SectionTitle>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Field
                            label="Nom complet"
                            value={primary_client?.full_name}
                        />
                        <Field label="Téléphone" value={primary_client?.phone} />
                        <Field
                            label="Adresse"
                            value={fullAddress(primary_client)}
                        />
                        <Field label="N° CIN" value={primary_client?.cin} />
                        <Field
                            label="N° Passeport"
                            value={primary_client?.passport_number}
                        />
                        <Field
                            label="N° Permis"
                            value={primary_client?.driving_license_number}
                        />
                        <Field
                            label="Validité permis"
                            value={formatDate(
                                primary_client?.driving_license_expiry,
                            )}
                        />
                        <Field
                            label="Nationalité"
                            value={primary_client?.nationality}
                        />
                        <Field
                            label="Date de naissance"
                            value={formatDate(primary_client?.birth_date)}
                        />
                    </div>
                </section>

                <section className="mt-6">
                    <SectionTitle>
                        3. Autre conducteur / Secondary driver
                    </SectionTitle>
                    {hasSecondaryDriver ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <Field
                                label="Nom complet"
                                value={
                                    secondary_client?.full_name ??
                                    reservation.secondary_driver.name
                                }
                            />
                            <Field
                                label="Téléphone"
                                value={
                                    secondary_client?.phone ??
                                    reservation.secondary_driver.phone
                                }
                            />
                            <Field
                                label="N° CIN"
                                value={
                                    secondary_client?.cin ??
                                    reservation.secondary_driver.cin
                                }
                            />
                            <Field
                                label="N° Permis"
                                value={
                                    secondary_client?.driving_license_number ??
                                    reservation.secondary_driver.license
                                }
                            />
                            <Field
                                label="Validité permis"
                                value={formatDate(
                                    secondary_client?.driving_license_expiry,
                                )}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Aucun conducteur secondaire enregistré.
                        </p>
                    )}
                </section>

                <section className="mt-6">
                    <SectionTitle>
                        4. Véhicule &amp; inspection / Vehicle &amp; inspection
                    </SectionTitle>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Field label="Marque" value={car?.brand} />
                        <Field label="Modèle" value={car?.model} />
                        <Field
                            label="Immatriculation"
                            value={car?.registration_number}
                        />
                        <Field label="Catégorie" value={car?.category} />
                        <Field label="Année" value={car?.year} />
                        <Field label="Couleur" value={car?.color} />
                        <Field
                            label="Transmission"
                            value={car?.transmission_type}
                        />
                        <Field label="Carburant" value={car?.fuel_type} />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded border border-gray-300 p-3">
                            <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                                Livraison — {formatDateTime(reservation.pickup_datetime)}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Field
                                    label="Odomètre"
                                    value={km(reservation.pickup_mileage)}
                                />
                                <Field
                                    label="Carburant"
                                    value={percent(reservation.pickup_fuel_level)}
                                />
                            </div>
                        </div>
                        <div className="rounded border border-gray-300 p-3">
                            <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                                Réception —{' '}
                                {formatDateTime(
                                    reservation.actual_return_datetime ??
                                        reservation.expected_return_datetime,
                                )}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Field
                                    label="Odomètre"
                                    value={km(reservation.return_mileage)}
                                />
                                <Field
                                    label="Carburant"
                                    value={percent(reservation.return_fuel_level)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 rounded border border-dashed border-gray-300 p-3 sm:grid-cols-3">
                        <Checkbox label="Lavage / Wash" />
                        <Checkbox label="Radio" />
                        <Checkbox label="Roue de secours / Spare wheel" />
                    </div>
                </section>

                <section className="mt-6">
                    <SectionTitle>
                        5. Durée &amp; financier / Duration &amp; financials
                    </SectionTitle>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Field
                            label="Date de sortie"
                            value={formatDateTime(reservation.pickup_datetime)}
                        />
                        <Field
                            label="Date d'entrée"
                            value={formatDateTime(
                                reservation.expected_return_datetime,
                            )}
                        />
                        <Field label="Jours" value={reservation.rental_days} />
                        <Field
                            label="Distance parcourue"
                            value={km(mileage.distance)}
                        />
                        <Field
                            label="Km inclus"
                            value={`${km(mileage.allowance)} (${mileage.daily_allowance} km/jour)`}
                        />
                        <Field
                            label="Km supplémentaires"
                            value={km(mileage.excess)}
                        />
                        <Field
                            label="Frais km supp."
                            value={`${MAD(mileage.extra_fee)} (${MAD(mileage.fee_per_km)}/km)`}
                        />
                        <Field
                            label="Tarif journalier"
                            value={MAD(reservation.daily_rate)}
                        />
                    </div>

                    <div className="mt-4 ml-auto w-full max-w-md space-y-1.5 text-sm">
                        <Row label="Sous-total" value={MAD(reservation.subtotal)} />
                        {reservation.discount_amount > 0 && (
                            <Row
                                label="Remise"
                                value={`- ${MAD(reservation.discount_amount)}`}
                            />
                        )}
                        {reservation.tax_amount > 0 && (
                            <Row label="Taxe" value={MAD(reservation.tax_amount)} />
                        )}
                        <Row label="Caution" value={MAD(reservation.deposit_amount)} />
                        <div className="flex justify-between border-t border-gray-800 pt-1.5 text-base font-bold text-gray-900">
                            <span>Total</span>
                            <span>{MAD(reservation.total_amount)}</span>
                        </div>
                        <Row label="Payé" value={MAD(paidTotal)} />
                        <Row label="Solde" value={MAD(balance)} />
                    </div>

                    {extras.length > 0 && (
                        <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                                Extras
                            </p>
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-gray-300 text-left text-xs text-gray-500 uppercase">
                                        <th className="py-1 pr-2 font-medium">
                                            Désignation
                                        </th>
                                        <th className="py-1 pr-2 font-medium">
                                            Type
                                        </th>
                                        <th className="py-1 pr-2 text-right font-medium">
                                            Qté
                                        </th>
                                        <th className="py-1 pr-2 text-right font-medium">
                                            P.U.
                                        </th>
                                        <th className="py-1 text-right font-medium">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {extras.map((extra, index) => (
                                        <tr
                                            key={`${extra.name}-${index}`}
                                            className="border-b border-gray-200"
                                        >
                                            <td className="py-1 pr-2">
                                                {extra.name}
                                            </td>
                                            <td className="py-1 pr-2">
                                                {extra.pricing_type === 'daily'
                                                    ? 'Journalier'
                                                    : 'Fixe'}
                                            </td>
                                            <td className="py-1 pr-2 text-right">
                                                {extra.quantity}
                                            </td>
                                            <td className="py-1 pr-2 text-right">
                                                {MAD(extra.unit_price)}
                                            </td>
                                            <td className="py-1 text-right">
                                                {MAD(extra.total_price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {payments.length > 0 && (
                        <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                                Paiements
                            </p>
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-gray-300 text-left text-xs text-gray-500 uppercase">
                                        <th className="py-1 pr-2 font-medium">
                                            Date
                                        </th>
                                        <th className="py-1 pr-2 font-medium">
                                            Méthode
                                        </th>
                                        <th className="py-1 pr-2 font-medium">
                                            Référence
                                        </th>
                                        <th className="py-1 pr-2 font-medium">
                                            Statut
                                        </th>
                                        <th className="py-1 text-right font-medium">
                                            Montant
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b border-gray-200"
                                        >
                                            <td className="py-1 pr-2">
                                                {formatDate(payment.payment_date)}
                                            </td>
                                            <td className="py-1 pr-2">
                                                {methodLabel[payment.method] ??
                                                    text(payment.method)}
                                            </td>
                                            <td className="py-1 pr-2">
                                                {text(payment.reference)}
                                            </td>
                                            <td className="py-1 pr-2">
                                                {recordStatusLabel[
                                                    payment.status
                                                ] ?? text(payment.status)}
                                            </td>
                                            <td className="py-1 text-right">
                                                {MAD(payment.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="mt-6">
                    <SectionTitle>
                        6. Conditions générales / General terms &amp; conditions
                    </SectionTitle>
                    <ol className="space-y-1.5">
                        {TERMS.map((term) => (
                            <TermsItem key={term}>{term}</TermsItem>
                        ))}
                    </ol>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                            Signature loueur / Agency
                        </p>
                        <div className="mt-2 h-24 rounded border border-gray-300" />
                        <p className="mt-2 text-xs text-gray-500">
                            {text(agency?.name)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                            Signature client / Client
                        </p>
                        <p className="mt-1 text-[11px] text-gray-500 italic">
                            J'ai lu, compris et j'approuve les termes du présent
                            contrat.
                        </p>
                        <div className="mt-2 h-24 rounded border border-gray-300" />
                        <p className="mt-2 text-xs text-gray-500">
                            {text(primary_client?.full_name)}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ReservationInvoice
