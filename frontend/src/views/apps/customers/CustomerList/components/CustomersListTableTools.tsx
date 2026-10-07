import useCustomerList from '../hooks/useCustomerList'
import CustomerListSearch from './CustomerListSearch'
import CustomerTableFilter from './CustomerListTableFilter'
import CustomerListSelected from './CustomerListSelected'
import cloneDeep from 'lodash/cloneDeep'

const CustomersListTableTools = () => {
    const { pagingState, setPagingState } = useCustomerList()

    const handleInputChange = (val: string) => {
        const newTableState = cloneDeep(pagingState)
        newTableState.query = val
        newTableState.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setPagingState(newTableState)
        }

        if (typeof val === 'string' && val.length === 0) {
            setPagingState(newTableState)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex gap-2">
                <CustomerListSearch onInputChange={handleInputChange} />
                <CustomerTableFilter />
            </div>
            <CustomerListSelected />
        </div>
    )
}

export default CustomersListTableTools
