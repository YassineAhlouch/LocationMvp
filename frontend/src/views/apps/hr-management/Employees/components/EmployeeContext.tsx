import useSWR from 'swr'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import EmployeeContext from '../context/DataContext'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import { apiGetEmployees } from '@/services/HrmService'
import type { ReactNode } from 'react'
import type {
    Employee,
    EmployeeStatus,
    GetEmployeesResponse,
    EmployeeRequestParams,
} from '../types'

type EmployeeContextProviderProps = {
    children: ReactNode
}

const EmployeeContextProvider = ({
    children,
}: EmployeeContextProviderProps) => {
    const { pagingState, filterState, setQueryParams } =
        useQueryParamPagingState({
            pageIndex: 1,
            pageSize: 20,
            query: '',
            sortOrder: '',
            sortKey: '',
        })

    const apiParams: EmployeeRequestParams = {
        ...pagingState,
        sortKey: pagingState.sortKey?.toString() || '',
        status: (filterState.status as EmployeeStatus) || 'active',
        employmentTypes: (filterState.employmentTypes as string) || '',
        departments: (filterState.departments as string) || '',
        roles: (filterState.roles as string) || '',
    }

    const { data, isLoading, mutate } = useSWR(
        ['/api/hrm/employees', apiParams],
        ([, params]) => apiGetEmployees<GetEmployeesResponse>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const createEmployee = async (newEmployee: Employee) => {
        if (!data) return

        const optimisticData = {
            ...data,
            employees: [newEmployee, ...data.employees],
            total: data.total + 1,
        }
        mutate(optimisticData, false)

        toast.push(
            <Notification title="Success" type="success">
                Employee created successfully
            </Notification>,
        )
    }

    const updateEmployee = async (id: string, updates: Partial<Employee>) => {
        if (!data) return

        // Optimistic update
        const optimisticData = {
            ...data,
            employees: data.employees.map((emp) =>
                emp.id === id ? { ...emp, ...updates } : emp,
            ),
        }
        mutate(optimisticData, false)

        toast.push(
            <Notification title="Success" type="success">
                Employee updated successfully
            </Notification>,
        )
    }

    const deleteEmployee = async (id: string) => {
        if (!data) return

        // Optimistic update
        const optimisticData = {
            ...data,
            employees: data.employees.filter((emp) => emp.id !== id),
            total: data.total - 1,
        }
        mutate(optimisticData, false)
        toast.push(
            <Notification title="Success" type="success">
                Employee deleted successfully
            </Notification>,
        )
    }

    const bulkUpdateEmployees = async (
        ids: string[],
        status: EmployeeStatus,
    ) => {
        if (!data) return

        // Optimistic update
        const optimisticData = {
            ...data,
            employees: data.employees.map((emp) =>
                ids.includes(emp.id)
                    ? { ...emp, accountInfo: { ...emp.accountInfo, status } }
                    : emp,
            ),
        }
        mutate(optimisticData, false)
        toast.push(
            <Notification title="Success" type="success">
                Employees updated successfully
            </Notification>,
        )
    }

    const bulkDeleteEmployees = async (ids: string[]) => {
        if (!data) return

        // Optimistic update
        const optimisticData = {
            ...data,
            employees: data.employees.filter((emp) => !ids.includes(emp.id)),
            total: data.total - ids.length,
        }
        mutate(optimisticData, false)

        toast.push(
            <Notification title="Success" type="success">
                Employees deleted successfully
            </Notification>,
        )
    }

    return (
        <EmployeeContext.Provider
            value={{
                employees: data?.employees || null,
                total: data?.total || 0,
                isLoading,
                mutate,
                pagingState,
                filterState,
                setQueryParams,
                createEmployee,
                updateEmployee,
                deleteEmployee,
                bulkUpdateEmployees,
                bulkDeleteEmployees,
            }}
        >
            {children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider
