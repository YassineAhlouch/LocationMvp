import List from './List'
import OrderListStatistic from './OrderListStatistic'
import OderrListStatusTab from './OderrListStatusTab'
import OrderListTableTools from './OrderListTableTools'
const OrderListContent = () => {
    return (
        <>
            <OrderListStatistic />
            <OderrListStatusTab />
            <OrderListTableTools />
            <List />
        </>
    )
}

export default OrderListContent
