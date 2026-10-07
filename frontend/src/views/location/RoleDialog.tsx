import { useEffect, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import Scroll from '@/components/ui/Scroll'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import {
    apiCreateRole,
    apiGetPermissionCatalog,
    apiUpdateRole,
} from '@/services/LocationService'
import type { PermissionModule, Role, RolePayload } from '@/@types/location'
import PermissionChecklist, { hasStarPermission } from './PermissionChecklist'
import {
    DEFAULT_ROLE_COLOR,
    DEFAULT_ROLE_ICON,
    roleColorMap,
    roleColorOptions,
    roleIconMap,
    roleIconOptions,
} from './roleMeta'
import { apiErrorMessage } from './shared'
import classNames from '@/utils/classNames'

type FormSchema = {
    name: string
    description: string
    icon: string
    color: string
}

const validationSchema = z.object({
    name: z
        .string()
        .min(2, 'Role name is required')
        .max(100, 'Role name must be less than 100 characters'),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(200, 'Description must be less than 200 characters'),
    icon: z.string().min(1, 'Please select an icon'),
    color: z.string().min(1, 'Please select a color'),
})

type RoleDialogProps = {
    isOpen: boolean
    role: Role | null
    onClose: () => void
    onSaved: () => void
}

const RoleDialog = ({ isOpen, role, onClose, onSaved }: RoleDialogProps) => {
    const [catalog, setCatalog] = useState<PermissionModule[]>([])
    const [permissions, setPermissions] = useState<string[]>([])
    const [isActive, setIsActive] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const isEdit = Boolean(role)
    const isMaster = hasStarPermission(role?.permissions ?? [])

    const {
        handleSubmit,
        reset,
        register,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(
            validationSchema,
        ) as unknown as Resolver<FormSchema>,
        defaultValues: {
            name: '',
            description: '',
            icon: DEFAULT_ROLE_ICON,
            color: DEFAULT_ROLE_COLOR,
        },
    })

    const selectedIcon = watch('icon')
    const selectedColor = watch('color')

    useEffect(() => {
        if (isOpen) {
            reset({
                name: role?.name ?? '',
                description: role?.description ?? '',
                icon: role?.icon ?? DEFAULT_ROLE_ICON,
                color: role?.color ?? DEFAULT_ROLE_COLOR,
            })
            setPermissions(role?.permissions ?? [])
            setIsActive(role?.is_active ?? true)
            apiGetPermissionCatalog()
                .then((res) => setCatalog(res ?? []))
                .catch(() => setCatalog([]))
        }
    }, [isOpen, role, reset])

    const handleDiscard = () => {
        onClose()
    }

    const onSubmit = async (values: FormSchema) => {
        if (permissions.length === 0) {
            toast.push(
                <Notification
                    type="warning"
                    title="Select at least one permission"
                />,
            )
            return
        }
        setSubmitting(true)
        const payload: RolePayload = {
            name: values.name.trim(),
            description: values.description.trim(),
            icon: values.icon,
            color: values.color,
            permissions,
            is_active: isActive,
        }
        try {
            if (role) {
                await apiUpdateRole(role.id, payload)
            } else {
                await apiCreateRole(payload)
            }
            toast.push(
                <Notification
                    type="success"
                    title={isEdit ? 'Role updated!' : 'Role created!'}
                />,
            )
            onSaved()
            onClose()
        } catch (error) {
            toast.push(
                <Notification
                    type="danger"
                    title={apiErrorMessage(error, 'Could not save role')}
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleDiscard}
            width={800}
            className="max-h-[90vh] overflow-y-auto"
        >
            <h5 className="mb-6 text-base font-bold dark:text-gray-100">
                {isEdit ? `Edit Role: ${role?.name ?? ''}` : 'Add New Role'}
            </h5>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label="Role Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="e.g. Operations Manager"
                        {...register('name')}
                    />
                </FormItem>
                <FormItem
                    label="Description"
                    invalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                >
                    <Input
                        textArea
                        rows={3}
                        placeholder="Describe the role's responsibilities and access level"
                        {...register('description')}
                    />
                </FormItem>
                <FormItem
                    label="Icon"
                    invalid={Boolean(errors.icon)}
                    errorMessage={errors.icon?.message}
                >
                    <div className="inline-flex flex-wrap gap-2">
                        {roleIconOptions.map((key) => {
                            const IconComponent = roleIconMap[key]
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    title={key}
                                    onClick={() => setValue('icon', key)}
                                    className={classNames(
                                        'flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700',
                                        selectedIcon === key
                                            ? 'border-primary text-primary'
                                            : 'border-gray-200 text-gray-900 hover:border-gray-300 dark:border-gray-700 dark:text-gray-100',
                                    )}
                                >
                                    <IconComponent className="text-xl" />
                                </button>
                            )
                        })}
                    </div>
                </FormItem>
                <FormItem
                    label="Color"
                    invalid={Boolean(errors.color)}
                    errorMessage={errors.color?.message}
                >
                    <div className="flex flex-wrap gap-2">
                        {roleColorOptions.map((key) => (
                            <button
                                key={key}
                                type="button"
                                title={key}
                                onClick={() => setValue('color', key)}
                                className={classNames(
                                    'relative h-6 w-6 rounded-lg transition-all duration-200 hover:scale-105',
                                    roleColorMap[key].bgClass,
                                )}
                            >
                                {selectedColor === key && (
                                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                                        ✓
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </FormItem>
                <FormItem label="Status">
                    <Switcher
                        checked={isActive}
                        onChange={(checked) => setIsActive(checked)}
                    />
                </FormItem>
                <FormItem label="Permissions">
                    {isMaster && (
                        <p className="mb-3 text-sm text-primary">
                            This role holds the master “*” grant — every
                            permission is implied and cannot be unset here.
                        </p>
                    )}
                    <div className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700">
                        <Scroll.FlexSize edgeShadow className="max-h-[380px]">
                            <PermissionChecklist
                                catalog={catalog}
                                permissions={permissions}
                                onChange={setPermissions}
                                locked={isMaster}
                            />
                        </Scroll.FlexSize>
                    </div>
                    {permissions.length === 0 && (
                        <p className="mt-1 text-xs text-error">
                            Select at least one permission.
                        </p>
                    )}
                </FormItem>
            </Form>
            <div className="mt-6 flex w-full items-center justify-end gap-2">
                <Button onClick={handleDiscard} disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    type="submit"
                    loading={submitting}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isEdit ? 'Update' : 'Create'}
                </Button>
            </div>
        </Dialog>
    )
}

export default RoleDialog
