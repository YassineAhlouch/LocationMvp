import Container from '@/components/shared/Container'
import ForecastHeader from './components/ForecastHeader'
import RevenueForecastCard from './components/RevenueForecastCard'
import UserGrowthForecastCard from './components/UserGrowthForecastCard'
import ChurnRetentionForecastCard from './components/ChurnRetentionForecastCard'
import SubscriptionForecastCard from './components/SubscriptionForecastCard'

const Forecast = () => {
    return (
        <Container>
            <div className="space-y-8 pb-8">
                <ForecastHeader />
                <div className="space-y-4">
                    <RevenueForecastCard />
                    <UserGrowthForecastCard />
                    <SubscriptionForecastCard />
                    <ChurnRetentionForecastCard />
                </div>
            </div>
        </Container>
    )
}

export default Forecast
