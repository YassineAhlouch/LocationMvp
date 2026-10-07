/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs'
import { mock } from '../MockAdapter'
import wildCardSearch from '@/utils/wildCardSearch'
import paginate from '@/utils/paginate'
import {
    leaveCalendarEvents,
    employeeLeaveDetails,
    leaveStatistics,
    leaveRequests,
    generatePayrollData,
    calculatePayrollMetrics,
    generateAttendanceData,
    calculateAttendanceMetrics,
    generatePeriodAttendanceData,
    employeeData,
    departments,
    getRolesByDepartments,
    announcements,
    announcementCategories,
    pinnedAnnouncements,
    generateHrmDashboardData,
} from '../data/hrmData'

mock.onGet('/api/hrm/leaves/calendar').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, leaveCalendarEvents])
        }, 300)
    })
})

mock.onGet('/api/hrm/leaves/statistics').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, leaveStatistics])
        }, 200)
    })
})

mock.onGet('/api/hrm/leaves/requests').reply(function (config) {
    const { pageIndex, pageSize, sortOrder, sortKey, query, status, type } =
        config.params

    let data = [...leaveRequests]
    let total = data.length

    if (status && status !== 'all') {
        data = data.filter((request) => request.status === status)
    }

    if (type && type !== 'all') {
        data = data.filter((request) => request.type === type)
    }

    if (query) {
        data = wildCardSearch(data, query, [
            'employee.name',
            'employee.title',
            'type',
            'reason',
        ] as any)
        total = data.length
    }

    if (sortKey && sortOrder) {
        if (sortKey === 'employee') {
            data.sort((a, b) => {
                const aName = a.employee.name.toUpperCase()
                const bName = b.employee.name.toUpperCase()
                if (sortOrder === 'desc') {
                    return bName.localeCompare(aName)
                }
                return aName.localeCompare(bName)
            })
        } else if (
            sortKey === 'startDate' ||
            sortKey === 'endDate' ||
            sortKey === 'appliedAt'
        ) {
            data.sort((a, b) => {
                const aDate = new Date(a[sortKey] as string).getTime()
                const bDate = new Date(b[sortKey] as string).getTime()
                if (sortOrder === 'desc') {
                    return bDate - aDate
                }
                return aDate - bDate
            })
        } else {
            data.sort((a, b) => {
                const aVal = String(a[sortKey]).toUpperCase()
                const bVal = String(b[sortKey]).toUpperCase()
                if (sortOrder === 'desc') {
                    return bVal.localeCompare(aVal)
                }
                return aVal.localeCompare(bVal)
            })
        }
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 400)
    })
})

mock.onGet(new RegExp('/api/hrm/leaves/employee/.*')).reply(function (config) {
    const urlParts = config.url?.split('/')
    const employeeId = urlParts?.[urlParts.length - 2]
    const eventId = urlParts?.[urlParts.length - 1]

    const key = `${employeeId}-${eventId}`
    const detail = employeeLeaveDetails[key]

    if (!detail) {
        return [404, { message: 'Employee leave detail not found' }]
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, detail])
        }, 300)
    })
})

