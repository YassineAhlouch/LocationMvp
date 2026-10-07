import { useState, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import Tabs from '@/components/ui/Tabs'
import BasicInfoTab from './BasicInfoTab'
import DocumentsTab from './DocumentsTab'
import CompensationTab from './CompensationTab'
import { LiUser } from '@/icons'
import { useEmployeeStore } from '../store/employeeStore'
import { apiGetEmployee } from '@/services/HrmService'
import { LiEdit, LiTrash } from '@/icons'
import { LuX } from 'react-icons/lu'
import useSWR from 'swr'
import useResponsive from '@/utils/hooks/useResponsive'
import type { Employee } from '../types'

type EmployeeDetailsDrawerProps = {
    employeeId: string | null
    onClose: () => void
}

const EmployeeDetailsDrawer = ({
    employeeId,
    onClose,
}: EmployeeDetailsDrawerProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('basic-info')
    const { openEditEmployee, openDeleteEmployee } = useEmployeeStore()
    const { smaller } = useResponsive()

    const drawerWidth = smaller.sm ? 350 : 500

    const { data: employee } = useSWR(
        employeeId ? `/api/hrm/employees/${employeeId}` : null,
        () => (employeeId ? apiGetEmployee<Employee>(employeeId) : null),
        {
            revalidateOnFocus: false,
        },
    )

    useEffect(() => {
        if (employee) {
            setIsOpen(true)
        }
    }, [employee])

    if (!employee) return null

    const handleClose = () => {
        setIsOpen(false)
        onClose()
    }

    const handleEdit = () => {
        openEditEmployee(employee)
        handleClose()
    }

    const handleDelete = () => {
        openDeleteEmployee(employee)
        handleClose()
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            width={drawerWidth}
            bodyClass="p-0"
            closable={false}
        >
            <div>
                <div
                    className="h-26 w-full bg-gray-200 p-4 rounded-t-lg"
                    style={{
                        backgroundImage:
                            'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)',
                    }}
                >
                    <div className="flex justify-end items-center gap-2">
                        <Tooltip title="Edit" placement="bottom">
                            <Button
                                size="sm"
                                variant="subtle"
                                icon={<LiEdit />}
                                onClick={handleEdit}
                                className="bg-black/30 text-white hover:bg-black/40 hover:text-white"
                            />
                        </Tooltip>
                        <Tooltip title="Delete" placement="bottom">
                            <Button
                                size="sm"
                                variant="subtle"
                                icon={<LiTrash />}
                                onClick={handleDelete}
                                className="bg-black/30 text-white hover:bg-black/40 hover:text-white"
                            />
                        </Tooltip>
                        <Tooltip title="Close" placement="bottom">
                            <Button
                                size="sm"
                                variant="subtle"
                                icon={<LuX />}
                                onClick={handleClose}
                                className="bg-black/30 text-white hover:bg-black/40 hover:text-white"
                            />
                        </Tooltip>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -top-4 left-4">
                        <div className="flex items-end gap-2">
                            <div className="rounded-full p-1  border-gray-200 dark:border-gray-800 inline-flex bg-white dark:bg-gray-800">
                                <Avatar
                                    size={70}
                                    shape="circle"
                                    src={employee.personalInfo.profilePhoto}
                                    icon={<LiUser className="text-3xl" />}
                                    className="heading-text"
                                />
                            </div>
                            <div className="flex-1 mb-1">
                                <h5>{employee.personalInfo.fullName}</h5>
                                <span>
                                    {employee.jobInfo.role} •{' '}
                                    {employee.jobInfo.department}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col mt-20 px-4">
                <div>
                    <Tabs value={activeTab} onChange={setActiveTab}>
                        <Tabs.TabList>
                            <Tabs.TabNav value="basic-info">
                                Basic Info
                            </Tabs.TabNav>
                            <Tabs.TabNav value="documents">
                                Documents
                            </Tabs.TabNav>
                            <Tabs.TabNav value="compensation">
                                Compensation
                            </Tabs.TabNav>
                        </Tabs.TabList>
                    </Tabs>
                </div>
                <div className="flex-1 overflow-auto">
                    <Tabs value={activeTab}>
                        <Tabs.TabContent value="basic-info">
                            <BasicInfoTab employee={employee} />
                        </Tabs.TabContent>
                        <Tabs.TabContent value="documents">
                            <DocumentsTab employee={employee} />
                        </Tabs.TabContent>
                        <Tabs.TabContent value="compensation">
                            <CompensationTab employee={employee} />
                        </Tabs.TabContent>
                    </Tabs>
                </div>
            </div>
        </Drawer>
    )
}

export default EmployeeDetailsDrawer
