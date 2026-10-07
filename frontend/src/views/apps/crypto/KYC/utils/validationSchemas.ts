import { z } from 'zod'

export const personalInfoSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters'),
    dateOfBirth: z
        .date()
        .nullable()
        .refine((date) => date !== null, {
            message: 'Date of birth is required',
        }),
    nationality: z.string().min(1, 'Nationality is required'),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must be less than 20 digits'),
    gender: z.enum(['male', 'female', 'other']).optional(),
})

export const identificationSchema = z
    .object({
        idType: z.enum(['passport', 'national_id', 'drivers_license'], {
            message: 'Please select an ID type',
        }),
        idNumber: z
            .string()
            .min(5, 'ID number must be at least 5 characters')
            .max(50, 'ID number must be less than 50 characters'),
        issueDate: z
            .date()
            .nullable()
            .refine((date) => date !== null, {
                message: 'Issue date is required',
            }),
        expiryDate: z
            .date()
            .nullable()
            .refine((date) => date !== null, {
                message: 'Expiry date is required',
            }),
        idDocumentFront: z
            .any()
            .refine(
                (file) => file !== null,
                'Front side of ID document is required',
            ),
        idDocumentBack: z
            .any()
            .refine(
                (file) => file !== null,
                'Back side of ID document is required',
            ),
    })
    .refine(
        (data) => {
            if (!data.expiryDate || !data.issueDate) return true
            return data.expiryDate > data.issueDate
        },
        {
            message: 'Expiry date must be after issue date',
            path: ['expiryDate'],
        },
    )
    .refine(
        (data) => {
            if (!data.expiryDate) return true
            const today = new Date()
            return data.expiryDate > today
        },
        {
            message: 'ID document must not be expired',
            path: ['expiryDate'],
        },
    )

export const addressInfoSchema = z.object({
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State/Province is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z
        .string()
        .min(3, 'Postal code must be at least 3 characters')
        .max(20, 'Postal code must be less than 20 characters'),
    streetAddress: z
        .string()
        .min(5, 'Street address must be at least 5 characters')
        .max(200, 'Street address must be less than 200 characters'),
    proofOfAddress: z
        .any()
        .refine(
            (file) => file !== null,
            'Proof of address document is required',
        ),
})

export const financialInfoSchema = z
    .object({
        employmentStatus: z.string().min(1, 'Employment status is required'),
        sourceOfFunds: z.string().min(1, 'Source of funds is required'),
        sourceOfFundsOther: z.string().optional(),
        annualIncomeRange: z.string().min(1, 'Annual income range is required'),
        taxId: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.sourceOfFunds === 'other') {
                return (
                    data.sourceOfFundsOther &&
                    data.sourceOfFundsOther.trim().length > 0
                )
            }
            return true
        },
        {
            message: 'Please specify the source of funds',
            path: ['sourceOfFundsOther'],
        },
    )

export const companyInfoSchema = z.object({
    companyName: z
        .string()
        .min(2, 'Company name must be at least 2 characters')
        .max(200, 'Company name must be less than 200 characters'),
    registrationNumber: z
        .string()
        .min(5, 'Registration number must be at least 5 characters')
        .max(50, 'Registration number must be less than 50 characters'),
    countryOfIncorporation: z
        .string()
        .min(1, 'Country of incorporation is required'),
    businessType: z.string().min(1, 'Business type is required'),
    incorporationDate: z
        .date()
        .nullable()
        .refine((date) => date !== null, {
            message: 'Incorporation date is required',
        }),
    companyEmail: z
        .string()
        .email('Please enter a valid company email address'),
    companyPhone: z
        .string()
        .min(10, 'Company phone must be at least 10 digits')
        .max(20, 'Company phone must be less than 20 digits'),
    website: z
        .string()
        .url('Please enter a valid website URL')
        .optional()
        .or(z.literal('')),
})

export const representativeSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters'),
    position: z
        .string()
        .min(2, 'Position/Title must be at least 2 characters')
        .max(100, 'Position/Title must be less than 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    contactNumber: z
        .string()
        .min(10, 'Contact number must be at least 10 digits')
        .max(20, 'Contact number must be less than 20 digits'),
    idDocument: z
        .any()
        .refine(
            (file) => file !== null,
            'ID document of representative is required',
        ),
    proofOfAuthorization: z
        .any()
        .refine(
            (file) => file !== null,
            'Proof of authorization document is required',
        ),
})

export const businessAddressSchema = z.object({
    registeredAddress: z
        .string()
        .min(5, 'Registered address must be at least 5 characters')
        .max(300, 'Registered address must be less than 300 characters'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postalCode: z
        .string()
        .min(3, 'Postal code must be at least 3 characters')
        .max(20, 'Postal code must be less than 20 characters'),
    country: z.string().min(1, 'Country is required'),
    proofOfAddress: z
        .any()
        .refine(
            (file) => file !== null,
            'Proof of address document is required',
        ),
})

export const financialComplianceSchema = z
    .object({
        sourceOfFunds: z.string().min(1, 'Source of funds is required'),
        sourceOfFundsOther: z.string().optional(),
        annualRevenueRange: z
            .string()
            .min(1, 'Annual revenue range is required'),
        taxId: z
            .string()
            .min(5, 'Tax ID/VAT number must be at least 5 characters')
            .max(50, 'Tax ID/VAT number must be less than 50 characters'),
        registrationCertificate: z
            .any()
            .refine(
                (file) => file !== null,
                'Company registration certificate is required',
            ),
        businessLicense: z.any().optional(),
    })
    .refine(
        (data) => {
            if (data.sourceOfFunds === 'other') {
                return (
                    data.sourceOfFundsOther &&
                    data.sourceOfFundsOther.trim().length > 0
                )
            }
            return true
        },
        {
            message: 'Please specify the source of funds',
            path: ['sourceOfFundsOther'],
        },
    )

export const individualKYCSchema = z.object({
    personalInfo: personalInfoSchema,
    identification: identificationSchema,
    address: addressInfoSchema,
    financial: financialInfoSchema,
})

export const businessKYCSchema = z.object({
    companyInfo: companyInfoSchema,
    representative: representativeSchema,
    businessAddress: businessAddressSchema,
    financialCompliance: financialComplianceSchema,
})

export const INDIVIDUAL_STEP_SCHEMAS = [
    personalInfoSchema,
    identificationSchema,
    addressInfoSchema,
    financialInfoSchema,
]

export const BUSINESS_STEP_SCHEMAS = [
    companyInfoSchema,
    representativeSchema,
    businessAddressSchema,
    financialComplianceSchema,
]
