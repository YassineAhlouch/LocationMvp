import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/shared/EmptyState'
import { LuCheck } from 'react-icons/lu'
import { useKYCStore } from '../store/kycStore'

const SuccessView = () => {
    const { accountType, backToOverview } = useKYCStore()

    const handleBackToOverview = () => {
        backToOverview()
    }

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="max-w-md mx-auto">
                <div className="mb-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex justify-center">
                                <EmptyState
                                    variant="dots"
                                    size={200}
                                    illustration={
                                        <div className="w-16 h-16 bg-success-subtle text-success rounded-full border-2 border-emerald-200 flex items-center justify-center mx-auto text-4xl">
                                            <LuCheck />
                                        </div>
                                    }
                                />
                            </div>
                            <div className="text-center">
                                <h4 className="mb-2">
                                    KYC Submission Successful!
                                </h4>

                                <p className="mb-8">
                                    Your KYC submission has been received and is
                                    now under review. We'll notify you via email
                                    once the verification process is complete.
                                </p>
                            </div>
                            <Card className="mb-4">
                                <h6 className=" mb-2">What happens next?</h6>
                                <ul className="heading-text space-y-1">
                                    <li>
                                        • Our compliance team will review your
                                        documents
                                    </li>
                                    <li>
                                        •{' '}
                                        {accountType === 'individual'
                                            ? 'Individual accounts are typically processed within 24-48 hours'
                                            : 'Business accounts are typically processed within 2-5 business days'}
                                    </li>
                                    <li>
                                        • You'll receive an email notification
                                        with the verification result
                                    </li>
                                    <li>
                                        • If additional information is needed,
                                        we'll contact you directly
                                    </li>
                                </ul>
                            </Card>
                            <Button
                                variant="solid"
                                block
                                onClick={handleBackToOverview}
                            >
                                Back to Overview
                            </Button>
                            <p className="text-xs text-center mt-4">
                                Need help? Contact our support team at
                                eyris@support.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuccessView
