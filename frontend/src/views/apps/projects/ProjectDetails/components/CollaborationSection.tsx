import { useState } from 'react'
import OverflowTabs from '@/components/shared/OverflowTabs'
import Comments from './Comments'
import Delivery from './Delivery'
import Attachments from './Attachments'
import History from './History'
import type { Project } from '../types'

type CollaborationSectionProps = {
    data: Project
}

const tabList = [
    { label: 'Comments', value: 'comments' },
    { label: 'Delivery', value: 'delivery' },
    { label: 'Attachments', value: 'attachments' },
    { label: 'History', value: 'history' },
]

const CollaborationSection = ({ data }: CollaborationSectionProps) => {
    const [activeTab, setActiveTab] = useState('comments')

    return (
        <div>
            <OverflowTabs
                tabList={tabList}
                value={activeTab}
                onChange={setActiveTab}
            />
            <div className="py-4">
                {activeTab === 'comments' && <Comments data={data.comments} />}
                {activeTab === 'delivery' && (
                    <Delivery data={data.milestones} />
                )}
                {activeTab === 'attachments' && (
                    <Attachments data={data.attachments} />
                )}
                {activeTab === 'history' && <History data={data.activity} />}
            </div>
        </div>
    )
}

export default CollaborationSection
