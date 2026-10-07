import { useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { FormItem, Form } from '@/components/ui/Form'
import TransferOwnerShipDialog from './TransferOwnerShipDialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import SettingsHeader from './SettingsHeader'
import useProjectSettingData from '../hooks/useProjectSettingData'
import { useProjectSettingStore } from '../store/projectSettingStore'
import sleep from '@/utils/sleep'
import acronym from '@/utils/acronym'
import classNames from '@/utils/classNames'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { SettingsGeneral } from '../types'

type FormSchema = SettingsGeneral

const validationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    status: z.string().min(1, 'Status is required'),
    language: z.string().min(1, 'Language is required'),
    timezone: z.string().min(1, 'Timezone is required'),
})

const languageOptions = [
    { value: 'en', label: 'English', flag: 'US' },
    { value: 'es', label: 'Spanish', flag: 'ES' },
    { value: 'fr', label: 'French', flag: 'FR' },
    { value: 'de', label: 'German', flag: 'DE' },
    { value: 'it', label: 'Italian', flag: 'IT' },
    { value: 'pt', label: 'Portuguese', flag: 'PT' },
    { value: 'ch', label: 'Chinese', flag: 'CN' },
    { value: 'jp', label: 'Japanese', flag: 'JP' },
    { value: 'kr', label: 'Korean', flag: 'KR' },
]

const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-success' },
    { value: 'paused', label: 'Paused', color: 'bg-warning' },
    { value: 'draft', label: 'Draft', color: 'bg-info' },
]

const AVATAR_SIZE = 70

