import Container from '@/components/shared/Container'
import SubscriptionsHeader from './components/SubscriptionsHeader'
import SubscriberChartView from './components/SubscriberChartView'
import SubscriberLifecycleJourney from './components/SubscriberLifecycleJourney'
import SubscriberPersonaTable from './components/SubscriberPersonaTable'

const Subscriptions = () => {
    return (
        <Container>
            <SubscriptionsHeader />
            <div className="space-y-6">
                <SubscriberChartView />
                <SubscriberLifecycleJourney />
                <SubscriberPersonaTable />
            </div>
        </Container>
    )
}

export default Subscriptions
