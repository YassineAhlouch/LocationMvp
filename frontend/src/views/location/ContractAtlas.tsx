import dayjs from 'dayjs'
import type { Client, ReservationContract } from '@/@types/location'
import './ContractAtlas.css'

/**
 * Bilingual FR/AR "Atlas" rental contract, mirroring
 * resources/views/contracts/contrat2-location.html. A single white card
 * instead of the classic two-page letterhead; all values are pulled from the
 * reservation contract payload so any agency can print it.
 */

const EMPTY = ''

const txt = (value: string | number | null | undefined): string =>
    value === null || value === undefined || value === ''
        ? EMPTY
        : String(value)

const unit = (value: number | null | undefined, suffix: string): string =>
    value === null || value === undefined
        ? EMPTY
        : `${Number(value).toLocaleString('fr-FR')} ${suffix}`

const number = (value: number | null | undefined): string =>
    value === null || value === undefined
        ? EMPTY
        : Number(value).toLocaleString('fr-FR')

const amount = (value: number | null | undefined): string =>
    value === null || value === undefined
        ? EMPTY
        : `${Number(value).toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })} DH`

const date = (value: string | null | undefined): string =>
    value ? dayjs(value).format('DD/MM/YYYY') : EMPTY

const dateTime = (value: string | null | undefined): string =>
    value ? dayjs(value).format('DD/MM/YYYY HH:mm') : EMPTY

const time = (value: string | null | undefined): string =>
    value ? dayjs(value).format('HH:mm') : EMPTY

const fullName = (client: Client | null): string =>
    txt(client?.full_name) ||
    [client?.first_name, client?.last_name].filter(Boolean).join(' ')

const addressOf = (client: Client | null): string =>
    [client?.address, client?.city, client?.country].filter(Boolean).join(', ')

const fuelLevel = (value: number | null | undefined): string =>
    value === null || value === undefined ? '100%' : `${value}%`

const MainRow = ({
    label,
    value,
    ar,
}: {
    label: string
    value: string
    ar: string
}) => (
    <tr>
        <td className="fr-label">{label}</td>
        <td className="value">{value}</td>
        <td className="ar" lang="ar" dir="rtl">
            {ar}
        </td>
    </tr>
)

const SectionBar = ({ children }: { children: string }) => (
    <tr className="section-bar">
        <td colSpan={3} lang="ar" dir="rtl">
            {children}
        </td>
    </tr>
)

const ATLAS_FR_CONDITIONS = [
    "Le locataire doit être titulaire d'un permis de conduire depuis plus de deux ans.",
    'Une caution est exigée du locataire lors de la location.',
    "Le locataire s'engage à restituer le véhicule dans le même état et au moment fixés dans le présent contrat.",
    'En cas de dommage ou de rayure sur le véhicule, son montant est directement déduit du montant de la caution.',
    'En cas de perte des documents ou de la clé du véhicule, le locataire paie une pénalité de 2000 DH.',
    "Le locataire n'a pas le droit de réparer le véhicule sans l'autorisation de la société, quelle que soit la nature de la panne.",
    "Il est interdit au locataire de signer le constat à l'amiable avant la présence de l'expert.",
    "Il est interdit au locataire d'entrer à Melilla ; il assume l'entière responsabilité en cas de tentative.",
    "Il est interdit au locataire de laisser conduire le véhicule par d'autres personnes dont les noms ne figurent pas dans le présent contrat.",
]

const ATLAS_AR_CONDITIONS = [
    'يجب على المكتري أن يتوفر على رخصة السياقة أكثر من سنتين.',
    'عند الكراء يشترط على المكتري دفع ضمانة.',
    'يلتزم المكتري بإرجاع السيارة في نفس الحالة والوقت المحددين في هذه العقدة.',
    'في حالة حدوث عطب أو خدش للسيارة، تخصم قيمته مباشرة من مبلغ الضمانة.',
    'في حالة ضياع أوراق أو مفتاح السيارة، يؤدي المكتري غرامة تقدر بـ 2000 درهم.',
    'لا يحق للمكتري إصلاح السيارة دون اذن الشركة كيفما كان نوع العطب.',
    'يمنع على المكتري إمضاء المعاينة الودية قبل حضور الخبير.',
    'يمنع على المكتري دخول مليلية ويتحمل المسؤولية كاملة من حاول القيام بذلك.',
    'يمنع على المكتري السماح لأشخاص آخرين بقيادة السيارة إذا لم تكن أسماؤهم مذكورة في هذا العقد.',
]

