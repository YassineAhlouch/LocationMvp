import { useMemo } from 'react'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import useScrumboard from '../hooks/useScrumboardData'
import { useScrumboardStore } from '../store/scrumboardStore'
import { priorityMap, tagsMap } from '../utils'
import { LiTag, LiCross } from '@/icons'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import dayjs from 'dayjs'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormSchema = {
    subject: string
    description: string
    assignee: string
    priority: string
    dueDate: string
    tags: string[]
}

const validationSchema = z.object({
    subject: z.string().min(1, 'Please input subject!'),
    description: z.string().min(1, 'Please input description!'),
    priority: z.string().min(1, 'Please select priority!'),
    dueDate: z.string().min(1, 'Please select due date!'),
    tags: z.array(z.string()).nonempty('Select at least one tag!'),
    assignee: z.string().min(1, 'Please select one assignee!'),
})

const AddTicketDialog = () => {
    const selectedColumn = useScrumboardStore((state) => state.selectedColumn)
    const addTaskDialogOpen = useScrumboardStore(
        (state) => state.addTaskDialogOpen,
    )
    const setAddTaskDialogOpen = useScrumboardStore(
        (state) => state.setAddTaskDialogOpen,
    )
    const setSelectedColumn = useScrumboardStore(
        (state) => state.setSelectedColumn,
    )

    const { setTasks, projectMeta } = useScrumboard()

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            subject: '',
            description: '',
            priority: '',
            dueDate: '',
            tags: [],
            assignee: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const handleClose = async () => {
        setAddTaskDialogOpen(false)
        await sleep(200)
        setSelectedColumn('')
        reset()
    }

    const priorityOptions = useMemo(() => {
        return Object.entries(priorityMap).map(([key]) => {
            return {
                value: key,
                label: key,
            }
        })
    }, [])

    const tagOptions = useMemo(() => {
        return Object.entries(tagsMap).map(([key]) => {
            return {
                value: key,
                label: key,
            }
        })
    }, [])

    const assigneeOptions = useMemo(() => {
        return (
            projectMeta?.allMembers.map((member) => ({
                label: member.name,
                value: member.id,
                img: member.img,
            })) || []
        )
    }, [projectMeta])

    const handleFormSubmit = async (values: FormSchema) => {
        await sleep(500)
        setTasks((data) => {
            return [
                {
                    id: Date.now().toString(),
                    subject: values.subject,
                    columnId: selectedColumn,
                    description: values.description,
                    cover: '',
                    members:
                        projectMeta?.allMembers.filter(
                            (member) => member.id === values.assignee,
                        ) || [],
                    tags: values.tags,
                    priority: values.priority,
                    attachmentCount: 0,
                    taskCount: 0,
                    commentCount: 0,
                    dueDate: values.dueDate,
                },
                ...data,
            ]
        })
        handleClose()
    }

    return (
        <Dialog
            isOpen={addTaskDialogOpen}
            onClose={handleClose}
            closable={false}
            className="p-0"
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame variant="thick">
                        <LiTag className="text-xl heading-text" />
                    </IconFrame>
                    <div>
                        <h5>Add new ticket</h5>
                        <p className="pr-12 hidden sm:block">
                            Add a new ticket to the selected column
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="subtle"
                    type="button"
                    icon={<LiCross className="text-2xl" />}
                    onClick={handleClose}
                />
            </div>
            <div className="p-4">
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        label="Subject"
                        invalid={Boolean(errors.subject)}
                        errorMessage={errors.subject?.message}
                    >
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <Input placeholder="Enter Subject" {...field} />
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
                                    placeholder="Enter Description"
                                    {...field}
                                    textArea
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
                                                            'h-3.5 w-3.5 rounded-xs',
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
                                                        'h-3.5 w-3.5 rounded-xs',
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
                    <FormItem
                        label="Assignee"
                        invalid={Boolean(errors.assignee)}
                        errorMessage={errors.assignee?.message}
                    >
                        <Controller
                            name="assignee"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={assigneeOptions}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    value={assigneeOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    placeholder="Select Assignee"
                                    customInputDisplay={(selectedItem) => (
                                        <SelectInputWithPrefix
                                            label={selectedItem?.label}
                                            showPrefix={Boolean(
                                                selectedItem?.value,
                                            )}
                                            prefix={
                                                selectedItem && (
                                                    <img
                                                        src={selectedItem.img}
                                                        className="w-5 h-5 rounded-full"
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
                                                    src={option?.img}
                                                    className="w-5 h-5 rounded-full"
                                                    alt={option?.label}
                                                />
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Tags"
                        invalid={Boolean(errors.tags)}
                        errorMessage={errors.tags?.message}
                    >
                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <Select.Multi
                                    options={tagOptions}
                                    value={tagOptions.filter((option) =>
                                        field.value.includes(option.value),
                                    )}
                                    onChange={(options) =>
                                        field.onChange(
                                            options.map(
                                                (option) => option.value,
                                            ),
                                        )
                                    }
                                    placeholder="Select tags"
                                />
                            )}
                        />
                    </FormItem>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            loading={isSubmitting}
                            type="submit"
                        >
                            Add Ticket
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default AddTicketDialog
