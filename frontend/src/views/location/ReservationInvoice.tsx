import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { LiChevronLeft, LiPrinter } from '@/icons'
import { apiGetReservationContract } from '@/services/LocationService'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { formatDate, formatDateTime } from './shared'
import type { Client, ReservationContract } from '@/@types/location'
import './ReservationInvoice.css'

/**
 * Printable "Contrat de location" for a reservation, mirroring the
 * Sevenhorses template (resources/views/contracts/contrat-location.html).
 * Two A4 portrait pages: the rental form + the 12 general conditions.
 */

const EMPTY = ''

const txt = (value: string | number | null | undefined): string =>
    value === null || value === undefined || value === ''
        ? EMPTY
        : String(value)

/** Plain amount used next to the "DH" suffix printed on the document. */
const amount = (value: number | null | undefined): string =>
    value === null || value === undefined
        ? EMPTY
        : Number(value).toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })

const kms = (value: number | null | undefined): string =>
    value === null || value === undefined
        ? EMPTY
        : `${Number(value).toLocaleString('fr-FR')} km`

const datePart = (
    value: string | null | undefined,
    unit: 'DD' | 'MM' | 'YYYY',
): string => (value ? dayjs(value).format(unit) : EMPTY)

const timePart = (value: string | null | undefined): string =>
    value ? dayjs(value).format('HH:mm') : EMPTY

const splitName = (full: string | null | undefined) => {
    if (!full) {
        return { nom: EMPTY, prenom: EMPTY }
    }
    const parts = full.trim().split(/\s+/)
    if (parts.length === 1) {
        return { nom: parts[0], prenom: EMPTY }
    }
    return {
        prenom: parts.slice(0, -1).join(' '),
        nom: parts[parts.length - 1],
    }
}

const methodLabel: Record<string, string> = {
    cash: 'Espèces',
    card: 'Carte',
    transfer: 'Virement',
}

type DriverFields = {
    nom: string
    prenom: string
    naissance: string
    lieuNaissance: string
    adresse: string
    telephone: string
    permis: string
    permisDelivreLe: string
    permisDelivreA: string
    passeport: string
    passeportDelivreLe: string
    passeportDelivreA: string
    cin: string
    cinValable: string
    entreeMaroc: string
}

const buildDriver = (
    client: Client | null,
    fallback: {
        name: string | null
        phone: string | null
        cin: string | null
        passport: string | null
        license: string | null
    },
): DriverFields => {
    const split = splitName(fallback.name)

    return {
        nom: txt(client?.last_name) || split.nom,
        prenom: txt(client?.first_name) || split.prenom,
        naissance: client?.birth_date ? formatDate(client.birth_date) : EMPTY,
        lieuNaissance: txt(client?.birth_place),
        adresse:
            [client?.address, client?.city, client?.country]
                .filter(Boolean)
                .join(', ') || EMPTY,
        telephone: txt(client?.phone) || txt(fallback.phone),
        permis: txt(client?.driving_license_number) || txt(fallback.license),
        permisDelivreLe: EMPTY,
        permisDelivreA: EMPTY,
        passeport: txt(client?.passport_number) || txt(fallback.passport),
        passeportDelivreLe: EMPTY,
        passeportDelivreA: EMPTY,
        cin: txt(client?.cin) || txt(fallback.cin),
        cinValable: EMPTY,
        entreeMaroc: EMPTY,
    }
}

