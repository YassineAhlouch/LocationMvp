import AssetsHeader from './components/AssetsHeader'
import PortfolioOverview from './components/PortfolioOverview'
import AssetsContent from './components/AssetsContent'
import DepositModal from './components/DepositDialog'
import WithdrawModal from './components/WithdrawDialog'
import TradeDialog from './components/TradeDialog'
import Container from '@/components/shared/Container'

const Assets = () => {
    return (
        <Container>
            <div className="flex flex-col gap-4">
                <AssetsHeader />
                <PortfolioOverview />
                <AssetsContent />
            </div>
            <DepositModal />
            <WithdrawModal />
            <TradeDialog />
        </Container>
    )
}

export default Assets
