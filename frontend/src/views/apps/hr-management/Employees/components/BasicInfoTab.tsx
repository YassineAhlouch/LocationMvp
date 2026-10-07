import { useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import {
    LiHash,
    LiMail,
    LiPhone,
    LiNote,
    LiSagittarius,
    LiGitBranch,
    LiBriefcase,
    LiUserOctagon,
    LiTickCircle,
    LiDesktop,
    LiMapPin,
} from '@/icons'
import { countryList } from '@/constants/countries.constant'
import { formatDate } from '@/utils/formatDate'
import dayjs from 'dayjs'
import type { Employee } from '../types'
import type { ReactNode } from 'react'
import classNames from '@/utils/classNames'

type BasicInfoTabProps = {
    employee: Employee
}

const getStatuAttribute = (status: string) => {
    switch (status) {
        case 'active':
            return {
                badgeClass: 'bg-success',
                label: 'Active',
            }
        case 'inactive':
            return {
                badgeClass: 'bg-warning',
                label: 'Inactive',
            }
        case 'terminated':
            return {
                badgeClass: 'bg-error',
                label: 'Terminated',
            }
        default:
            return {
                badgeClass: 'bg-gray-100 text-gray-600',
                label: status,
            }
    }
}

const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
        case 'full-time':
            return 'Full-time'
        case 'part-time':
            return 'Part-time'
        case 'contract':
            return 'Contract'
        case 'intern':
            return 'Intern'
        case 'freelance':
            return 'Freelance'
        default:
            return type
    }
}

const getGenderLabel = (gender: string) => {
    switch (gender) {
        case 'male':
            return 'Male'
        case 'female':
            return 'Female'
        case 'other':
            return 'Other'
        case 'prefer-not-to-say':
            return 'Prefer not to say'
        default:
            return gender
    }
}

const BasicInfoTab = ({ employee }: BasicInfoTabProps) => {
    const location = useMemo(() => {
        return countryList.find(
            (country) =>
                country.value === employee.personalInfo.address?.country,
        )?.label
    }, [employee.personalInfo.address?.country])

    const personalInfomation: {
        label: string
        value: string
        icon: ReactNode
    }[] = [
        { label: 'Employee ID', value: employee.employeeId, icon: <LiHash /> },
        {
            label: 'Email',
            value: employee.personalInfo.email,
            icon: <LiMail />,
        },
        {
            label: 'Phone',
            value: employee.personalInfo.phone,
            icon: <LiPhone />,
        },
        {
            label: 'Gender',
            value: getGenderLabel(employee.personalInfo.gender),
            icon: <LiSagittarius />,
        },
        {
            label: 'Date of Birth',
            value: employee.personalInfo.dateOfBirth,
            icon: <LiNote />,
        },
    ]

    const jobInfomation: { label: string; value: string; icon: ReactNode }[] = [
        {
            label: 'Department',
            value: employee.jobInfo.department,
            icon: <LiGitBranch />,
        },
        {
            label: 'Designation',
            value: employee.jobInfo.designation,
            icon: <LiBriefcase />,
        },
        {
            label: 'Employment Type',
            value: getEmploymentTypeLabel(employee.jobInfo.employmentType),
            icon: <LiUserOctagon />,
        },
        {
            label: 'Joining Date',
            value: formatDate(employee.jobInfo.joiningDate),
            icon: <LiNote />,
        },
    ]

    const accountInfomation: {
        label: string
        value: string | ReactNode
        icon: ReactNode
    }[] = [
        {
            label: 'Status',
            value: (
                <Tag className="gap-1 bg-transparent">
                    <Badge
                        className={classNames(
                            getStatuAttribute(employee.accountInfo.status)
                                .badgeClass,
                            'w-2.5 h-2.5',
                        )}
                    />
                    {getStatuAttribute(employee.accountInfo.status).label}
                </Tag>
            ),
            icon: <LiTickCircle />,
        },
        { label: 'Location', value: location || 'N/A', icon: <LiMapPin /> },
        {
            label: 'Last Login',
            value:
                dayjs(employee.accountInfo.lastLogin).format('MMM DD, YYYY') ||
                'N/A',
            icon: <LiDesktop />,
        },
    ]

    return (
        <div className="py-4 px-2 space-y-8">
            {/* Personal Information */}
            <div className="space-y-8">
                <div>
                    <h6 className="mb-4">Personal Information</h6>
                    <div className="space-y-4">
                        {personalInfomation.map((item) => (
                            <div key={item.label} className="flex gap-2">
                                <span className="flex items-center gap-2 min-w-[170px]">
                                    <span className="text-base">
                                        {item.icon}
                                    </span>
                                    {item.label}:
                                </span>
                                <span className="heading-text">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h6 className="mb-4">Job Information</h6>
                    <div className="space-y-4">
                        {jobInfomation.map((item) => (
                            <div key={item.label} className="flex gap-2">
                                <span className="flex items-center gap-2 min-w-[170px]">
                                    <span className="text-base">
                                        {item.icon}
                                    </span>
                                    {item.label}:
                                </span>
                                <span className="heading-text">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h6 className="mb-4">Account Information</h6>
                    <div className="space-y-4">
                        {accountInfomation.map((item) => (
                            <div key={item.label} className="flex gap-2">
                                <span className="flex items-center gap-2 min-w-[170px]">
                                    <span className="text-base">
                                        {item.icon}
                                    </span>
                                    {item.label}:
                                </span>
                                <span className="heading-text">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BasicInfoTab