const DriverCell = ({ driver }: { driver: DriverFields }) => (
    <td>
        <div className="field-block">
            <div className="field-row">
                <span className="fl">Nom</span>
                <div className="fd">{driver.nom}</div>
            </div>
            <div className="field-row">
                <span className="fl">Prénom</span>
                <div className="fd">{driver.prenom}</div>
            </div>
            <div className="field-row-split">
                <div className="fhalf">
                    <span className="fl">Né(e) le</span>
                    <div className="fd">{driver.naissance}</div>
                </div>
                <div className="fhalf">
                    <span className="fl">à</span>
                    <div className="fd">{driver.lieuNaissance}</div>
                </div>
            </div>
            <div className="field-row">
                <span className="fl">Adresse du maroc</span>
                <div className="fd">{driver.adresse}</div>
            </div>
            <div
                className="field-row"
                style={{ borderBottom: '1pt dotted #aaa', height: '3mm' }}
            />
            <div className="field-row">
                <span className="fl">Téléphone</span>
                <div className="fd">{driver.telephone}</div>
            </div>
            <div className="field-row">
                <span className="fl">Permis de conduire N°</span>
                <div className="fd">{driver.permis}</div>
            </div>
            <div className="field-row-split">
                <div className="fhalf">
                    <span className="fl">Délivré le</span>
                    <div className="fd">{driver.permisDelivreLe}</div>
                </div>
                <div className="fhalf">
                    <span className="fl">à</span>
                    <div className="fd">{driver.permisDelivreA}</div>
                </div>
            </div>
            <div className="field-row">
                <span className="fl">Passeport</span>
                <div className="fd">{driver.passeport}</div>
            </div>
            <div className="field-row-split">
                <div className="fhalf">
                    <span className="fl">Délivré le</span>
                    <div className="fd">{driver.passeportDelivreLe}</div>
                </div>
                <div className="fhalf">
                    <span className="fl">à</span>
                    <div className="fd">{driver.passeportDelivreA}</div>
                </div>
            </div>
            <div className="field-row">
                <span className="fl">CIN N°</span>
                <div className="fd">{driver.cin}</div>
            </div>
            <div className="field-row">
                <span className="fl">Valable jusqu'au</span>
                <div className="fd">{driver.cinValable}</div>
            </div>
            <div className="field-row">
                <span className="fl">Numéro et date d'entrée au maroc</span>
                <div className="fd">{driver.entreeMaroc}</div>
            </div>
        </div>
    </td>
)

const CONDITIONS: Array<{ num: string; body: string }> = [
    {
        num: 'Article 1 : UTILISATION DE LA VOITURE :',
        body: "Le locataire s'engage à ne pas laisser conduire la voiture par d'autres personnes que lui-même ou celles agrées par le loueur et dont il se porte garant, et à n'utiliser le véhicule que pour ses besoins personnels. Il est interdit de participer à toute compétition quelle que soit, et d'utiliser le véhicule à des fins illicites ou des transports des marchandises. Le locataire s'engage à ne pas solliciter directement des documents douaniers. Il est interdit au locataire de surcharger le véhicule loué en transportant un nombre de passagers supérieur à celui porté sur le contrat, sous peine d'être déchu de l'assurance.",
    },
    {
        num: "Article 2 : PAS D'ANNULATION :",
        body: "Pas de remboursement en cas de problèmes personnels ni pour l'essence ; tout ce qui est pneumatique est à la charge du client ; les voitures doivent être garées dans les Parking payants avec gardiens. Vol de pneu de secours à la charge du CLIENT. Le procès d'excès de Vitesse est à la charge du client.",
    },
    {
        num: 'Article 3 : ESSENCE ET HUILE :',
        body: "L'essence est à la charge du client. Le locataire doit vérifier en permanence les niveaux d'huile et d'eau, et vérifier les niveaux de la boite de vitesse et du pont arrière tous les 1000 km. Il justifiera de ces travaux par des factures correspondantes (qui lui seront remboursées) sous peine d'avoir à payer une indemnité anormale.",
    },
    {
        num: 'Article 4 : ENTRETIEN ET REPARATION :',
        body: "L'usure mécanique normale est à la charge du loueur. Toutes les réparations provenant, soit d'une usure normale, soit d'une négligence de la part du locataire ou d'une cause accidentelle, seront à sa charge et exécutées par nos soins. Dans le cas où le véhicule serait immobilisé en dehors de la région, les réparations qu'elles soient dues à l'usure normale ou à une cause accidentelle, ne seront exécutées qu'après accord télégraphique du loueur ou par l'agent régional de la marque du véhicule. Elles devront faire l'objet d'une facture acquittée. En aucun cas et en aucune circonstance, le locataire ne pourra réclamer des dommages et intérêts, soit par retard de la remise de la voiture, ou annulation de la location, soit pour immobilisation dans le cas de réparations nécessaires par l'usure normale et effectuées au cours de la location. La responsabilité du loueur ne pourra jamais être invoquée, même en cas d'accidents de personnes ou de choses ayant résulté de vices ou de défauts de construction ou de réparation antérieures.",
    },
    {
        num: 'Article 5 : ASSURANCE :',
        body: "Le locataire est garanti pour les risques suivants : 1. Pour une somme illimitée pour les accidents qu'il peut causer aux tiers, y compris ceux transportés à titre gracieux. 2. Contre le vol et l'incendie de véhicule loué, à l'exclusion des vêtements et de tous les objets transportés. 3. Les frais de rapatriement et d'immobilisation restent toujours à la charge du locataire, quelque soit la formule d'assurance contractée. 4. Le locataire s'engage à déclarer au loueur, dans les 48 heures et immédiatement aux autorités de police, tout accident, vol ou incendie, même partiel sous peine d'être déchu du bénéfice de l'assurance.",
    },
    {
        num: 'Article 6 : LOCATION, CAUTION, PROLONGATION :',
        body: "Le prix de location, ainsi que la caution, sont déterminés par les tarifs en vigueur et payables d'avance. La caution ne pourra servir en aucun cas au loueur. Afin d'éviter toute contestation et pour le cas où le locataire voudrait conserver la voiture pour un temps supérieur à celui indiqué sur le contrat, il devra après avoir obtenu l'accord de s'exposer à des poursuites pour détournement de voiture ou abus de confiance. La journée de location compte de 0 heures à 24 heures et toute journée commencée est due en entier.",
    },
    {
        num: 'Article 7 : RAPATRIEMENT DE LA VOITURE :',
        body: "Le locataire est interdit formellement d'abandonner le véhicule. En cas d'impossibilité matérielle, celui-ci sera rapatrié aux frais et par les soins du locataire, la location restant due jusqu'au retour du véhicule.",
    },
    {
        num: 'Article 8 : PAPIERS DE LA VOITURE :',
        body: "Le locataire remettra dès la fin de la location et à la rentrée de la voiture, la carte grise et tous les papiers nécessaires à sa circulation, faute de quoi, ces pièces étant indispensables à de nouvelles locations, la location continuera à être facturée au prix initial jusqu'à remise à la société. En cas de perte de ces papiers, le locataire devra acquitter le montant des frais de duplicata.",
    },
    {
        num: 'Article 9 : RESPONSABILITE :',
        body: 'Le locataire demeure seul responsable des vols des pièces automobiles, amendes, contraventions et procès verbaux établis contre lui.',
    },
    {
        num: 'Article 10 : COMPETENCE :',
        body: "De convention expresse et en cas de contestation quelconque, le tribunal de Marrakech sera seul compétent, les frais de timbres et d'enregistrement restant à la charge du locataire.",
    },
    {
        num: "Article 11 : EN CAS D'ACCIDENT :",
        body: "Le client est tenu de faire un constat et de signer le PV, sinon les frais d'assurances sont à sa charge.",
    },
    {
        num: 'Article 12 : CONDITIONS POUR LES 4X4 :',
        body: "CHAQUE MATIN : chauffer le moteur 10 mn — vérifier l'eau, les huiles et les pneus — sur la route n'utilisez pas le crabotage — si vous êtes bloqué dans le sable : faire point mort et utiliser le crabotage en 4 roues motrices. Les 4x4 ne doivent pas passer dans les rivières ou sur les sables côtières. En cas d'accident sans justification (constat de police ou de gendarmerie avec n° de P.V) les dommages sont à la charge du client. La voiture est toujours à la charge de la personne sur le contrat de location. La voiture ne doit être laissée près de la plage ou la rivière ou dans les zones interdites.",
    },
]

