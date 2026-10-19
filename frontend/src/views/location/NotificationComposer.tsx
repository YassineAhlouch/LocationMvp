import { useCallback, useEffect, useMemo, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { LiCross } from '@/icons'
import {
    apiGetRoles,
    apiGetUsers,
    apiSendNotification,
} from '@/services/LocationService'
import type { AppNotificationPayload } from '@/@types/location'
import { apiErrorMessage } from './shared'
import useTranslation from '@/utils/hooks/useTranslation'

type Audience = 'all' | 'users' | 'roles'

type Option = { value: string; label: string }

type NotificationComposerProps = {
    isOpen: boolean
    onClose: () => void
    onSent: () => void
}

const emptyOptions: Option[] = []

/**
 * Compose an announcement (POST /api/v1/notifications, notifications.send).
 * Exactly one audience shape is sent: everyone, a set of users, or a set of
 * roles — the backend rejects ambiguous payloads.
 */
const NotificationComposer = ({
    isOpen,
    onClose,
    onSent,
}: NotificationComposerProps) => {
    const { t } = useTranslation()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [audience, setAudience] = useState<Audience>('all')
    const [selectedUsers, setSelectedUsers] = useState<Option[]>(emptyOptions)
    const [selectedRoles, setSelectedRoles] = useState<Option[]>(emptyOptions)
    const [userOptions, setUserOptions] = useState<Option[]>(emptyOptions)
    const [roleOptions, setRoleOptions] = useState<Option[]>(emptyOptions)
    const [submitting, setSubmitting] = useState(false)

    const audienceOptions = useMemo(
        () => [
            {
                value: 'all',
                label: t('notifications.composer.audienceAll', 'Everyone'),
            },
            {
                value: 'users',
                label: t(
                    'notifications.composer.audienceUsers',
                    'Specific people',
                ),
            },
            {
                value: 'roles',
                label: t(
                    'notifications.composer.audienceRoles',
                    'Specific roles',
                ),
            },
        ],
        [t],
    )

    const reset = useCallback(() => {
        setTitle('')
        setBody('')
        setAudience('all')
        setSelectedUsers(emptyOptions)
        setSelectedRoles(emptyOptions)
    }, [])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        apiGetUsers({ per_page: 100 })
            .then((res) =>
                setUserOptions(
                    res.data.map((staff) => ({
                        value: String(staff.id),
                        label: staff.full_name,
                    })),
                ),
            )
            .catch(() => setUserOptions(emptyOptions))

        apiGetRoles({ per_page: 100 })
            .then((res) =>
                setRoleOptions(
                    res.data.map((role) => ({
                        value: String(role.id),
                        label: role.name,
                    })),
                ),
            )
            .catch(() => setRoleOptions(emptyOptions))
    }, [isOpen])

    const hasRecipients =
        audience === 'all' ||
        (audience === 'users' && selectedUsers.length > 0) ||
        (audience === 'roles' && selectedRoles.length > 0)

    const canSubmit =
        title.trim().length > 0 && body.trim().length > 0 && hasRecipients

    const handleSubmit = async () => {
        if (!canSubmit) {
            return
        }

        const payload: AppNotificationPayload = {
            title: title.trim(),
            body: body.trim(),
        }

        if (audience === 'all') {
            payload.send_to_all = true
        } else if (audience === 'users') {
            payload.user_ids = selectedUsers.map((option) =>
                Number(option.value),
            )
        } else {
            payload.role_ids = selectedRoles.map((option) =>
                Number(option.value),
            )
        }

        setSubmitting(true)
        try {
            const result = await apiSendNotification(payload)
            toast.push(
                <Notification
                    type="success"
                    title={t(
                        'notifications.composer.sent',
                        'Announcement sent to {{n}} recipient(s)',
                        { n: result.sent },
                    )}
                />,
            )
            reset()
            onSent()
            onClose()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(
                        error,
                        t(
                            'notifications.composer.sendError',
                            'Could not send the announcement',
                        ),
                    )}
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} closable={false} width={560}>
            <div className="flex flex-col">
                <div className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                        <h5 className="truncate">
                            {t(
                                'notifications.composer.title',
                                'New announcement',
                            )}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t(
                                'notifications.composer.subtitle',
                                'In-app message delivered to the people you choose.',
                            )}
                        </p>
                    </div>
                    <Button
                        variant="subtle"
                        size="sm"
                        onClick={onClose}
                        icon={<LiCross className="text-2xl" />}
                    />
                </div>

                <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-800">
                    <div>
                        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                            {t('notifications.composer.subject', 'Subject')}
                        </label>
                        <Input
                            value={title}
                            maxLength={255}
                            placeholder={t(
                                'notifications.composer.subjectPlaceholder',
                                'Short headline',
                            )}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                            {t('notifications.composer.body', 'Message')}
                        </label>
                        <Input
                            textArea
                            rows={5}
                            value={body}
                            maxLength={5000}
                            placeholder={t(
                                'notifications.composer.bodyPlaceholder',
                                'Write the announcement…',
                            )}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                            {t(
                                'notifications.composer.audience',
                                'Audience',
                            )}
                        </label>
                        <Select
                            isSearchable={false}
                            options={audienceOptions}
                            value={
                                audienceOptions.find(
                                    (option) => option.value === audience,
                                ) ?? null
                            }
                            onChange={(option) =>
                                setAudience(
                                    (option?.value as Audience) ?? 'all',
                                )
                            }
                        />
                    </div>

                    {audience === 'users' ? (
                        <div>
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t(
                                    'notifications.composer.recipients',
                                    'Recipients',
                                )}
                            </label>
                            <Select.Multi
                                options={userOptions}
                                value={selectedUsers}
                                placeholder={t(
                                    'notifications.composer.recipientsPlaceholder',
                                    'Choose people…',
                                )}
                                onChange={(options) =>
                                    setSelectedUsers(options as Option[])
                                }
                            />
                        </div>
                    ) : null}

                    {audience === 'roles' ? (
                        <div>
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                {t(
                                    'notifications.composer.roles',
                                    'Roles',
                                )}
                            </label>
                            <Select.Multi
                                options={roleOptions}
                                value={selectedRoles}
                                placeholder={t(
                                    'notifications.composer.rolesPlaceholder',
                                    'Choose roles…',
                                )}
                                onChange={(options) =>
                                    setSelectedRoles(options as Option[])
                                }
                            />
                        </div>
                    ) : null}
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-800">
                    <Button onClick={onClose} disabled={submitting}>
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleSubmit}
                        loading={submitting}
                        disabled={!canSubmit}
                    >
                        {t('notifications.composer.send', 'Send')}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default NotificationComposer
