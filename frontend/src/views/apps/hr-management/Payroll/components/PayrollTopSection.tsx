import useSWR from 'swr'
import { usePayrollStore } from '../store/payrollStore'
import { apiGetPayrollData } from '@/services/HrmService'
import PayrollHeader from './PayrollHeader'
import PayrollMetrics from './PayrollMetrics'
import type { GetPayrollResponse } from '../types'

const PayrollTopSection = () => {
    const { selectedMonth } = usePayrollStore()

    const { data, isLoading } = useSWR(
        ['/api/hrm/payroll', { month: selectedMonth }],
        ([, params]) => apiGetPayrollData<GetPayrollResponse>(params),
        {
            revalidateOnFocus: false,
        },
    )

    return (
        <div>
            <PayrollHeader
                currentMetrics={data?.metrics}
                employeeCount={data?.total || 0}
            />
            <PayrollMetrics metrics={data?.metrics} loading={isLoading} />
        </div>
    )
}

export default PayrollTopSection
