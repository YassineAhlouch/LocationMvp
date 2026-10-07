import { useMemo } from 'react'
import Alert from '@/components/ui/Alert'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem, Form } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import sleep from '@/utils/sleep'
import classNames from '@/utils/classNames'
import { LuX } from 'react-icons/lu'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Member } from '../types'

type FormSchema = {
    newOwner: string
    projectName: string
}

const validationSchema = z.object({
    newOwner: z.string().min(1, { message: 'Owner is required' }),
    projectName: z
        .string()
        .min(1, { message: 'Type the project name to confirm this action' }),
})

type TransferOwnerShipDialogProps = {
    onClose: () => void
    onConfirm: () => void
    members: Member[]
    projectName: string
    open: boolean
}

const TransferOwnerShipDialog = ({
    projectName,
    members,
    open,
    onClose,
    onConfirm,
}: TransferOwnerShipDialogProps) => {
    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
        watch,
    } = useForm<FormSchema>({
        defaultValues: {
            newOwner: '',
            projectName: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const memberList = useMemo(() => {
        return members.map((member) => ({
            label: member.name,
            value: member.id,
            img: member.img,
            email: member.email,
        }))
    }, [members])

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleFormSubmit = async (values: FormSchema) => {
        await sleep(1000)
        console.log('Form submitted with values:', values)
        onConfirm()
        handleClose()
    }

    return (
        <Dialog
            isOpen={open}
            className="p-0"
            width={600}
            closable={false}
            onClose={handleClose}
        >
            <div className="flex justify-between p-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h5>Transfer Project Ownership</h5>
                    </div>
                    <p>
                        Transfer ownership of{' '}
                        <span className="font-semibold">{projectName}</span> to
                        another team member.
                    </p>
                </div>
                <div>
                    <button
                        className="close-button button-press-feedback hover:bg-gray-100 hover:dark:bg-gray-700 rounded-lg"
                        type="button"
                        onClick={handleClose}
                    >
                        <LuX />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="mb-4">
                    <Alert showIcon>
                        <span className="font-semibold">Warning</span>: This is
                        a permanent action. Once transferred, only the new owner
                        can transfer ownership back to you.
                    </Alert>
                </div>
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        label="Assignee"
                        invalid={Boolean(errors.newOwner)}
                        errorMessage={errors.newOwner?.message}
                    >
                        <Controller
                            name="newOwner"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={memberList}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    value={memberList.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    placeholder="Select new owner"
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
                    <FormItem label="Type the project name to confirm">
                        <Controller
                            name="projectName"
                            control={control}
                            render={({ field }) => (
                                <Input placeholder={projectName} {...field} />
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
                            disabled={
                                watch('projectName') !== projectName &&
                                watch('newOwner') === ''
                            }
                            loading={isSubmitting}
                        >
                            Transfer
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default TransferOwnerShipDialog
