import useSWR from 'swr'
import classNames from '@/utils/classNames'
import { formatDate } from '@/utils/formatDate'
import { apiGetSubscription } from '@/services/LocationService'
import { SUBSCRIPTION_SWR_KEY } from '@/constants/billing.constant'
import { LiAlertTriangle, LiWalletMoney } from '@/icons'

const money = (
    amountValue: number,
    currency: { symbol: string; decimals: number } | null,
): string => {
    const decimals = currency?.decimals ?? 2
    const symbol = currency?.symbol ?? 'DH'

    return `${amountValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })} ${symbol}`
}

/**
 * App-wide subscription notice. Shows a red read-only warning once an invoice
 * is overdue (writes are blocked by the backend with 402), and a softer amber
 * reminder while a future invoice is still outstanding.
 */
const SubscriptionBanner = () => {
    const { data } = useSWR(SUBSCRIPTION_SWR_KEY, apiGetSubscription, {
        revalidateOnFocus: true,
        shouldRetryOnError: false,
    })

    if (!data) {
        return null
    }

    const { locked, outstanding_amount, currency, next_due_date } = data

    if (!locked && outstanding_amount <= 0) {
        return null
    }

    const due = next_due_date ? formatDate(next_due_date) : null

    if (locked) {
        return (
            <div
                className={classNames(
                    'mx-4 mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 sm:mx-6',
                    'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200',
                )}
            >
                <span className="mt-0.5 text-xl">
                    <LiAlertTriangle />
                </span>
                <div>
                    <div className="font-semibold">
                        Your workspace is read-only — payment overdue
                    </div>
                    <div className="text-sm">
                        You owe{' '}
                        <span className="font-semibold">
                            {money(outstanding_amount, currency)}
                        </span>
                        {due ? <> (due {due})</> : null}. Settle your
                        subscription with the platform to re-enable editing.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={classNames(
                'mx-4 mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 sm:mx-6',
                'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
            )}
        >
            <span className="mt-0.5 text-xl">
                <LiWalletMoney />
            </span>
            <div>
                <div className="font-semibold">
                    Upcoming subscription payment
                </div>
                <div className="text-sm">
                    <span className="font-semibold">
                        {money(outstanding_amount, currency)}
                    </span>
                    {due ? <> is due on {due}</> : null}. No action needed yet.
                </div>
            </div>
        </div>
    )
}

export default SubscriptionBanner
