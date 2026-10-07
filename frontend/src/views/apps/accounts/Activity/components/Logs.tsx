import Timeline from '@/components/ui/Timeline'
import Button from '@/components/ui/Button'
import { ActivityAvatar, ActivityEvent } from '@/components/view/Activity'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import type { Activity } from '../types'

type LogProps = {
    onLoadMore: () => void
    isLoading: boolean
    loadable: boolean
    activities: Activity[]
}

const Logs = ({ activities, loadable, isLoading, onLoadMore }: LogProps) => {
    return (
        <div>
            {activities.map((log, index) => (
                <div key={log.id + index} className="mb-8">
                    {log.events.length > 0 && (
                        <div className="mb-4 font-semibold uppercase">
                            {dayjs.unix(log.date).format('dddd, DD MMMM')}
                        </div>
                    )}
                    <Timeline>
                        {isEmpty(log.events) ? (
                            <Timeline.Item>No Activities</Timeline.Item>
                        ) : (
                            log.events.map((event, index) => (
                                <Timeline.Item
                                    key={log.id + event.type + index}
                                    media={<ActivityAvatar data={event} />}
                                >
                                    <div>
                                        <ActivityEvent data={event} />
                                    </div>
                                </Timeline.Item>
                            ))
                        )}
                    </Timeline>
                </div>
            ))}
            <div className="text-center">
                {loadable ? (
                    <Button loading={isLoading} onClick={onLoadMore}>
                        Load More
                    </Button>
                ) : (
                    'No more activity to load'
                )}
            </div>
        </div>
    )
}

export default Logs
