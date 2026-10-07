/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { userDetailData } from './usersData'

dayjs.extend(isSameOrBefore)

export const calculateLeaveDuration = (
    startDate: string,
    endDate: string,
): string => {
    const start = dayjs(startDate)
    const end = dayjs(endDate)
    const diffDays = end.diff(start, 'day') + 1
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`
}

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

export const getLeaveTypeColor = (type: string): string => {
    switch (type) {
        case 'holiday':
            return 'red'
        case 'annualLeave':
            return 'blue'
        case 'sickLeave':
            return 'orange'
        case 'casualLeave':
            return 'green'
        default:
            return 'gray'
    }
}

const getRandomEmployees = (
    count: number,
    status = 'approved',
    seed: number = 0,
) => {
    const shuffled = [...userDetailData].sort((a, b) => {
        const seedA = seededRandom(seed + parseInt(a.id))
        const seedB = seededRandom(seed + parseInt(b.id))
        return seedA - seedB
    })
    return shuffled.slice(0, count).map((emp) => ({
        id: emp.id,
        name: emp.name,
        title: emp.title,
        status,
    }))
}

const formatDate = (date: dayjs.Dayjs) => date.toISOString()

const addDays = (date: dayjs.Dayjs, days: number) => {
    return date.add(days, 'day')
}

const today = dayjs()
const currentMonth = today.month()
const currentYear = today.year()

const getRandomDateInMonth = (
    year: number,
    month: number,
    seed: number = 0,
) => {
    const daysInMonth = dayjs().year(year).month(month).daysInMonth()
    const randomDay =
        Math.floor(seededRandom(seed + year + month) * daysInMonth) + 1
    return dayjs().year(year).month(month).date(randomDay)
}

const getRandomLeaveType = (seed: number = 0) => {
    const types = ['annualLeave', 'sickLeave', 'casualLeave']
    return types[Math.floor(seededRandom(seed) * types.length)]
}

const getRandomStatus = (seed: number = 0) => {
    const rand = seededRandom(seed)
    if (rand < 0.7) return 'approved'
    if (rand < 0.85) return 'pending'
    if (rand < 0.95) return 'rejected'
    return 'cancelled'
}

const holidayTemplates = [
    { name: "New Year's Day", month: 0, day: 1, duration: 1 },
    { name: 'Martin Luther King Jr. Day', month: 0, day: 15, duration: 1 },
    { name: "Presidents' Day", month: 1, day: 19, duration: 1 },
    { name: 'Memorial Day', month: 4, day: 27, duration: 1 },
    { name: 'Independence Day', month: 6, day: 4, duration: 1 },
    { name: 'Labor Day', month: 8, day: 2, duration: 1 },
    { name: 'Columbus Day', month: 9, day: 14, duration: 1 },
    { name: 'Veterans Day', month: 10, day: 11, duration: 1 },
    { name: 'Thanksgiving', month: 10, day: 28, duration: 2 },
    { name: 'Christmas Holiday', month: 11, day: 24, duration: 3 },
]

const generateLeaveCalendarEvents = () => {
    const events: any[] = []
    let eventId = 1

    const usedDateTypes = new Map()

    const isDateTypeAvailable = (date: dayjs.Dayjs, type: string): boolean => {
        const dateKey = formatDate(date)
        const usedTypes = usedDateTypes.get(dateKey) || new Set()
        return !usedTypes.has(type)
    }

    const markDateTypeUsed = (date: dayjs.Dayjs, type: string) => {
        const dateKey = formatDate(date)
        if (!usedDateTypes.has(dateKey)) {
            usedDateTypes.set(dateKey, new Set())
        }
        usedDateTypes.get(dateKey)!.add(type)
    }

    const createEvent = (
        date: dayjs.Dayjs,
        type: string,
        duration: number = 1,
        title?: string,
        description?: string,
    ) => {
        const startDate = date
        const endDate = date.add(duration - 1, 'day')

        const dateSeed = date.valueOf() + eventId
        const status =
            type === 'holiday' ? 'approved' : getRandomStatus(dateSeed)
        const employeeCount =
            type === 'holiday'
                ? 0
                : Math.floor(seededRandom(dateSeed + 100) * 3) + 1

        let currentDate = startDate
        while (currentDate.isSameOrBefore(endDate)) {
            markDateTypeUsed(currentDate, type)
            currentDate = currentDate.add(1, 'day')
        }

        return {
            id: eventId++,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            title:
                title ||
                (type === 'holiday'
                    ? 'Public Holiday'
                    : type === 'annualLeave'
                      ? 'Annual Leave'
                      : type === 'sickLeave'
                        ? 'Sick Leave'
                        : 'Casual Leave'),
            color: getLeaveTypeColor(type),
            description:
                description ||
                `${
                    type === 'holiday'
                        ? 'Public Holiday'
                        : type === 'annualLeave'
                          ? 'Annual leave'
                          : type === 'sickLeave'
                            ? 'Medical leave'
                            : 'Personal leave'
                }`,
            type,
            employees:
                type === 'holiday'
                    ? []
                    : getRandomEmployees(employeeCount, status, dateSeed),
        }
    }

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const prevMonthHolidays = holidayTemplates.filter(
        (h) => h.month === prevMonth,
    )
    prevMonthHolidays.slice(0, 2).forEach((holiday) => {
        const holidayDate = dayjs()
            .year(prevYear)
            .month(prevMonth)
            .date(holiday.day)
        events.push(
            createEvent(
                holidayDate,
                'holiday',
                holiday.duration,
                holiday.name,
                `Public Holiday - ${holiday.name}`,
            ),
        )
    })

    const prevMonthEventsNeeded = 10 - prevMonthHolidays.slice(0, 2).length
    let prevMonthAttempts = 0
    for (
        let i = 0;
        i < prevMonthEventsNeeded && prevMonthAttempts < 50;
        prevMonthAttempts++
    ) {
        const seed =
            currentMonth * 1000 + prevMonth * 100 + i + prevMonthAttempts
        const randomDate = getRandomDateInMonth(prevYear, prevMonth, seed)
        const leaveType = getRandomLeaveType(seed)

        if (isDateTypeAvailable(randomDate, leaveType)) {
            events.push(createEvent(randomDate, leaveType))
            i++
        }
    }

    const currentMonthHolidays = holidayTemplates.filter(
        (h) => h.month === currentMonth,
    )
    currentMonthHolidays.slice(0, 3).forEach((holiday) => {
        const holidayDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .date(holiday.day)
        events.push(
            createEvent(
                holidayDate,
                'holiday',
                holiday.duration,
                holiday.name,
                `Public Holiday - ${holiday.name}`,
            ),
        )
    })

    const currentMonthEventsNeeded =
        15 - currentMonthHolidays.slice(0, 3).length
    let currentMonthAttempts = 0
    for (
        let i = 0;
        i < currentMonthEventsNeeded && currentMonthAttempts < 50;
        currentMonthAttempts++
    ) {
        const seed =
            currentMonth * 1000 +
            currentMonth * 100 +
            i +
            50 +
            currentMonthAttempts
        const randomDate = getRandomDateInMonth(currentYear, currentMonth, seed)
        const leaveType = getRandomLeaveType(seed)

        if (isDateTypeAvailable(randomDate, leaveType)) {
            events.push(createEvent(randomDate, leaveType))
            i++
        }
    }

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

    const nextMonthHolidays = holidayTemplates.filter(
        (h) => h.month === nextMonth,
    )
    nextMonthHolidays.slice(0, 2).forEach((holiday) => {
        const holidayDate = dayjs()
            .year(nextYear)
            .month(nextMonth)
            .date(holiday.day)
        events.push(
            createEvent(
                holidayDate,
                'holiday',
                holiday.duration,
                holiday.name,
                `Public Holiday - ${holiday.name}`,
            ),
        )
    })

    const nextMonthEventsNeeded = 10 - nextMonthHolidays.slice(0, 2).length
    let nextMonthAttempts = 0
    for (
        let i = 0;
        i < nextMonthEventsNeeded && nextMonthAttempts < 50;
        nextMonthAttempts++
    ) {
        const seed =
            currentMonth * 1000 + nextMonth * 100 + i + 100 + nextMonthAttempts
        const randomDate = getRandomDateInMonth(nextYear, nextMonth, seed)
        const leaveType = getRandomLeaveType(seed)

        if (isDateTypeAvailable(randomDate, leaveType)) {
            events.push(createEvent(randomDate, leaveType))
            i++
        }
    }

    return events.sort(
        (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
    )
}

export const leaveCalendarEvents = generateLeaveCalendarEvents()

export const employeeLeaveDetails: Record<string, any> = {}

leaveCalendarEvents.forEach((event) => {
    event.employees.forEach((emp: any) => {
        const key = `${emp.id}-${event.id}`
        employeeLeaveDetails[key] = {
            id: emp.id,
            name: emp.name,
            title: emp.title,
            reason:
                event.type === 'sickLeave'
                    ? 'Medical treatment and recovery'
                    : event.type === 'annualLeave'
                      ? 'Family vacation and personal time'
                      : event.type === 'casualLeave'
                        ? 'Personal matters'
                        : undefined,
            status:
                emp.status === 'pending'
                    ? 'Pending'
                    : emp.status === 'approved'
                      ? 'Approved'
                      : emp.status === 'rejected'
                        ? 'Rejected'
                        : 'Cancelled',
            appliedAt: formatDate(addDays(dayjs(event.startDate), -7)),
            approvedAt:
                emp.status === 'approved'
                    ? formatDate(addDays(dayjs(event.startDate), -3))
                    : undefined,
            halfDay: seededRandom(event.id + parseInt(emp.id)) > 0.7,
            startDate: event.startDate,
            endDate: event.endDate,
            doc:
                event.type === 'sickLeave'
                    ? [
                          {
                              id: '1',
                              name: 'Medical Certificate.pdf',
                              url: '/documents/medical-cert.pdf',
                              type: 'application/pdf',
                          },
                      ]
                    : event.type === 'annualLeave' &&
                        seededRandom(event.id + parseInt(emp.id) + 50) > 0.5
                      ? [
                            {
                                id: '2',
                                name: 'Travel Itinerary.pdf',
                                url: '/documents/travel-itinerary.pdf',
                                type: 'application/pdf',
                            },
                        ]
                      : undefined,
        }
    })
})

export const leaveStatistics = {
    totalRequests: {
        value: 128,
        change: '+12%',
        trend: 'up',
    },
    approvalRate: {
        value: 84,
        change: '+3%',
        trend: 'up',
    },
    onLeaveToday: {
        value: 7,
        departments: '3 departments',
    },
    upcomingLeaves: {
        value: 23,
        period: 'Next 7 days',
    },
}

const generateLeaveRequests = () => {
    const requests: any[] = []
    let requestId = 1

    const nonHolidayEvents = leaveCalendarEvents.filter(
        (event) => event.type !== 'holiday',
    )

    nonHolidayEvents.forEach((event) => {
        event.employees.forEach((employee: any) => {
            const startDate = new Date(event.startDate)
            const duration = calculateLeaveDuration(
                event.startDate,
                event.endDate,
            )

            const employeeData = userDetailData.find(
                (user) => user.id === employee.id,
            )
            if (!employeeData) return

            const reasons = {
                annualLeave: [
                    'Family vacation',
                    'Personal time off',
                    'Wedding anniversary celebration',
                    'Holiday trip',
                    'Rest and relaxation',
                ],
                sickLeave: [
                    'Medical appointment',
                    'Recovery from illness',
                    'Dental treatment',
                    'Medical procedure',
                    'Health checkup',
                ],
                casualLeave: [
                    'Personal matters',
                    'Family emergency',
                    'Home maintenance',
                    'Personal appointment',
                    'Family event',
                ],
            }

            const typeReasons = reasons[event.type as keyof typeof reasons] || [
                'Personal matters',
            ]
            const reasonSeed = event.id + parseInt(employee.id) + requestId
            const randomReason =
                typeReasons[
                    Math.floor(seededRandom(reasonSeed) * typeReasons.length)
                ]

            const daysBeforeApplication =
                Math.floor(seededRandom(reasonSeed + 100) * 12) + 3
            const appliedDate = dayjs(startDate).subtract(
                daysBeforeApplication,
                'day',
            )

            requests.push({
                id: requestId.toString(),
                employee: {
                    id: employeeData.id,
                    name: employeeData.name,
                    title: employeeData.title,
                    avatar: employeeData.img,
                },
                type:
                    event.type === 'annualLeave'
                        ? 'annualLeave'
                        : event.type === 'sickLeave'
                          ? 'sickLeave'
                          : event.type === 'casualLeave'
                            ? 'casualLeave'
                            : 'holiday',
                startDate: event.startDate,
                endDate: event.endDate,
                duration,
                reason:
                    employee.status === 'pending' ||
                    seededRandom(reasonSeed + 200) > 0.3
                        ? randomReason
                        : undefined,
                status: employee.status,
                appliedAt: appliedDate.format('YYYY-MM-DD'),
            })

            requestId++
        })
    })

    return requests.sort(
        (a, b) => dayjs(b.appliedAt).valueOf() - dayjs(a.appliedAt).valueOf(),
    )
}

export const leaveRequests = generateLeaveRequests()

const generateEmployeePayroll = (
    id: string,
    name: string,
    department: string,
    avatar: string,
    month: string,
) => {
    const seed = parseInt(id) + month.charCodeAt(month.length - 1)
    const random = (min: number, max: number) =>
        Math.floor(
            (((seed * 9301 + 49297) % 233280) / 233280) * (max - min + 1),
        ) + min

    const basicSalary = random(3000, 8000)
    const allowances = random(200, 800)
    const deductions = random(100, 500)
    const netPay = basicSalary + allowances - deductions

    const currentMonth = dayjs('2024-12-02').format('YYYY-MM')
    const recordMonth = month

    let status

    if (recordMonth < currentMonth) {
        status = 'paid'
    } else if (recordMonth === currentMonth) {
        status = 'pending'
    } else {
        const statusRand = random(1, 100)
        if (statusRand <= 70) status = 'pending'
        else if (statusRand <= 90) status = 'processing'
        else status = 'failed'
    }

    return {
        id: `${id}-${month}`,
        employee: {
            id,
            name,
            department,
            avatar,
        },
        basicSalary,
        allowances,
        deductions,
        netPay,
        status,
        payPeriod: month,
        processedAt: status === 'paid' ? `${month}-28T10:30:00Z` : undefined,
        paySlipUrl:
            status === 'paid' ? `/payslips/${id}-${month}.pdf` : undefined,
    }
}

const getDepartmentByUserId = (userId: string): string => {
    const departments = [
        'Engineering',
        'Marketing',
        'Sales',
        'HR',
        'Finance',
        'Operations',
        'Design',
        'Product',
    ]
    const id = parseInt(userId)
    return departments[id % departments.length]
}

const getEmployeesFromUserData = () => {
    return userDetailData.map((user) => ({
        id: user.id,
        name: user.name,
        department: getDepartmentByUserId(user.id),
        avatar: user.img,
    }))
}

export const generatePayrollData = (month: string) => {
    const employees = getEmployeesFromUserData()
    return employees.map((emp) =>
        generateEmployeePayroll(
            emp.id,
            emp.name,
            emp.department,
            emp.avatar,
            month,
        ),
    )
}

export const calculatePayrollMetrics = (records: any[]) => {
    const totalPaid = records.reduce((sum, record) => sum + record.netPay, 0)
    const totalBasicSalary = records.reduce(
        (sum, record) => sum + record.basicSalary,
        0,
    )
    const totalAllowances = records.reduce(
        (sum, record) => sum + record.allowances,
        0,
    )
    const totalDeductions = records.reduce(
        (sum, record) => sum + record.deductions,
        0,
    )

    const totalCompensation = totalBasicSalary + totalAllowances
    const bonuses = totalCompensation * 0.15
    const overtime = totalCompensation * 0.1

    return {
        totalPaid,
        breakdown: {
            baseSalary: totalBasicSalary,
            bonuses: Math.round(bonuses),
            overtime: Math.round(overtime),
            allowances: totalAllowances,
            deductions: totalDeductions,
        },
        summary: {
            deductions: totalDeductions,
            extras: Math.round(bonuses + overtime),
            retentions: Math.round(totalDeductions * 0.3),
            additions: Math.round(totalAllowances + bonuses + overtime),
        },
    }
}

export type AttendanceStatus =
    | 'present'
    | 'absent'
    | 'late'
    | 'on_leave'
    | 'remote'

export type AttendanceRecord = {
    id: string
    employee: {
        id: string
        name: string
        department: string
        role: string
        avatar?: string
    }
    date: string
    checkIn?: string
    checkOut?: string
    totalHours?: string
    status: AttendanceStatus
    markedBy: 'system' | 'admin' | 'employee' | 'biometric'
    notes?: string
}

export type AttendanceMetrics = {
    presentToday: number
    absentToday: number
    lateArrivals: number
    attendanceRate: number
}

export type GetAttendanceResponse = {
    records: AttendanceRecord[]
    metrics: AttendanceMetrics
    total: number
}

const generateTime = (
    baseHour: number,
    baseMinute: number,
    variance: number = 30,
    seed: number = 0,
): string => {
    const totalMinutes =
        baseHour * 60 + baseMinute + (seededRandom(seed) - 0.5) * variance
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

const calculateTotalHours = (checkIn: string, checkOut: string): string => {
    const [inHour, inMinute] = checkIn.split(':').map(Number)
    const [outHour, outMinute] = checkOut.split(':').map(Number)

    const inTotalMinutes = inHour * 60 + inMinute
    const outTotalMinutes = outHour * 60 + outMinute

    const diffMinutes = outTotalMinutes - inTotalMinutes
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    return `${hours}h ${minutes}m`
}

export const generateAttendanceData = (date: string): AttendanceRecord[] => {
    const employees = getEmployeesFromUserData()
    const dateObj = dayjs(date)

    return employees.map((emp) => {
        const dateSeed =
            dateObj.year() * 10000 + dateObj.month() * 100 + dateObj.date()
        const seed = parseInt(emp.id) * 1000 + dateSeed
        const random = seededRandom(seed)

        let status: AttendanceStatus
        let checkIn: string | undefined
        let checkOut: string | undefined
        let markedBy: AttendanceRecord['markedBy'] = 'biometric'

        if (random < 0.7) status = 'present'
        else if (random < 0.76) status = 'late'
        else if (random < 0.81) status = 'remote'
        else if (random < 0.85) status = 'on_leave'
        else status = 'absent'

        if (status === 'present') {
            checkIn = generateTime(9, 0, 30, seed + 1000)
            checkOut = generateTime(17, 30, 45, seed + 2000)
        } else if (status === 'late') {
            checkIn = generateTime(9, 45, 60, seed + 1000)
            checkOut = generateTime(17, 30, 45, seed + 2000)
        } else if (status === 'remote') {
            checkIn = generateTime(9, 15, 45, seed + 1000)
            checkOut = generateTime(17, 15, 60, seed + 2000)
            markedBy = 'employee'
        }

        const totalHours =
            checkIn && checkOut
                ? calculateTotalHours(checkIn, checkOut)
                : undefined

        if (random > 0.95) {
            markedBy = 'admin'
        }

        return {
            id: `${emp.id}-${date}`,
            employee: {
                id: emp.id,
                name: emp.name,
                department: emp.department,
                role:
                    userDetailData.find((u) => u.id === emp.id)?.title ||
                    'Employee',
                avatar: emp.avatar,
            },
            date,
            checkIn,
            checkOut,
            totalHours,
            status,
            markedBy,
            notes:
                status === 'on_leave'
                    ? 'Approved leave'
                    : status === 'absent' && random > 0.8
                      ? 'Sick leave'
                      : undefined,
        }
    })
}

export const calculateAttendanceMetrics = (
    records: AttendanceRecord[],
): AttendanceMetrics => {
    const presentToday = records.filter((r) => r.status === 'present').length
    const remoteToday = records.filter((r) => r.status === 'remote').length
    const absentToday = records.filter((r) => r.status === 'absent').length
    const lateArrivals = records.filter((r) => r.status === 'late').length
    const totalEmployees = records.length

    const attendingEmployees = presentToday + remoteToday + lateArrivals
    const attendanceRate =
        totalEmployees > 0
            ? Math.round((attendingEmployees / totalEmployees) * 100)
            : 0

    return {
        presentToday: presentToday + remoteToday,
        absentToday,
        lateArrivals,
        attendanceRate,
    }
}

export const generatePeriodAttendanceData = (
    startDate: string,
    endDate: string,
) => {
    const employees = getEmployeesFromUserData()
    const start = new Date(startDate)
    const end = new Date(endDate)
    const dates: string[] = []

    let current = dayjs(start)
    const endDateObj = dayjs(end)
    while (current.isSameOrBefore(endDateObj)) {
        dates.push(current.format('YYYY-MM-DD'))
        current = current.add(1, 'day')
    }

    return employees.map((emp) => {
        const employeeAttendance: Record<string, AttendanceStatus> = {}
        let presentDays = 0

        dates.forEach((date) => {
            const records = generateAttendanceData(date)
            const empRecord = records.find((r) => r.employee.id === emp.id)
            if (empRecord) {
                employeeAttendance[date] = empRecord.status
                if (
                    empRecord.status === 'present' ||
                    empRecord.status === 'late' ||
                    empRecord.status === 'remote'
                ) {
                    presentDays++
                }
            }
        })

        const attendancePercentage = Math.round(
            (presentDays / dates.length) * 100,
        )

        return {
            employee: {
                id: emp.id,
                name: emp.name,
                department: emp.department,
                role:
                    userDetailData.find((u) => u.id === emp.id)?.title ||
                    'Employee',
                avatar: emp.avatar,
            },
            attendance: employeeAttendance,
            presentPercentage: attendancePercentage,
        }
    })
}

export const departments = [
    {
        id: '1',
        name: 'Engineering',
        description: 'Software development and technical operations',
        roles: [
            {
                id: '1-1',
                name: 'Software Engineer',
                department: 'Engineering',
                level: 'junior',
            },
            {
                id: '1-2',
                name: 'Senior Software Engineer',
                department: 'Engineering',
                level: 'senior',
            },
            {
                id: '1-3',
                name: 'Tech Lead',
                department: 'Engineering',
                level: 'lead',
            },
            {
                id: '1-4',
                name: 'Engineering Manager',
                department: 'Engineering',
                level: 'manager',
            },
        ],
    },
    {
        id: '2',
        name: 'Marketing',
        description: 'Brand promotion and customer acquisition',
        roles: [
            {
                id: '2-1',
                name: 'Marketing Specialist',
                department: 'Marketing',
                level: 'junior',
            },
            {
                id: '2-2',
                name: 'Digital Marketing Manager',
                department: 'Marketing',
                level: 'mid',
            },
            {
                id: '2-3',
                name: 'Marketing Director',
                department: 'Marketing',
                level: 'manager',
            },
        ],
    },
    {
        id: '3',
        name: 'Sales',
        description: 'Revenue generation and client relations',
        roles: [
            {
                id: '3-1',
                name: 'Sales Representative',
                department: 'Sales',
                level: 'junior',
            },
            {
                id: '3-2',
                name: 'Account Manager',
                department: 'Sales',
                level: 'mid',
            },
            {
                id: '3-3',
                name: 'Sales Manager',
                department: 'Sales',
                level: 'manager',
            },
        ],
    },
    {
        id: '4',
        name: 'HR',
        description: 'Human resources and talent management',
        roles: [
            {
                id: '4-1',
                name: 'HR Specialist',
                department: 'HR',
                level: 'junior',
            },
            {
                id: '4-2',
                name: 'HR Manager',
                department: 'HR',
                level: 'manager',
            },
        ],
    },
    {
        id: '5',
        name: 'Finance',
        description: 'Financial planning and accounting',
        roles: [
            {
                id: '5-1',
                name: 'Financial Analyst',
                department: 'Finance',
                level: 'junior',
            },
            {
                id: '5-2',
                name: 'Accountant',
                department: 'Finance',
                level: 'mid',
            },
            {
                id: '5-3',
                name: 'Finance Manager',
                department: 'Finance',
                level: 'manager',
            },
        ],
    },
    {
        id: '6',
        name: 'Operations',
        description: 'Business operations and process management',
        roles: [
            {
                id: '6-1',
                name: 'Operations Specialist',
                department: 'Operations',
                level: 'junior',
            },
            {
                id: '6-2',
                name: 'Operations Manager',
                department: 'Operations',
                level: 'manager',
            },
        ],
    },
    {
        id: '7',
        name: 'Design',
        description: 'User experience and visual design',
        roles: [
            {
                id: '7-1',
                name: 'UI/UX Designer',
                department: 'Design',
                level: 'mid',
            },
            {
                id: '7-2',
                name: 'Senior Designer',
                department: 'Design',
                level: 'senior',
            },
            {
                id: '7-3',
                name: 'Design Lead',
                department: 'Design',
                level: 'lead',
            },
        ],
    },
    {
        id: '8',
        name: 'Product',
        description: 'Product strategy and management',
        roles: [
            {
                id: '8-1',
                name: 'Product Manager',
                department: 'Product',
                level: 'mid',
            },
            {
                id: '8-2',
                name: 'Senior Product Manager',
                department: 'Product',
                level: 'senior',
            },
        ],
    },
]

const getEmploymentTypeByUserId = (userId: string) => {
    const types = ['full-time', 'part-time', 'contract', 'intern', 'freelance']
    const id = parseInt(userId)
    if (id % 10 < 7) return 'full-time'
    return types[id % types.length]
}

const getEmployeeStatusByUserId = (userId: string) => {
    const id = parseInt(userId)
    if (id % 20 < 17) return 'active'
    if (id % 20 < 19) return 'inactive'
    return 'terminated'
}

const getCurrentStatusByUserId = (userId: string) => {
    const id = parseInt(userId)
    if (id % 10 < 7) return 'working'
    if (id % 10 < 9) return 'away'
    return 'on-leave'
}

const getGenderByUserId = (userId: string) => {
    const id = parseInt(userId)
    if (id % 10 < 4) return 'male'
    if (id % 10 < 8) return 'female'
    if (id % 10 < 9) return 'other'
    return 'prefer-not-to-say'
}

const getRoleByDepartmentAndUserId = (
    department: string,
    userId: string,
): string => {
    const dept = departments.find((d) => d.name === department)
    if (!dept) return 'Employee'

    const id = parseInt(userId)
    const roleIndex = id % dept.roles.length
    return dept.roles[roleIndex].name
}

export const generateEmployeeData = () => {
    const employees: any[] = []

    userDetailData.forEach((user, index) => {
        const uniqueId = `${parseInt(user.id) * 10 + index}`
        const employee = generateSingleEmployee(user, uniqueId, index)
        employees.push(employee)
    })

    return employees
}

const generateSingleEmployee = (
    user: any,
    uniqueId: string,
    variant: number,
) => {
    return (() => {
        const department = getDepartmentByUserId(uniqueId)
        const role = getRoleByDepartmentAndUserId(department, uniqueId)
        const employmentType = getEmploymentTypeByUserId(uniqueId)
        const status = getEmployeeStatusByUserId(uniqueId)
        const currentStatus = getCurrentStatusByUserId(uniqueId)
        const gender = getGenderByUserId(uniqueId)

        const employeeId = `EMP${uniqueId.padStart(5, '0')}`

        const yearsAgo = Math.floor(
            seededRandom(parseInt(uniqueId) + 1000 + variant) * 5,
        )
        const monthsAgo = Math.floor(
            seededRandom(parseInt(uniqueId) + 2000 + variant) * 12,
        )
        const joiningDate = dayjs('2024-12-02')
            .subtract(yearsAgo, 'year')
            .subtract(monthsAgo, 'month')
            .format('YYYY-MM-DD')

        const baseSalary =
            40000 + (parseInt(uniqueId) % 10) * 10000 + yearsAgo * 5000

        const employee = {
            id: uniqueId,
            employeeId,
            personalInfo: {
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.name,
                email:
                    variant > 0
                        ? `${user.email.split('@')[0]}.${variant}@${user.email.split('@')[1]}`
                        : user.email,
                phone: user.phoneNumber,
                gender,
                dateOfBirth: user.birthday,
                profilePhoto: user.img,
                address: user.address,
            },
            jobInfo: {
                department,
                designation: role,
                role,
                employmentType,
                joiningDate,
                workLocation: user.location,
            },
            accountInfo: {
                loginEmail:
                    variant > 0
                        ? `${user.email.split('@')[0]}.${variant}@${user.email.split('@')[1]}`
                        : user.email,
                status,
                currentStatus,
                lastLogin: user.lastOnline,
                permissions: user.role,
                createdBy: 'system',
                updatedBy: 'system',
            },
            compensation: {
                baseSalary,
                currency: 'USD',
                bonus: Math.floor(baseSalary * 0.1),
                allowances: Math.floor(baseSalary * 0.05),
                deductions: Math.floor(baseSalary * 0.02),
                effectiveDate: joiningDate,
            },
            documents: [
                {
                    id: `doc-${uniqueId}-1`,
                    name: 'Resume.pdf',
                    type: 'application/pdf',
                    url: `/documents/resume-${uniqueId}.pdf`,
                    uploadedAt: joiningDate,
                    uploadedBy: 'hr',
                },
                {
                    id: `doc-${uniqueId}-2`,
                    name: 'ID_Copy.pdf',
                    type: 'application/pdf',
                    url: `/documents/id-${uniqueId}.pdf`,
                    uploadedAt: joiningDate,
                    uploadedBy: 'hr',
                },
            ],
            createdAt: joiningDate,
            updatedAt: dayjs('2024-12-02').format('YYYY-MM-DD'),
        }

        return employee
    })()
}

export const employeeData = generateEmployeeData()

export const getEmployeesByStatus = (status: string) => {
    return employeeData.filter((emp) => emp.accountInfo.status === status)
}

export const getEmployeesByDepartment = (department: string) => {
    return employeeData.filter((emp) => emp.jobInfo.department === department)
}

export const getEmployeesByEmploymentType = (type: string) => {
    return employeeData.filter((emp) => emp.jobInfo.employmentType === type)
}

export const getUniqueEmploymentTypes = (): string[] => {
    return [...new Set(employeeData.map((emp) => emp.jobInfo.employmentType))]
}

export const getUniqueDepartments = (): string[] => {
    return [...new Set(employeeData.map((emp) => emp.jobInfo.department))]
}

export const getRolesByDepartments = (departmentNames: string[]): string[] => {
    const roles = new Set<string>()
    departmentNames.forEach((deptName) => {
        const dept = departments.find((d) => d.name === deptName)
        if (dept) {
            dept.roles.forEach((role) => roles.add(role.name))
        }
    })
    return Array.from(roles)
}

export const announcementCategories = [
    { id: 'all', name: 'All', color: 'gray', count: 0 },
    { id: 'general', name: 'General', color: 'blue', count: 0 },
    { id: 'new-hire', name: 'New Hire', color: 'green', count: 0 },
    { id: 'policy', name: 'Policy Updates', color: 'purple', count: 0 },
    { id: 'promotion', name: 'Promotion', color: 'yellow', count: 0 },
    { id: 'transfer', name: 'Transfer', color: 'orange', count: 0 },
    { id: 'training', name: 'Training', color: 'pink', count: 0 },
    { id: 'special', name: 'Special', color: 'red', count: 0 },
]

const announcementTemplates = [
    {
        category: 'general',
        title: 'Welcome to Eyris People 👋',
        description:
            "We're thrilled to share some exciting updates with you! Our team has been hard at work, and we are delighted to introduce the latest features that will enhance your experience. These improvements are designed to make your daily tasks more efficient and enjoyable.",
    },
    {
        category: 'policy',
        title: 'Updated Remote Work Policy',
        description:
            "We've updated our remote work policy to provide more flexibility for our team members. The new policy allows for hybrid work arrangements and includes guidelines for maintaining productivity and collaboration while working remotely.",
    },
    {
        category: 'new-hire',
        title: 'Welcome Our New Team Members!',
        description:
            "We're excited to welcome several new talented individuals to our team this month. Please join us in welcoming them and helping them feel at home in our organization.",
    },
    {
        category: 'training',
        title: 'Upcoming Leadership Training Workshop',
        description:
            "We're organizing a comprehensive leadership training workshop next month. This program is designed to enhance management skills and foster leadership qualities among our team members.",
    },
    {
        category: 'promotion',
        title: 'Congratulations on Recent Promotions!',
        description:
            "We're pleased to announce several well-deserved promotions within our organization. These team members have demonstrated exceptional performance and dedication to their roles.",
    },
    {
        category: 'general',
        title: 'Company Town Hall Meeting',
        description:
            "Join us for our quarterly town hall meeting where we'll discuss company performance, upcoming initiatives, and answer your questions. Your participation and feedback are valuable to us.",
    },
    {
        category: 'policy',
        title: 'New Benefits Package Announcement',
        description:
            "We're excited to announce enhancements to our employee benefits package, including improved health coverage, additional wellness programs, and expanded professional development opportunities.",
    },
    {
        category: 'special',
        title: 'Annual Company Retreat 2024',
        description:
            "Save the date for our annual company retreat! This year's event will feature team-building activities, workshops, and plenty of opportunities to connect with colleagues from different departments.",
    },
    {
        category: 'training',
        title: 'Technical Skills Development Program',
        description:
            "We're launching a new technical skills development program to help team members stay current with the latest technologies and industry best practices. Registration opens next week.",
    },
    {
        category: 'general',
        title: 'Office Renovation Update',
        description:
            'Our office renovation project is progressing well. The new collaborative spaces and updated facilities will be ready next month. Thank you for your patience during this transition.',
    },
    {
        category: 'transfer',
        title: 'Department Transfer Announcements',
        description:
            "We're announcing several internal transfers as part of our organizational restructuring. These moves will help optimize our team structure and provide growth opportunities for our employees.",
    },
    {
        category: 'special',
        title: 'Employee Recognition Awards',
        description:
            'Nominations are now open for our quarterly employee recognition awards. Please take a moment to nominate colleagues who have gone above and beyond in their contributions.',
    },
]

const generateAnnouncements = () => {
    const announcements: any[] = []
    let announcementId = 1

    for (let i = 0; i < 25; i++) {
        const template = announcementTemplates[i % announcementTemplates.length]
        const daysAgo = Math.floor(seededRandom(i + 1000) * 30)
        const hoursAgo = Math.floor(seededRandom(i + 2000) * 24)
        const createdAt = dayjs('2024-12-02')
            .subtract(daysAgo, 'day')
            .subtract(hoursAgo, 'hour')

        const authorIndex = Math.floor(
            seededRandom(i + 3000) * userDetailData.length,
        )
        const author = userDetailData[authorIndex]

        const reactionCount = Math.floor(seededRandom(i + 4000) * 20) + 1
        const reactions: any[] = []
        const emojis = ['👍', '👏', '❤️', '😊', '🎉', '🔥']

        const emojiCount = Math.floor(seededRandom(i + 5000) * 3) + 1
        for (let j = 0; j < emojiCount; j++) {
            const emoji = emojis[j % emojis.length]
            const count =
                Math.floor(
                    seededRandom(i + j + 6000) * (reactionCount / emojiCount),
                ) + 1
            const users = []

            for (let k = 0; k < Math.min(count, 5); k++) {
                const userIndex = Math.floor(
                    seededRandom(i + j + k + 7000) * userDetailData.length,
                )
                users.push({
                    id: userDetailData[userIndex].id,
                    name: userDetailData[userIndex].name,
                })
            }

            reactions.push({ emoji, count, users })
        }

        const commentCount = Math.floor(seededRandom(i + 8000) * 8)
        const comments: any[] = []
        const commentTexts = [
            'Great news! Looking forward to this.',
            'Thanks for sharing this update.',
            'This is exactly what we needed!',
            'Excited to see these changes.',
            'Thank you for the detailed information.',
            "Can't wait to participate!",
            'This will be very helpful.',
            'Appreciate the transparency.',
        ]

        for (let j = 0; j < commentCount; j++) {
            const commentUserIndex = Math.floor(
                seededRandom(i + j + 9000) * userDetailData.length,
            )
            const commentUser = userDetailData[commentUserIndex]
            const minutesAgo = Math.floor(
                seededRandom(i + j + 10000) * (daysAgo * 24 * 60),
            )

            const replyCount = Math.floor(seededRandom(i + j + 14000) * 3)
            const replies: any[] = []

            for (let k = 0; k < replyCount; k++) {
                const replyUserIndex = Math.floor(
                    seededRandom(i + j + k + 15000) * userDetailData.length,
                )
                const replyUser = userDetailData[replyUserIndex]
                const replyMinutesAgo = Math.floor(
                    seededRandom(i + j + k + 16000) * minutesAgo,
                )

                replies.push({
                    id: `reply-${announcementId}-${j + 1}-${k + 1}`,
                    author: {
                        id: replyUser.id,
                        name: replyUser.name,
                        avatar: replyUser.img,
                    },
                    text: commentTexts[(j + k) % commentTexts.length],
                    createdAt: dayjs('2024-12-02')
                        .subtract(replyMinutesAgo, 'minute')
                        .toISOString(),
                })
            }

            comments.push({
                id: `comment-${announcementId}-${j + 1}`,
                author: {
                    id: commentUser.id,
                    name: commentUser.name,
                    avatar: commentUser.img,
                },
                text: commentTexts[j % commentTexts.length],
                createdAt: dayjs('2024-12-02')
                    .subtract(minutesAgo, 'minute')
                    .toISOString(),
                replies,
            })
        }

        const isPinned =
            i < 5 &&
            (reactions.reduce((sum, r) => sum + r.count, 0) > 10 ||
                comments.length > 3)

        let media: any[] | undefined
        if (seededRandom(i + 11000) > 0.8) {
            const mediaType = 'photo'
            media = [
                {
                    id: `media-${announcementId}`,
                    type: mediaType,
                    url: `/img/others/announcement/img-${announcementId}.jpg`,
                    name: `${mediaType}-${announcementId}.${mediaType === 'photo' ? 'jpg' : 'mp4'}`,
                    size:
                        Math.floor(seededRandom(i + 13000) * 5000000) + 500000,
                },
            ]
        }

        announcements.push({
            id: `announcement-${announcementId}`,
            author: {
                id: author.id,
                name: author.name,
                title: author.title,
                avatar: author.img,
            },
            category: template.category,
            title: template.title,
            description: template.description,
            media,
            reactions,
            comments,
            isPinned,
            createdAt: createdAt.toISOString(),
            updatedAt: createdAt.toISOString(),
        })

        announcementId++
    }

    return announcements.sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
    )
}

export const announcements = generateAnnouncements()

announcementCategories.forEach((category) => {
    if (category.id === 'all') {
        category.count = announcements.length
    } else {
        category.count = announcements.filter(
            (a) => a.category === category.id,
        ).length
    }
})

export const pinnedAnnouncements = announcements
    .filter((a) => a.isPinned)
    .slice(0, 5)

export const getAnnouncementsByCategory = (categoryId: string) => {
    if (categoryId === 'all') return announcements
    return announcements.filter((a) => a.category === categoryId)
}

export const getAnnouncementById = (id: string) => {
    return announcements.find((a) => a.id === id)
}

const generateTurnoverData = () => {
    const monthlyData = []
    const targetRate = 8.0

    const trendPattern = [
        8.2, 8.8, 8.2, 8.6, 8.1, 8.5, 9.1, 8.9, 8.3, 8.1, 8.4, 9.4,
    ]

    for (let i = 11; i >= 0; i--) {
        const month = dayjs('2024-12-02').subtract(i, 'month')
        const monthKey = month.format('YYYY-MM')

        const rate = trendPattern[11 - i]

        const avgHeadcount = employeeData.length
        const voluntaryLeavers = Math.round((rate / 100) * avgHeadcount)

        monthlyData.push({
            month: monthKey,
            rate,
            voluntaryLeavers,
            avgHeadcount,
        })
    }

    const currentRate = monthlyData[monthlyData.length - 1].rate
    const variance = Math.round((currentRate - targetRate) * 10) / 10

    return {
        currentRate,
        targetRate,
        variance,
        monthlyData,
    }
}

const generateJobLevelData = () => {
    const total = 156
    const levels = [
        { name: 'Executive', count: 89, percentage: 57 },
        { name: 'Senior Executive', count: 42, percentage: 27 },
        { name: 'Manager', count: 18, percentage: 12 },
        { name: 'Director', count: 7, percentage: 4 },
    ]

    return {
        total,
        levels,
    }
}

const generatePayrollDashboardData = () => {
    const monthlyData = []
    let ytdTotal = 0

    for (let i = 5; i >= 0; i--) {
        const month = dayjs('2024-12-02').subtract(i, 'month')
        const monthKey = month.format('YYYY-MM')

        const payrollRecords = generatePayrollData(monthKey)
        const metrics = calculatePayrollMetrics(payrollRecords)

        const baseSalary = metrics.breakdown.baseSalary
        const bonuses = metrics.breakdown.bonuses
        const overtime = metrics.breakdown.overtime
        const taxes = Math.round(baseSalary * 0.15)
        const total = baseSalary + bonuses + overtime + taxes

        monthlyData.push({
            month: monthKey,
            baseSalary,
            bonuses,
            overtime,
            taxes,
            total,
        })

        ytdTotal += total
    }

    const previousMonth = monthlyData[monthlyData.length - 2].total

    const variancePercentage = 3.5
    const varianceAmount = Math.round(
        (previousMonth * variancePercentage) / 100,
    )
    const trend = 'up'

    return {
        ytdTotal,
        monthlyData,
        variance: {
            amount: varianceAmount,
            percentage: variancePercentage,
            trend,
        },
    }
}

const generateEmployeeQualityData = () => {
    const employeeScores: Record<string, { scores: number[]; dept: string }> =
        {}

    employeeData.forEach((emp) => {
        const isManager =
            emp.jobInfo.role.toLowerCase().includes('manager') ||
            emp.jobInfo.role.toLowerCase().includes('lead')
        if (isManager) return

        const empId = emp.id
        const dept = emp.jobInfo.department

        const joiningDate = dayjs(emp.jobInfo.joiningDate)
        const tenureYears = dayjs('2024-12-02').diff(joiningDate, 'year', true)

        const performanceRating = 3 + seededRandom(parseInt(empId) + 100) * 2
        const performanceScore = (performanceRating / 5) * 40

        let tenureScore = 0
        if (tenureYears < 1) tenureScore = 18
        else if (tenureYears < 3) tenureScore = 22.5
        else if (tenureYears < 5) tenureScore = 27
        else tenureScore = 30

        const certCount = Math.floor(seededRandom(parseInt(empId) + 200) * 6)
        const skillScore = Math.min((certCount / 5) * 30, 30)

        const totalScore = performanceScore + tenureScore + skillScore

        if (!employeeScores[dept]) {
            employeeScores[dept] = { scores: [], dept }
        }
        employeeScores[dept].scores.push(totalScore)
    })

    const departmentAvgs = Object.entries(employeeScores).map(
        ([dept, data]) => {
            const avgScore =
                data.scores.reduce((sum, score) => sum + score, 0) /
                data.scores.length
            return {
                dept,
                avgScore: Math.round(avgScore * 10) / 10,
                employeeCount: data.scores.length,
            }
        },
    )

    const sortedDepts = departmentAvgs
        .sort((a, b) => b.employeeCount - a.employeeCount)
        .slice(0, 5)

    const colors = ['#286cf0', '#00a85b', '#f59e0b', '#8b5cf6', '#ec4899']

    const departments = sortedDepts.map((dept, index) => ({
        name: dept.dept,
        avgScore: dept.avgScore,
        employeeCount: dept.employeeCount,
        color: colors[index % colors.length],
    }))

    const allScores = Object.values(employeeScores).flatMap((d) => d.scores)
    const companyAvgScore =
        Math.round(
            (allScores.reduce((sum, s) => sum + s, 0) / allScores.length) * 10,
        ) / 10

    const previousScore = Math.round((companyAvgScore - 2.5) * 10) / 10
    const trend = companyAvgScore >= previousScore ? 'up' : 'down'

    return {
        companyAvgScore,
        previousScore,
        trend,
        departments,
    }
}

const generateActionsData = () => {
    const today = dayjs('2024-12-02')
    const events: any[] = []

    for (let i = 0; i < 8; i++) {
        const date = today.add(i, 'day')

        const scheduleCount =
            1 + Math.floor(seededRandom(date.valueOf() + 1000) * 2)
        for (let j = 0; j < scheduleCount; j++) {
            const seed = date.valueOf() + j + 1000
            const employeeIndex = Math.floor(
                seededRandom(seed) * userDetailData.length,
            )
            const employee = userDetailData[employeeIndex]

            const scheduleTypes = ['interview', 'meeting', 'performance_review']
            const typeIndex = Math.floor(
                seededRandom(seed + 100) * scheduleTypes.length,
            )
            const type = scheduleTypes[typeIndex] as any

            const hour = 9 + Math.floor(seededRandom(seed + 200) * 9)
            const minute = Math.floor(seededRandom(seed + 300) * 60)
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

            const titles: Record<string, string> = {
                interview: `Interview: ${employee.name}`,
                meeting: `Team Meeting with ${employee.name}`,
                performance_review: `Performance Review: ${employee.name}`,
            }

            const descriptions: Record<string, string> = {
                interview: 'Senior Developer position',
                meeting: 'Q4 Planning Discussion',
                performance_review: 'Quarterly performance evaluation',
            }

            events.push({
                id: `schedule-${date.format('YYYYMMDD')}-${j}`,
                category: 'schedule',
                type,
                employee: {
                    id: employee.id,
                    name: employee.name,
                    avatar: employee.img,
                    title: employee.title,
                },
                title: titles[type],
                description: descriptions[type],
                time,
                deadline: date.toISOString(),
                status: i === 0 && j === 0 ? 'urgent' : 'pending',
                actions: ['view'],
            })
        }

        if (seededRandom(date.valueOf() + 2000) > 0.5) {
            const seed = date.valueOf() + 2000
            const systemTypes = [
                'system_update',
                'policy_change',
                'training_notification',
            ]
            const typeIndex = Math.floor(
                seededRandom(seed + 100) * systemTypes.length,
            )
            const type = systemTypes[typeIndex] as any

            const hour = 9 + Math.floor(seededRandom(seed + 200) * 9)
            const minute = Math.floor(seededRandom(seed + 300) * 60)
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

            const titles: Record<string, string> = {
                system_update: 'System Maintenance Scheduled',
                policy_change: 'New HR Policy Update',
                training_notification: 'Mandatory Training Deadline',
            }

            const descriptions: Record<string, string> = {
                system_update: 'HRIS system will be down for maintenance',
                policy_change:
                    'Updated remote work policy effective next month',
                training_notification:
                    'Complete compliance training by end of week',
            }

            events.push({
                id: `system-${date.format('YYYYMMDD')}`,
                category: 'system',
                type,
                title: titles[type],
                description: descriptions[type],
                time,
                deadline: date.toISOString(),
                status: type === 'training_notification' ? 'urgent' : 'pending',
                actions:
                    type === 'training_notification'
                        ? ['approve', 'renew']
                        : ['view'],
            })
        }

        const employeeCount =
            1 + Math.floor(seededRandom(date.valueOf() + 3000) * 2)
        for (let j = 0; j < employeeCount; j++) {
            const seed = date.valueOf() + j + 3000
            const employeeIndex = Math.floor(
                seededRandom(seed) * userDetailData.length,
            )
            const employee = userDetailData[employeeIndex]

            const employeeTypes = [
                'leave_request',
                'onboarding',
                'birthday',
                'work_anniversary',
            ]
            const typeIndex = Math.floor(
                seededRandom(seed + 100) * employeeTypes.length,
            )
            const type = employeeTypes[typeIndex] as any

            const hour = 9 + Math.floor(seededRandom(seed + 200) * 9)
            const minute = Math.floor(seededRandom(seed + 300) * 60)
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

            const titles: Record<string, string> = {
                leave_request: `Leave Request: ${employee.name}`,
                onboarding: `New Hire Onboarding: ${employee.name}`,
                birthday: `Birthday: ${employee.name}`,
                work_anniversary: `Work Anniversary: ${employee.name}`,
            }

            const descriptions: Record<string, string> = {
                leave_request: 'Annual leave request pending approval',
                onboarding: 'Complete onboarding checklist',
                birthday: 'Send birthday wishes!',
                work_anniversary: `${Math.floor(seededRandom(seed + 400) * 5) + 1} years with the company`,
            }

            const actions =
                type === 'leave_request'
                    ? ['approve', 'deny']
                    : type === 'onboarding'
                      ? ['view']
                      : []

            events.push({
                id: `employee-${date.format('YYYYMMDD')}-${j}`,
                category: 'employees',
                type,
                employee: {
                    id: employee.id,
                    name: employee.name,
                    avatar: employee.img,
                    title: employee.title,
                },
                title: titles[type],
                description: descriptions[type],
                time,
                deadline: date.toISOString(),
                status: type === 'leave_request' ? 'urgent' : 'pending',
                actions,
            })
        }
    }

    return {
        events: events.sort(
            (a, b) => dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf(),
        ),
    }
}

const generateComplianceData = () => {
    const issues: any[] = []
    const today = dayjs('2024-12-02')

    const issueConfigs = [
        {
            employeeIndex: 2,
            issueType: 'incomplete_training',
            urgency: 'warning',
            daysRemaining: 25,
        },
        {
            employeeIndex: 5,
            issueType: 'expiring_visa',
            urgency: 'warning',
            daysRemaining: 18,
        },
        {
            employeeIndex: 8,
            issueType: 'missing_document',
            urgency: 'warning',
            daysRemaining: 12,
        },
        {
            employeeIndex: 11,
            issueType: 'expired_certification',
            urgency: 'warning',
            daysRemaining: 20,
        },
        {
            employeeIndex: 14,
            issueType: 'incomplete_training',
            urgency: 'critical',
            daysRemaining: 5,
        },
        {
            employeeIndex: 17,
            issueType: 'missing_document',
            urgency: 'overdue',
            daysRemaining: -3,
        },
    ]

    const descriptions: Record<string, string> = {
        missing_document: 'Missing mandatory employment verification',
        expiring_visa: 'Work visa expiring soon',
        incomplete_training: 'Mandatory safety training incomplete',
        expired_certification: 'Professional certification expired',
    }

    issueConfigs.forEach((config, i) => {
        const employee =
            employeeData[config.employeeIndex % employeeData.length]
        const deadline = today.add(config.daysRemaining, 'day')

        const actions =
            config.issueType === 'missing_document' ||
            config.issueType === 'expired_certification'
                ? ['approve_late', 'view_profile']
                : ['incorporate', 'view_profile']

        issues.push({
            id: `issue-${i + 1}`,
            employee: {
                id: employee.id,
                name: employee.personalInfo.fullName,
                email: employee.personalInfo.email,
                avatar: employee.personalInfo.profilePhoto,
                department: employee.jobInfo.department,
            },
            issueType: config.issueType,
            description: descriptions[config.issueType],
            deadline: deadline.toISOString(),
            daysRemaining: config.daysRemaining,
            urgency: config.urgency,
            actions,
        })
    })

    issues.sort((a, b) => {
        const urgencyOrder = { overdue: 0, critical: 1, warning: 2 }
        const urgencyDiff =
            urgencyOrder[a.urgency as keyof typeof urgencyOrder] -
            urgencyOrder[b.urgency as keyof typeof urgencyOrder]
        if (urgencyDiff !== 0) return urgencyDiff
        return a.daysRemaining - b.daysRemaining
    })

    const summary = {
        warning: issues.filter((i) => i.urgency === 'warning').length,
        critical: issues.filter((i) => i.urgency === 'critical').length,
        overdue: issues.filter((i) => i.urgency === 'overdue').length,
    }

    return {
        issues,
        total: issues.length,
        summary,
    }
}

export const generateHrmDashboardData = () => {
    return {
        turnover: generateTurnoverData(),
        jobLevel: generateJobLevelData(),
        payroll: generatePayrollDashboardData(),
        employeeQuality: generateEmployeeQualityData(),
        actions: generateActionsData(),
        compliance: generateComplianceData(),
    }
}
