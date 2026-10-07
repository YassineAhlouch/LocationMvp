import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Upload from '@/components/ui/Upload'
import Avatar from '@/components/ui/Avatar'
import Drawer from '@/components/ui/Drawer'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker'
import { FormItem, Form } from '@/components/ui/Form'
import Divider from '@/components/shared/Divider'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import useProjectListData from '../hooks/useProjectListData'
import { LiImageAdd, LiCross, LiElementPlus } from '@/icons'
import { priorityMap, statusMap } from '../utils'
import { apiGetProjectMembers } from '@/services/ProjectService'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'
import useSWR from 'swr'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type MemberOption = {
    value: string
    label: string
    img: string
    email: string
}

type FormSchema = {
    name: string
    status: string
    dueDate: string
    description?: string
    img?: string
    members: MemberOption[]
    priority: string
}

const AVATAR_SIZE = 50

const validationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    status: z.string().min(1, 'Status is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    members: z
        .array(
            z.object({
                value: z.string(),
                label: z.string(),
                img: z.string(),
                email: z.string(),
            }),
        )
        .nonempty('At least one member is required'),
    priority: z.string().min(1, 'Priority is required'),
    description: z.string().optional(),
    img: z.string().optional(),
})

const CreateProject = () => {
    const [openDrawer, setOpenDrawer] = useState(false)

    const { setData } = useProjectListData()

    const { data: members, isLoading } = useSWR(
        '/projects/createProject/members',
        apiGetProjectMembers<{
            allMembers: {
                id: string
                name: string
                firstName: string
                lastName: string
                email: string
                img: string
            }[]
        }>,
    )

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: '',
            status: '',
            dueDate: '',
            description: '',
            img: '',
            members: [],
            priority: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const priorityOptions = useMemo(() => {
        return Object.entries(priorityMap).map(([key]) => {
            return {
                value: key,
                label: key,
            }
        })
    }, [])

    const statusOptions = useMemo(() => {
        return Object.entries(statusMap).map(([key, value]) => {
            return {
                value: key,
                label: value.label,
                icon: value.icon,
                color: value.color,
            }
        })
    }, [])

    const memberOptions = useMemo(() => {
        return (
            members?.allMembers.map((member) => ({
                label: member.name,
                value: member.id,
                email: member.email,
                img: member.img,
            })) || []
        )
    }, [members])

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

    const handleClose = () => {
        setOpenDrawer(false)
        reset()
    }

    const handleFormSubmit = async (data: FormSchema) => {
        await sleep(1000)
        const newProject = {
            id: uniqueId('new-project-'),
            name: data.name,
            client: '',
            status: data.status,
            startDate: '',
            dueDate: data.dueDate,
            progress: 0,
            favorite: false,
            description: data.description || '',
            img: data.img || '',
            members: data.members.map((member) => ({
                id: member.value,
                name: member.label,
                email: member.email,
                img: member.img,
            })),
            priority: data.priority,
            tasks: { total: 0, completed: 0 },
        }

        setData((prev) => [newProject, ...prev])
        setOpenDrawer(false)
        reset()
        toast.push(
            <Notification
                type="success"
                title={'A new project has been created'}
            />,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <>
            <Button variant="solid" onClick={() => setOpenDrawer(true)}>
                Create Project
            </Button>
            <Drawer
                closable={false}
                isOpen={openDrawer}
                onClose={handleClose}
                footer={
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button size="sm" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variant="solid"
                            type="submit"
                            loading={isSubmitting}
                            onClick={handleSubmit(handleFormSubmit)}
                        >
                            Create
                        </Button>
                    </div>
                }
            >
                <div className="flex justify-between gap-4">
                    <div>
                        <IconFrame variant="layered">
                            <LiElementPlus className="text-xl heading-text" />
                        </IconFrame>
                        <h6 className="text-lg font-semibold mt-6">
                            Create Project
                        </h6>
                        <p>Get started quickly & keep everything organized</p>
                    </div>
                    <div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleClose}
                            type="button"
                        >
                            <LiCross className="text-base" />
                        </Button>
                    </div>
                </div>
                <Divider className="my-4" />
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem>
                        <Controller
                            name="img"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <div>
                                        <Upload
                                            showList={false}
                                            uploadLimit={1}
                                            beforeUpload={beforeUpload}
                                            onChange={(files) => {
                                                field.onChange(
                                                    URL.createObjectURL(files),
                                                )
                                            }}
                                        >
                                            <div className="flex items-center gap-2 cursor-pointer">
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
                                                        className="relative rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-800 heading-text border-dashed"
                                                    >
                                                        <LiImageAdd className="text-xl" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium heading-text">
                                                        Upload a logo
                                                    </div>
                                                    <span className="text-xs">
                                                        We only support PNGs and
                                                        JPEGs
                                                    </span>
                                                </div>
                                            </div>
                                        </Upload>
                                    </div>
                                </>
                            )}
                        />
                    </FormItem>
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
                                    placeholder="Enter Project Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Name"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Enter Description"
                                    textArea
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Priority"
                        invalid={Boolean(errors.priority)}
                        errorMessage={errors.priority?.message}
                    >
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={priorityOptions}
                                    value={priorityOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                    placeholder="Select priority"
                                    customInputDisplay={(selectedItem) => (
                                        <SelectInputWithPrefix
                                            label={selectedItem?.label}
                                            prefix={
                                                selectedItem && (
                                                    <span
                                                        className={classNames(
                                                            'h-3 w-3 rounded-sm',
                                                            priorityMap[
                                                                selectedItem
                                                                    .label
                                                            ].color,
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
                                            selected={selected}
                                            checkIcon={CheckIcon}
                                            label={option?.label}
                                            prefix={
                                                <span
                                                    className={classNames(
                                                        'h-3 w-3 rounded-sm',
                                                        priorityMap[
                                                            option.label
                                                        ].color,
                                                    )}
                                                ></span>
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Status"
                        invalid={Boolean(errors.status)}
                        errorMessage={errors.status?.message}
                    >
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                    placeholder="Select status"
                                    customInputDisplay={(selectedItem) => (
                                        <SelectInputWithPrefix
                                            label={selectedItem?.label}
                                            prefix={
                                                selectedItem && (
                                                    <span className="text-base">
                                                        {
                                                            statusMap[
                                                                selectedItem
                                                                    .value
                                                            ].icon
                                                        }
                                                    </span>
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
                                                <span
                                                    className={classNames(
                                                        'text-base',
                                                        option.color,
                                                    )}
                                                >
                                                    {
                                                        statusMap[option.value]
                                                            ?.icon
                                                    }
                                                </span>
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Assignee"
                        invalid={Boolean(errors.members)}
                        errorMessage={errors.members?.message}
                    >
                        <Controller
                            name="members"
                            control={control}
                            render={({ field }) => (
                                <Select.Multi
                                    options={memberOptions}
                                    isDisabled={isLoading}
                                    value={field.value}
                                    onChange={(option) =>
                                        field.onChange(option)
                                    }
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
                                                    src={option?.img}
                                                    className="w-5 h-5 rounded-full"
                                                    alt={option?.label}
                                                />
                                            }
                                        />
                                    )}
                                    customLabel={(item) => (
                                        <div className="flex items-center gap-1">
                                            <Avatar
                                                shape="circle"
                                                size={14}
                                                src={item.img}
                                            />
                                            <span>{item.label}</span>
                                        </div>
                                    )}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Due Date"
                        invalid={Boolean(errors.dueDate)}
                        errorMessage={errors.dueDate?.message}
                    >
                        <Controller
                            name="dueDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    placeholder="Select Due Date"
                                    value={
                                        field.value
                                            ? dayjs(field.value).toDate()
                                            : null
                                    }
                                    onChange={(value) =>
                                        field.onChange(
                                            dayjs(value).toISOString(),
                                        )
                                    }
                                    clearable={false}
                                />
                            )}
                        />
                    </FormItem>
                </Form>
            </Drawer>
        </>
    )
}

export default CreateProject
