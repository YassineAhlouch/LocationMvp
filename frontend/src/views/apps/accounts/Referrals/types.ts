// Referral user data
export type ReferralUser = {
    id: string
    name: string
    email: string
    img?: string
    signupDate: string
    status: 'pending' | 'completed' | 'expired'
}

// Referral statistics
export type ReferralStats = {
    invitationsSent: number
    signupsViaLink: number
    conversionRate: number // Percentage of invitations that resulted in signups
    rewardsEarned: {
        amount: number
        currency: string
        type: 'cash' | 'credits' | 'discount'
    }
}

// Referral activity entry
export type ReferralActivity = {
    id: string
    referredUser: ReferralUser
    signupDate: string
    reward: {
        amount: number
        currency: string
        type: 'cash' | 'credits' | 'discount'
    }
    status: 'pending' | 'completed'
}

// Main referral data structure
export type ReferralData = {
    referralLink: string
    referralCode: string
    stats: ReferralStats
    history: ReferralActivity[]
    totalHistoryCount: number
}

// API response types
export type GetReferralDataResponse = {
    data: ReferralData
}

export type SendInvitationRequest = {
    email: string
}

export type SendInvitationResponse = {
    success: boolean
    message: string
}
