import { create } from 'zustand'
import sleep from '@/utils/sleep'
import type {
    AccountType,
    KYCStatus,
    SubmissionStatus,
    IndividualKYCData,
    BusinessKYCData,
    FileUploadType,
    FileValidationResult,
} from '../types'
import { FILE_UPLOAD_CONFIG } from '../utils/constants'

type KYCStore = {
    // State
    accountType: AccountType | null
    currentStep: number
    isWizardActive: boolean
    individualData: IndividualKYCData
    businessData: BusinessKYCData
    submissionStatus: SubmissionStatus
    kycStatus: KYCStatus
    kycCompletedForType: AccountType | null // Track which account type completed KYC

    // Actions
    setAccountType: (type: AccountType) => void
    setCurrentStep: (step: number) => void
    setWizardActive: (active: boolean) => void
    updateIndividualData: (
        stepKey: keyof IndividualKYCData,
        data: Partial<IndividualKYCData[keyof IndividualKYCData]>,
    ) => void
    updateBusinessData: (
        stepKey: keyof BusinessKYCData,
        data: Partial<BusinessKYCData[keyof BusinessKYCData]>,
    ) => void
    submitKYC: () => Promise<void>
    resetKYC: () => void
    backToOverview: () => void

    // Validation methods
    canAccessStep: (stepIndex: number) => boolean
    isStepComplete: (stepIndex: number) => boolean
    validateFileUpload: (
        file: File,
        type: FileUploadType,
    ) => FileValidationResult
}

const initialIndividualData: IndividualKYCData = {
    personalInfo: {
        fullName: '',
        dateOfBirth: null,
        nationality: '',
        email: '',
        phoneNumber: '',
        gender: undefined,
    },
    identification: {
        idType: 'passport',
        idNumber: '',
        issueDate: null,
        expiryDate: null,
        idDocumentFront: null,
        idDocumentBack: null,
    },
    address: {
        country: '',
        state: '',
        city: '',
        postalCode: '',
        streetAddress: '',
        proofOfAddress: null,
    },
    financial: {
        employmentStatus: '',
        sourceOfFunds: '',
        sourceOfFundsOther: '',
        annualIncomeRange: '',
        taxId: '',
    },
}

const initialBusinessData: BusinessKYCData = {
    companyInfo: {
        companyName: '',
        registrationNumber: '',
        countryOfIncorporation: '',
        businessType: '',
        incorporationDate: null,
        companyEmail: '',
        companyPhone: '',
        website: '',
    },
    representative: {
        fullName: '',
        position: '',
        email: '',
        contactNumber: '',
        idDocument: null,
        proofOfAuthorization: null,
    },
    businessAddress: {
        registeredAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        proofOfAddress: null,
    },
    financialCompliance: {
        sourceOfFunds: '',
        sourceOfFundsOther: '',
        annualRevenueRange: '',
        taxId: '',
        registrationCertificate: null,
        businessLicense: null,
    },
}