const General = () => {
    const { data, setData } = useProjectSettingData()

    const [archiveDialog, setArchiveDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [transferOwnerDialog, setTransferOwnerDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    const disabled = useProjectSettingStore((state) => state.disabled)
    const setArchived = useProjectSettingStore((state) => state.setArchived)
    const setDeleted = useProjectSettingStore((state) => state.setDeleted)
    const setDisabled = useProjectSettingStore((state) => state.setDisabled)

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            ...data?.general,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        reset(data?.general)
    }, [data, reset])

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }

    const handleFormSubmit = async (values: FormSchema) => {
        await sleep(1000)
        setData((data) => ({
            ...data,
            general: values,
        }))
    }

    const handleSetArchived = async () => {
        setLoading(true)
        await sleep(1000)
        setArchived(true)
        setDisabled(true)
        setLoading(false)
        setArchiveDialog(false)
    }

    const handleSetDelete = async () => {
        setLoading(true)
        await sleep(1000)
        setDeleted(true)
        setLoading(false)
        setDeleteDialog(false)
    }

    const handleSetDisabled = () => {
        setDisabled(true)
        setTransferOwnerDialog(false)
    }

    return (
        <>
            <SettingsHeader
                title="General"
                description="Manage your project configuration and preferences"
            >
                <Button disabled={disabled}>Cancel</Button>
                <Button
                    variant="solid"
                    disabled={disabled}
                    loading={isSubmitting}
                    onClick={handleSubmit(handleFormSubmit)}
                >
                    Save Changes
                </Button>
            </SettingsHeader>
            <div className="space-y-4 mt-4">
                <Form>
                    <FormItem>
                        <Controller
                            name="logo"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <div className="flex items-center gap-4">
                                        <>
                                            {field.value ? (
                                                <Avatar
                                                    src={field?.value}
                                                    size={AVATAR_SIZE}
                                                    alt="Upload image"
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: AVATAR_SIZE,
                                                        height: AVATAR_SIZE,
                                                    }}
                                                    className="relative rounded-lg overflow-hidden flex items-center justify-center"
                                                >
                                                    <div className="absolute top-0 left-0 w-full h-full">
                                                        <svg
                                                            width={AVATAR_SIZE}
                                                            height={AVATAR_SIZE}
                                                            viewBox="0 0 100 100"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <defs>
                                                                <radialGradient
                                                                    id="grad"
                                                                    cx="30%"
                                                                    cy="30%"
                                                                    r="90%"
                                                                >
                                                                    <stop
                                                                        offset="0%"
                                                                        stopColor="#f92599"
                                                                    />
                                                                    <stop
                                                                        offset="100%"
                                                                        stopColor="#3758f6"
                                                                    />
                                                                </radialGradient>
                                                            </defs>
                                                            <rect
                                                                x="0"
                                                                y="0"
                                                                width="100"
                                                                height="100"
                                                                fill="url(#grad)"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="text-3xl z-10 text-white font-medium">
                                                        {acronym(
                                                            data?.general.name,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                        <Upload
                                            showList={false}
                                            uploadLimit={1}
                                            beforeUpload={beforeUpload}
                                            onChange={(files) => {
                                                field.onChange(
                                                    URL.createObjectURL(files),
                                                )
                                            }}
                                            disabled={disabled}
                                        >
                                            <div>
                                                <div className="mb-2">
                                                    <div className="font-medium heading-text">
                                                        Upload a logo
                                                    </div>
                                                    <span className="text-xs">
                                                        We only support PNGs and
                                                        JPEGs under 10MB
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="subtle"
                                                    className="h-7"
                                                    size="sm"
                                                    type="button"
                                                    disabled={disabled}
                                                >
                                                    Upload Image
                                                </Button>
                                            </div>
                                        </Upload>
                                    </div>
                                </>
                            )}
                        />
                    </FormItem>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormItem
                            label="Project Name"
                            htmlFor="name"
                            errorMessage={errors.name?.message}
                            invalid={Boolean(errors.name)}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="name"
                                        placeholder="Project Name"
                                        disabled={disabled}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Project Slug"
                            htmlFor="slug"
                            errorMessage={errors.slug?.message}
                            invalid={Boolean(errors.slug)}
                        >
                            <Controller
                                name="slug"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="slug"
                                        placeholder="Project Slug"
                                        disabled={disabled}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormItem
                            label="Status"
                            htmlFor="status"
                            invalid={Boolean(errors.status)}
                            errorMessage={errors.status?.message}
                        >
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="status"
                                        options={statusOptions}
                                        value={statusOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        isDisabled={disabled}
                                        onChange={(option) =>
                                            field.onChange(option.value)
                                        }
                                        customInputDisplay={(selectedItem) => (
                                            <SelectInputWithPrefix
                                                label={selectedItem?.label}
                                                prefix={
                                                    selectedItem && (
                                                        <span
                                                            className={classNames(
                                                                'h-3.5 w-3.5 rounded-sm',
                                                                selectedItem.color,
                                                            )}
                                                        ></span>
                                                    )
                                                }
                                            />
                                        )}
                                        customOption={({
                                            option,
                                            selected,
                                            CheckIcon,
                                        }) => (
                                            <SelectOptionWithPrefix
                                                label={option.label}
                                                prefix={
                                                    <span
                                                        className={classNames(
                                                            'h-3 w-3 rounded-sm',
                                                            option.color,
                                                        )}
                                                    ></span>
                                                }
                                                selected={selected}
                                                checkIcon={CheckIcon}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            htmlFor="language"
                            label="Language"
                            invalid={Boolean(errors.language)}
                            errorMessage={errors.language?.message}
                        >
                            <Controller
                                name="language"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="language"
                                        options={languageOptions}
                                        isDisabled={disabled}
                                        customInputDisplay={(selectedItem) => (
                                            <SelectInputWithPrefix
                                                label={selectedItem?.label}
                                                prefix={
                                                    selectedItem && (
                                                        <img
                                                            src={`/img/countries/${selectedItem?.flag}.png`}
                                                            className="w-4 h-4"
                                                            alt={
                                                                selectedItem?.label
                                                            }
                                                        />
                                                    )
                                                }
                                            />
                                        )}
                                        customOption={({
                                            option,
                                            selected,
                                            CheckIcon,
                                        }) => (
                                            <SelectOptionWithPrefix
                                                selected={selected}
                                                checkIcon={CheckIcon}
                                                label={option?.label}
                                                prefix={
                                                    <img
                                                        src={`/img/countries/${option?.flag}.png`}
                                                        className="w-4 h-4"
                                                        alt={option?.label}
                                                    />
                                                }
                                            />
                                        )}
                                        onChange={(selectedItem) =>
                                            field.onChange(selectedItem?.value)
                                        }
                                        value={languageOptions.find(
                                            (item) =>
                                                item.value === field.value,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <FormItem
                        label="Description"
                        htmlFor="description"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="description"
                                    placeholder="Project Description"
                                    disabled={disabled}
                                    textArea
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </Form>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="font-semibold">Danger Zone</h5>
                    </div>
                    <Card bodyClass="p-0">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="font-semibold heading-text">
                                        Transfer ownership
                                    </div>
                                    <p>
                                        You can transfer the ownership of this
                                        project to another user
                                    </p>
                                </div>
                                <div>
                                    <Button
                                        disabled={disabled}
                                        onClick={() =>
                                            setTransferOwnerDialog(true)
                                        }
                                    >
                                        Transfer
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="font-semibold heading-text">
                                        Archive this project
                                    </div>
                                    <p>
                                        Once you archive this project, you will
                                        be able to restore it later.
                                    </p>
                                </div>
                                <div>
                                    <Button
                                        disabled={disabled}
                                        onClick={() => setArchiveDialog(true)}
                                    >
                                        Archive Project
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="font-semibold heading-text">
                                        Delete this project
                                    </div>
                                    <p>
                                        Once you delete this project, it cannot
                                        be recovered.
                                    </p>
                                </div>
                                <div>
                                    <Button
                                        variant="subtle"
                                        disabled={disabled}
                                        onClick={() => setDeleteDialog(true)}
                                        className={({ active, unclickable }) =>
                                            classNames(
                                                'text-error border border-gray-300 dark:border-gray-500',
                                                active
                                                    ? ''
                                                    : 'bg-gray-100 dark:bg-gray-600',
                                                unclickable &&
                                                    'opacity-50 cursor-not-allowed',
                                                !active &&
                                                    !unclickable &&
                                                    'hover:bg-gray-200 hover:dark:bg-gray-500',
                                            )
                                        }
                                    >
                                        Delete Project
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <ConfirmDialog
                isOpen={archiveDialog}
                type="danger"
                title="Archive Project"
                onClose={() => setArchiveDialog(false)}
                onCancel={() => setArchiveDialog(false)}
                onConfirm={handleSetArchived}
                confirmButtonProps={{ loading }}
            >
                <p>
                    {' '}
                    Are you sure you want to archive this project? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
            <ConfirmDialog
                isOpen={deleteDialog}
                type="danger"
                title="Delete Project"
                onClose={() => setDeleteDialog(false)}
                onCancel={() => setDeleteDialog(false)}
                onConfirm={handleSetDelete}
                confirmButtonProps={{ loading }}
            >
                <p>
                    {' '}
                    Are you sure you want to delete this project? This action
                    can&apos;t be undo
                    {`(don't worry, you can refresh the page to restore it)`}.
                </p>
            </ConfirmDialog>
            <TransferOwnerShipDialog
                open={transferOwnerDialog}
                onClose={() => setTransferOwnerDialog(false)}
                onConfirm={handleSetDisabled}
                members={data?.allMembers || []}
                projectName={data?.general?.slug || ''}
            />
        </>
    )
}

export default General
