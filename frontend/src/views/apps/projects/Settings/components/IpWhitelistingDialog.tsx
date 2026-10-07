import { useEffect } from 'react'
import Dialog from '@/components/ui//Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import { LiTask, LiCross } from '@/icons'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { WhiteList } from '../types'

type FormSchema = {
    label: string
    ip: string
    description?: string
}

type IpWhitelistingDialogProps = {
    data: WhiteList | null
    onClose: () => void
    open: boolean
    type: 'add' | 'edit' | ''
    onSubmit: () => (payload: WhiteList) => Promise<void>
}

const validationSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    ip: z.ipv4().min(1, 'IP address is required'),
})

const IpWhitelistingDialog = ({
    data,
    open,
    onClose,
    type,
    onSubmit,
}: IpWhitelistingDialogProps) => {
    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            label: data ? data.label : '',
            ip: data ? data.ip : '',
            description: data ? data.description : '',
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (open && type === 'edit' && data) {
            reset({
                label: data.label,
                ip: data.ip,
                description: data.description,
            })
        } else if (open && type === 'add') {
            reset({
                label: '',
                ip: '',
                description: '',
            })
        }
    }, [open, type, data, reset])

    const handleClose = () => {
        onClose()
        reset()
        if (type === 'edit') {
            reset({
                label: data ? data.label : '',
                ip: data ? data.ip : '',
                description: data ? data.description : '',
            })
        } else {
            reset({
                label: '',
                ip: '',
                description: '',
            })
        }
    }

    const handleFormSubmit = async (formData: FormSchema) => {
        const callback = onSubmit()

        await callback({
            id: data ? data.id : uniqueId('whitelist_'),
            label: formData.label,
            ip: formData.ip,
            description: formData.description || '',
            addedAt: dayjs().format(),
            createdBy: 'admin@infotech.io',
        })

        reset()
        handleClose()
    }

    return (
        <Dialog
            isOpen={open}
            onClose={handleClose}
            className="p-0"
            closable={false}
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <div className="h-10 min-w-10 flex items-center justify-center heading-text border ring ring-gray-200 border-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg text-xl ">
                        <LiTask className="text-xl" />
                    </div>
                    <div>
                        <h5 className="">
                            {type === 'add'
                                ? 'Add IP Whitelist'
                                : 'Edit IP Whitelist'}
                        </h5>
                        <p className="pr-12 hidden sm:block">
                            {type === 'add'
                                ? 'Add a new IP address to the whitelist.'
                                : 'Edit the existing IP address in the whitelist.'}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="subtle"
                    icon={<LiCross className="text-2xl" />}
                    type="button"
                    onClick={handleClose}
                />
            </div>
            <div className="p-4">
                <Form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4"
                >
                    <FormItem
                        label="Label"
                        errorMessage={errors.label?.message}
                        invalid={Boolean(errors.label)}
                    >
                        <Controller
                            name="label"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Enter label" />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="IP Address"
                        errorMessage={errors.ip?.message}
                        invalid={Boolean(errors.ip)}
                    >
                        <Controller
                            name="ip"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter IP address"
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Description">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} textArea />
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                        >
                            {type === 'add' ? 'Add IP' : 'Update IP'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default IpWhitelistingDialog
