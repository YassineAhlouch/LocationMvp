import dayjs from 'dayjs'
import type { ActivityLog } from '@/@types/location'
import { MAD } from './shared'
import type { Translator } from './shared'

/**
 * Turns an audit entry's frozen payload into a human sentence, e.g.
 * "Ikram Bakhti a modifié : Statut : En attente → Confirmée (Réservation #3282)".
 *
 * The backend stores only raw field values, so the wording, field labels and
 * value labels all live here — which keeps the log readable in whatever
 * language the viewer has selected, now or years from now.
 */

/** Internal keys that add noise (or a secret) rather than meaning. */
const SKIPPED_FIELDS = new Set([
    'id',
    'agency_id',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'approved_by',
    'password',
])

/** Fields that should render as money. */
const AMOUNT_FIELDS = new Set([
    'daily_price',
    'purchase_price',
    'daily_rate',
    'subtotal',
    'tax_amount',
    'discount_amount',
    'deposit_amount',
    'total_amount',
    'amount',
    'paid_amount',
    'financed_amount',
    'installment_amount',
    'down_payment',
])

/** Fields that should render as a date. */
const DATE_FIELDS = new Set([
    'birth_date',
    'driving_license_expiry',
    'insurance_expiry_date',
    'technical_inspection_expiry',
    'purchase_date',
    'starts_on',
    'ends_on',
    'start_date',
    'due_date',
    'paid_date',
    'first_due_date',
])

/** Fields that should render as a date and time. */
const DATETIME_FIELDS = new Set([
    'pickup_datetime',
    'expected_return_datetime',
    'actual_return_datetime',
    'last_maintenance_at',
    'last_login_at',
])

/** Where a `status` value's labels live, per audit module. */
const STATUS_BASES: Record<string, string> = {
    reservations: 'reservations.status',
    payments: 'payments.status',
    expenses: 'expenses.status',
    users: 'users.status',
    clients: 'clients.statusOption',
    fleet: 'cars.status',
    financing: 'expenses.status',
}

/** Modules whose "entity" is the actor, so the `#id` suffix adds nothing. */
const NO_ENTITY_REF = new Set(['auth', 'notifications'])

/**
 * The handful of fields worth showing when a whole entity is born or removed.
 * Without this a created row would dump every column it owns.
 */
const ENTITY_SUMMARIES: Record<string, string[]> = {
    Reservation: [
        'reservation_number',
        'status',
        'payment_status',
        'total_amount',
        'pickup_datetime',
        'expected_return_datetime',
    ],
    Client: ['first_name', 'last_name', 'phone', 'email', 'city', 'status'],
    Car: ['registration_number', 'brand_id', 'model_id', 'year', 'daily_price', 'status'],
    User: ['first_name', 'last_name', 'email', 'phone', 'role_id', 'is_active'],
    Role: ['name', 'description', 'is_active'],
    Payment: ['amount', 'method', 'status', 'reference'],
    CarExpense: ['type', 'title', 'amount', 'vendor', 'status', 'due_date'],
    PricingRule: [
        'name',
        'rule_type',
        'adjustment_type',
        'adjustment_value',
        'starts_on',
        'ends_on',
        'is_active',
    ],
    CarFinancing: [
        'lender',
        'purchase_price',
        'down_payment',
        'financed_amount',
        'installment_amount',
        'installments_count',
        'first_due_date',
    ],
    CarInstallment: [
        'installment_number',
        'due_date',
        'amount',
        'paid_amount',
        'paid_date',
        'status',
        'reference',
    ],
    Brand: ['name'],
    CarModel: ['name', 'brand_id'],
    CarCategory: ['name'],
}

export type ActivityChange = {
    field: string
    label: string
    from: string | null
    to: string | null
}

/** `App\Models\Reservation` → `Reservation`. */
export const entityShortName = (entityType: string) =>
    entityType.split('\\').pop() ?? entityType

const humanize = (key: string) =>
    key
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, (character) => character.toUpperCase())

const fieldLabel = (t: Translator, field: string) =>
    t(`activity.field.${field}`, humanize(field))

const formatDateTime = (value: string) =>
    dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm') : value

const formatDate = (value: string) =>
    dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY') : value

const formatValue = (
    t: Translator,
    module: string,
    field: string,
    value: unknown,
): string => {
    if (value === null || value === undefined || value === '') {
        return '—'
    }

    if (typeof value === 'boolean') {
        return value ? t('activity.yes', 'Yes') : t('activity.no', 'No')
    }

    if (Array.isArray(value)) {
        if (field === 'permissions') {
            return t('activity.permissionCount', '{{n}} permissions', {
                n: value.length,
            })
        }

        return value.map((item) => String(item)).join(', ')
    }

    if (typeof value === 'object') {
        return JSON.stringify(value)
    }

    const raw = String(value)

    if (field === 'is_active') {
        return ['1', 'true'].includes(raw.toLowerCase())
            ? t('activity.yes', 'Yes')
            : t('activity.no', 'No')
    }

    if (field === 'status' || field === 'payment_status') {
        const base =
            field === 'payment_status'
                ? 'reservations.payment'
                : STATUS_BASES[module]

        if (base) {
            return t(`${base}.${raw}`, raw)
        }
    }

    if (field === 'method') {
        return t(`payments.method.${raw}`, raw)
    }

    if (field === 'type' && module === 'expenses') {
        return t(`expenses.type.${raw}`, raw)
    }

    if (field === 'fuel_type') {
        return t(`cars.fuel.${raw}`, raw)
    }

    if (field === 'transmission_type') {
        return t(`cars.transmission.${raw}`, raw)
    }

    if (field === 'rule_type') {
        return t(`activity.value.ruleType.${raw}`, raw)
    }

    if (field === 'adjustment_type') {
        return t(`activity.value.adjustmentType.${raw}`, raw)
    }

    if (DATETIME_FIELDS.has(field)) {
        return formatDateTime(raw)
    }

    if (DATE_FIELDS.has(field)) {
        return formatDate(raw)
    }

    if (AMOUNT_FIELDS.has(field) && raw.trim() !== '' && !Number.isNaN(Number(raw))) {
        return MAD(Number(raw))
    }

    return raw
}

