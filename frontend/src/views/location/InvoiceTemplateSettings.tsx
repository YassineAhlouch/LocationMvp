import { useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useSessionUser } from '@/store/authStore'
import {
    apiGetAgencies,
    apiGetInvoiceTemplates,
    apiUpdateAgencyTemplate,
} from '@/services/LocationService'
import { isVerbGranted } from './PermissionChecklist'
import type { Agency, InvoiceTemplate } from '@/@types/location'

/**
 * Administration screen that assigns one invoice/contract layout to each
 * agency. This is the only place a template is chosen: an agency user never
 * switches it from the invoice page, they always print what they were given.
 */
const InvoiceTemplateSettings = () => {
    const { user } = useSessionUser()
    const canManage = isVerbGranted(
        user?.role?.permissions ?? [],
        'settings',
        'manage',
    )

    const [templates, setTemplates] = useState<InvoiceTemplate[]>([])
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [loading, setLoading] = useState(true)
    const [savingId, setSavingId] = useState<number | null>(null)

    useEffect(() => {
        if (!canManage) {
            setLoading(false)
            return
        }
        let active = true
        setLoading(true)
        Promise.all([apiGetInvoiceTemplates(), apiGetAgencies()])
            .then(([templateList, agencyList]) => {
                if (!active) {
                    return
                }
                setTemplates(templateList)
                setAgencies(agencyList)
            })
            .catch(() => {
                if (active) {
                    toast.push(
                        <Notification
                            type="danger"
                            title="Could not load invoice templates"
                        />,
                    )
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
    }, [canManage])

    const templateOptions = useMemo(
        () => templates.map((template) => ({ value: template.id, label: template.name })),
        [templates],
    )

    const handleChange = async (agency: Agency, templateId: number) => {
        if (agency.invoice_template?.id === templateId) {
            return
        }
        setSavingId(agency.id)
        try {
            const updated = await apiUpdateAgencyTemplate(agency.id, templateId)
            setAgencies((current) =>
                current.map((item) => (item.id === updated.id ? updated : item)),
            )
            toast.push(
                <Notification
                    type="success"
                    title="Invoice template updated"
                />,
            )
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title="Could not update invoice template"
                />,
            )
        } finally {
            setSavingId(null)
        }
    }

    if (!canManage) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-4 text-center">
                <h5 className="dark:text-gray-100">Access restricted</h5>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    Only administrators can assign invoice templates.
                </p>
            </div>
        )
    }

    return (
        <Container className="">
            <div className="space-y-4">
                <div>
                    <h4>Invoice templates</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assign one contract layout to each agency. Agencies
                        cannot switch it themselves.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner />
                    </div>
                ) : agencies.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                        No agencies to configure.
                    </p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Agency
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">
                                        Invoice template
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {agencies.map((agency) => (
                                    <tr
                                        key={agency.id}
                                        className="border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {agency.name}
                                            </div>
                                            {agency.city ? (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {agency.city}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="w-64">
                                                <Select
                                                    options={templateOptions}
                                                    value={
                                                        templateOptions.find(
                                                            (option) =>
                                                                option.value ===
                                                                agency
                                                                    .invoice_template
                                                                    ?.id,
                                                        ) ?? null
                                                    }
                                                    isSearchable={false}
                                                    isDisabled={
                                                        savingId === agency.id
                                                    }
                                                    onChange={(option) =>
                                                        handleChange(
                                                            agency,
                                                            option.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default InvoiceTemplateSettings