const ContractAtlas = ({ contract }: { contract: ReservationContract }) => {
    const {
        reservation,
        agency,
        car,
        primary_client,
        secondary_client,
        mileage,
    } = contract

    const agencyName = (agency?.name ?? '').trim()
    const vehicleName = [txt(car?.brand), txt(car?.model)]
        .filter(Boolean)
        .join(' ')
    const registration = txt(car?.registration_number)
    const vehicle = registration
        ? `${vehicleName} (${registration})`
        : vehicleName

    const clientName = fullName(primary_client)
    const secondaryName = fullName(secondary_client)

    return (
        <div className="atlas-contract page">
            {/* <div className="badge">{badge}</div> */}

            {/* ── Header ── */}
            <div className="head">
                <h1>{agencyName || 'Atlas Car Location'}</h1>
                <div className="sub" lang="ar" dir="rtl">
                    وكالة تأجير السيارات - Agence de Location de Voiture
                </div>
            </div>

            {/* ── Main table ── */}
            <table>
                <colgroup>
                    <col style={{ width: '23%' }} />
                    <col style={{ width: '54%' }} />
                    <col style={{ width: '23%' }} />
                </colgroup>
                <tbody>
                    <tr className="contract-row">
                        <td className="fr-label">CONTRAT N°</td>
                        <td className="value">
                            {txt(reservation.reservation_number)}
                        </td>
                        <td className="ar" lang="ar" dir="rtl">
                            عـقـد الكراء رقم
                        </td>
                    </tr>
                    <MainRow
                        label="Locataire"
                        value={clientName}
                        ar="المكتري"
                    />
                    <MainRow
                        label="Adresse Perso"
                        value={addressOf(primary_client)}
                        ar="العنوان الشخصي"
                    />
                    <MainRow
                        label="Tel. Perso"
                        value={txt(primary_client?.phone)}
                        ar="الهاتف الشخصي"
                    />
                    <MainRow
                        label="N° CIN"
                        value={txt(primary_client?.cin)}
                        ar="رقم البطاقة الوطنية"
                    />
                    <MainRow
                        label="N° CE"
                        value={EMPTY}
                        ar="رقم بطاقة الإقامة"
                    />
                    <MainRow
                        label="N° Passeport"
                        value={txt(primary_client?.passport_number)}
                        ar="رقم جواز السفر"
                    />
                    <MainRow
                        label="N° Permis"
                        value={txt(primary_client?.driving_license_number)}
                        ar="رقم رخصة السياقة"
                    />
                    <MainRow
                        label="Validité Permis"
                        value={EMPTY}
                        ar="صلاحية الرخصة"
                    />
                    <MainRow label="Délivré à" value="" ar="مكان التسليم" />

                    <SectionBar>السائق الآخر - Autre Conducteur</SectionBar>
                    <MainRow
                        label="Nom et Prénom"
                        value={secondaryName}
                        ar="الإسم والنسب"
                    />
                    <MainRow
                        label="N° CIN"
                        value={txt(secondary_client?.cin)}
                        ar="رقم البطاقة الوطنية"
                    />
                    <MainRow
                        label="Adresse Perso"
                        value={addressOf(secondary_client)}
                        ar="العنوان الشخصي"
                    />
                    <MainRow
                        label="N° Permis"
                        value={txt(secondary_client?.driving_license_number)}
                        ar="رقم رخصة السياقة"
                    />
                    <MainRow
                        label="Validité Permis"
                        value={EMPTY}
                        ar="صلاحية الرخصة"
                    />

                    <SectionBar>
                        معلومات السيارة - Informations du Véhicule
                    </SectionBar>
                    <MainRow label="Véhicule" value={vehicle} ar="السيارة" />
                </tbody>
            </table>

            {/* ── Vehicle condition table ── */}
            <table className="cond-tbl">
                <colgroup>
                    <col style={{ width: '16.66%' }} />
                    <col style={{ width: '16.66%' }} />
                    <col style={{ width: '16.66%' }} />
                    <col style={{ width: '16.66%' }} />
                    <col style={{ width: '16.66%' }} />
                    <col style={{ width: '16.7%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>
                            <span className="h-fr">Kilométrage</span>
                            <span className="h-ar" lang="ar" dir="rtl">
                                عداد المسافة
                            </span>
                        </th>
                        <th>
                            <span className="h-fr">Lavage</span>
                            <span className="h-ar" lang="ar" dir="rtl">
                                الغسيل
                            </span>
                        </th>
                        <th>
                            <span className="h-fr">Poste Radio</span>
                            <span className="h-ar" lang="ar" dir="rtl">
                                الراديو
                            </span>
                        </th>
                        <th>
                            <span className="h-fr">Carburant</span>
                            <span className="h-ar" lang="ar" dir="rtl">
                                الوقود
                            </span>
                        </th>
                        <th>
                            <span className="h-fr">Roue &amp; Secours</span>
                            <span className="h-ar" lang="ar" dir="rtl">
                                عجلة احتياطية
                            </span>
                        </th>
                        <th>
                            <span className="h-fr">Date</span>
                            <span className="h-ar" lang="ar" dir="rtl">
                                التاريخ
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{number(reservation.pickup_mileage)}</td>
                        <td>OUI</td>
                        <td>OUI</td>
                        <td>{fuelLevel(reservation.pickup_fuel_level)}</td>
                        <td>OUI</td>
                        <td className="last">
                            Livraison
                            <br />
                            {date(reservation.pickup_datetime)}
                        </td>
                    </tr>
                    <tr>
                        <td>{number(reservation.return_mileage)}</td>
                        <td>OUI</td>
                        <td>OUI</td>
                        <td>{fuelLevel(reservation.return_fuel_level)}</td>
                        <td>OUI</td>
                        <td className="last">
                            Réception
                            <br />
                            {date(
                                reservation.actual_return_datetime ??
                                    reservation.expected_return_datetime,
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ── Rental info ── */}
            <table>
                <colgroup>
                    <col style={{ width: '23%' }} />
                    <col style={{ width: '54%' }} />
                    <col style={{ width: '23%' }} />
                </colgroup>
                <tbody>
                    <SectionBar>
                        معلومات الكراء - Informations de la location
                    </SectionBar>
                    <MainRow
                        label="Date de Sortie"
                        value={dateTime(reservation.pickup_datetime)}
                        ar="تاريخ الاستلام"
                    />
                    <MainRow
                        label="Date d'Entrée"
                        value={dateTime(reservation.expected_return_datetime)}
                        ar="تاريخ الإرجاع"
                    />
                    <MainRow
                        label="Nombre de jours"
                        value={txt(reservation.rental_days)}
                        ar="عدد الأيام"
                    />
                    <MainRow
                        label="Distance parcourue"
                        value={unit(mileage.distance, 'km')}
                        ar="المسافة المقطوعة"
                    />
                    <MainRow
                        label={`Km inclus (${mileage.daily_allowance}/jour)`}
                        value={unit(mileage.allowance, 'km')}
                        ar="الكيلومترات المشمولة"
                    />
                    <MainRow
                        label="Km supplémentaire"
                        value={unit(mileage.excess, 'km')}
                        ar="كيلومترات إضافية"
                    />
                    <tr className="red-row">
                        <td className="fr-label">
                            Frais km supp. ({mileage.fee_per_km} DH/km)
                        </td>
                        <td className="value">{amount(mileage.extra_fee)}</td>
                        <td className="ar" lang="ar" dir="rtl">
                            رسوم الكيلومترات الإضافية
                        </td>
                    </tr>
                    <MainRow
                        label="Montant Total"
                        value={amount(reservation.total_amount)}
                        ar="المبلغ الإجمالي"
                    />
                </tbody>
            </table>

            {/* ── Conditions ── */}
            <div className="cond-box">
                <div className="cond-col left">
                    <div className="cond-title">CONDITIONS GÉNÉRALES</div>
                    {ATLAS_FR_CONDITIONS.map((line) => (
                        <p key={line}>* {line}</p>
                    ))}
                </div>
                <div className="cond-col right" lang="ar" dir="rtl">
                    <div className="cond-title">شــروط عـامـــة</div>
                    {ATLAS_AR_CONDITIONS.map((line) => (
                        <p key={line}>* {line}</p>
                    ))}
                </div>
            </div>

            {/* ── Agreement ── */}
            <div className="agreement">
                J'ai lu, compris et j'approuve les termes du présent contrat.
                <span className="ar" lang="ar" dir="rtl">
                    لقد اطلعت وفهمت ووافقت على شروط الكراء المحددة في هذا العقد.
                </span>
            </div>

            {/* ── Signatures ── */}
            <div className="signs">
                <div className="sign-side">
                    <div className="sig-box" />
                    <div className="cap">
                        Signature ·{' '}
                        <span lang="ar" dir="rtl">
                            توقيع وكاشي الوكالة
                        </span>
                    </div>
                    <div className="cap-line">loueur</div>
                </div>

                <img
                    className="cars"
                    src="/img/invoice/cardiagram-clio.jpg"
                    alt="Schéma du véhicule"
                />

                <div className="sign-side">
                    <div className="sig-box" />
                    <div className="cap">
                        Signature client ·{' '}
                        <span lang="ar" dir="rtl">
                            توقيع المكتري
                        </span>
                    </div>
                    <div className="cap-line">
                        {time(reservation.pickup_datetime)}
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="foot">
                {[
                    agency?.address?.trim(),
                    agency?.email ? `EMAIL: ${agency.email}` : null,
                    agency?.phone ? `TEL: ${agency.phone}` : null,
                ]
                    .filter(Boolean)
                    .join(' · ')}
            </div>
        </div>
    )
}

export default ContractAtlas
