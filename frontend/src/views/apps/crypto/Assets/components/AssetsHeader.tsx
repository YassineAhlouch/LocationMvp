import Button from '@/components/ui/Button'
import { useAssetsStore } from '../store/assetsStore'
import { LiMoneyRecive, LiMoneySend } from '@/icons'

const AssetsHeader = () => {
    const openDepositModal = useAssetsStore((state) => state.openDepositModal)
    const openWithdrawModal = useAssetsStore((state) => state.openWithdrawModal)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h4>Crypto Asset Management</h4>
                    <p>
                        View, deposit, withdraw, and track your crypto balances
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-2">
                    <Button
                        icon={<LiMoneyRecive />}
                        onClick={() => openDepositModal()}
                        block
                    >
                        Deposit
                    </Button>
                    <Button
                        icon={<LiMoneySend />}
                        onClick={() => openWithdrawModal()}
                        block
                    >
                        Withdraw
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AssetsHeader
