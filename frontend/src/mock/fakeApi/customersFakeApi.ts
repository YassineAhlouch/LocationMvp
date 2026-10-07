/* eslint-disable @typescript-eslint/no-explicit-any */
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'
import { userDetailData } from '../data/usersData'
import {
    customerStatisticData,
    leadsData,
    leadNoteData,
    leadDocumentData,
    dealsData,
    subscriptionData,
    purchaseHistoryData,
    generateCrmDashboardData,
} from '../data/customerData'
import {
    helpdeskTicketData,
    helpdeskTicketDetailsData,
} from '../data/ticketsData'
import { customerActivityLog } from '../data/logData'

mock.onGet(`/api/customers`).reply((config) => {
    const {
        pageIndex = 1,
        pageSize = 10,
        sortOrder,
        sortKey,
        query,
        status,
        customerLabel,
    } = config.params

    const users = userDetailData as any[]

    const sanitizeUsers = users.filter((elm) => typeof elm !== 'function')
    let data = sanitizeUsers
    let total = users.length

    if (status) {
        data = data.filter((item) => item.status === status)
    }

    if (customerLabel && customerLabel.length > 0) {
        data = data.filter((item) =>
            customerLabel.some((label: string) => item.tags.includes(label)),
        )
    }

    if (sortKey && sortOrder) {
        if (sortKey !== 'totalSpending') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }
    if (query) {
        data = wildCardSearch(data, query)
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

mock.onGet(new RegExp(`/api/customer/documents`)).reply(() => {
    return [200, leadDocumentData]
})

mock.onGet(new RegExp(`/api/customer/deals`)).reply(() => {
    return [
        200,
        {
            deals: dealsData,
            subscriptions: subscriptionData,
        },
    ]
})

mock.onGet(new RegExp(`/api/customer/statistics`)).reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, customerStatisticData])
        }, 500)
    })
})

mock.onGet(`/api/helpdesk/tickets`).reply((config) => {
    const {
        pageIndex,
        pageSize,
        sortOrder,
        sortKey,
        query,
        status,
        priority,
        category,
    } = config.params

    const tickets = helpdeskTicketData as any[]

    let data = tickets
    let total = tickets.length

    if (status && Array.isArray(status) && status.length > 0) {
        data = data.filter((item) => status.includes(item.status))
    }

    if (priority && Array.isArray(priority) && priority.length > 0) {
        data = data.filter((item) => priority.includes(item.priority))
    }

    if (category && Array.isArray(category) && category.length > 0) {
        data = data.filter((item) => category.includes(item.category))
    }

    if (sortKey && sortOrder) {
        if (sortKey !== 'totalSpending') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    if (query) {
        data = wildCardSearch(data, query)
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

mock.onGet(new RegExp(`/api/helpdesk/tickets/*`)).reply((config) => {
    const segement = config.url?.split('/')
    const id = segement?.[segement.length - 1]

    const detailsData = helpdeskTicketDetailsData.find(
        (ticket) => ticket.id === id,
    )
    const basicData = helpdeskTicketData.find((ticket) => ticket.id === id)
    const ticket = {
        ...basicData,
        ...detailsData,
    }

    if (!ticket) {
        return [404, {}]
    }

    return [200, ticket]
})
mock.onGet(`/api/leads`).reply((config) => {
    const {
        pageIndex,
        pageSize,
        sortOrder,
        sortKey,
        query,
        leadStatus,
        probability,
        customerLabel,
    } = config.params

    const leads = userDetailData.map((user) => {
        const extra = leadsData.find((lead) => lead.id === user.id) || {}
        return {
            ...user,
            ...extra,
        }
    }) as any[]

    const sanitizeUsers = leads.filter((elm) => typeof elm !== 'function')
    let data = sanitizeUsers
    let total = leads.length

    if (leadStatus) {
        data = data.filter((item) => item.leadStatus === leadStatus)
    }

    if (probability) {
        const probabilityMap: Record<string, string[]> = {
            High: ['High', 'Medium', 'Low'],
            Medium: ['Medium', 'Low'],
            Low: ['Low'],
        }
        data = data.filter((item) => {
            const probabilityArr = probabilityMap[probability]
            if (probabilityArr) {
                return probabilityArr.includes(item.probability)
            }
            return true
        })
    }

    if (customerLabel && customerLabel.length > 0) {
        data = data.filter((item) =>
            customerLabel.some((label: string) => item.tags.includes(label)),
        )
    }

    const executeSorting = () => {
        if (
            ['name', 'email', 'company', 'probability', 'phoneNumber'].includes(
                sortKey,
            )
        ) {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
            return
        }

        if (sortKey === 'tags') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) => {
                    return (a as unknown as string[]).join(', ').toUpperCase()
                }),
            )
            return
        }

        data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
    }

    if (sortKey && sortOrder) {
        executeSorting()
    }

    if (query) {
        data = wildCardSearch(data, query)
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

mock.onGet(new RegExp(`/api/lead/notes`)).reply(() => {
    return [200, leadNoteData]
})

mock.onGet(new RegExp(`/api/leads/*`)).reply(function (config) {
    const id = config.url?.split('/')[2]

    const customer = userDetailData.find((user) => user.id === id)

    const user = {
        ...customer,
        ...leadsData.find((lead) => lead.id === id),
        notes: leadNoteData,
        purchases: purchaseHistoryData,
    }

    if (!user) {
        return [404, {}]
    }

    return [200, user]
})

mock.onGet(new RegExp(`/api/customer/log`)).reply(() => {
    return [200, customerActivityLog]
})

mock.onGet(new RegExp(`/api/customers/*`)).reply(function (config) {
    const id = config.url?.split('/')[2]

    const customer = userDetailData.find((user) => user.id === id)

    const user = {
        ...customer,
        ...leadsData.find((lead) => lead.id === id),
        notes: leadNoteData,
        purchases: purchaseHistoryData,
    }

    if (!customer) {
        return [
            200,
            {
                ...userDetailData[0],
                ...leadsData[0],
                notes: leadNoteData,
                purchases: purchaseHistoryData,
            },
        ]
    }

    return [200, user]
})

mock.onGet('/api/crm/dashboard').reply((config) => {
    const { teamSelection = 'all', timeHorizon = 'week' } = config.params || {}

    // Generate dynamic data based on filters
    const responseData = generateCrmDashboardData(timeHorizon, teamSelection)

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})
