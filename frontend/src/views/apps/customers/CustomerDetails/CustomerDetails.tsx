import Loading from '@/components/shared/Loading'
import CustomerDetailsInfo from './components/CustomerDetailsInfo'
import CustomerDetailsContent from './components/CustomerDetailsContent'
import { apiGetCustomer } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router'
import isEmpty from 'lodash/isEmpty'
import type { Customer } from './types'

const CustomerDetails = () => {
    const param = useParams()
    const pathSegment = param['*'] || ''
    const customerId = param.customerId

    const { data, isLoading, mutate } = useSWR(
        [`/api/customers/${customerId}`, { id: customerId as string }],
        ([, params]) => apiGetCustomer<Customer, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    return (
        <Loading loading={isLoading}>
            {!isEmpty(data) && (
                <div className="flex flex-col xl:flex-row gap-4 h-full">
                    <div className="min-w-[260px] 2xl:min-w-[260px]">
                        <CustomerDetailsInfo data={data} />
                    </div>
                    <CustomerDetailsContent
                        customerId={customerId as string}
                        path={pathSegment}
                        data={data}
                        mutate={mutate}
                    />
                </div>
            )}
        </Loading>
    )
}

export default CustomerDetails
