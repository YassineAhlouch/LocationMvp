import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import Wizard from '@/components/shared/Wizard'
import PersonalInformation from './PersonalInformation'
import Identification from './Identification'
import AddressInformation from './AddressInformation'
import FinancialInformation from './FinancialInformation'
import CompanyInformation from './CompanyInformation'
import AuthorizedRepresentative from './AuthorizedRepresentative'
import BusinessAddressComponent from './BusinessAddress'
import FinancialCompliance from './FinancialCompliance'
import { useKYCStore } from '../store/kycStore'
import { INDIVIDUAL_KYC_STEPS, BUSINESS_KYC_STEPS } from '../utils/constants'
import { LiChevronLeft } from '@/icons'

const KYCWizard = () => {
    const {
        accountType,
        currentStep,
        submissionStatus,
        setCurrentStep,
        setWizardActive,
        canAccessStep,
        isStepComplete,
        submitKYC,
    } = useKYCStore()

    if (!accountType) return null

    const steps =
        accountType === 'individual' ? INDIVIDUAL_KYC_STEPS : BUSINESS_KYC_STEPS
    const totalSteps = steps.length

    const handleStepChange = (stepIndex: number) => {
        if (canAccessStep(stepIndex)) {
            setCurrentStep(stepIndex)
        }
    }

    const handleNext = () => {
        if (currentStep < totalSteps - 1 && canAccessStep(currentStep + 1)) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleBackToSelection = () => {
        setWizardActive(false)
        setCurrentStep(0)
    }

    const handleSubmit = async () => {
        if (isAllStepsComplete()) {
            await submitKYC()
        }
    }

    const isAllStepsComplete = () => {
        for (let i = 0; i < totalSteps; i++) {
            if (!isStepComplete(i)) {
                return false
            }
        }
        return true
    }

    const renderStepContent = () => {
        if (accountType === 'individual') {
            switch (currentStep) {
                case 0:
                    return <PersonalInformation />
                case 1:
                    return <Identification />
                case 2:
                    return <AddressInformation />
                case 3:
                    return <FinancialInformation />
                default:
                    return null
            }
        } else if (accountType === 'business') {
            switch (currentStep) {
                case 0:
                    return <CompanyInformation />
                case 1:
                    return <AuthorizedRepresentative />
                case 2:
                    return <BusinessAddressComponent />
                case 3:
                    return <FinancialCompliance />
                default:
                    return null
            }
        }
        return null
    }
    return (
        <Container size="sm">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleBackToSelection}
                        icon={<LiChevronLeft />}
                        variant="subtle"
                        size="sm"
                    ></Button>
                    <div>
                        <h5>
                            {accountType === 'individual'
                                ? 'Individual'
                                : 'Business'}{' '}
                            KYC Verification
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                            Complete all steps to verify your {accountType}{' '}
                            account
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <Wizard
                    vertical
                    current={currentStep}
                    onChange={handleStepChange}
                >
                    {steps.map((step, index) => (
                        <Wizard.Step
                            key={step.key}
                            title={step.title}
                            disabled={!canAccessStep(index)}
                        >
                            {renderStepContent()}
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    {currentStep > 0 && (
                                        <Button
                                            variant="default"
                                            onClick={handlePrevious}
                                            icon={
                                                <LiChevronLeft className="text-xs" />
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {currentStep < totalSteps - 1 ? (
                                        <Button
                                            variant="solid"
                                            onClick={handleNext}
                                            disabled={
                                                !isStepComplete(currentStep)
                                            }
                                        >
                                            Next Step
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="solid"
                                            onClick={handleSubmit}
                                            disabled={!isAllStepsComplete()}
                                            loading={
                                                submissionStatus ===
                                                'submitting'
                                            }
                                        >
                                            {submissionStatus === 'submitting'
                                                ? 'Submitting...'
                                                : 'Submit'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Wizard.Step>
                    ))}
                </Wizard>
            </div>
        </Container>
    )
}

export default KYCWizard