mock.onGet('/api/hrm/payroll').reply((config) => {
    const params = config.params
    const {
        month = dayjs().format('YYYY-MM'),
        pageIndex = 1,
        pageSize = 10,
        query = '',
        sortKey = '',
        sortOrder = '',
    } = params

    return new Promise(function (resolve) {
        setTimeout(function () {
            let records = generatePayrollData(month)

            if (query) {
                const searchTerm = query.toLowerCase()
                records = records.filter(
                    (record) =>
                        record.employee.name
                            .toLowerCase()
                            .includes(searchTerm) ||
                        record.employee.department
                            .toLowerCase()
                            .includes(searchTerm) ||
                        record.status.toLowerCase().includes(searchTerm),
                )
            }

            if (sortKey && sortOrder) {
                records.sort((a, b) => {
                    let aVal: any, bVal: any

                    switch (sortKey) {
                        case 'employee':
                            aVal = a.employee.name
                            bVal = b.employee.name
                            break
                        case 'department':
                            aVal = a.employee.department
                            bVal = b.employee.department
                            break
                        case 'basicSalary':
                            aVal = a.basicSalary
                            bVal = b.basicSalary
                            break
                        case 'allowances':
                            aVal = a.allowances
                            bVal = b.allowances
                            break
                        case 'deductions':
                            aVal = a.deductions
                            bVal = b.deductions
                            break
                        case 'netPay':
                            aVal = a.netPay
                            bVal = b.netPay
                            break
                        case 'status':
                            aVal = a.status
                            bVal = b.status
                            break
                        default:
                            aVal = a.employee.name
                            bVal = b.employee.name
                    }

                    if (typeof aVal === 'string' && typeof bVal === 'string') {
                        return sortOrder === 'desc'
                            ? bVal.localeCompare(aVal)
                            : aVal.localeCompare(bVal)
                    }

                    if (sortOrder === 'desc') {
                        return bVal > aVal ? 1 : aVal > bVal ? -1 : 0
                    }
                    return aVal > bVal ? 1 : bVal > aVal ? -1 : 0
                })
            }

            const metrics = calculatePayrollMetrics(records)

            const startIndex = (pageIndex - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedRecords = records.slice(startIndex, endIndex)

            const response = {
                records: paginatedRecords,
                metrics,
                total: records.length,
            }

            resolve([200, response])
        }, 400)
    })
})

mock.onGet('/api/hrm/payroll/export').reply((config) => {
    const { month, format } = config.params

    return new Promise((resolve) => {
        setTimeout(() => {
            const filename = `payroll-${month}.${format}`
            const blob = new Blob(['Mock payroll export data'], {
                type: 'application/octet-stream',
            })
            resolve([
                200,
                blob,
                {
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Content-Type': 'application/octet-stream',
                },
            ])
        }, 1500)
    })
})

mock.onGet('/api/hrm/attendance').reply((config) => {
    const params = config.params
    const {
        date = dayjs().format('YYYY-MM-DD'),
        pageIndex = 1,
        pageSize = 10,
        query = '',
        status = '',
        sortKey = '',
        sortOrder = '',
    } = params

    return new Promise(function (resolve) {
        setTimeout(function () {
            let records = generateAttendanceData(date)
            const metrics = calculateAttendanceMetrics(records)

            if (status && status !== 'all') {
                records = records.filter(
                    (record: any) => record.status === status,
                )
            }

            if (query) {
                const searchTerm = query.toLowerCase()
                records = records.filter(
                    (record: any) =>
                        record.employee.name
                            .toLowerCase()
                            .includes(searchTerm) ||
                        record.employee.department
                            .toLowerCase()
                            .includes(searchTerm) ||
                        record.employee.role.toLowerCase().includes(searchTerm),
                )
            }

            if (sortKey && sortOrder) {
                records.sort((a: any, b: any) => {
                    let aVal, bVal

                    switch (sortKey) {
                        case 'employee':
                            aVal = a.employee.name
                            bVal = b.employee.name
                            break
                        case 'department':
                            aVal = a.employee.department
                            bVal = b.employee.department
                            break
                        case 'checkIn':
                            aVal = a.checkIn || '99:99'
                            bVal = b.checkIn || '99:99'
                            break
                        case 'checkOut':
                            aVal = a.checkOut || '00:00'
                            bVal = b.checkOut || '00:00'
                            break
                        case 'status':
                            aVal = a.status
                            bVal = b.status
                            break
                        default:
                            aVal = a.employee.name
                            bVal = b.employee.name
                    }

                    if (sortOrder === 'desc') {
                        return bVal > aVal ? 1 : -1
                    }
                    return aVal > bVal ? 1 : -1
                })
            }

            const startIndex = (pageIndex - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedRecords = records.slice(startIndex, endIndex)

            const response = {
                records: paginatedRecords,
                metrics,
                total: records.length,
            }

            resolve([200, response])
        }, 400)
    })
})

mock.onGet('/api/hrm/attendance/period').reply((config) => {
    const params = config.params
    const {
        startDate,
        endDate,
        pageIndex = 1,
        pageSize = 10,
        query = '',
        sortKey = '',
        sortOrder = '',
    } = params

    return new Promise(function (resolve) {
        setTimeout(function () {
            let data = generatePeriodAttendanceData(startDate, endDate)

            if (query) {
                const searchTerm = query.toLowerCase()
                data = data.filter(
                    (record) =>
                        record.employee.name
                            .toLowerCase()
                            .includes(searchTerm) ||
                        record.employee.department
                            .toLowerCase()
                            .includes(searchTerm),
                )
            }

            if (sortKey && sortOrder) {
                data.sort((a, b) => {
                    let aVal: string | number
                    let bVal: string | number

                    switch (sortKey) {
                        case 'employee':
                            aVal = a.employee.name.toUpperCase()
                            bVal = b.employee.name.toUpperCase()
                            break
                        case 'rate':
                            aVal = a.presentPercentage
                            bVal = b.presentPercentage
                            break
                        default:
                            aVal = a.employee.name.toUpperCase()
                            bVal = b.employee.name.toUpperCase()
                    }

                    if (typeof aVal === 'string' && typeof bVal === 'string') {
                        return sortOrder === 'desc'
                            ? bVal.localeCompare(aVal)
                            : aVal.localeCompare(bVal)
                    } else {
                        return sortOrder === 'desc'
                            ? (bVal as number) - (aVal as number)
                            : (aVal as number) - (bVal as number)
                    }
                })
            }

            const total = data.length

            const startIndex = (pageIndex - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedData = data.slice(startIndex, endIndex)

            const response = {
                data: paginatedData,
                total: total,
            }

            resolve([200, response])
        }, 500)
    })
})

mock.onGet('/api/hrm/employees').reply((config) => {
    const params = config.params
    const {
        pageIndex = 1,
        pageSize = 10,
        query = '',
        status = '',
        employmentTypes = '',
        departments = '',
        roles = '',
        sortKey = '',
        sortOrder = '',
    } = params

    return new Promise(function (resolve) {
        setTimeout(function () {
            let employees = [...employeeData]

            if (status && status !== 'all') {
                employees = employees.filter(
                    (emp) => emp.accountInfo.status === status,
                )
            }

            if (employmentTypes) {
                const types = employmentTypes.split(',')
                employees = employees.filter((emp) =>
                    types.includes(emp.jobInfo.employmentType),
                )
            }

            if (departments) {
                const depts = departments.split(',')
                employees = employees.filter((emp) =>
                    depts.includes(emp.jobInfo.department),
                )
            }

            // Apply role filter
            if (roles) {
                const roleList = roles.split(',')
                employees = employees.filter((emp) =>
                    roleList.includes(emp.jobInfo.role),
                )
            }

            if (query) {
                const searchTerm = query.toLowerCase()
                employees = employees.filter(
                    (emp) =>
                        emp.personalInfo.fullName
                            .toLowerCase()
                            .includes(searchTerm) ||
                        emp.personalInfo.email
                            .toLowerCase()
                            .includes(searchTerm) ||
                        emp.employeeId.toLowerCase().includes(searchTerm) ||
                        emp.jobInfo.department
                            .toLowerCase()
                            .includes(searchTerm) ||
                        emp.jobInfo.role.toLowerCase().includes(searchTerm),
                )
            }

            if (sortKey && sortOrder) {
                employees.sort((a, b) => {
                    let aVal: any, bVal: any

                    switch (sortKey) {
                        case 'employeeId':
                            aVal = a.employeeId
                            bVal = b.employeeId
                            break
                        case 'name':
                            aVal = a.personalInfo.fullName
                            bVal = b.personalInfo.fullName
                            break
                        case 'department':
                            aVal = a.jobInfo.department
                            bVal = b.jobInfo.department
                            break
                        case 'role':
                            aVal = a.jobInfo.role
                            bVal = b.jobInfo.role
                            break
                        case 'employmentType':
                            aVal = a.jobInfo.employmentType
                            bVal = b.jobInfo.employmentType
                            break
                        case 'currentStatus':
                            aVal = a.accountInfo.currentStatus
                            bVal = b.accountInfo.currentStatus
                            break
                        case 'joiningDate':
                            aVal = new Date(a.jobInfo.joiningDate).getTime()
                            bVal = new Date(b.jobInfo.joiningDate).getTime()
                            break
                        default:
                            aVal = a.personalInfo.fullName
                            bVal = b.personalInfo.fullName
                    }

                    if (typeof aVal === 'string' && typeof bVal === 'string') {
                        return sortOrder === 'desc'
                            ? bVal.localeCompare(aVal)
                            : aVal.localeCompare(bVal)
                    }

                    if (sortOrder === 'desc') {
                        return bVal > aVal ? 1 : aVal > bVal ? -1 : 0
                    }
                    return aVal > bVal ? 1 : bVal > aVal ? -1 : 0
                })
            }

            const total = employees.length

            const startIndex = (pageIndex - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedEmployees = employees.slice(startIndex, endIndex)

            const response = {
                employees: paginatedEmployees,
                total: total,
            }

            resolve([200, response])
        }, 400)
    })
})

mock.onGet(new RegExp('/api/hrm/employees/.*')).reply(function (config) {
    const urlParts = config.url?.split('/')
    const employeeId = urlParts?.[urlParts.length - 1]

    const employee = employeeData.find((emp) => emp.id === employeeId)

    if (!employee) {
        return [404, { message: 'Employee not found' }]
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, employee])
        }, 300)
    })
})

