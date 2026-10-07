import Container from '@/components/shared/Container'
import CustomerListTable from './components/CustomerListTable'
import CustomerListActionTools from './components/CustomerListActionTools'
import CustomersListTableTools from './components/CustomersListTableTools'
import CutomerListStatistic from './components/CutomerListStatistic'
import CustomerListStatusTab from './components/CustomerListStatusTab'

const CustomerList = () => {
    return (
        <>
            <Container>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                        <h4>Customers</h4>
                        <CustomerListActionTools />
                    </div>
                    <CutomerListStatistic />
                    <CustomerListStatusTab />
                    <CustomersListTableTools />
                    <CustomerListTable />
                </div>
            </Container>
        </>
    )
}

export default CustomerList
