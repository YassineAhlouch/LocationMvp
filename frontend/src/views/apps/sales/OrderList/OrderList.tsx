import OrderListContext from './components/OrderListContext'
import OrderListHeader from './components/OrderListHeader'
import OrderListContent from './components/OrderListContent'

const OrderList = () => {
    return (
        <OrderListContext>
            <div className="space-y-4">
                <OrderListHeader />
                <OrderListContent />
            </div>
        </OrderListContext>
    )
}

export default OrderList