const isSameValue = (a: unknown, b: unknown): boolean => {
    if (a === b) {
        return true
    }

    if (a === null || a === undefined || b === null || b === undefined) {
        return (a ?? null) === (b ?? null)
    }

    if (typeof a === 'object' || typeof b === 'object') {
        return JSON.stringify(a) === JSON.stringify(b)
    }

    return String(a) === String(b)
}

const isPresent = (value: unknown) =>
    value !== null && value !== undefined && value !== ''

/**
 * Every field that moved in an entry, already labelled and humanised.
 *
 * - updates: the fields whose value differs between `old_values` and `new_values`
 * - creations: `new_values` (curated to `ENTITY_SUMMARIES` when `summary` is set)
 * - deletions: `old_values`
 */
export const activityChanges = (
    log: ActivityLog,
    t: Translator,
    options: { summary?: boolean } = {},
): ActivityChange[] => {
    const oldValues = log.old_values ?? null
    const newValues = log.new_values ?? null

    const make = (
        field: string,
        from: unknown,
        to: unknown,
    ): ActivityChange => ({
        field,
        label: fieldLabel(t, field),
        from: from === undefined ? null : formatValue(t, log.module, field, from),
        to: to === undefined ? null : formatValue(t, log.module, field, to),
    })

    const changedBetween = (
        field: string,
        before: unknown,
        after: unknown,
    ): boolean => {
        if (isSameValue(before, after)) {
            return false
        }

        // Arrays render as a summary (e.g. a permission count), so compare them
        // raw — otherwise two different permission sets of equal size hide.
        if (Array.isArray(before) || Array.isArray(after)) {
            return true
        }

        // Two stored spellings of one value ("200.00" vs "200", or a timestamp
        // with and without seconds) are not a change worth showing.
        return (
            formatValue(t, log.module, field, before) !==
            formatValue(t, log.module, field, after)
        )
    }

    if (oldValues && newValues) {
        const keys = new Set([...Object.keys(newValues), ...Object.keys(oldValues)])

        return [...keys]
            .filter((key) => !SKIPPED_FIELDS.has(key))
            .filter((key) => changedBetween(key, oldValues[key], newValues[key]))
            .map((key) => make(key, oldValues[key], newValues[key]))
    }

    const source = newValues ?? oldValues ?? {}
    const isCreation = newValues !== null
    const summaryFields = ENTITY_SUMMARIES[entityShortName(log.entity_type)]

    const matchedSummary =
        options.summary && summaryFields
            ? summaryFields.filter((key) => key in source && isPresent(source[key]))
            : []

    // Entries whose entity is really the actor (e.g. a sent announcement) match
    // none of the entity summary fields, so fall back to everything on the row.
    const keys =
        matchedSummary.length > 0
            ? matchedSummary
            : Object.keys(source).filter((key) => !SKIPPED_FIELDS.has(key))

    return keys.map((key) =>
        isCreation ? make(key, undefined, source[key]) : make(key, source[key], undefined),
    )
}

/** The reason a call site tacked onto the backend description, if any. */
const reasonFromDescription = (description: string | null): string | null => {
    if (!description) {
        return null
    }

    const separator = description.lastIndexOf(' — ')

    if (separator === -1) {
        return null
    }

    const reason = description.slice(separator + 3).trim()

    return reason.length > 0 ? reason : null
}

export const entityReference = (t: Translator, log: ActivityLog): string => {
    const entity = t(
        `activity.entity.${entityShortName(log.entity_type)}`,
        entityShortName(log.entity_type),
    )

    return t('activity.entityRef', '{{entity}} #{{id}}', {
        entity,
        id: log.entity_id,
    })
}

/** One field's before/after (or single value) rendered for a detail block. */
export const describeChange = (change: ActivityChange): string => {
    if (change.from !== null && change.to !== null) {
        return `${change.from} → ${change.to}`
    }

    return change.to ?? change.from ?? '—'
}

/** The full human sentence shown in the list, timeline and drawer. */
export const describeActivity = (t: Translator, log: ActivityLog): string => {
    const user = log.user?.full_name ?? t('activity.system', 'System')
    const verb = t(`activity.verb.${log.action}`, log.action)
    const isUpdate = Boolean(log.old_values && log.new_values)

    const changes = activityChanges(log, t, { summary: !isUpdate })
    const rendered = changes.map((change) => {
        if (change.from !== null && change.to !== null) {
            return `${change.label}: ${change.from} → ${change.to}`
        }

        return `${change.label}: ${change.to ?? change.from ?? '—'}`
    })

    let sentence = `${user} ${verb}`

    if (rendered.length > 0) {
        sentence += ` : ${rendered.join(', ')}`
    }

    const reason = reasonFromDescription(log.description)

    if (reason) {
        sentence += ` — ${t('activity.reason', 'Reason')}: ${reason}`
    }

    if (!NO_ENTITY_REF.has(log.module) && log.entity_id !== null) {
        sentence += ` (${entityReference(t, log)})`
    }

    return sentence
}
