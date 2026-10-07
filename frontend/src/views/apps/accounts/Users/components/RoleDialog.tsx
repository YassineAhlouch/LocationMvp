import { useEffect } from 'react'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { roleColorMap, roleIconMap } from '../utils'
import useAccessControlData from '../hooks/useAccessControlData'
import { useAccessControlStore } from '../store/accessControlStore'
import IconFrame from '@/components/shared/IconFrame'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { LiUser, LiAdd, LiEdit, LiCross } from '@/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormSchema = {
    name: string
    description: string
    icon: string
    color: string
}

const validationSchema = z.object({
    name: z
        .string()
        .min(1, 'Role name is required')
        .max(50, 'Role name must be less than 50 characters'),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(200, 'Description must be less than 200 characters'),
    icon: z.string().min(1, 'Please select an icon'),
    color: z.string().min(1, 'Please select a color'),
})

const getModalConfig = (roleModalMode: string) => {
    switch (roleModalMode) {
        case 'create':
            return {
                title: 'Create New Role',
                subtitle:
                    'Define a new role with specific permissions and settings',
                icon: LiAdd,
                submitText: 'Create Role',
            }
        case 'edit':
            return {
                title: 'Edit Role',
                subtitle: 'Modify role settings and permissions',
                icon: LiEdit,
                submitText: 'Save Changes',
            }
        default:
            return {
                title: 'Role',
                subtitle: '',
                icon: LiUser,
                submitText: 'Save',
            }
    }
}

const RoleDialog = () => {
    const { setRolesData } = useAccessControlData()
    const isRoleModalOpen = useAccessControlStore(
        (state) => state.isRoleModalOpen,
    )
    const roleModalMode = useAccessControlStore((state) => state.roleModalMode)
    const selectedRole = useAccessControlStore((state) => state.selectedRole)
    const setSelectedRole = useAccessControlStore(
        (state) => state.setSelectedRole,
    )
    const closeRoleModal = useAccessControlStore(
        (state) => state.closeRoleModal,
    )

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: '',
            description: '',
            icon: 'UserIcon',
            color: 'bg-blue-500',
        },
        resolver: zodResolver(validationSchema),
    })

    // Reset form when modal opens/closes or mode changes
    useEffect(() => {
        if (isRoleModalOpen) {
            if (roleModalMode === 'edit' && selectedRole) {
                reset({
                    name: selectedRole.name,
                    description: selectedRole.description,
                    icon: selectedRole.icon,
                    color: selectedRole.color,
                })
            } else {
                reset({
                    name: '',
                    description: '',
                    icon: 'UserIcon',
                    color: 'bg-blue-500',
                })
            }
        }
    }, [isRoleModalOpen, roleModalMode, selectedRole, reset])

    const handleClose = async () => {
        closeRoleModal()
        setSelectedRole(null)
        await sleep(200)
        reset()
    }

    const handleFormSubmit = async (values: FormSchema) => {
        await sleep(500)

        if (roleModalMode === 'create') {
            setRolesData((prev) => [
                ...prev,
                {
                    id: `role-${Date.now()}`,
                    name: values.name,
                    description: values.description,
                    icon: values.icon,
                    color: values.color,
                    memberCount: 0,
                    members: [],
                    permissions: [],
                    isDefault: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ])
        } else if (roleModalMode === 'edit' && selectedRole) {
            setRolesData((prev) => {
                return prev.map((role) => {
                    if (role.id === selectedRole.id) {
                        return {
                            ...role,
                            name: values.name,
                            description: values.description,
                            icon: values.icon,
                            color: values.color,
                            updatedAt: new Date().toISOString(),
                        }
                    }
                    return role
                })
            })
        }

        handleClose()
    }

    const modalConfig = getModalConfig(roleModalMode)

    return (
        <Dialog
            isOpen={isRoleModalOpen}
            onClose={handleClose}
            closable={false}
            className="p-0"
            width={600}
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame variant="layered">
                        <modalConfig.icon className="text-lg heading-text" />
                    </IconFrame>
                    <div>
                        <h5>{modalConfig.title}</h5>
                        <p className="pr-12">{modalConfig.subtitle}</p>
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
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        label="Role Name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Enter role name (e.g., Administrator, Manager)"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Description"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Describe the role's responsibilities and access level"
                                    textArea
                                    rows={3}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Icon"
                        invalid={Boolean(errors.icon)}
                        errorMessage={errors.icon?.message}
                    >
                        <Controller
                            name="icon"
                            control={control}
                            render={({ field }) => (
                                <div className="inline-flex flex-wrap gap-2">
                                    {Object.entries(roleIconMap).map(
                                        ([key, IconComponent]) => (
                                            <button
                                                key={key}
                                                onClick={() =>
                                                    field.onChange(key)
                                                }
                                                className={classNames(
                                                    'flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700',
                                                    field.value === key
                                                        ? 'border=primary text-primary'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:bg-gray-700',
                                                )}
                                                type="button"
                                                title={key}
                                            >
                                                <IconComponent className="text-xl" />
                                            </button>
                                        ),
                                    )}
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Color"
                        invalid={Boolean(errors.color)}
                        errorMessage={errors.color?.message}
                    >
                        <Controller
                            name="color"
                            control={control}
                            render={({ field }) => (
                                <div className="flex gap-2">
                                    {Object.entries(roleColorMap).map(
                                        ([key, group]) => (
                                            <div key={key}>
                                                <button
                                                    onClick={() =>
                                                        field.onChange(key)
                                                    }
                                                    className={classNames(
                                                        'relative w-6 h-6 rounded-lg  transition-all duration-200 hover:scale-105',
                                                        group.bgClass,
                                                    )}
                                                    type="button"
                                                    title={key}
                                                >
                                                    {field.value === key && (
                                                        <div
                                                            className={classNames(
                                                                'absolute inset-0 flex items-center justify-center text-xs text-white',
                                                            )}
                                                        >
                                                            ✓
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            loading={isSubmitting}
                            type="submit"
                        >
                            {modalConfig.submitText}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default RoleDialog
