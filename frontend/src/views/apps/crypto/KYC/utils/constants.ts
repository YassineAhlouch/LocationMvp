import type { AccountTypeInfo } from '../types'

// ID Type Options
export const ID_TYPE_OPTIONS = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'drivers_license', label: "Driver's License" },
]

// Gender Options
export const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
]

// Employment Status Options
export const EMPLOYMENT_STATUS_OPTIONS = [
    { value: 'employed', label: 'Employed' },
    { value: 'self_employed', label: 'Self Employed' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'student', label: 'Student' },
    { value: 'retired', label: 'Retired' },
]

// Source of Funds Options (Individual)
export const SOURCE_OF_FUNDS_OPTIONS = [
    { value: 'salary', label: 'Salary' },
    { value: 'investment', label: 'Investment' },
    { value: 'business', label: 'Business' },
    { value: 'inheritance', label: 'Inheritance' },
    { value: 'savings', label: 'Savings' },
    { value: 'other', label: 'Other' },
]

// Business Source of Funds Options
export const BUSINESS_SOURCE_OF_FUNDS_OPTIONS = [
    { value: 'business_revenue', label: 'Business Revenue' },
    { value: 'investment_capital', label: 'Investment Capital' },
    { value: 'company_savings', label: 'Company Savings or Retained Earnings' },
    { value: 'loan_credit', label: 'Loan or Credit Facility' },
    { value: 'parent_company', label: 'Parent Company Funding' },
    { value: 'grants_government', label: 'Grants or Government Funding' },
    { value: 'donations_sponsorships', label: 'Donations or Sponsorships' },
    { value: 'other', label: 'Other (Please Specify)' },
]

// Annual Income Range Options
export const ANNUAL_INCOME_RANGE_OPTIONS = [
    { value: 'under_25k', label: 'Under $25,000' },
    { value: '25k_50k', label: '$25,000 - $50,000' },
    { value: '50k_100k', label: '$50,000 - $100,000' },
    { value: '100k_250k', label: '$100,000 - $250,000' },
    { value: '250k_500k', label: '$250,000 - $500,000' },
    { value: 'over_500k', label: 'Over $500,000' },
]

// Business Type Options
export const BUSINESS_TYPE_OPTIONS = [
    { value: 'private_limited', label: 'Private Limited Company' },
    { value: 'public_limited', label: 'Public Limited Company' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'ngo', label: 'Non-Governmental Organization' },
    { value: 'trust', label: 'Trust' },
    { value: 'other', label: 'Other' },
]

// Annual Revenue Range Options
export const ANNUAL_REVENUE_RANGE_OPTIONS = [
    { value: 'under_100k', label: 'Under $100,000' },
    { value: '100k_500k', label: '$100,000 - $500,000' },
    { value: '500k_1m', label: '$500,000 - $1,000,000' },
    { value: '1m_5m', label: '$1,000,000 - $5,000,000' },
    { value: '5m_10m', label: '$5,000,000 - $10,000,000' },
    { value: 'over_10m', label: 'Over $10,000,000' },
]

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
    idDocuments: {
        accept: '.jpg,.jpeg,.png,.pdf',
        maxSize: 5 * 1024 * 1024,
        types: ['image/jpeg', 'image/png', 'application/pdf'],
    },
    proofOfAddress: {
        accept: '.jpg,.jpeg,.png,.pdf',
        maxSize: 5 * 1024 * 1024,
        types: ['image/jpeg', 'image/png', 'application/pdf'],
    },
    businessDocs: {
        accept: '.pdf,.jpg,.jpeg,.png',
        maxSize: 10 * 1024 * 1024,
        types: ['application/pdf', 'image/jpeg', 'image/png'],
    },
}

export const ACCOUNT_TYPE_INFO: Record<
    'individual' | 'business',
    AccountTypeInfo
> = {
    individual: {
        title: 'Individual Account Verification',
        description: 'For personal trading and investment accounts.',
        benefits: [
            {
                icon: 'ShieldCheckIcon',
                title: 'Enhanced Security',
                description:
                    'Advanced security measures to protect your account',
            },
            {
                icon: 'CheckmarkCircle02Icon',
                title: 'Regulatory Compliance',
                description: 'Full compliance with international regulations',
            },
            {
                icon: 'Lightning01Icon',
                title: 'Fast Approval',
                description:
                    'Quick verification process, usually within 24 hours',
            },
            {
                icon: 'CustomerSupportIcon',
                title: 'Dedicated Support',
                description: 'Priority customer support for verified accounts',
            },
        ],
    },
    business: {
        title: 'Business Account Verification',
        description:
            'Verify your company to access institutional-grade trading features and higher limits.',
        benefits: [
            {
                icon: 'Building06Icon',
                title: 'Institutional Features',
                description: 'Access to advanced trading tools and features',
            },
            {
                icon: 'TrendingUpIcon',
                title: 'Higher Limits',
                description: 'Increased trading and withdrawal limits',
            },
            {
                icon: 'UserGroupIcon',
                title: 'Multi-User Access',
                description: 'Team access with role-based permissions',
            },
            {
                icon: 'CustomerSupportIcon',
                title: 'Priority Support',
                description: 'Dedicated account manager and priority support',
            },
        ],
    },
}

// KYC Steps Configuration
export const INDIVIDUAL_KYC_STEPS = [
    { title: 'Personal Information', key: 'personalInfo' },
    { title: 'Identification', key: 'identification' },
    { title: 'Address Information', key: 'address' },
    { title: 'Financial Information', key: 'financial' },
]

export const BUSINESS_KYC_STEPS = [
    { title: 'Company Information', key: 'companyInfo' },
    { title: 'Authorized Representative', key: 'representative' },
    { title: 'Business Address', key: 'businessAddress' },
    { title: 'Financial & Compliance', key: 'financialCompliance' },
]
