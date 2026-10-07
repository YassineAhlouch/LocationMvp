import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import classNames from '@/utils/classNames'
import { useEmployeeStore } from '../store/employeeStore'
import { LiBriefcase, LiMail, LiPhone } from '@/icons'
import acronym from '@/utils/acronym'
import { LuEllipsis, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu'
import type { Employee } from '../types'
import type { DropdownRef } from '@/components/ui/Dropdown'
import type { MouseEvent, SyntheticEvent } from 'react'

type EmployeeCardProps = {
    employee: Employee
    onViewDetails: (employee: Employee) => void
    onEdit: (employee: Employee) => void
    onDelete: (employee: Employee) => void
}

const EmployeeCard = ({
    employee,
    onViewDetails,
    onEdit,
    onDelete,
}: EmployeeCardProps) => {
    const { selectedEmployees, toggleEmployeeSelection } = useEmployeeStore()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<DropdownRef>(null)

    const isSelected = selectedEmployees.includes(employee.id)

    const handleCardClick = () => {
        toggleEmployeeSelection(employee.id)
    }

    const handleCallback = (
        e: SyntheticEvent<Element, Event>,
        callback?: () => void,
    ) => {
        e.stopPropagation()
        callback?.()
    }

    const handleDropdownToggleClick = (e: MouseEvent) => {
        e.stopPropagation()
        dropdownRef.current?.handleDropdownOpen()
    }

    return (
        <Card
            className={classNames(
                'relative transition-all duration-200 cursor-pointer group ',
                isSelected
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700',
            )}
            clickable
            onClick={handleCardClick}
        >
            <div className="absolute top-4 right-4">
                <div
                    className={classNames(
                        'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        dropdownOpen && 'opacity-100',
                    )}
                >
                    <Dropdown
                        ref={dropdownRef}
                        renderTitle={
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 text-xs"
                                onClick={handleDropdownToggleClick}
                                icon={<LuEllipsis className="text-lg" />}
                            />
                        }
                        placement="bottom-end"
                        onOpen={(bool) => setDropdownOpen(bool)}
                    >
                        <Dropdown.Item
                            onClick={(e) =>
                                handleCallback(e, () => onViewDetails(employee))
                            }
                            eventKey="view"
                        >
                            <div className="flex items-center gap-2">
                                <LuEye />
                                <span>View Details</span>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={(e) =>
                                handleCallback(e, () => onEdit(employee))
                            }
                            eventKey="edit"
                        >
                            <div className="flex items-center gap-2">
                                <LuPencil />
                                <span>Edit</span>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item variant="divider" />
                        <Dropdown.Item
                            onClick={(e) =>
                                handleCallback(e, () => onDelete(employee))
                            }
                            eventKey="delete"
                        >
                            <div className="flex items-center gap-2 text-red-600">
                                <LuTrash2 />
                                <span>Delete</span>
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    {employee.personalInfo.profilePhoto ? (
                        <Avatar
                            size={25}
                            shape="circle"
                            src={employee.personalInfo.profilePhoto}
                            alt={employee.personalInfo.fullName}
                        />
                    ) : (
                        <Avatar
                            size={25}
                            shape="circle"
                            className="heading-text"
                        >
                            {acronym(employee.personalInfo.fullName)}
                        </Avatar>
                    )}

                    <div className="font-semibold heading-text truncate">
                        {employee.personalInfo.fullName}
                    </div>
                </div>
                <div className="space-y-2 pl-1.5">
                    <div className="flex items-center gap-3">
                        <LiBriefcase className="text-base" />
                        <span className="heading-text">
                            {employee.jobInfo.role}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LiMail className="text-base" />
                        <span className="heading-text">
                            {employee.personalInfo.email}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LiPhone className="text-base" />
                        <span className="heading-text">
                            {employee.personalInfo.phone}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default EmployeeCard
