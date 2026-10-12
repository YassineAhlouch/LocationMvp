import type { PaymentStatus } from '@/@types/platform'

/**
 * Label/colour maps for platform subscription invoices. `status` is derived
 * on the backend from paid_at/due_date, so it can never drift.
 */
export const paymentStatusMeta: Record<
    PaymentStatus,
    { label: string; className: string }
> = {
    paid: {
        label: 'Paid',
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100',
    },
    pending: {
        label: 'Pending',
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100',
    },
    overdue: {
        label: 'Overdue',
        className:
            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-100',
    },
}

export const paymentStatusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Paid', value: 'paid' },
]
