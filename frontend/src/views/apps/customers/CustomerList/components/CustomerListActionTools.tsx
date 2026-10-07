import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import { TbCloudDownload, TbUserPlus, TbDotsVertical } from 'react-icons/tb'
import useCustomerList from '../hooks/useCustomerList'
import useResponsive from '@/utils/hooks/useResponsive'
import { CSVLink } from 'react-csv'
import CreateCustomerDialog, {
    type Customer as DialogCustomer,
} from '@/components/view/CreateCustomerDialog/CreateCustomerDialog'
import type { Customer } from '../types'

const CustomerListActionTools = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { customerList, mutate } = useCustomerList()
    const { larger } = useResponsive()

    const handleCreateCustomer = (dialogCustomer: DialogCustomer) => {
        const newCustomer: Customer = {
            id: dialogCustomer.id,
            name: dialogCustomer.name,
            firstName: dialogCustomer.firstName,
            lastName: dialogCustomer.lastName,
            email: dialogCustomer.email,
            img: dialogCustomer.img,
            phoneNumber: dialogCustomer.phoneNumber,
            dialCode: dialogCustomer.dialCode,
            role: 'Customer',
            lastOnline: Date.now(),
            status: 'active',
            location: dialogCustomer.address?.country || '',
            title: '',
            birthday: '',
            address: dialogCustomer.address?.addressLine1 || '',
            postcode: dialogCustomer.address?.postalCode || '',
            city: dialogCustomer.address?.city || '',
            country: dialogCustomer.address?.country || '',
            totalSpending: 0,
        }

        mutate((currentData) => {
            if (!currentData) return currentData
            return {
                ...currentData,
                list: [newCustomer, ...currentData.list],
                total: currentData.total + 1,
            }
        }, false)
        setIsDialogOpen(false)
    }

    const handleMenuSelect = (eventKey: string) => {
        if (eventKey === 'add') {
            setIsDialogOpen(true)
        }
        // Export is handled by CSVLink directly
    }

    return (
        <>
            {larger.lg ? (
                <div className="flex flex-col md:flex-row gap-3">
                    <CSVLink
                        className="w-full"
                        filename="customerList.csv"
                        data={customerList}
                    >
                        <Button
                            icon={<TbCloudDownload className="text-xl" />}
                            className="w-full"
                        >
                            Export data
                        </Button>
                    </CSVLink>
                    <Button
                        variant="solid"
                        icon={<TbUserPlus className="text-xl" />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Add new
                    </Button>
                </div>
            ) : (
                <Dropdown
                    renderTitle={<Button icon={<TbDotsVertical />} />}
                    placement="bottom-end"
                >
                    <Dropdown.Item eventKey="add" onSelect={handleMenuSelect}>
                        <div className="flex items-center gap-2">
                            <TbUserPlus className="text-xl" />
                            <span>Add new</span>
                        </div>
                    </Dropdown.Item>
                    <CSVLink filename="customerList.csv" data={customerList}>
                        <Dropdown.Item eventKey="export">
                            <div className="flex items-center gap-2">
                                <TbCloudDownload className="text-xl" />
                                <span>Export data</span>
                            </div>
                        </Dropdown.Item>
                    </CSVLink>
                </Dropdown>
            )}
            <CreateCustomerDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onCreate={handleCreateCustomer}
            />
        </>
    )
}

export default CustomerListActionTools
