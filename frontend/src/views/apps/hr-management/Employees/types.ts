export type EmployeeStatus = 'active' | 'inactive' | 'terminated'
export type EmploymentType =
    | 'full-time'
    | 'part-time'
    | 'contract'
    | 'intern'
    | 'freelance'
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say'
export type CurrentStatus = 'working' | 'away' | 'on-leave'

export type Address = {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
}

export type EmployeeDocument = {
    id: string
    name: string
    type: string
    url: string
    uploadedAt: string
    uploadedBy: string
}

export type Employee = {
    id: string
    employeeId: string // Auto-generated or manual
    personalInfo: {
        firstName: string
        lastName: string
        fullName: string
        email: string
        phone: string
        gender: Gender
        dateOfBirth: string
        profilePhoto?: string
        address?: Address
    }
    jobInfo: {
        department: string
        designation: string
        role: string
        employmentType: EmploymentType
        joiningDate: string
        reportingManager?: string
        workLocation?: string
    }
    accountInfo: {
        loginEmail: string
        status: EmployeeStatus
        currentStatus: CurrentStatus
        lastLogin?: string
        permissions?: string[]
        createdBy: string
        updatedBy: string
    }
    compensation?: {
        baseSalary: number
        currency: string
        bonus?: number
        allowances?: number
        deductions?: number
        effectiveDate: string
    }
    documents?: EmployeeDocument[]
    createdAt: string
    updatedAt: string
}

export type EmployeeFilters = {
    search: string
    employmentTypes: EmploymentType[]
    departments: string[]
    roles: string[]
}

export type SortConfig = {
    key:
        | 'employeeId'
        | 'name'
        | 'department'
        | 'role'
        | 'employmentType'
        | 'currentStatus'
        | 'joiningDate'
    direction: 'asc' | 'desc'
}

export type Department = {
    id: string
    name: string
    description?: string
    parentDepartment?: string
    roles: Role[]
}

export type Role = {
    id: string
    name: string
    department: string
    level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager'
    permissions?: string[]
}

export type GetEmployeesResponse = {
    employees: Employee[]
    total: number
}

export type CreateEmployeeRequest = Omit<
    Employee,
    'id' | 'createdAt' | 'updatedAt'
>

export type UpdateEmployeeRequest = Partial<
    Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
>

export type EmployeeRequestParams = {
    pageIndex?: number
    pageSize?: number
    sortKey?: string
    sortOrder?: string
    query?: string
    status?: EmployeeStatus
    employmentTypes?: string
    departments?: string
    roles?: string
}

export type BasicInfoFormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    gender: Gender
    dateOfBirth: string
    profilePhoto?: File
    documents?: File[]
}

export type JobInfoFormData = {
    department: string
    designation: string
    employmentType: EmploymentType
    joiningDate: string
    reportingManager?: string
    workLocation?: string
}

export type AccountInfoFormData = {
    employeeId: string
    loginEmail: string
    status: EmployeeStatus
}

export type EmployeeFormData = BasicInfoFormData &
    JobInfoFormData &
    AccountInfoFormData
