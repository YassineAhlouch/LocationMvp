import Timeline from '@/components/ui/Timeline'
import { ActivityAvatar, ActivityEvent } from '@/components/view/Activity'
import Loading from '@/components/shared/Loading'
import Divider from '@/components/shared/Divider'
import { apiGetCustomerLog } from '@/services/CustomersService'
import isEmpty from 'lodash/isEmpty'
import useSWR from 'swr'
import dayjs from 'dayjs'

type Activities = {
    id: string
    date: number
    events: Array<{
        type: string
        dateTime: number
        ticket?: string
        status?: number
        userName: string
        userImg?: string
        comment?: string
        tags?: {
            value: string
            label: string
        }[]
        files?: string[]
        assignee?: string
    }>
}[]

type LeadActivityProps = {
    leadId: string
}

const LeadActivity = ({ leadId }: LeadActivityProps) => {
    const { data, isLoading } = useSWR(
        ['/api/leads/activity', { id: leadId }],
        ([, params]) => apiGetCustomerLog<Activities, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    return (
        <Loading loading={isLoading}>
            {data &&
                data.map((log, index) => (
                    <div key={log.id + index} className="mb-6">
                        {log.events.length > 0 && (
                            <div className="mb-4 font-medium flex items-center gap-4 heading-text">
                                <Divider orientation="horizontal" />
                                <span className="border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 flex-1 text-nowrap bg-gray-100 dark:bg-gray-800">
                                    {dayjs
                                        .unix(log.date)
                                        .format('dddd, DD MMMM')}
                                </span>
                                <Divider orientation="horizontal" />
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
                                        <div className="mt-0.5">
                                            <ActivityEvent data={event} />
                                        </div>
                                    </Timeline.Item>
                                ))
                            )}
                        </Timeline>
                    </div>
                ))}
        </Loading>
    )
}

export default LeadActivity