export const useKYCStore = create<KYCStore>((set, get) => ({
    // Initial State
    accountType: null,
    currentStep: 0,
    isWizardActive: false,
    individualData: initialIndividualData,
    businessData: initialBusinessData,
    submissionStatus: 'idle',
    kycStatus: null,
    kycCompletedForType: null,

    // Actions
    setAccountType: (type: AccountType) => {
        set({ accountType: type, currentStep: 0 })
    },

    setCurrentStep: (step: number) => {
        set({ currentStep: step })
    },

    setWizardActive: (active: boolean) => {
        set({ isWizardActive: active })
    },

    updateIndividualData: (
        stepKey: keyof IndividualKYCData,
        data: Partial<IndividualKYCData[keyof IndividualKYCData]>,
    ) => {
        set((state) => ({
            individualData: {
                ...state.individualData,
                [stepKey]: { ...state.individualData[stepKey], ...data },
            },
        }))
    },

    updateBusinessData: (
        stepKey: keyof BusinessKYCData,
        data: Partial<BusinessKYCData[keyof BusinessKYCData]>,
    ) => {
        set((state) => ({
            businessData: {
                ...state.businessData,
                [stepKey]: { ...state.businessData[stepKey], ...data },
            },
        }))
    },

    submitKYC: async () => {
        const { accountType } = get()

        set({ submissionStatus: 'submitting' })

        try {
            // Simulate API call with sleep utility
            await sleep(2000)

            // Simulate successful submission
            set({
                submissionStatus: 'success',
                kycStatus: 'pending',
                kycCompletedForType: accountType, // Track which account type completed KYC
                isWizardActive: false,
            })
        } catch {
            set({ submissionStatus: 'error' })
        }
    },

    resetKYC: () => {
        set({
            accountType: null,
            currentStep: 0,
            isWizardActive: false,
            individualData: initialIndividualData,
            businessData: initialBusinessData,
            submissionStatus: 'idle',
            kycStatus: null,
            kycCompletedForType: null,
        })
    },

    backToOverview: () => {
        set({
            isWizardActive: false,
            currentStep: 0,
            submissionStatus: 'idle',
        })
    },

    // Validation methods
    canAccessStep: (stepIndex: number) => {
        const { accountType } = get()

        if (!accountType) return false
        if (stepIndex === 0) return true

        // Check if all previous steps are complete
        for (let i = 0; i < stepIndex; i++) {
            if (!get().isStepComplete(i)) {
                return false
            }
        }

        return true
    },

    isStepComplete: (stepIndex: number) => {
        const { accountType, individualData, businessData } = get()

        if (!accountType) return false

        if (accountType === 'individual') {
            switch (stepIndex) {
                case 0: {
                    // Personal Information
                    const { personalInfo } = individualData
                    return !!(
                        personalInfo.fullName &&
                        personalInfo.dateOfBirth &&
                        personalInfo.nationality &&
                        personalInfo.email &&
                        personalInfo.phoneNumber
                    )
                }

                case 1: {
                    // Identification
                    const { identification } = individualData
                    return !!(
                        identification.idType &&
                        identification.idNumber &&
                        identification.issueDate &&
                        identification.expiryDate &&
                        identification.idDocumentFront &&
                        identification.idDocumentBack
                    )
                }

                case 2: {
                    // Address Information
                    const { address } = individualData
                    return !!(
                        address.country &&
                        address.state &&
                        address.city &&
                        address.postalCode &&
                        address.streetAddress &&
                        address.proofOfAddress
                    )
                }

                case 3: {
                    // Financial Information
                    const { financial } = individualData
                    const isOtherValid =
                        financial.sourceOfFunds !== 'other' ||
                        (financial.sourceOfFundsOther &&
                            financial.sourceOfFundsOther.trim().length > 0)
                    return !!(
                        financial.employmentStatus &&
                        financial.sourceOfFunds &&
                        financial.annualIncomeRange &&
                        isOtherValid
                    )
                }

                default:
                    return false
            }
        } else if (accountType === 'business') {
            switch (stepIndex) {
                case 0: {
                    // Company Information
                    const { companyInfo } = businessData
                    return !!(
                        companyInfo.companyName &&
                        companyInfo.registrationNumber &&
                        companyInfo.countryOfIncorporation &&
                        companyInfo.businessType &&
                        companyInfo.incorporationDate &&
                        companyInfo.companyEmail &&
                        companyInfo.companyPhone
                    )
                }

                case 1: {
                    // Authorized Representative
                    const { representative } = businessData
                    return !!(
                        representative.fullName &&
                        representative.position &&
                        representative.email &&
                        representative.contactNumber &&
                        representative.idDocument &&
                        representative.proofOfAuthorization
                    )
                }

                case 2: {
                    // Business Address
                    const { businessAddress } = businessData
                    return !!(
                        businessAddress.registeredAddress &&
                        businessAddress.city &&
                        businessAddress.state &&
                        businessAddress.postalCode &&
                        businessAddress.country &&
                        businessAddress.proofOfAddress
                    )
                }

                case 3: {
                    // Financial & Compliance
                    const { financialCompliance } = businessData
                    const isOtherValid =
                        financialCompliance.sourceOfFunds !== 'other' ||
                        (financialCompliance.sourceOfFundsOther &&
                            financialCompliance.sourceOfFundsOther.trim()
                                .length > 0)
                    return !!(
                        financialCompliance.sourceOfFunds &&
                        financialCompliance.annualRevenueRange &&
                        financialCompliance.taxId &&
                        financialCompliance.registrationCertificate &&
                        isOtherValid
                    )
                }

                default:
                    return false
            }
        }

        return false
    },

    validateFileUpload: (
        file: File,
        type: FileUploadType,
    ): FileValidationResult => {
        let config

        // Determine which config to use based on file type
        if (type === 'proofOfAddress') {
            config = FILE_UPLOAD_CONFIG.proofOfAddress
        } else if (
            type === 'registrationCertificate' ||
            type === 'businessLicense'
        ) {
            config = FILE_UPLOAD_CONFIG.businessDocs
        } else {
            config = FILE_UPLOAD_CONFIG.idDocuments
        }

        // Check file size
        if (file.size > config.maxSize) {
            const maxSizeMB = config.maxSize / (1024 * 1024)
            return {
                valid: false,
                error: `File size must be less than ${maxSizeMB}MB`,
            }
        }

        // Check file type
        if (!config.types.includes(file.type)) {
            return {
                valid: false,
                error: `File type not supported. Please upload ${config.accept} files only.`,
            }
        }

        return { valid: true }
    },
}))
