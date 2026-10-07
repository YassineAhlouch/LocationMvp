import Timeline from '@/components/ui/Timeline'
import { ActivityAvatar, ActivityEvent } from '@/components/view/Activity'
import type { Activity } from '../types'

type HistoryProps = {
    data: Activity[]
}

const History = ({ data }: HistoryProps) => {
    return (
        <div>
            <Timeline>
                {data.map((event, index) => (
                    <Timeline.Item
                        key={event.type + index}
                        media={<ActivityAvatar data={event} />}
                    >
                        <div className="mt-0.5">
                            <ActivityEvent data={event} />
                        </div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </div>
    )
}

export default History