mock.onGet('/api/hrm/departments').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, departments])
        }, 200)
    })
})

mock.onGet('/api/hrm/roles').reply((config) => {
    const { departments: deptParam } = config.params

    if (!deptParam) {
        return [400, { message: 'Departments parameter is required' }]
    }

    const departmentNames = deptParam.split(',')
    const roles = getRolesByDepartments(departmentNames)

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, roles])
        }, 200)
    })
})

mock.onGet('/api/hrm/announcements').reply((config) => {
    const params = config.params
    const {
        category = 'all',
        dateRange,
        sortBy = 'date-desc',
        pageIndex = 1,
        pageSize = 10,
        query = '',
    } = params

    return new Promise(function (resolve) {
        setTimeout(function () {
            let filteredAnnouncements = [...announcements]

            if (category && category !== 'all') {
                filteredAnnouncements = filteredAnnouncements.filter(
                    (a) => a.category === category,
                )
            }

            if (dateRange && dateRange.start && dateRange.end) {
                filteredAnnouncements = filteredAnnouncements.filter((a) => {
                    const announcementDate = dayjs(a.createdAt)
                    return (
                        announcementDate.isAfter(dayjs(dateRange.start)) &&
                        announcementDate.isBefore(dayjs(dateRange.end))
                    )
                })
            }

            if (query) {
                const searchTerm = query.toLowerCase()
                filteredAnnouncements = filteredAnnouncements.filter(
                    (a) =>
                        a.title.toLowerCase().includes(searchTerm) ||
                        a.description.toLowerCase().includes(searchTerm) ||
                        a.author.name.toLowerCase().includes(searchTerm),
                )
            }

            switch (sortBy) {
                case 'date-desc':
                    filteredAnnouncements.sort(
                        (a, b) =>
                            dayjs(b.createdAt).valueOf() -
                            dayjs(a.createdAt).valueOf(),
                    )
                    break
                case 'date-asc':
                    filteredAnnouncements.sort(
                        (a, b) =>
                            dayjs(a.createdAt).valueOf() -
                            dayjs(b.createdAt).valueOf(),
                    )
                    break
                case 'reactions':
                    filteredAnnouncements.sort((a, b) => {
                        const aCount = a.reactions.reduce(
                            (sum: number, r: any) => sum + r.count,
                            0,
                        )
                        const bCount = b.reactions.reduce(
                            (sum: number, r: any) => sum + r.count,
                            0,
                        )
                        return bCount - aCount
                    })
                    break
                case 'comments':
                    filteredAnnouncements.sort(
                        (a, b) => b.comments.length - a.comments.length,
                    )
                    break
            }

            const total = filteredAnnouncements.length

            const startIndex = (pageIndex - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedAnnouncements = filteredAnnouncements.slice(
                startIndex,
                endIndex,
            )

            const response = {
                announcements: paginatedAnnouncements,
                categories: announcementCategories,
                pinned: pinnedAnnouncements,
                total: total,
            }

            resolve([200, response])
        }, 400)
    })
})

mock.onGet('/api/hrm/announcements/categories').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, announcementCategories])
        }, 200)
    })
})

