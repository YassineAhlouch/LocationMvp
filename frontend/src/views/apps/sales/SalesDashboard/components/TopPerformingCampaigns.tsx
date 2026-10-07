import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import IconFrame from '@/components/shared/IconFrame'
import formatCurrency from '@/utils/formatCurrency'
import classNames from '@/utils/classNames'
import {
    HiOutlineMail,
    HiOutlineSearch,
    HiOutlineVideoCamera,
    HiOutlineUserGroup,
    HiOutlineRefresh,
} from 'react-icons/hi'
import { MdOutlineDisplaySettings } from 'react-icons/md'
import type {
    CampaignData,
    CampaignChannel,
    CampaignStatus,
    CampaignCategory,
} from '../types'

type TopPerformingCampaignsProps = {
    data: CampaignData[]
}

const channelImages: Record<CampaignChannel, string> = {
    google: '/img/thumbs/brands/google.png',
    facebook: '/img/thumbs/brands/facebook.png',
    tiktok: '/img/thumbs/brands/tiktok.png',
    instagram: '/img/thumbs/brands/instagram.png',
    email: '/img/thumbs/misc/email.png',
}

const channelLabels: Record<CampaignChannel, string> = {
    google: 'Google',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    email: 'Email',
}

const categoryIcons: Record<CampaignCategory, React.ReactNode> = {
    search: <HiOutlineSearch />,
    display: <MdOutlineDisplaySettings />,
    video: <HiOutlineVideoCamera />,
    social: <HiOutlineUserGroup />,
    email: <HiOutlineMail />,
    retargeting: <HiOutlineRefresh />,
}

const statusStyles: Record<CampaignStatus, string> = {
    Active: 'bg-success',
    Paused: 'bg-gray-400 dark:bg-gray-600',
    Learning: 'bg-warning',
}

const getRoasColor = (roas: number): string => {
    if (roas > 3.0) return 'text-success'
    if (roas < 1.5) return 'text-error'
    return ''
}

const TopPerformingCampaigns = ({ data }: TopPerformingCampaignsProps) => {
    return (
        <Card bodyClass="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h5>Top Performing Campaigns</h5>
            </div>
            <Table>
                <Table.THead>
                    <Table.Tr>
                        <Table.Th>Campaign Name</Table.Th>
                        <Table.Th>Channel</Table.Th>
                        <Table.Th>Spend</Table.Th>
                        <Table.Th>ROAS</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.THead>
                <Table.TBody>
                    {data.map((campaign) => (
                        <Table.Tr key={campaign.id}>
                            <Table.Td>
                                <div className="flex items-center gap-2">
                                    <IconFrame size={32}>
                                        <span className="heading-text text-lg">
                                            {categoryIcons[campaign.category]}
                                        </span>
                                    </IconFrame>
                                    <span className="font-medium heading-text">
                                        {campaign.name}
                                    </span>
                                </div>
                            </Table.Td>
                            <Table.Td>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={channelImages[campaign.channel]}
                                        alt={channelLabels[campaign.channel]}
                                        className="w-5 h-5 object-contain"
                                    />
                                    <span className="heading-text">
                                        {channelLabels[campaign.channel]}
                                    </span>
                                </div>
                            </Table.Td>
                            <Table.Td className="heading-text">
                                {formatCurrency(campaign.spend)}
                            </Table.Td>
                            <Table.Td>
                                <span
                                    className={classNames(
                                        'heading-text font-medium',
                                        getRoasColor(campaign.roas),
                                    )}
                                >
                                    {campaign.roas.toFixed(2)}x
                                </span>
                            </Table.Td>
                            <Table.Td>
                                <Tag className="bg-transparent gap-1">
                                    <span
                                        className={classNames(
                                            'w-2 h-2 rounded-full',
                                            statusStyles[campaign.status],
                                        )}
                                    ></span>
                                    {campaign.status}
                                </Tag>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.TBody>
            </Table>
        </Card>
    )
}

export default TopPerformingCampaigns
