import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Progress from '@/components/ui/Progress'
import Divider from '@/components/shared/Divider'
import classNames from '@/utils/classNames'
import { colors } from '@/constants/colors.constant'
import { leadStatusColor } from '../utils'
import {
    LuUser,
    LuMail,
    LuPhone,
    LuBriefcaseBusiness,
    LuCalendar,
    LuCircleCheck,
    LuStar,
    LuDollarSign,
    LuActivity,
    LuClock,
    LuExternalLink,
} from 'react-icons/lu'
import type { Lead } from '../types'

type LeadTabsProps = {
    data?: Lead
}

const companySizeMap: Record<string, string> = {
    Small: '1-10',
    Medium: '11-50',
    Large: '51-200',
    Enterprise: '201+',
}

const LeadOverview = ({ data }: LeadTabsProps) => {
    return (
        <div className="space-y-4">
            {data && (
                <>
                    <Card>
                        <h5 className="text-lg font-semibold">
                            Basic Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <LuUser className="text-base" />
                                    <span className="font-medium">
                                        Full Name
                                    </span>
                                </div>
                                <div className="font-medium heading-text">
                                    {data.name}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <LuMail className="text-base" />
                                    <span className="font-medium">Email</span>
                                </div>
                                <div className="font-medium heading-text">
                                    {data.email}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <LuPhone className="text-base" />
                                    <span className="font-medium">Phone</span>
                                </div>
                                <div className="font-medium heading-text">
                                    {data.phoneNumber}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <LuBriefcaseBusiness className="text-base" />
                                    <span className="font-medium">Title</span>
                                </div>
                                <div className="font-medium heading-text">
                                    {data.title || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <LuCalendar className="text-base" />
                                    <span className="font-medium">
                                        Date of Birth
                                    </span>
                                </div>
                                <div className="font-medium heading-text">
                                    {data.birthday || 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <LuCircleCheck className="text-base" />
                                    <span className="font-medium">
                                        Lead Status
                                    </span>
                                </div>
                                <Tag
                                    className={classNames(
                                        leadStatusColor[data.leadStatus]?.tag,
                                    )}
                                >
                                    {data.leadStatus}
                                </Tag>
                            </div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <div className="flex items-center gap-3">
                                <div
                                    className={classNames(
                                        colors.emerald.iconBg,
                                        colors.emerald.iconText,
                                        'rounded-lg p-2',
                                    )}
                                >
                                    <LuStar className="text-xl" />
                                </div>
                                <div>
                                    <h5>{data.engagementScore}</h5>
                                    <div>Lead Score</div>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-3">
                                <div
                                    className={classNames(
                                        colors.blue.iconBg,
                                        colors.blue.iconText,
                                        'rounded-lg p-2',
                                    )}
                                >
                                    <LuDollarSign className="text-xl" />
                                </div>
                                <div>
                                    <h5>$200K</h5>
                                    <div>Pipeline Value</div>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-3">
                                <div
                                    className={classNames(
                                        colors.purple.iconBg,
                                        colors.purple.iconText,
                                        'rounded-lg p-2',
                                    )}
                                >
                                    <LuActivity className="text-xl" />
                                </div>
                                <div>
                                    <h5>12</h5>
                                    <div>Interactions</div>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-3">
                                <div
                                    className={classNames(
                                        colors.yellow.iconBg,
                                        colors.yellow.iconText,
                                        'rounded-lg p-2',
                                    )}
                                >
                                    <LuClock className="text-xl" />
                                </div>
                                <div>
                                    <h5>45</h5>
                                    <div>Days Active</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card
                            header={{
                                content: 'Company Information',
                            }}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Company:
                                    </span>
                                    <span className="font-medium heading-text">
                                        {data.company || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Industry:
                                    </span>
                                    <span className="font-medium heading-text">
                                        {data.industry}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Company Size:
                                    </span>
                                    <span className="font-medium heading-text">
                                        {companySizeMap[data.companySize] ||
                                            'N/A'}{' '}
                                        employees
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Annual Revenue:
                                    </span>
                                    <span className="font-medium heading-text">
                                        $50M - $100M
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Location:
                                    </span>
                                    <span className="font-medium heading-text">
                                        {data.location || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Website:
                                    </span>
                                    <a
                                        href="https://www.google.com/"
                                        target="_blank"
                                        className="heading-text font-medium underline flex items-center gap-1"
                                    >
                                        {data.website}
                                        <LuExternalLink />
                                    </a>
                                </div>
                            </div>
                        </Card>

                        <Card
                            header={{
                                content: 'Lead Journey',
                            }}
                        >
                            <div className="space-y-3">
                                <div className="flex items gap-3">
                                    <div
                                        className={classNames(
                                            'w-3 h-3 rounded mt-1.5',
                                            leadStatusColor[data.leadStatus]
                                                ?.dot,
                                        )}
                                    ></div>
                                    <div className="flex-1">
                                        <div className="font-medium heading-text text-base">
                                            {data.leadStatus} Lead
                                        </div>
                                        <div>Current stage</div>
                                    </div>
                                </div>
                                <div className="ml-6">
                                    <Progress
                                        percent={data.engagementScore}
                                        size="sm"
                                        showInfo={false}
                                    />
                                    <div className="mt-2 font-medium">
                                        <span className="heading-text">
                                            {data.engagementScore}%
                                        </span>{' '}
                                        through sales funnel
                                    </div>
                                </div>
                            </div>
                            <Divider className="my-4" />
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        First Contact
                                    </span>
                                    <span className="font-medium heading-text">
                                        Apr 15, 2025
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Last Activity
                                    </span>
                                    <span className="font-medium heading-text">
                                        3 days ago
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Next Follow-up
                                    </span>
                                    <span className="font-medium heading-text">
                                        Tomorrow
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}

export default LeadOverview