mock.onGet('/api/hrm/announcements/list').reply((config) => {
    const params = config.params
    const { category = 'all', dateRange, sortBy = 'date-desc' } = params

    return new Promise(function (resolve) {
        setTimeout(function () {
            let filteredAnnouncements = [...announcements]

            if (category && category !== 'all') {
                filteredAnnouncements = filteredAnnouncements.filter(
                    (a) => a.category === category,
                )
            }

            if (dateRange && dateRange.start && dateRange.end) {
                filteredAnnouncements = filteredAnnouncements.filter((a) => {
                    const announcementDate = dayjs(a.createdAt)
                    return (
                        announcementDate.isAfter(dayjs(dateRange.start)) &&
                        announcementDate.isBefore(dayjs(dateRange.end))
                    )
                })
            }

            switch (sortBy) {
                case 'date-desc':
                    filteredAnnouncements.sort(
                        (a, b) =>
                            dayjs(b.createdAt).valueOf() -
                            dayjs(a.createdAt).valueOf(),
                    )
                    break
                case 'date-asc':
                    filteredAnnouncements.sort(
                        (a, b) =>
                            dayjs(a.createdAt).valueOf() -
                            dayjs(b.createdAt).valueOf(),
                    )
                    break
                case 'reactions':
                    filteredAnnouncements.sort((a, b) => {
                        const aCount = a.reactions.reduce(
                            (sum: number, r: any) => sum + r.count,
                            0,
                        )
                        const bCount = b.reactions.reduce(
                            (sum: number, r: any) => sum + r.count,
                            0,
                        )
                        return bCount - aCount
                    })
                    break
                case 'comments':
                    filteredAnnouncements.sort(
                        (a, b) => b.comments.length - a.comments.length,
                    )
                    break
            }

            resolve([200, filteredAnnouncements])
        }, 400)
    })
})

