import { useMemo, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Scroll from '@/components/ui/Scroll'
import { Form, FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { apiGetProjectMembers } from '@/services/ProjectService'
import { statusMap, categoriesMap, priorityMap } from '../utils'
import classNames from '@/utils/classNames'
import { LuTag, LuX } from 'react-icons/lu'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import useSWR from 'swr'
import { useForm, Controller } from 'react-hook-form'
import type { TicketDetails, EditableTicketDetails } from '../types'

type TicketInfoProps = {
    data: TicketDetails
    onUpdate: (data: EditableTicketDetails) => void
    onRemoveLinkedTicket: (id: string) => void
}

type FormSchema = EditableTicketDetails

const projectOption = [
    { value: 'CRM Web', label: 'CRM Web' },
    { value: 'Inventory App', label: 'Inventory App' },
    { value: 'Workflow Manager', label: 'Workflow Manager' },
    { value: 'Billing System', label: 'Billing System' },
    { value: 'Analytics Suite', label: 'Analytics Suite' },
]

const TicketInfo = ({
    data,
    onUpdate,
    onRemoveLinkedTicket,
}: TicketInfoProps) => {
    const {
        control,
        formState: { errors },
        watch,
    } = useForm<FormSchema>({
        defaultValues: {
            priority: data.priority,
            project: data.project,
            dueDate: data.dueDate,
            category: data.category,
            subject: data.subject,
            status: data.status,
            assignee: data.assignee,
        },
    })

    const { data: members, isLoading } = useSWR(
        '/helpdesk/members',
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

    useEffect(() => {
        const debouncedCallback = debounce(
            (formValue) => onUpdate(formValue),
            300,
        )

        const subscription = watch(debouncedCallback)

        return () => subscription.unsubscribe()
    }, [onUpdate, watch])

    const priorityOptions = useMemo(() => {
        return Object.entries(priorityMap).map(([key]) => {
            return {
                value: key,
                label: key,
            }
        })
    }, [])

    const categoryOptions = useMemo(() => {
        return Object.entries(categoriesMap).map(([key]) => {
            return {
                value: key,
                label: key,
            }
        })
    }, [])

    const assigneeOptions = useMemo(() => {
        return (
            members?.allMembers.map((member) => ({
                label: member.name,
                value: member.id,
                img: member.img,
            })) || []
        )
    }, [members])

    const statusOptions = useMemo(() => {
        return Object.entries(statusMap).map(([key]) => {
            return {
                value: key,
                label: key,
            }
        })
    }, [])

    return (
        <Form
            className="h-full"
            containerClassName="h-full flex flex-col justify-between"
        >
            <div className="relative flex-1">
                <div className="absolute top-0 left-0 h-full w-full">
                    <Scroll
                        className="h-full"
                        contentClassName="h-full"
                        scrollbars="vertical"
                    >
                        <div className="p-4">
                            <FormItem
                                label="Subject"
                                invalid={Boolean(errors.subject)}
                                errorMessage={errors.subject?.message}
                            >
                                <Controller
                                    name="subject"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Subject"
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
                                                    option.value ===
                                                    field.value,
                                            )}
                                            onChange={(option) =>
                                                field.onChange(option.value)
                                            }
                                            customInputDisplay={(
                                                selectedItem,
                                            ) => (
                                                <SelectInputWithPrefix
                                                    label={selectedItem?.label}
                                                    prefix={
                                                        selectedItem && (
                                                            <span
                                                                className={classNames(
                                                                    'h-3.5 w-3.5 rounded-sm',
                                                                    statusMap[
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
                                                    label={option.label}
                                                    prefix={
                                                        <span
                                                            className={classNames(
                                                                'h-3 w-3 rounded-sm',
                                                                statusMap[
                                                                    option.label
                                                                ].color,
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
                                                    option.value ===
                                                    field.value,
                                            )}
                                            onChange={(option) =>
                                                field.onChange(option.value)
                                            }
                                            customInputDisplay={(
                                                selectedItem,
                                            ) => (
                                                <SelectInputWithPrefix
                                                    label={selectedItem?.label}
                                                    prefix={
                                                        selectedItem && (
                                                            <span
                                                                className={classNames(
                                                                    'text-base',
                                                                    priorityMap[
                                                                        selectedItem
                                                                            .label
                                                                    ].color,
                                                                )}
                                                            >
                                                                {
                                                                    priorityMap[
                                                                        selectedItem
                                                                            .label
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
                                                                priorityMap[
                                                                    option.label
                                                                ].color,
                                                            )}
                                                        >
                                                            {
                                                                priorityMap[
                                                                    option.label
                                                                ].icon
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
                                invalid={Boolean(errors.assignee)}
                                errorMessage={errors.assignee?.message}
                            >
                                <Controller
                                    name="assignee"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={assigneeOptions}
                                            isDisabled={isLoading}
                                            value={assigneeOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value.id,
                                            )}
                                            onChange={(option) =>
                                                field.onChange({
                                                    id: option.value,
                                                    name: option.label,
                                                    img: option.img,
                                                })
                                            }
                                            customInputDisplay={(
                                                selectedItem,
                                            ) => (
                                                <SelectInputWithPrefix
                                                    label={selectedItem?.label}
                                                    showPrefix={Boolean(
                                                        selectedItem?.value,
                                                    )}
                                                    prefix={
                                                        selectedItem && (
                                                            <img
                                                                src={
                                                                    selectedItem.img
                                                                }
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
                                label="Category"
                                invalid={Boolean(errors.category)}
                                errorMessage={errors.category?.message}
                            >
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={categoryOptions}
                                            value={categoryOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            )}
                                            onChange={(option) =>
                                                field.onChange(option.value)
                                            }
                                            customInputDisplay={(
                                                selectedItem,
                                            ) => (
                                                <SelectInputWithPrefix
                                                    label={selectedItem?.label}
                                                    prefix={
                                                        selectedItem && (
                                                            <span
                                                                className={classNames(
                                                                    'text-base',
                                                                )}
                                                            >
                                                                {
                                                                    categoriesMap[
                                                                        selectedItem
                                                                            .label
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
                                                            )}
                                                        >
                                                            {
                                                                categoriesMap[
                                                                    option.label
                                                                ].icon
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
                                label="Project"
                                invalid={Boolean(errors.project)}
                                errorMessage={errors.project?.message}
                            >
                                <Controller
                                    name="project"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={projectOption}
                                            value={projectOption.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            )}
                                            onChange={(option) =>
                                                field.onChange(option.value)
                                            }
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
                                            inputFormat="DD MMM YYYY"
                                            placeholder="Due Date"
                                            clearable={false}
                                            value={dayjs(field.value).toDate()}
                                            onChange={(date) =>
                                                field.onChange(
                                                    dayjs(date).format(
                                                        'YYYY-MM-DD',
                                                    ),
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                            {data.linkedTickes.length > 0 && (
                                <div>
                                    <div className="form-label mb-1">
                                        Linked Tickets
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {data.linkedTickes.map((ticket) => (
                                            <Card
                                                key={ticket.id}
                                                bodyClass="px-3 py-2"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-1 heading-text text-xs font-semibold">
                                                        <LuTag />
                                                        <span className="hover:underline cursor-pointer">
                                                            {ticket.id}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        icon={<LuX />}
                                                        size="sm"
                                                        className="w-5 h-5 text-xs rounded"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            onRemoveLinkedTicket(
                                                                ticket.id,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="text-xs mt-1">
                                                    {ticket.subject}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Scroll>
                </div>
            </div>
        </Form>
    )
}

export default TicketInfo
