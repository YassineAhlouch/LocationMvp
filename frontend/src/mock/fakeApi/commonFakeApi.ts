/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock } from '../MockAdapter'
import {
    notificationListData,
    searchQueryPoolData,
    tenantListData,
} from '../data/commonData'

mock.onGet(`/api/notification/list`).reply(() => {
    return [200, notificationListData]
})

mock.onGet(`/api/notification/count`).reply(() => {
    const unreadNotification = notificationListData.filter(
        (notification) => !notification.read,
    )
    return [200, { count: unreadNotification.length }]
})

mock.onGet(`/api/search/query`).reply((config) => {
    const { query } = config.params

    const result = searchQueryPoolData.filter((item: any) => {
        const searchQuery = query.toLowerCase()
        if (item.type === 'user') {
            return (
                item.name.toLowerCase().includes(searchQuery) ||
                item.email.toLowerCase().includes(searchQuery)
            )
        }
        if (item.type === 'companies') {
            return (
                item.name.toLowerCase().includes(searchQuery) ||
                item.email.toLowerCase().includes(searchQuery)
            )
        }
        if (item.type === 'quickAction') {
            return item.title.toLowerCase().includes(searchQuery)
        }
        if (item.type === 'files') {
            return item.title.toLowerCase().includes(searchQuery)
        }
        return false
    })

    const typeToTitle: Record<string, string> = {
        user: 'People',
        companies: 'Companies',
        quickAction: 'Quick Actions',
        files: 'Files',
    }

    const types = [...new Set(result.map((item) => item.type))]

    const data = types.map((type) => ({
        title: typeToTitle[type] || type,
        data: result.filter((item) => item.type === type).slice(0, 5),
    }))

    return [200, data]
})

mock.onGet(`/api/tenants`).reply(() => {
    return [200, tenantListData]
})