mock.onGet('/api/hrm/announcements/pinned').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, pinnedAnnouncements])
        }, 200)
    })
})

mock.onPost(
    new RegExp('/api/hrm/announcements/.*/comments/.*/reactions'),
).reply((config) => {
    const urlParts = config.url?.split('/')
    const announcementId = urlParts?.[4]
    const commentId = urlParts?.[6]
    const { emoji } = JSON.parse(config.data)

    const announcement = announcements.find((a: any) => a.id === announcementId)
    if (!announcement) {
        return [404, { message: 'Announcement not found' }]
    }

    const comment = announcement.comments.find((c: any) => c.id === commentId)
    if (!comment) {
        return [404, { message: 'Comment not found' }]
    }

    if (!comment.reactions) {
        comment.reactions = []
    }

    const existingReaction = comment.reactions.find(
        (r: any) => r.emoji === emoji,
    )
    const currentUserId = 'current-user-id'
    const currentUserName = 'Current User'

    if (existingReaction) {
        const userIndex = existingReaction.users.findIndex(
            (u: any) => u.id === currentUserId,
        )
        if (userIndex > -1) {
            existingReaction.users.splice(userIndex, 1)
            existingReaction.count--
            if (existingReaction.count === 0) {
                comment.reactions = comment.reactions.filter(
                    (r: any) => r.emoji !== emoji,
                )
            }
        } else {
            existingReaction.users.push({
                id: currentUserId,
                name: currentUserName,
            })
            existingReaction.count++
        }
    } else {
        comment.reactions.push({
            emoji,
            count: 1,
            users: [{ id: currentUserId, name: currentUserName }],
            reacted: true,
        })
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([200, { comment }])
        }, 300)
    })
})

const cachedDashboardData = generateHrmDashboardData()

mock.onGet('/api/hrm/dashboard').reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, cachedDashboardData])
        }, 400)
    })
})
