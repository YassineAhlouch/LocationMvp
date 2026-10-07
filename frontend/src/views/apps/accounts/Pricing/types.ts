export type PaymentCycle = 'monthly' | 'annually'

export type SelectedPlan = {
    planName: string
    paymentCycle: PaymentCycle
    price: {
        monthly: number
        annually: number
    }
}

export type Plan = {
    id: string
    name: string
    description: string
    price: {
        monthly: number
        annually: number
    }
    features: string[]
    recommended: boolean
}

export type GetPricingPlanResponse = {
    featuresModel: {
        id: string
        description: string
    }[]
    plans: Plan[]
}
