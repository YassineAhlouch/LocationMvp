import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Timeline from '@/components/ui/Timeline'
import ClockProgress from '@/components/shared/ClockProgress'
import InfoBar from '@/components/shared/InfoBar'
import FileIcon from '@/components/shared/FileIcon'
import classNames from '@/utils/classNames'
import { historyIconMap } from '../utils'
import { LuPhone, LuMail, LuDownload } from 'react-icons/lu'
import type { Deal } from '../types'

type DealDetailsProps = {
    data: Deal
}

const probabilityMap = (percent: number): 'low' | 'medium' | 'high' => {
    if (percent >= 80) return 'high'
    if (percent >= 50) return 'medium'
    if (percent >= 0) return 'low'
    return 'low'
}

const DealDetails = ({ data }: DealDetailsProps) => {
    return (
        <>
            {data && (
                <div>
                    <div className="px-4 py-6 space-y-6">
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Deal Name:{' '}
                            </span>
                            <span className="heading-text font-medium">
                                {data.name}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Deal Value:{' '}
                            </span>
                            <span className="heading-text font-medium">
                                {data.value}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Close Date:{' '}
                            </span>
                            <span className="heading-text font-medium">
                                {data.closeDate}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Probability:{' '}
                            </span>
                            <span className="flex items-center gap-2">
                                <InfoBar
                                    level={probabilityMap(data.probability)}
                                />
                                <span className="heading-text font-medium">
                                    {data.probability}%
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Stage
                            </span>
                            <span className="flex items-center gap-2">
                                <ClockProgress
                                    value={
                                        (data.stage / data.totalStages) * 100
                                    }
                                    size={16}
                                />
                                <span className="heading-text font-medium">
                                    {data.stage} of {data.totalStages}
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Owner:{' '}
                            </span>
                            <span className="flex items-center gap-2">
                                <Avatar
                                    size={25}
                                    className="bg-gradient-to-br from-[#2bc6e0] to-[#b814ee] border-0 text-white"
                                    shape="circle"
                                >
                                    {data.ownerInitials}
                                </Avatar>
                                <span className="heading-text font-medium">
                                    {data.owner}
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Products:{' '}
                            </span>
                            <span className="inline-flex items-center flex-wrap gap-2">
                                {data.products.map((product) => (
                                    <Tag key={product}>{product}</Tag>
                                ))}
                            </span>
                        </div>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="px-4 py-6 space-y-6">
                        <div>
                            <h6 className="mb-2">Description</h6>
                            <p>{data.description}</p>
                        </div>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="px-4 py-6">
                        <h6 className="mb-2">Contacts</h6>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                            {data.contacts.map(
                                (
                                    contact: {
                                        name: string
                                        role: string
                                        email: string
                                    },
                                    index: number,
                                ) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-2"
                                    >
                                        <div>
                                            <p className="heading-text font-medium">
                                                {contact.name}
                                            </p>
                                            <p className="text-xs">
                                                {contact.role}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={<LuMail />}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={<LuPhone />}
                                            />
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                    <div className="px-4 py-6">
                        <h6 className="mb-2">Documents</h6>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                            {data.documents.map(
                                (
                                    document: {
                                        name: string
                                        date: string
                                        type: string
                                    },
                                    index: number,
                                ) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileIcon
                                                type={document.type}
                                                size={25}
                                            />
                                            <div className="heading-text font-medium">
                                                {document.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={<LuDownload />}
                                            />
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                    <div className="px-4 py-6">
                        <h6 className="mb-2">History</h6>
                        <Timeline>
                            {data.history.map((history, index) => (
                                <Timeline.Item
                                    key={index}
                                    media={
                                        <Avatar
                                            className={classNames(
                                                'border-0',
                                                historyIconMap[history.type]
                                                    .color,
                                            )}
                                            icon={
                                                historyIconMap[history.type]
                                                    .icon
                                            }
                                            shape="circle"
                                            size={22}
                                        />
                                    }
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="heading-text font-medium">
                                            {history.action}{' '}
                                        </span>
                                        <span>{history.date}</span>
                                    </span>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </div>
                </div>
            )}
        </>
    )
}

export default DealDetails
