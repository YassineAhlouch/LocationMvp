import Tabs from '@/components/ui/Tabs'
import useOrderListData from '../hooks/useOrderListData'

const { TabNav, TabList } = Tabs

const CustomerListStatusTab = () => {
    const { filterState, setQueryParams } = useOrderListData()

    return (
        <Tabs
            className="print:hidden"
            value={filterState.paymentStatus ?? ''}
            onChange={(val) => setQueryParams({ paymentStatus: val })}
        >
            <TabList>
                <TabNav value="">All</TabNav>
                <TabNav value="paid">Paid</TabNav>
                <TabNav value="unpaid">Unpaid</TabNav>
            </TabList>
        </Tabs>
    )
}

export default CustomerListStatusTab
