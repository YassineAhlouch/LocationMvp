import MarketContext from './components/MarketContext'
import MarketHeader from './components/MarketHeader'
import MarketStatistic from './components/MarketStatistic'
import MarketTab from './components/MartketTab'
import MarketActionTools from './components/MarketActionTools'
import MarketContent from './components/MartketContent'
import Container from '@/components/shared/Container'

const Market = () => {
    return (
        <MarketContext>
            <Container>
                <div className="flex flex-col gap-4">
                    <MarketHeader />
                    <MarketStatistic />
                    <MarketTab />
                    <MarketActionTools />
                    <MarketContent />
                </div>
            </Container>
        </MarketContext>
    )
}

export default Market
