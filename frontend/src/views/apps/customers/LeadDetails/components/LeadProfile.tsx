import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import InfoBar from '@/components/shared/InfoBar'
import Divider from '@/components/shared/Divider'
import LeadAction from './LeadAction'
import classNames from '@/utils/classNames'
import { LuPhone, LuMail } from 'react-icons/lu'
import type { Lead } from '../types'

type LeadProfileProps = {
    data?: Lead
    isLoading?: boolean
}

const statusColor: Record<string, string> = {
    active: 'bg-success',
    inactive: 'bg-error',
}

const priorityMap: Record<string, 'low' | 'medium' | 'high'> = {
    Low: 'low',
    Medium: 'medium',
    High: 'high',
}

const LeadProfile = ({ data }: LeadProfileProps) => {
    return (
        <Card>
            {data && (
                <div className="space-y-6">
                    <div className="flex justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Avatar src={data.img} shape="circle" />
                            <div>
                                <h5 className="font-semibold">{data.name}</h5>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                icon={<LuPhone />}
                                size="sm"
                                className="h-7 w-7"
                                title="Call"
                            />
                            <Button
                                icon={<LuMail />}
                                size="sm"
                                className="h-7 w-7"
                                title="Email"
                            />
                            <LeadAction data={data} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="space-y-1">
                            <div>Assigned owner</div>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    shape="circle"
                                    className="bg-gradient-to-br from-[#2bc6e0] to-[#b814ee] border-0 text-white"
                                    size={20}
                                >
                                    M
                                </Avatar>
                                <span className="heading-text font-semibold">
                                    Michael Scott
                                </span>
                            </div>
                        </div>
                        <Divider
                            orientation="vertical"
                            className="h-10 hidden md:block"
                        />
                        <div className="space-y-1">
                            <div>Status</div>
                            <div className="flex items-center gap-1">
                                <span
                                    className={classNames(
                                        'w-2 h-2 rounded-full',
                                        statusColor[data.status],
                                    )}
                                ></span>
                                <span className="capitalize heading-text font-semibold">
                                    {data.status}
                                </span>
                            </div>
                        </div>
                        <Divider
                            orientation="vertical"
                            className="h-10 hidden md:block"
                        />
                        <div className="space-y-1">
                            <div>Priority</div>
                            <div className="flex items-center gap-1">
                                <InfoBar
                                    level={priorityMap[data.probability]}
                                />
                                <span className="capitalize heading-text font-semibold">
                                    {data.probability}
                                </span>
                            </div>
                        </div>
                        <Divider
                            orientation="vertical"
                            className="h-10 hidden md:block"
                        />
                        <div className="space-y-1">
                            <div>Lead source</div>
                            <span className="heading-text font-semibold">
                                {data.source}
                            </span>
                        </div>
                        <Divider
                            orientation="vertical"
                            className="h-10 hidden md:block"
                        />
                        <div className="space-y-1">
                            <div>Tags</div>
                            <div className="inline-flex items-center gap-2 flex-wrap">
                                {data.tags.map((tag, index) => (
                                    <Tag className="py-0.5 px-1.5" key={index}>
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default LeadProfile
