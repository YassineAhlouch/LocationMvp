/**
 * Label/colour maps for the platform invoice view. Mirrors the reservation
 * and payment enums on the backend.
 */

export const paymentStatusMeta: Record<
    string,
    { label: string; className: string }
> = {
    paid: {
        label: 'Paid',
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100',
    },
    partial: {
        label: 'Partial',
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100',
    },
    unpaid: {
        label: 'Unpaid',
        className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
    },
}

export const reservationStatusMeta: Record<
    string,
    { label: string; className: string }
> = {
    pending: {
        label: 'Pending',
        className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
    },
    confirmed: {
        label: 'Confirmed',
        className:
            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100',
    },
    reserved: {
        label: 'Reserved',
        className:
            'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-100',
    },
    active: {
        label: 'Active',
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100',
    },
    completed: {
        label: 'Completed',
        className:
            'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-100',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-100',
    },
    no_show: {
        label: 'No show',
        className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-100',
    },
}

export const paymentMethodLabel: Record<string, string> = {
    cash: 'Cash',
    card: 'Card',
    transfer: 'Transfer',
}

export const paymentRecordStatusLabel: Record<string, string> = {
    paid: 'Paid',
    pending: 'Pending',
    refunded: 'Refunded',
}

/** Format an amount with the agency currency, falling back to DH. */
export const formatAmount = (
    value: number | null | undefined,
    currency: { symbol?: string; decimals?: number } | null | undefined,
): string => {
    if (value === null || value === undefined) {
        return '—'
    }

    const decimals = currency?.decimals ?? 2
    const symbol = currency?.symbol ?? 'DH'

    return `${value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })} ${symbol}`
}