const FALLBACK_ADDRESS =
    'Numéro 78, 2ème étage, Kissaria Al Jassim, Boulevard Mohamed V, Gueliz, Marrakech'

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

    // ── Company / letterhead ────────────────────────────────────────────
    const brandName = (agency?.name ?? 'Sevenhorses').trim()
    const brandParts = brandName.split(/\s+/)
    const brandFirst = brandParts[0] ?? brandName
    const brandRest = brandParts.slice(1).join(' ')
    const footerAddress = agency?.address?.trim() || FALLBACK_ADDRESS

    // ── Vehicle ─────────────────────────────────────────────────────────
    const marque = txt(car?.brand)
    const immatriculation =
        txt(car?.registration_number) ||
        txt(reservation.car?.registration_number)

    // ── Drivers ─────────────────────────────────────────────────────────
    const driver1 = buildDriver(primary_client, reservation.primary_driver)
    const driver2 = buildDriver(secondary_client, reservation.secondary_driver)

    // ── Duration ────────────────────────────────────────────────────────
    const pickup = reservation.pickup_datetime
    const dropoff = reservation.expected_return_datetime
    const depart = {
        j: datePart(pickup, 'DD'),
        m: datePart(pickup, 'MM'),
        a: datePart(pickup, 'YYYY'),
        label: formatDateTime(pickup),
    }
    const retour = {
        j: datePart(dropoff, 'DD'),
        m: datePart(dropoff, 'MM'),
        a: datePart(dropoff, 'YYYY'),
        label: formatDateTime(dropoff),
    }

    // ── Delivery / collection ───────────────────────────────────────────
    const livraisonLieu = txt(reservation.pickup_location)
    const recuperationLieu = txt(reservation.return_location)
    const livraisonHeure = timePart(pickup)
    const recuperationHeure = timePart(dropoff)

    // ── Pricing ─────────────────────────────────────────────────────────
    const prixJour = amount(reservation.daily_rate)
    const nbJours = txt(reservation.rental_days)
    const kmAdditionnel =
        mileage.extra_fee > 0 ? `${amount(mileage.extra_fee)} DH` : EMPTY

    // ── Financials ──────────────────────────────────────────────────────
    const netLocation = amount(reservation.subtotal)
    const fraisLivraison = EMPTY
    const tva = amount(reservation.tax_amount)
    const caution = amount(reservation.deposit_amount)
    const total = amount(reservation.total_amount)
    const modeReglement = payments[0]
        ? (methodLabel[payments[0].method] ?? txt(payments[0].method))
        : EMPTY

    // ── Inspection / signature ──────────────────────────────────────────
    const kmDepart = kms(reservation.pickup_mileage)
    const kmArrivee = kms(reservation.return_mileage)
    const faitLe = formatDate(
        reservation.created_at ?? new Date().toISOString(),
    )

    const footer = (
        <div className="footer">
            <span>{footerAddress}</span>
            <strong>Sevenhorses.ma</strong>
        </div>
    )

    return (
        <div className="min-h-screen overflow-x-auto bg-gray-100 px-4 py-6 print:overflow-visible print:bg-white print:p-0 dark:bg-gray-900">
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

            <div className="reservation-contract">
                {/* ═══════════════════════ PAGE 1 — CONTRAT ══════════════ */}
                <div className="page">
                    <div className="contract-header">
                        <div>
                            <div className="logo">
                                <span>{brandFirst}</span>
                                {brandRest ? ` ${brandRest}` : ''}
                                <sup>®</sup>
                            </div>
                            <div className="company-info">
                                <strong>
                                    {agency?.name ?? 'Ste Sevenhorses'}
                                </strong>
                                <br />
                                {agency?.phone ?? '+212 671-729098'}
                                <br />
                                {agency?.email ?? 'Contact@sevenhorses.ma'}
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="tagline">
                                Conduisez vers de
                                <br />
                                nouvelles expériences
                            </div>
                            <div className="contract-title">
                                Contrat de location
                            </div>
                        </div>
                    </div>

                    {/* VEHICLE BAND */}
                    <div className="vehicle-band">
                        <div className="vb-item">
                            <span className="vb-label">Marque :</span>
                            <div className="vb-dots">{marque}</div>
                        </div>
                        <div className="vb-sep" />
                        <div className="vb-item">
                            <span className="vb-label">
                                N° d'Immatriculation :
                            </span>
                            <div className="vb-dots">{immatriculation}</div>
                        </div>
                    </div>

                    <div className="section-title">Locataire</div>

                    {/* DRIVERS TABLE */}
                    <table className="driver-table">
                        <thead>
                            <tr>
                                <th>1er Conducteur</th>
                                <th>2ème Conducteur</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <DriverCell driver={driver1} />
                                <DriverCell driver={driver2} />
                            </tr>
                        </tbody>
                    </table>

                    {/* BOTTOM GRID */}
                    <div className="bottom-grid">
                        {/* LEFT COLUMN */}
                        <div className="col-left">
                            <table className="mini-table">
                                <thead>
                                    <tr>
                                        <th
                                            className="th-blank"
                                            style={{ width: '18%' }}
                                        />
                                        <th style={{ width: '11%' }}>J</th>
                                        <th style={{ width: '11%' }}>M</th>
                                        <th style={{ width: '16%' }}>A</th>
                                        <th>Durée de location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="row-label">Départ</td>
                                        <td>{depart.j}</td>
                                        <td>{depart.m}</td>
                                        <td>{depart.a}</td>
                                        <td className="td-left">
                                            {depart.label}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="row-label">Retour</td>
                                        <td>{retour.j}</td>
                                        <td>{retour.m}</td>
                                        <td>{retour.a}</td>
                                        <td className="td-left">
                                            {retour.label}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="mini-table">
                                <thead>
                                    <tr>
                                        <th
                                            className="th-blank"
                                            style={{ width: '26%' }}
                                        />
                                        <th>Lieu</th>
                                        <th style={{ width: '28%' }}>Heure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="row-label">Livraison</td>
                                        <td className="td-left">
                                            {livraisonLieu}
                                        </td>
                                        <td>{livraisonHeure}</td>
                                    </tr>
                                    <tr>
                                        <td className="row-label">
                                            Récupération
                                        </td>
                                        <td className="td-left">
                                            {recuperationLieu}
                                        </td>
                                        <td>{recuperationHeure}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="dotted-box">
                                <div className="dotted-row">
                                    <span className="line-lbl">
                                        Prix / jour (300 km / jr)
                                    </span>
                                    <div className="dotted-fill">
                                        {prixJour}
                                    </div>
                                </div>
                                <div className="dotted-row">
                                    <span className="line-lbl">
                                        Nombre de jours
                                    </span>
                                    <div className="dotted-fill">{nbJours}</div>
                                </div>
                                <div className="dotted-row">
                                    <span className="line-lbl">
                                        Kilométrage additionnel (1dh / km)
                                    </span>
                                    <div className="dotted-fill">
                                        {kmAdditionnel}
                                    </div>
                                </div>
                            </div>

                            <div className="dotted-box">
                                <div className="dotted-row">
                                    <span className="line-lbl">
                                        Net location
                                    </span>
                                    <div className="dotted-fill">
                                        {netLocation}
                                    </div>
                                    <span className="dotted-dh">DH</span>
                                </div>
                                <div className="dotted-row">
                                    <span className="line-lbl">
                                        Frais de livraison / Reprise
                                    </span>
                                    <div className="dotted-fill">
                                        {fraisLivraison}
                                    </div>
                                    <span className="dotted-dh">DH</span>
                                </div>
                                <div className="dotted-row">
                                    <span className="line-lbl">TVA 20%</span>
                                    <div className="dotted-fill">{tva}</div>
                                    <span className="dotted-dh">DH</span>
                                </div>
                                <div className="dotted-row">
                                    <span className="line-lbl">Caution</span>
                                    <div className="dotted-fill">{caution}</div>
                                    <span className="dotted-dh">DH</span>
                                </div>
                            </div>

                            <div className="total-box">
                                <div className="total-row">
                                    <span className="total-lbl">
                                        Total Général
                                    </span>
                                    <div className="total-fill">{total}</div>
                                    <span className="total-dh">DH</span>
                                </div>
                                <div className="total-row">
                                    <span className="total-lbl">
                                        Mode de règlement
                                    </span>
                                    <div className="total-fill">
                                        {modeReglement}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="col-right">
                            <div className="right-image-container">
                                <div className="image-border-wrapper">
                                    <img
                                        src="/imageCar.png"
                                        alt="Contract visual / diagramme"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="total-box">
                                <div className="total-row">
                                    <span className="total-lbl">Km départ</span>
                                    <div className="total-fill">{kmDepart}</div>
                                </div>
                                <div className="total-row">
                                    <span className="total-lbl">
                                        Km arrivée
                                    </span>
                                    <div className="total-fill">
                                        {kmArrivee}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="legal">
                        Le client est seul responsable des violations du code de
                        la route.
                        <br />
                        Je reconnais pris connaissance des conditions générales
                        de location
                        <br /> au verso et accepté de m'y confirmer.
                    </div>

                    <div className="sig-row">
                        <div className="sig-item">
                            <span className="sig-label">Fait le :</span>
                            <div className="sig-line">{faitLe}</div>
                        </div>
                        <div className="sig-item">
                            <span className="sig-label">Le locataire :</span>
                            <div className="sig-line" />
                        </div>
                    </div>

                    {footer}
                </div>

                {/* ═══════════════════ PAGE 2 — CONDITIONS ══════════════ */}
                <div className="page">
                    <div className="cond-title">
                        CONDITIONS GENERALES DE LOCATION
                    </div>

                    <p className="cond-intro">
                        Le présent contrat a été établi et prend date comme
                        indiqué au verso. Il engage l'agence qui sera appelée «
                        le loueur » et la personne, Société ou compagnie par qui
                        est signé ce contrat, qui sera dénommée « le locataire
                        ».
                    </p>

                    {CONDITIONS.map((condition) => (
                        <p className="article" key={condition.num}>
                            <span className="art-num">{condition.num}</span>{' '}
                            <span className="art-body">{condition.body}</span>
                        </p>
                    ))}

                    {footer}
                </div>
            </div>
        </div>
    )
}

export default ReservationInvoice
