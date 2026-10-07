import Tabs from '@/components/ui/Tabs'
import useCustomerList from '../hooks/useCustomerList'

const { TabNav, TabList } = Tabs

const CustomerListStatusTab = () => {
    const { filterData, setFilterData } = useCustomerList()

    return (
        <Tabs
            value={filterData.status}
            onChange={(val) => setFilterData({ status: val })}
        >
            <TabList>
                <TabNav value="">All Customers</TabNav>
                <TabNav value="active">Active</TabNav>
                <TabNav value="inactive">Inactive</TabNav>
            </TabList>
        </Tabs>
    )
}

export default CustomerListStatusTab
