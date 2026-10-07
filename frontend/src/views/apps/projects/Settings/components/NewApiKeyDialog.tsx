import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Dialog from '@/components/ui/Dialog'
import { FormItem, Form } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { LiKey, LiCross } from '@/icons'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ApiKey } from '../types'

type FormSchema = {
    name: string
    desctiption?: string
    expiresAt: string | null
}

type NewApiKeyDialogProps = {
    onSubmit: () => (apiKey: ApiKey) => Promise<void>
}

const DATE_FORMAT = 'MMM DD, YYYY'

const validationSchema = z.object({
    name: z.string().min(1, 'Api key name is required'),
    desctiption: z.string().optional(),
    expiresAt: z.string().nullable(),
})

const NewApiKeyDialog = ({ onSubmit }: NewApiKeyDialogProps) => {
    const [newApiKeyDialog, setNewApiKeyDialog] = useState(false)

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: '',
            desctiption: '',
            expiresAt: '7d',
        },
        resolver: zodResolver(validationSchema),
    })

    const handleCloseNewApiKeyDialog = () => {
        reset()
        setNewApiKeyDialog(false)
    }

    const handleFormSubmit = async (data: FormSchema) => {
        const callback = onSubmit()
        await callback({
            id: uniqueId('api-key-token-'),
            name: data.name,
            token: `sk_live_${uniqueId('4kfd82nd72nd82n')}`,
            createdAt: dayjs().toISOString(),
            lastUsedAt: null,
            status: 'active',
            scopes: [],
            expiresAt: data.expiresAt
                ? dayjs().add(parseInt(data.expiresAt), 'day').toISOString()
                : null,
        })
        handleCloseNewApiKeyDialog()
    }

    const expirationOptions = useMemo(
        () => [
            {
                label: `7 days (${dayjs().add(7, 'day').format(DATE_FORMAT)})`,
                value: '7d',
            },
            {
                label: `30 days (${dayjs().add(30, 'day').format(DATE_FORMAT)})`,
                value: '30d',
            },
            {
                label: `60 days (${dayjs().add(60, 'day').format(DATE_FORMAT)})`,
                value: '60d',
            },
            {
                label: `90 days (${dayjs().add(90, 'day').format(DATE_FORMAT)})`,
                value: '90d',
            },
            { label: 'Never expires', value: null },
        ],
        [],
    )

    return (
        <>
            <Button variant="subtle" onClick={() => setNewApiKeyDialog(true)}>
                Create API Key
            </Button>
            <Dialog
                isOpen={newApiKeyDialog}
                onClose={handleCloseNewApiKeyDialog}
                className="p-0"
                closable={false}
            >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <div className="h-10 min-w-10 flex items-center justify-center heading-text border ring ring-gray-200 border-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg text-xl ">
                            <LiKey className="text-xl" />
                        </div>
                        <div>
                            <h5>Create New API Key</h5>
                            <p className="pr-12">
                                To access your project data programmatically.
                            </p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="subtle"
                        icon={<LiCross className="text-2xl" />}
                        type="button"
                        onClick={handleCloseNewApiKeyDialog}
                    />
                </div>
                <div className="p-4">
                    <Form onSubmit={handleSubmit(handleFormSubmit)}>
                        <FormItem
                            label="Name"
                            invalid={Boolean(errors.name)}
                            errorMessage={errors.name?.message}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter API key name"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Description"
                            invalid={Boolean(errors.desctiption)}
                            errorMessage={errors.desctiption?.message}
                        >
                            <Controller
                                name="desctiption"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        placeholder="Enter API key description"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Company"
                            invalid={Boolean(errors.expiresAt)}
                            errorMessage={errors.expiresAt?.message}
                        >
                            <Controller
                                name="expiresAt"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={expirationOptions}
                                        placeholder="Select expiration date"
                                        value={expirationOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={handleCloseNewApiKeyDialog}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isSubmitting}
                            >
                                Create API Key
                            </Button>
                        </div>
                    </Form>
                </div>
            </Dialog>
        </>
    )
}

export default NewApiKeyDialog
