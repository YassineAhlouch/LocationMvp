export type AccountType = 'individual' | 'business'

export type KYCStatus = 'pending' | 'verified' | 'rejected' | null

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

// Individual KYC Data Types
export type IndividualPersonalInfo = {
    fullName: string
    dateOfBirth: Date | null
    nationality: string
    email: string
    phoneNumber: string
    gender?: 'male' | 'female' | 'other'
}

export type IndividualIdentification = {
    idType: 'passport' | 'national_id' | 'drivers_license'
    idNumber: string
    issueDate: Date | null
    expiryDate: Date | null
    idDocumentFront: File | null
    idDocumentBack: File | null
}

export type IndividualAddress = {
    country: string
    state: string
    city: string
    postalCode: string
    streetAddress: string
    proofOfAddress: File | null
}

export type IndividualFinancial = {
    employmentStatus: string
    sourceOfFunds: string
    sourceOfFundsOther?: string
    annualIncomeRange: string
    taxId?: string
}

export type IndividualKYCData = {
    personalInfo: IndividualPersonalInfo
    identification: IndividualIdentification
    address: IndividualAddress
    financial: IndividualFinancial
}

// Business KYC Data Types
export type BusinessCompanyInfo = {
    companyName: string
    registrationNumber: string
    countryOfIncorporation: string
    businessType: string
    incorporationDate: Date | null
    companyEmail: string
    companyPhone: string
    website?: string
}

export type BusinessRepresentative = {
    fullName: string
    position: string
    email: string
    contactNumber: string
    idDocument: File | null
    proofOfAuthorization: File | null
}

export type BusinessAddress = {
    registeredAddress: string
    city: string
    state: string
    postalCode: string
    country: string
    proofOfAddress: File | null
}

export type BusinessFinancialCompliance = {
    sourceOfFunds: string
    sourceOfFundsOther?: string
    annualRevenueRange: string
    taxId: string
    registrationCertificate: File | null
    businessLicense?: File | null
}

export type BusinessKYCData = {
    companyInfo: BusinessCompanyInfo
    representative: BusinessRepresentative
    businessAddress: BusinessAddress
    financialCompliance: BusinessFinancialCompliance
}

// File Upload Types
export type FileUploadType =
    | 'idDocumentFront'
    | 'idDocumentBack'
    | 'proofOfAddress'
    | 'idDocument'
    | 'proofOfAuthorization'
    | 'registrationCertificate'
    | 'businessLicense'

export type FileValidationResult = {
    valid: boolean
    error?: string
}

// Account Type Benefits
export type AccountTypeBenefit = {
    icon: string
    title: string
    description: string
}

export type AccountTypeInfo = {
    title: string
    description: string
    benefits: AccountTypeBenefit[]
}
