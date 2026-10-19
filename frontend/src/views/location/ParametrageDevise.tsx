import { useEffect, useMemo, useState } from 'react'
import { mutate } from 'swr'
import useTranslation from '@/utils/hooks/useTranslation'
import Container from '@/components/shared/Container'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useSessionUser } from '@/store/authStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { AGENCY_SWR_KEY } from '@/constants/agency.constant'
import {
    apiGetAgency,
    apiGetCurrencies,
    apiUpdateAgencyCurrency,
} from '@/services/LocationService'
import { money } from './shared'
import { isVerbGranted } from './PermissionChecklist'
import type { Currency } from '@/@types/location'

/**
 * Picks the currency the agency prices and invoices in. The platform curates
 * the catalog (only active units are offered); the agency only chooses which
 * one applies. The choice is agency-wide, so it is an administrative setting.
 */
const ParametrageDevise = () => {
    const { user } = useSessionUser()
    const { t } = useTranslation()
    const storedCurrency = useCurrencyStore((state) => state.currency)
    const setCurrency = useCurrencyStore((state) => state.setCurrency)
    const storedCurrencyId = storedCurrency.id

    const canManage = isVerbGranted(
        user?.role?.permissions ?? [],
        'settings',
        'manage',
    )

    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        let active = true

        Promise.all([apiGetCurrencies(), apiGetAgency()])
            .then(([list, agency]) => {
                if (!active) {
                    return
                }

                setCurrencies(list)

                if (agency.currency) {
                    setCurrency(agency.currency)
                }
            })
            .catch(() => {
                toast.push(
                    <Notification
                        type="danger"
                        title={t(
                            'settings.currency.loadFailed',
                            'Could not load currencies',
                        )}
                    />,
                )
            })
            .finally(() => {
                if (active) {
                    setLoading(false)
                }
            })

        return () => {
            active = false
        }
    }, [setCurrency, t])

    const currencyOptions = useMemo(
        () =>
            currencies.map((currency) => ({
                value: currency.id,
                label: `${currency.code} — ${currency.name}`,
            })),
        [currencies],
    )

    const handleChange = async (currencyId: number) => {
        const selected = currencies.find((currency) => currency.id === currencyId)

        if (!selected || selected.id === storedCurrencyId) {
            return
        }

        setSaving(true)

        try {
            const agency = await apiUpdateAgencyCurrency(currencyId)

            if (agency.currency) {
                setCurrency(agency.currency)
            }

            void mutate(AGENCY_SWR_KEY, agency, false)

            toast.push(
                <Notification
                    type="success"
                    title={t('settings.currency.updated', 'Currency updated')}
                />,
            )
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t(
                        'settings.currency.updateFailed',
                        'Could not update currency',
                    )}
                />,
            )
        } finally {
            setSaving(false)
        }
    }

    if (!canManage) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-4 text-center">
                <h5 className="dark:text-gray-100">
                    {t(
                        'settings.currency.accessRestricted',
                        'Access restricted',
                    )}
                </h5>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t(
                        'settings.currency.accessRestrictedDescription',
                        'Only administrators can change the agency currency.',
                    )}
                </p>
            </div>
        )
    }

    return (
        <Container className="">
            <div className="space-y-4">
                <div>
                    <h4>{t('settings.currency.title', 'Currency')}</h4>
                    <p className="max-w-2xl text-xs text-gray-500 dark:text-gray-400">
                        {t(
                            'settings.currency.description',
                            'Choose the currency every amount is shown in for your agency. The catalog is managed by the platform.',
                        )}
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner />
                    </div>
                ) : currencies.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                        {t(
                            'settings.currency.noCurrencies',
                            'No currencies available.',
                        )}
                    </p>
                ) : (
                    <div className="max-w-md rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                        <label className="mb-1 block text-sm font-medium">
                            {t('settings.currency.label', 'Currency')}
                        </label>
                        <Select
                            options={currencyOptions}
                            value={
                                currencyOptions.find(
                                    (option) =>
                                        option.value === storedCurrencyId,
                                ) ?? null
                            }
                            isSearchable={false}
                            isDisabled={saving}
                            placeholder={t(
                                'settings.currency.placeholder',
                                'Select a currency',
                            )}
                            onChange={(option) => handleChange(option.value)}
                        />
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            {t('settings.currency.current', 'Current currency')}
                            {': '}
                            <span className="font-medium">
                                {storedCurrency.code}
                            </span>
                            {' · '}
                            {money(1234.5)}
                        </p>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default ParametrageDevise
