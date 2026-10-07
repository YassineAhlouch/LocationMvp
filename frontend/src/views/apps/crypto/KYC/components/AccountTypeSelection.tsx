import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { useKYCStore } from '../store/kycStore'
import { ACCOUNT_TYPE_INFO } from '../utils/constants'
import {
    LiBriefcase,
    LiShield,
    LiZap,
    LiHeadphone,
    LiTrendUp,
    LiProfiles,
    LiTickCircle,
} from '@/icons'
import Domain from '@/components/svg/icons/Domain'
import Person from '@/components/svg/icons/Person'
import type { AccountType } from '../types'
import type { ComponentType } from 'react'
import type { SvgProps } from '@/@types/common'

interface SelectCardProps {
    id: string
    title: string
    description: string
    icon: ComponentType<SvgProps & { primaryClass?: string }>
    isSelected: boolean
    onClick: (id: string) => void
}

const SelectCard = ({
    id,
    title,
    description,
    icon: IconComponent,
    isSelected,
    onClick,
}: SelectCardProps) => {
    return (
        <div
            className={classNames(
                'relative p-6 rounded-lg border cursor-pointer transition-all duration-200',
                isSelected
                    ? 'border-primary outline outline-primary dark:outline-primary dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-800',
            )}
            onClick={() => onClick(id)}
        >
            <div className="flex gap-4">
                <div className="flex-1">
                    <h6 className="font-semibold mb-2">{title}</h6>
                    <p>{description}</p>
                </div>
                <div
                    className={classNames(
                        'flex items-center justify-center rounded-lg',
                    )}
                >
                    <IconComponent
                        primaryClass={classNames(
                            'transition-all duration-200 stroke-2',
                            isSelected
                                ? 'stroke-primary'
                                : 'stroke-gray-700 dark:stroke-white',
                        )}
                        height={80}
                        width={80}
                    />
                </div>
            </div>
        </div>
    )
}

type AccountTypeOption = {
    id: AccountType
    title: string
    description: string
    icon: ComponentType<SvgProps>
}

const ICON_MAP = {
    ShieldCheckIcon: LiShield,
    Lightning01Icon: LiZap,
    CustomerSupportIcon: LiHeadphone,
    Building06Icon: LiBriefcase,
    TrendingUpIcon: LiTrendUp,
    CheckmarkCircle02Icon: LiTickCircle,
    UserGroupIcon: LiProfiles,
}

const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
    {
        id: 'individual',
        title: 'Individual',
        description:
            'Ideal for personal traders and investors who want to manage their own portfolio with secure and compliant verification.',
        icon: Person,
    },
    {
        id: 'business',
        title: 'Business',
        description:
            'Designed for companies and organizations that need to manage corporate funds, team access, and higher transaction limits.',
        icon: Domain,
    },
]

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'pending':
            return {
                label: 'Kyc pending',
            }
        case 'verified':
            return {
                label: 'Kyc Verified',
            }
        case 'rejected':
            return {
                label: 'Kyc Rejected',
            }
        default:
            return {
                label: 'Get Started',
            }
    }
}

const AccountTypeSelection = () => {
    const { kycStatus, kycCompletedForType, setAccountType, setWizardActive } =
        useKYCStore()
    const [selectedType, setSelectedType] = useState<AccountType>('individual')

    const handleAccountTypeSelect = (type: string) => {
        setSelectedType(type as AccountType)
    }

    const handleGetStarted = () => {
        setAccountType(selectedType)
        setWizardActive(true)
    }

    const accountInfo = ACCOUNT_TYPE_INFO[selectedType]
    return (
        <div className="h-full flex items-center">
            <Container size="md" className="px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col justify-center">
                        <div className="max-w-md mx-auto lg:mx-0">
                            <h4 className="mb-4">
                                Choose your account type to get started
                            </h4>

                            <div className="space-y-4">
                                {ACCOUNT_TYPE_OPTIONS?.map((option) => (
                                    <SelectCard
                                        key={option.id}
                                        id={option.id}
                                        title={option.title}
                                        description={option.description}
                                        icon={option.icon}
                                        isSelected={selectedType === option.id}
                                        onClick={handleAccountTypeSelect}
                                    />
                                )) || []}
                            </div>

                            <div className="mt-8">
                                <Button
                                    variant="solid"
                                    size="lg"
                                    block
                                    onClick={handleGetStarted}
                                    disabled={Boolean(
                                        kycStatus &&
                                        kycCompletedForType === selectedType,
                                    )}
                                >
                                    {kycStatus &&
                                    kycCompletedForType === selectedType
                                        ? getStatusConfig(kycStatus).label
                                        : 'Get Started'}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="max-w-md mx-auto lg:mx-0">
                            <h5 className="mb-8">{accountInfo.description}</h5>
                            <div className="space-y-8">
                                {accountInfo?.benefits?.map(
                                    (benefit, index) => {
                                        const IconComponent =
                                            ICON_MAP[
                                                benefit.icon as keyof typeof ICON_MAP
                                            ]

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-start gap-4"
                                            >
                                                <Avatar
                                                    className="bg-transparent dark:bg-gray-800 dark:border-gray-700"
                                                    icon={
                                                        <IconComponent className="text-primary text-xl" />
                                                    }
                                                />

                                                <div className="flex-1">
                                                    <h6 className="mb-1">
                                                        {benefit.title}
                                                    </h6>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {benefit.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    },
                                ) || []}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default AccountTypeSelection
