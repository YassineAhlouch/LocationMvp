import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

type CryptoDashboardContainerProps = {
    totalPortfolio: ReactNode
    assetCards: ReactNode
    watchlistTable: ReactNode
    buySellPanel: ReactNode
    transactionHistory: ReactNode
}

const CryptoDashboardContainer = ({
    totalPortfolio,
    assetCards,
    watchlistTable,
    buySellPanel,
    transactionHistory,
}: CryptoDashboardContainerProps) => {
    return (
        <Container>
            <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex-1 min-w-0 space-y-4">
                    {totalPortfolio}
                    {assetCards}
                    {watchlistTable}
                </div>
                <div className="xl:w-[350px] 2xl:w-[430px] lg:flex-shrink-0 space-y-4">
                    {buySellPanel}
                    {transactionHistory}
                </div>
            </div>
        </Container>
    )
}

export default CryptoDashboardContainer
