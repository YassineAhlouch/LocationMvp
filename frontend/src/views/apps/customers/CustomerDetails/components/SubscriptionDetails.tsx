import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Timeline from '@/components/ui/Timeline'
import FileIcon from '@/components/shared/FileIcon'
import { historyIconMap } from '../utils'
import classNames from '@/utils/classNames'
import { LuPhone, LuMail, LuDownload } from 'react-icons/lu'

import type { Subscription } from '../types'

type SubscriptionDetailsProps = {
    data: Subscription
}

const SubscriptionDetails = ({ data }: SubscriptionDetailsProps) => {
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
                                Renewal Date:{' '}
                            </span>
                            <span className="heading-text font-medium">
                                {data.renewalDate}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium min-w-[110px]">
                                Stage
                            </span>
                            <span className="heading-text font-medium">
                                6 of 6
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

export default SubscriptionDetails
