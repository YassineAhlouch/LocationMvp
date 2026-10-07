import { useState } from 'react'
import Segment from '@/components/ui/Segment'
import Card from '@/components/ui/Card'
import { useSubscriptionAnalyticsStore } from '@/views/apps/analytics/Subscriptions/store/subscriptionAnalyticsStore'
import { apiGetSubscriberPersonas } from '@/services/AnalyticService'
import useDataTableState from '@/utils/hooks/useDataTableState'
import PersonaTableSection from './PersonaTableSection'
import useSWR from 'swr'
import type { GetSubscriberPersonasResponse, SubscriberPersona } from '../types'
import type { TableQueries } from '@/@types/common'

const SubscriberPersonaTable = () => {
    const { dateRange } = useSubscriptionAnalyticsStore()

    const [selectedPersona, setSelectedPersona] = useState('recentSubscribers')

    const [recentPagingState, setRecentPagingState] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sortOrder: '',
        sortKey: '',
    })
    const [recentSelectedRows, setRecentSelectedRows] = useState<
        SubscriberPersona[]
    >([])

    const [highValuePagingState, setHighValuePagingState] =
        useState<TableQueries>({
            pageIndex: 1,
            pageSize: 10,
            query: '',
            sortOrder: '',
            sortKey: '',
        })
    const [highValueSelectedRows, setHighValueSelectedRows] = useState<
        SubscriberPersona[]
    >([])

    const { data: recentData, isLoading: recentLoading } = useSWR(
        [
            '/api/analytic/subscription/personas',
            {
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString(),
                type: 'recent',
                ...recentPagingState,
            },
        ],
        ([, params]) =>
            apiGetSubscriberPersonas<
                GetSubscriberPersonasResponse & {
                    list: SubscriberPersona[]
                    total: number
                },
                Record<string, unknown>
            >(params),
        {
            revalidateOnFocus: false,
        },
    )

    const { data: highValueData, isLoading: highValueLoading } = useSWR(
        [
            '/api/analytic/subscription/personas',
            {
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString(),
                type: 'highValue',
                ...highValuePagingState,
            },
        ],
        ([, params]) =>
            apiGetSubscriberPersonas<
                GetSubscriberPersonasResponse & {
                    list: SubscriberPersona[]
                    total: number
                },
                Record<string, unknown>
            >(params),
        {
            revalidateOnFocus: false,
        },
    )

    const recentTableState = useDataTableState({
        pagingState: recentPagingState,
        onPagingChange: setRecentPagingState,
        selectedRows: recentSelectedRows,
        onRowSelectionChange: (checked: boolean, row: SubscriberPersona) => {
            if (checked) {
                setRecentSelectedRows((prev) => [...prev, row])
            } else {
                setRecentSelectedRows((prev) =>
                    prev.filter((item) => item.id !== row.id),
                )
            }
        },
        onAllRowSelectChange: setRecentSelectedRows,
    })

    const highValueTableState = useDataTableState({
        pagingState: highValuePagingState,
        onPagingChange: setHighValuePagingState,
        selectedRows: highValueSelectedRows,
        onRowSelectionChange: (checked: boolean, row: SubscriberPersona) => {
            if (checked) {
                setHighValueSelectedRows((prev) => [...prev, row])
            } else {
                setHighValueSelectedRows((prev) =>
                    prev.filter((item) => item.id !== row.id),
                )
            }
        },
        onAllRowSelectChange: setHighValueSelectedRows,
    })

    const isLoading = recentLoading || highValueLoading

    return (
        <Card bodyClass="p-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                <div>
                    <h5>Subscriber Personas</h5>
                    <p>
                        Detailed analysis of subscriber segments and engagement
                        patterns
                    </p>
                </div>
                <Segment
                    value={selectedPersona}
                    onChange={setSelectedPersona}
                    className="w-full md:w-auto"
                >
                    <Segment.Item
                        className="rounded-lg"
                        value="recentSubscribers"
                    >
                        Recent
                    </Segment.Item>
                    <Segment.Item
                        className="rounded-lg"
                        value="highValueSubscribers"
                    >
                        High Value
                    </Segment.Item>
                </Segment>
            </div>
            <div className="py-4">
                {selectedPersona === 'recentSubscribers' && (
                    <PersonaTableSection
                        title="Recent Subscribers"
                        subtitle="New subscribers from the last 6 months"
                        data={recentData?.list || []}
                        type="recent"
                        tableState={recentTableState}
                        pagingData={{
                            total: recentData?.total || 0,
                            pageIndex: recentPagingState.pageIndex as number,
                            pageSize: recentPagingState.pageSize as number,
                        }}
                        selectedRows={recentSelectedRows}
                        loading={isLoading}
                    />
                )}
                {selectedPersona === 'highValueSubscribers' && (
                    <PersonaTableSection
                        title="High Value Subscribers"
                        subtitle="Top subscribers by accumulated spending"
                        data={highValueData?.list || []}
                        type="highValue"
                        tableState={highValueTableState}
                        pagingData={{
                            total: highValueData?.total || 0,
                            pageIndex: highValuePagingState.pageIndex as number,
                            pageSize: highValuePagingState.pageSize as number,
                        }}
                        selectedRows={highValueSelectedRows}
                        loading={isLoading}
                    />
                )}
            </div>
        </Card>
    )
}

export default SubscriberPersonaTable
