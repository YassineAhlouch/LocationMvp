/* eslint-disable @typescript-eslint/no-explicit-any */
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'
import {
    notificationSettings2Data,
    billingSettingsData,
    intergrationSettingData,
    pricingPlansData,
    securitySettingsData,
    referralData,
    rolesData,
    permissionsData,
    pendingUsersData,
} from '../data/accountsData'
import { logData } from '../data/logData'
import { userDetailData } from '../data/usersData'

mock.onGet(`/api/settings/profile`).reply(() => {
    return [
        200,
        {
            ...userDetailData[0],
            language: 'en',
            timezone: 'America/New_York',
        },
    ]
})

mock.onGet(`/api/settings/security`).reply(() => {
    return [200, securitySettingsData]
})

mock.onGet(`/api/settings/notification`).reply(() => {
    return [200, notificationSettings2Data]
})

mock.onGet(`/api/settings/billing`).reply(() => {
    return [200, billingSettingsData]
})

mock.onGet(`/api/settings/integration`).reply(() => {
    return [200, intergrationSettingData]
})

mock.onGet(`/api/rbac/users`).reply((config) => {
    const { pageIndex, pageSize, query, status, sortOrder, sortKey, role } =
        config.params

    console.log('pageSize', pageSize)

    const users = userDetailData as any[]

    const sanitizeUsers = users.filter((elm) => typeof elm !== 'function')
    let data = sanitizeUsers
    let total = users.length

    if (sortKey && sortOrder) {
        if (sortKey !== 'lastOnline') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    if (status) {
        data = data.filter((item) => item.status === status)
    }

    if (role) {
        // Handle multiple roles (comma-separated string)
        const roleFilters = role.split(',').filter(Boolean)
        data = data.filter((item) =>
            roleFilters.some((roleFilter: any) =>
                item.role.includes(roleFilter),
            ),
        )
    }

    if (query) {
        data = wildCardSearch(data, query)
    }

    total = data.length
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

mock.onGet(`/api/pricing`).reply(() => {
    return [200, pricingPlansData]
})

mock.onGet(`/api/activity-logs`).reply((config) => {
    const { activityIndex } = config.params

    console.log('activityIndex', activityIndex)

    let loadable = true
    const maxGetItem = 3
    const count = (activityIndex - 1) * maxGetItem
    let logs = logData
    if (count >= logs.length) {
        loadable = false
    }
    logs = logs.slice(count, activityIndex * maxGetItem)

    const response = {
        index: activityIndex,
        list: logs,
        loadable,
    }
    return [200, response]
})

mock.onGet(`/api/referrals`).reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, { data: referralData }])
        }, 800)
    })
})

mock.onPost(`/api/referrals/invite`).reply((config) => {
    const { email } = JSON.parse(config.data)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve([
                    400,
                    {
                        success: false,
                        message: 'Please enter a valid email address',
                    },
                ])
            }, 500)
        })
    }

    // Simulate successful invitation
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([
                200,
                {
                    success: true,
                    message: `Invitation sent successfully to ${email}`,
                },
            ])
        }, 1200)
    })
})

mock.onGet(`/api/rbac/roles`).reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, rolesData])
        }, 500)
    })
})

mock.onGet(/\/api\/rbac\/roles\/(.*)/).reply((config) => {
    const roleId = config.url?.split('/').pop()
    const role = rolesData.find((r) => r.id === roleId)

    if (!role) {
        return [404, { message: 'Role not found' }]
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, { data: role }])
        }, 300)
    })
})

mock.onGet(`/api/rbac/permissions`).reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, permissionsData])
        }, 400)
    })
})

mock.onGet(`/api/rbac/pending-users`).reply((config) => {
    const {
        pageIndex,
        pageSize,
        query,
        sortOrder,
        sortKey,
        status,
        requestedRole,
    } = config.params

    let data = [...pendingUsersData] as any[]
    let total = data.length

    if (sortKey && sortOrder) {
        if (sortKey !== 'requestDate') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    new Date(a as string).getTime(),
                ),
            )
        }
    }

    if (status) {
        data = data.filter((item) => item.status === status)
    }

    if (requestedRole) {
        const roleFilters = requestedRole.split(',').filter(Boolean)
        data = data.filter((item) =>
            roleFilters.some((roleFilter: any) =>
                item.requestedRole.some((userRole: string) =>
                    userRole.toLowerCase().includes(roleFilter.toLowerCase()),
                ),
            ),
        )
    }

    if (query) {
        data = wildCardSearch(data, query)
    }

    total = data.length
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
