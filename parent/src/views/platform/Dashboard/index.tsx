import { useEffect, useState } from 'react'
import { Card, Notification, Spinner, toast } from '@/components/ui'
import StatisticCard from '@/components/shared/StatisticCard'
import PageHeading from '../components/PageHeading'
import StatusPill from '../components/StatusPill'
import { apiGetPlatformStats } from '@/services/PlatformService'
import apiErrorMessage from '@/utils/apiErrorMessage'
import { formatDate } from '@/utils/formatDate'
import {
    LiCalendar,
    LiCar,
    LiChartSquare,
    LiStore,
    LiUserCircle,
    LiWalletMoney,
} from '@/icons'
import type { PlatformStats } from '@/@types/platform'
import type { ReactNode } from 'react'

const amount = (value: number): string =>
    value.toLocaleString('en-US', { maximumFractionDigits: 0 })

const Dashboard = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        apiGetPlatformStats()
            .then(setStats)
            .catch((error) => {
                toast.push(
                    <Notification type="danger">{apiErrorMessage(error)}</Notification>,
                )
            })
            .finally(() => setLoading(false))
    }, [])

    const cards: Array<{
        label: string
        value: string
        hint?: string
        icon: ReactNode
        color: string
    }> = stats
        ? [
              {
                  label: 'Agencies',
                  value: String(stats.agencies.total),
                  hint: `${stats.agencies.active} active`,
                  icon: <LiStore className="text-3xl" />,
                  color: 'text-indigo-600 dark:text-indigo-400',
              },
              {
                  label: 'Active agencies',
                  value: String(stats.agencies.active),
                  hint: `${stats.agencies.inactive} inactive`,
                  icon: <LiChartSquare className="text-3xl" />,
                  color: 'text-emerald-600 dark:text-emerald-400',
              },
              {
                  label: 'Users',
                  value: String(stats.users),
                  icon: <LiUserCircle className="text-3xl" />,
                  color: 'text-sky-600 dark:text-sky-400',
              },
              {
                  label: 'Cars',
                  value: String(stats.cars),
                  icon: <LiCar className="text-3xl" />,
                  color: 'text-amber-600 dark:text-amber-400',
              },
              {
                  label: 'Reservations',
                  value: String(stats.reservations),
                  icon: <LiCalendar className="text-3xl" />,
                  color: 'text-violet-600 dark:text-violet-400',
              },
              {
                  label: 'Revenue this month',
                  value: amount(stats.monthly_revenue),
                  hint: 'Paid, all agencies',
                  icon: <LiWalletMoney className="text-3xl" />,
                  color: 'text-rose-600 dark:text-rose-400',
              },
          ]
        : []

    return (
        <>
            <PageHeading
                title="Platform dashboard"
                description="At a glance: tenants, fleet, reservations and revenue across every agency."
            />

            {loading && !stats ? (
                <div className="flex justify-center py-24">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {cards.map((card) => (
                            <StatisticCard key={card.label}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium heading-text">
                                            {card.label}
                                        </div>
                                        <h4 className="mt-2">{card.value}</h4>
                                        {card.hint && (
                                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {card.hint}
                                            </div>
                                        )}
                                    </div>
                                    <span className={card.color}>
                                        {card.icon}
                                    </span>
                                </div>
                            </StatisticCard>
                        ))}
                    </div>

                    <Card className="mt-6">
                        <h5 className="mb-4 heading-text">Recent agencies</h5>
                        {stats?.recent_agencies.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                                            <th className="py-2 pr-4 font-medium">
                                                Agency
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                City
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                Users
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                Cars
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                Currency
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                Status
                                            </th>
                                            <th className="py-2 font-medium">
                                                Created
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {stats?.recent_agencies.map((agency) => (
                                            <tr key={agency.id}>
                                                <td className="py-3 pr-4 font-medium heading-text">
                                                    {agency.name}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {agency.city || '—'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {agency.users_count}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {agency.cars_count}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {agency.currency
                                                        ? `${agency.currency.code} (${agency.currency.symbol})`
                                                        : '—'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <StatusPill
                                                        active={agency.is_active}
                                                    />
                                                </td>
                                                <td className="py-3">
                                                    {agency.created_at
                                                        ? formatDate(
                                                              agency.created_at,
                                                          )
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                No agencies yet.
                            </div>
                        )}
                    </Card>
                </>
            )}
        </>
    )
}

export default Dashboard