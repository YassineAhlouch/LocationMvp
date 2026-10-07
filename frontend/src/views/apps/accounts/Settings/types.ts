export type Address = {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
}

export type Session = {
    id: string
    name: string
}

export type NotificationConfig = {
    notificationsFromUs: {
        newsAndUpdates: boolean
        tipsAndTutorials: boolean
        userResearch: boolean
    }
    comments: 'none' | 'mentions' | 'all'
    reminders: 'none' | 'important' | 'all'
    moreActivityAboutYou: boolean
    marketingNotifications: {
        specialOffers: boolean
        eventInvitations: boolean
        partnerPromotions: boolean
    }
}

export type TwoFactorConfig = {
    method: TwoFactorMethod
    phoneNumber?: string
    email?: string
}

export type Integration = {
    id: string
    name: string
    desc: string
    img: string
    active: boolean
    type: string
}

export type SubscriptionPlan = {
    id: string
    name: string
    price: string
    description: string
    features: string[]
    isActive?: boolean
}

export type PaymentMethod = {
    id: string
    type: 'master' | 'visa' | 'amex'
    lastFour: string
    expiryDate: string
    location?: string
    cardHolderName: string
    isPrimary: boolean
}

export type BillingHistoryItem = {
    id: string
    date: string
    status: 'paid' | 'pending' | 'failed'
    amount: string
    plan: string
    invoiceUrl?: string
}

export type Billing = {
    currentPlan: SubscriptionPlan
    availablePlans: SubscriptionPlan[]
    paymentMethods: PaymentMethod[]
    billingHistory: BillingHistoryItem[]
}

export type SecurityStrength = 'weak' | 'medium' | 'strong' | 'very-secure'

export type TwoFactorMethod = 'sms' | 'app' | 'email'

export interface SecuritySettings {
    password: {
        hasPassword: boolean
        strength: SecurityStrength
        lastChanged: Date
    }
    twoFactorAuth: {
        enabled: boolean
        method?: TwoFactorMethod
        backupCodes?: string[]
    }
    devices: Device[]
}

export type Device = {
    id: string
    deviceName: string
    browser: string
    operatingSystem: string
    location: LocationInfo
    lastAccessTime: string
    isCurrentSession: boolean
    ipAddress: string
}

export type LocationInfo = {
    country: string
    region: string
    city: string
}

export interface GetSecuritySettingsResponse {
    password: {
        hasPassword: boolean
        strength: SecurityStrength
        lastChanged: string
    }
    twoFactorAuth: {
        enabled: boolean
        method?: TwoFactorMethod
        hasBackupCodes: boolean
    }
    devices: Device[]
}

export type GetSettingsProfileResponse = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    phoneNumber: string
    dialCode: string
    address?: Address
    birthday: string
}

export type GetSettingsIntegrationsResponse = Integration[]

export type GetSettingsNotificationConfigResponse = NotificationConfig

export type GetSettingsBillingResponse = Billing
