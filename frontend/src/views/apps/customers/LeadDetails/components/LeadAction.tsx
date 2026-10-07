import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { FormItem, Form } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import IconFrame from '@/components/shared/IconFrame'
import { LiCross, LiTrash, LiProfile, LiRefresh, LiUserTick } from '@/icons'
import { apiGetProjectMembers } from '@/services/ProjectService'
import { leadStatusColor } from '../utils'
import sleep from '@/utils/sleep'
import { useNavigate } from 'react-router'
import useSWR from 'swr'
import { LuEllipsis } from 'react-icons/lu'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Lead } from '../types'

type LeadActionProps = {
    data: Lead
}

type ReasssignFormSchema = {
    assignee: string
    assignmentReason?: string
    notifyAssignee?: boolean
}

type ChangeStatusFormSchema = {
    status: string
    updateReason?: string
    notifyAssignee?: boolean
}

type ReassignDialogProps = {
    onClose: () => void
    leadId: string
}

type ChangeStatusFormProps = {
    onClose: () => void
    leadId: string
    leadStatus: string
}

const reassignValidationSchema = z.object({
    assignee: z.string().min(1, 'Please select one assignee!'),
})

const changeStatusValidationSchema = z.object({
    status: z.string().min(1, 'Please select one status!'),
})

const ReassignForm = ({ onClose, leadId }: ReassignDialogProps) => {
    const { data, isLoading } = useSWR(
        '/projects/scrum-board/members',
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
    } = useForm<ReasssignFormSchema>({
        defaultValues: {
            assignee: '',
            assignmentReason: '',
            notifyAssignee: false,
        },
        resolver: zodResolver(reassignValidationSchema),
    })

    const options = useMemo(() => {
        return (
            data?.allMembers.map((member) => ({
                label: member.name,
                value: member.id,
                img: member.img,
            })) || []
        )
    }, [data])

    const handleFormSubmit = async (values: ReasssignFormSchema) => {
        console.log('Form submitted with values:', values, leadId)
        await sleep(1000)
        onClose()
        reset()
        toast.push(
            <Notification title="Lead assigned" type="success">
                Status has been successfully assigned.
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <>
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame variant="thick">
                        <LiUserTick className="text-xl heading-text" />
                    </IconFrame>
                    <div>
                        <h5>Assign Lead</h5>
                        <p className="pr-12">
                            Distribute this lead to assignee.
                        </p>
                    </div>
                </div>
                <Button
                    variant="subtle"
                    size="sm"
                    type="button"
                    icon={<LiCross className="text-2xl" />}
                    onClick={onClose}
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
                                    isDisabled={isLoading}
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
                                onClose()
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
        </>
    )
}

const ChangeStatusForm = ({
    onClose,
    leadStatus,
    leadId,
}: ChangeStatusFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ChangeStatusFormSchema>({
        defaultValues: {
            status: leadStatus,
        },
        resolver: zodResolver(changeStatusValidationSchema),
    })

    const options = useMemo(() => {
        return Object.entries(leadStatusColor).map(([key, value]) => ({
            label: key,
            value: key,
            color: value,
        }))
    }, [])

    const handleFormSubmit = async (values: ChangeStatusFormSchema) => {
        console.log('Form submitted with values:', values, leadId)
        await sleep(1000)
        onClose()
        toast.push(
            <Notification title="Lead status updated" type="success">
                The lead status has been successfully updated.
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <>
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame variant="thick">
                        <LiRefresh className="text-xl heading-text" />
                    </IconFrame>
                    <div>
                        <h5>Update Status</h5>
                        <p className="pr-12">Update the status of this lead.</p>
                    </div>
                </div>
                <Button
                    variant="subtle"
                    size="sm"
                    type="button"
                    icon={<LiCross className="text-2xl" />}
                    onClick={onClose}
                />
            </div>
            <div className="p-4">
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
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
                                    options={options}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    value={options.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    customInputDisplay={(selectedItem) => (
                                        <SelectInputWithPrefix
                                            label={selectedItem?.label}
                                            showPrefix={Boolean(
                                                selectedItem?.value,
                                            )}
                                            prefix={
                                                <span
                                                    className={`w-3 h-3 rounded ${leadStatusColor[selectedItem?.value]?.dot}`}
                                                ></span>
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
                                                    className={`w-3 h-3 rounded ${leadStatusColor[option?.value]?.dot}`}
                                                ></span>
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Update Reason">
                        <Controller
                            name="updateReason"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    placeholder="Update Reason"
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
                                onClose()
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                        >
                            Update
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}

const LeadAction = ({ data }: LeadActionProps) => {
    const [reassignDialogOpen, setReassignDialogOpen] = useState(false)
    const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const navigate = useNavigate()

    const handleDeleteConfirmDialogClose = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDeleteConfirmDialogConfirm = async () => {
        setIsDeleting(true)
        await sleep(1000)
        setIsDeleting(false)
        handleDeleteConfirmDialogClose()
        navigate('/apps/customers/leads')
        toast.push(
            <Notification title="Lead deleted" type="success">
                The lead has been successfully deleted.
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <>
            <Dropdown
                placement="bottom-end"
                renderTitle={
                    <Button
                        className="h-7 w-7"
                        size="sm"
                        icon={<LuEllipsis />}
                    />
                }
            >
                <Dropdown.Item
                    eventKey="changeStatus"
                    onClick={() => setChangeStatusDialogOpen(true)}
                >
                    <LiRefresh className="text-lg" />
                    <span>Change status</span>
                </Dropdown.Item>
                <Dropdown.Item
                    eventKey="assignTo"
                    onClick={() => setReassignDialogOpen(true)}
                >
                    <LiProfile className="text-lg" />
                    <span>Assign to</span>
                </Dropdown.Item>
                <Dropdown.Item
                    eventKey="delete"
                    className="text-error"
                    onClick={() => setDeleteConfirmationOpen(true)}
                >
                    <LiTrash className="text-lg" />
                    <span>Delete lead</span>
                </Dropdown.Item>
            </Dropdown>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete lead"
                onClose={handleDeleteConfirmDialogClose}
                onCancel={handleDeleteConfirmDialogClose}
                onConfirm={handleDeleteConfirmDialogConfirm}
                confirmText={isDeleting ? 'Deleting...' : 'Delete'}
                confirmButtonProps={{
                    loading: isDeleting,
                }}
            >
                <p>
                    {' '}
                    Are you sure you want to delete this lead? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
            <Dialog
                isOpen={reassignDialogOpen}
                className="p-0"
                closable={false}
                onClose={() => setReassignDialogOpen(false)}
            >
                <ReassignForm
                    leadId={data.id}
                    onClose={() => setReassignDialogOpen(false)}
                />
            </Dialog>
            <Dialog
                isOpen={changeStatusDialogOpen}
                className="p-0"
                closable={false}
                onClose={() => setChangeStatusDialogOpen(false)}
            >
                <ChangeStatusForm
                    leadId={data.id}
                    leadStatus={data.leadStatus}
                    onClose={() => setChangeStatusDialogOpen(false)}
                />
            </Dialog>
        </>
    )
}

export default LeadAction
