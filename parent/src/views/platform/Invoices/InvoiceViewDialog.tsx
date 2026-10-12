import { Button, Dialog } from '@/components/ui'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import {
    formatAmount,
    paymentMethodLabel,
    paymentRecordStatusLabel,
    paymentStatusMeta,
    reservationStatusMeta,
} from './status'
import type { PlatformInvoice } from '@/@types/platform'

type InvoiceViewDialogProps = {
    invoice: PlatformInvoice | null
    onClose: () => void
}

/**
 * Printable-ish invoice view: tenant header, client, vehicle, the charge
 * breakdown (line items, discount, tax, deposit) and the payment ledger with
 * the resulting balance.
 */
const InvoiceViewDialog = ({ invoice, onClose }: InvoiceViewDialogProps) => {
    const currency = invoice?.agency.currency ?? null
    const paymentStatus = paymentStatusMeta[invoice?.payment_status ?? ''] ?? {
        label: invoice?.payment_status ?? '—',
        className: 'bg-gray-100 text-gray-600',
    }
    const reservationStatus =
        reservationStatusMeta[invoice?.status ?? ''] ?? {
            label: invoice?.status ?? '—',
            className: 'bg-gray-100 text-gray-600',
        }

    const client = invoice?.primary_client

    const rows: Array<{ label: string; value: string }> = invoice
        ? [
              {
                  label: 'Rental',
                  value: `${invoice.daily_rate.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                  })} ${currency?.symbol ?? 'DH'} × ${invoice.rental_days} day${
                      invoice.rental_days === 1 ? '' : 's'
                  }`,
              },
              {
                  label: 'Subtotal',
                  value: formatAmount(invoice.subtotal, currency),
              },
              ...invoice.extras.map((extra) => ({
                  label: extra.name,
                  value: formatAmount(extra.total_price, currency),
              })),
              ...(invoice.discount_amount > 0
                  ? [
                        {
                            label: `Discount${invoice.discount_reason ? ` (${invoice.discount_reason})` : ''}`,
                            value: `− ${formatAmount(invoice.discount_amount, currency)}`,
                        },
                    ]
                  : []),
              ...(invoice.tax_amount > 0
                  ? [
                        {
                            label: 'Tax',
                            value: formatAmount(invoice.tax_amount, currency),
                        },
                    ]
                  : []),
              {
                  label: 'Deposit',
                  value: formatAmount(invoice.deposit_amount, currency),
              },
          ]
        : []

    return (
        <Dialog
            isOpen={invoice !== null}
            onClose={onClose}
            width={760}
            closable={true}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            {invoice && (
                <div className="max-h-[85vh] overflow-y-auto pr-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h5 className="heading-text">
                                {invoice.reservation_number}
                            </h5>
                            <div className="mt-1 text-xs text-gray-500">
                                Created{' '}
                                {invoice.created_at
                                    ? formatDateTime(invoice.created_at)
                                    : '—'}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${reservationStatus.className}`}
                            >
                                {reservationStatus.label}
                            </span>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatus.className}`}
                            >
                                {paymentStatus.label}
                            </span>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Agency
                            </div>
                            <div className="mt-1 font-medium heading-text">
                                {invoice.agency.name}
                            </div>
                            {invoice.agency.address && (
                                <div className="mt-0.5 text-sm">
                                    {invoice.agency.address}
                                </div>
                            )}
                            {(invoice.agency.city || invoice.agency.country) && (
                                <div className="text-sm">
                                    {[invoice.agency.city, invoice.agency.country]
                                        .filter(Boolean)
                                        .join(', ')}
                                </div>
                            )}
                            {invoice.agency.phone && (
                                <div className="mt-0.5 text-sm">
                                    {invoice.agency.phone}
                                </div>
                            )}
                            {invoice.agency.email && (
                                <div className="text-sm">
                                    {invoice.agency.email}
                                </div>
                            )}
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Client
                            </div>
                            {client ? (
                                <>
                                    <div className="mt-1 font-medium heading-text">
                                        {client.full_name}
                                    </div>
                                    {client.phone && (
                                        <div className="mt-0.5 text-sm">
                                            {client.phone}
                                        </div>
                                    )}
                                    {client.email && (
                                        <div className="text-sm">
                                            {client.email}
                                        </div>
                                    )}
                                    {client.cin && (
                                        <div className="text-sm">
                                            CIN {client.cin}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="mt-1 text-sm text-gray-500">
                                    No client on file.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vehicle + dates */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Vehicle
                            </div>
                            <div className="mt-1 font-medium heading-text">
                                {[invoice.car.brand, invoice.car.model]
                                    .filter(Boolean)
                                    .join(' ') || '—'}
                            </div>
                            <div className="text-sm">
                                {invoice.car.registration_number}
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Pickup
                            </div>
                            <div className="mt-1 font-medium">
                                {invoice.pickup_datetime
                                    ? formatDateTime(invoice.pickup_datetime)
                                    : '—'}
                            </div>
                            <div className="text-sm">
                                {invoice.pickup_location || ''}
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Return
                            </div>
                            <div className="mt-1 font-medium">
                                {invoice.expected_return_datetime
                                    ? formatDateTime(
                                          invoice.expected_return_datetime,
                                      )
                                    : '—'}
                            </div>
                            <div className="text-sm">
                                {invoice.return_location || ''}
                            </div>
                        </div>
                    </div>

                    {/* Charges */}
                    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="border-b border-gray-200 px-4 py-2 text-sm font-medium heading-text dark:border-gray-700">
                            Charges
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {rows.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center justify-between px-4 py-2 text-sm"
                                >
                                    <span className="text-gray-600 dark:text-gray-300">
                                        {row.label}
                                    </span>
                                    <span className="font-medium">{row.value}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5 text-sm font-semibold dark:bg-gray-800">
                                <span>Total</span>
                                <span className="heading-text">
                                    {formatAmount(invoice.total_amount, currency)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payments */}
                    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="border-b border-gray-200 px-4 py-2 text-sm font-medium heading-text dark:border-gray-700">
                            Payments
                        </div>
                        {invoice.payments.length ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {invoice.payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between gap-2 px-4 py-2 text-sm"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {payment.payment_date
                                                    ? formatDate(
                                                          payment.payment_date,
                                                      )
                                                    : '—'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {paymentMethodLabel[
                                                    payment.method ?? ''
                                                ] ?? payment.method ?? '—'}
                                                {payment.reference
                                                    ? ` · ${payment.reference}`
                                                    : ''}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div>
                                                {formatAmount(
                                                    payment.amount,
                                                    currency,
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {paymentRecordStatusLabel[
                                                    payment.status
                                                ] ?? payment.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500">
                                No payments recorded.
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-300">
                                Paid
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {formatAmount(invoice.paid_amount, currency)}
                            </span>
                        </div>
                        {invoice.balance_amount !== null &&
                            invoice.balance_amount > 0 && (
                                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Balance
                                    </span>
                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                        {formatAmount(
                                            invoice.balance_amount,
                                            currency,
                                        )}
                                    </span>
                                </div>
                            )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="button" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Dialog>
    )
}

export default InvoiceViewDialog