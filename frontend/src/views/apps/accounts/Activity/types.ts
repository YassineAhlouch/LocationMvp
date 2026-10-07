export type Activity = {
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
}

export type Activities = Activity[]

export type GetActivityLogResponse = {
    index: number
    list: Activities
    loadable: boolean
}

export type Filter = {
    members?: string[]
    keyword?: string | null
}

export type KeywordItem = {
    id: string
    label: string
    count: number
}

export type Member = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    activityCount?: number
}

export type FilterState = {
    activeTab: 'keywords' | 'members'
    selectedMembers: string[]
    selectedKeyword: string | null
    customKeywords: string[]
}

export type TabValue = 'keywords' | 'members'
