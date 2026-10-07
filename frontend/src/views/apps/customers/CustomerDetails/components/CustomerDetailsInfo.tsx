import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import dayjs from 'dayjs'
import {
    LuPhone,
    LuBuilding2,
    LuExternalLink,
    LuUserCheck,
    LuClock,
} from 'react-icons/lu'
import type { Customer } from '../types'

type CustomerInfoProps = {
    data: Customer
}

const companySizeMap: Record<string, string> = {
    Small: '1-10',
    Medium: '11-50',
    Large: '51-200',
    Enterprise: '201+',
}

const CustomerDetailsInfo = ({ data }: CustomerInfoProps) => {
    return (
        <Card className="h-full">
            <div className="flex flex-col xl:justify-between 2xl:min-w-[330px] mx-auto">
                <div className="flex xl:flex-col gap-2">
                    <Avatar size={60} shape="circle" src={data.img} />
                    <h5>{data.name}</h5>
                </div>
                <div className="inline-flex gap-2 mt-2 mb-4">
                    {data?.tags?.map((tag: string) => (
                        <Tag className="py-1 px-1.5" key={tag}>
                            {tag}
                        </Tag>
                    ))}
                </div>
                <div className="flex flex-col gap-y-6 mt-6">
                    <div className="mb-4">
                        <div className="mb-4 font-medium flex items-center gap-2">
                            <LuPhone className="text-base heading-text" />
                            <span>Contact Information</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Phone:{' '}
                                </span>
                                <p className="heading-text font-medium">
                                    {data?.phoneNumber}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Email:{' '}
                                </span>
                                <p className="heading-text font-medium">
                                    {data?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-4 font-medium flex items-center gap-2">
                            <LuBuilding2 className="text-base  heading-text" />
                            <span>Business Information</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Company:{' '}
                                </span>
                                <span className="heading-text font-medium">
                                    {data?.company}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Size:{' '}
                                </span>
                                <span className="heading-text font-medium">
                                    {companySizeMap[data?.companySize]}{' '}
                                    employees
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Industry:{' '}
                                </span>
                                <span className="heading-text font-medium">
                                    {data?.industry}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Website:{' '}
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
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Location:{' '}
                                </span>
                                <span className="heading-text font-medium">
                                    {data?.location}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-4 font-medium flex items-center gap-2">
                            <LuUserCheck className="text-base heading-text" />
                            <span>Sales owner</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Avatar
                                shape="circle"
                                className="bg-gradient-to-br from-[#2bc6e0] to-[#b814ee] border-0 text-white"
                                size={25}
                            >
                                MS
                            </Avatar>
                            <span className="heading-text font-medium">
                                Michael Scott
                            </span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-4 font-medium flex items-center gap-2">
                            <LuClock className="text-base heading-text" />
                            <span>Timeline</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Added:{' '}
                                </span>
                                <span className="heading-text font-medium">
                                    {dayjs(new Date())
                                        .subtract(4, 'month')
                                        .format('MMM DD, YYYY')}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Last Contacted:{' '}
                                </span>
                                <span className="heading-text font-medium">
                                    {dayjs(new Date())
                                        .subtract(2, 'week')
                                        .format('MMM DD, YYYY')}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium min-w-[110px]">
                                    Last Activity:{' '}
                                </span>
                                <span className="heading-text font-medium">
                                    {dayjs(new Date())
                                        .subtract(1, 'day')
                                        .format('MMM DD, YYYY')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CustomerDetailsInfo
