import { useKYCStore } from './store/kycStore'
import AccountTypeSelection from './components/AccountTypeSelection'
import KYCWizard from './components/KYCWizard'
import SuccessView from './components/SuccessView'

const KYC = () => {
    const { isWizardActive, submissionStatus } = useKYCStore()

    if (submissionStatus === 'success') {
        return <SuccessView />
    }

    if (isWizardActive) {
        return <KYCWizard />
    }

    return <AccountTypeSelection />
}

export default KYC
