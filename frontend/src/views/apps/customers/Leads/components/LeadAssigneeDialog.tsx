import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { FormItem, Form } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import { LiCross, LiUserAdd } from '@/icons'
import { useLeadsListStore } from '../store/leadsListStore'
import { apiGetProjectMembers } from '@/services/ProjectService'
import useSWRMutation from 'swr/mutation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormSchema = {
    assignee: string
    assignmentReason?: string
    notifyAssignee?: boolean
}

const validationSchema = z.object({
    assignee: z.string().min(1, 'Please select one assignee!'),
})

const LeadAssigneeDialog = () => {
    const selectedRows = useLeadsListStore((state) => state.selectedRows)
    const setSelectAllRows = useLeadsListStore(
        (state) => state.setSelectAllRows,
    )

    const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false)

    const { trigger, data } = useSWRMutation([`/api/assignee/user/`], () =>
        apiGetProjectMembers<{
            allMembers: {
                id: string
                name: string
                firstName: string
                lastName: string
                email: string
                img: string
            }[]
        }>(),
    )

    const options = useMemo(() => {
        return (
            data?.allMembers.map((member) => ({
                label: member.name,
                value: member.id,
                img: member.img,
            })) || []
        )
    }, [data])

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            assignee: '',
            assignmentReason: '',
            notifyAssignee: false,
        },
        resolver: zodResolver(validationSchema),
    })

    const handleDialogOpen = () => {
        trigger()
        setAssigneeDialogOpen(true)
    }

    const handleClose = () => {
        setAssigneeDialogOpen(false)
        setSelectAllRows([])
    }

    const handleFormSubmit = (values: FormSchema) => {
        handleClose()
        toast.push(
            <Notification
                type="success"
                title={`Assigned leads to ${options.find((option) => option.value === values.assignee)?.label}`}
            />,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <>
            <Button onClick={handleDialogOpen}>Assign</Button>
            <Dialog
                isOpen={assigneeDialogOpen}
                className="p-0"
                closable={false}
                onClose={handleClose}
            >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <IconFrame variant="thick">
                            <LiUserAdd className="heading-text text-xl" />
                        </IconFrame>
                        <div>
                            <h5>Assign Lead</h5>
                            <p className="pr-12">
                                Distribute {selectedRows.length} selected leads
                                to assignee.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="subtle"
                        size="sm"
                        type="button"
                        icon={<LiCross className="text-2xl" />}
                        onClick={() => {
                            handleClose()
                            reset()
                        }}
                    />
                </div>
                <div className="p-4">
                    <Form onSubmit={handleSubmit(handleFormSubmit)}>
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
                                        options={options}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                        value={options.find(
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
                        <FormItem label="Assignment Reason">
                            <Controller
                                name="assignmentReason"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        placeholder="Assignment Reason"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem>
                            <Controller
                                name="notifyAssignee"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Switcher
                                            checked={field.value}
                                            onChange={(checked) => {
                                                field.onChange(checked)
                                            }}
                                        />
                                        <span className="font-medium">
                                            Notify Assignee
                                        </span>
                                    </div>
                                )}
                            />
                        </FormItem>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                onClick={() => {
                                    handleClose()
                                    reset()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isSubmitting}
                            >
                                Assign
                            </Button>
                        </div>
                    </Form>
                </div>
            </Dialog>
        </>
    )
}

export default LeadAssigneeDialog
