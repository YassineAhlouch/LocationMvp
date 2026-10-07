import { createContext } from 'react'
import type { TableQueries } from '@/@types/common'
import type { Employee, EmployeeStatus } from '../types'

export type DataContextProps = {
    employees: Employee[] | null
    total: number
    isLoading: boolean
    mutate: () => void
    pagingState: TableQueries
    filterState: Record<string, unknown>
    setQueryParams: (params: Record<string, unknown>) => void
    createEmployee: (data: Employee) => void
    updateEmployee: (id: string, data: Partial<Employee>) => void
    deleteEmployee: (id: string) => void
    bulkUpdateEmployees: (ids: string[], status: EmployeeStatus) => void
    bulkDeleteEmployees: (ids: string[]) => void
}

const DataContext = createContext<DataContextProps>({
    employees: null,
    total: 0,
    isLoading: false,
    mutate: () => {},
    pagingState: {
        pageIndex: 1,
        pageSize: 20,
        query: '',
        sortOrder: '',
        sortKey: '',
    },
    filterState: {},
    setQueryParams: () => {},
    createEmployee: () => {},
    updateEmployee: () => {},
    deleteEmployee: () => {},
    bulkUpdateEmployees: () => {},
    bulkDeleteEmployees: () => {},
})

export default DataContext
