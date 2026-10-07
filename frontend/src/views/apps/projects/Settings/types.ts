export type ApiKey = {
    id: string
    name: string
    token: string
    createdAt: string
    lastUsedAt: string | null
    status: string
    scopes: string[]
    expiresAt: null | string
}

export type Transaction = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

export type CreditCardInfo = {
    cardId: string
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
}

export type NotificationEvent = {
    id: string
    title: string
    description: string
    enabled: string[]
}

export type WhiteList = {
    id: string
    ip: string
    label: string
    description: string
    addedAt: string
    createdBy: string
}

export type Member = {
    id: string
    name: string
    email: string
    img: string
    permissionRole: string
    invitedDate: string | number
    invitedBy: string
    status: string
}

export type Integration = {
    id: string
    name: string
    desc: string
    img: string
    type: string
    active: boolean
    installed?: boolean
}

export type SettingsSecurity = {
    apiKeys: Array<ApiKey>
    whiteList: {
        enabled: boolean
        list: Array<WhiteList>
    }
}

export type SettingsGeneral = {
    name: string
    slug: string
    description?: string
    logo?: string
    status: string
    language: string
    timezone: string
}

export type SettingsNotification = {
    list: {
        id: string
        events: NotificationEvent[]
    }[]
}

export type SettingsBilling = {
    currentPlan: {
        plan: string
        planDescription: string
        status: string
        billingCycle: string
        nextPaymentDate: string
        planDetails: {
            maxProjects: number
            maxMembers: number
            storage: string
            support: string
        }
        usage: {
            projectsUsed: number
            membersUsed: number
            storageUsed: string
        }
        amount: number
    }
    paymentMethods: CreditCardInfo
    transactionHistory: Array<Transaction>
}

export type Settings = {
    general: SettingsGeneral
    security: SettingsSecurity
    notification: SettingsNotification
    integrations: Integration[]
    billing: SettingsBilling
    allMembers: Member[]
    participantMembers: Member[]
    invitedMembers: Member[]
}

export type LogInfo = {
    id: string
    timestamp: string
    actor: {
        id: string
        name: string
        email: string
        img: string
    }
    action: string
    target: string
    description: string
    ipAddress: string
    userAgent: string
}

export type GetSettingsResponse = Settings

export type GetAuditLogsResponse = {
    list: LogInfo[]
    total: number
}
