import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useCustomerList from '../hooks/useCustomerList'
import { LuCheckCheck } from 'react-icons/lu'

const CustomerListSelected = () => {
    const {
        selectedRows,
        customerList,
        mutate,
        customerListTotal,
        setSelectAllRows,
    } = useCustomerList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false)
    const [sendMessageLoading, setSendMessageLoading] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = () => {
        const newCustomerList = customerList.filter((customer) => {
            return !selectedRows.some((selected) => selected.id === customer.id)
        })
        setSelectAllRows([])
        mutate(
            {
                list: newCustomerList,
                total: customerListTotal - selectedRows.length,
            },
            false,
        )
        setDeleteConfirmationOpen(false)
    }

    const handleSend = () => {
        setSendMessageLoading(true)
        setTimeout(() => {
            toast.push(
                <Notification
                    type="success"
                    title="Message sent!"
                ></Notification>,
                { placement: 'top-center' },
            )
            setSendMessageLoading(false)
            setSendMessageDialogOpen(false)
            setSelectAllRows([])
        }, 500)
    }

    return (
        <>
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-4">
                    <span>
                        {selectedRows.length > 0 && (
                            <span className="flex items-center gap-2">
                                <span className="text-lg text-primary">
                                    <LuCheckCheck />
                                </span>
                                <span className="font-medium flex items-center gap-1">
                                    <span className="heading-text">
                                        {selectedRows.length} Customers
                                    </span>
                                    <span>selected</span>
                                </span>
                            </span>
                        )}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            className={() =>
                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                            }
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="solid"
                            onClick={() => setSendMessageDialogOpen(true)}
                        >
                            Message
                        </Button>
                    </div>
                </div>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove customers"
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove these customers? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
            <Dialog
                isOpen={sendMessageDialogOpen}
                onClose={() => setSendMessageDialogOpen(false)}
            >
                <h5 className="mb-2">Send Message</h5>
                <p>Send message to the following customers</p>
                <Avatar.Group
                    chained
                    omittedAvatarTooltip
                    className="mt-4"
                    maxCount={4}
                    omittedAvatarProps={{ size: 30 }}
                >
                    {selectedRows.map((customer) => (
                        <Tooltip key={customer.id} title={customer.name}>
                            <Avatar
                                shape="circle"
                                size={30}
                                src={customer.img}
                                alt=""
                            />
                        </Tooltip>
                    ))}
                </Avatar.Group>
                <div className="my-4">
                    <RichTextEditor content={''} />
                </div>
                <div className="ltr:justify-end flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => setSendMessageDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        loading={sendMessageLoading}
                        onClick={handleSend}
                    >
                        Send
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default CustomerListSelected
