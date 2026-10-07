import { useState } from 'react'
import Wizard from '@/components/shared/Wizard'
import Button from '@/components/ui/Button'

const Horizontal = () => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <div className="w-full">
            <Wizard current={currentStep} onChange={setCurrentStep}>
                <Wizard.Step title="Account">
                    <div className="p-4">
                        <h4 className="font-semibold mb-2">
                            Account Information
                        </h4>
                        <p className="text-gray-500">
                            Enter your account details here.
                        </p>
                    </div>
                </Wizard.Step>
                <Wizard.Step title="Profile">
                    <div className="p-4">
                        <h4 className="font-semibold mb-2">Profile Setup</h4>
                        <p className="text-gray-500">
                            Complete your profile information.
                        </p>
                    </div>
                </Wizard.Step>
                <Wizard.Step title="Review">
                    <div className="p-4">
                        <h4 className="font-semibold mb-2">Review & Submit</h4>
                        <p className="text-gray-500">
                            Review your information before submitting.
                        </p>
                    </div>
                </Wizard.Step>
            </Wizard>
            <div className="flex justify-between mt-4">
                <Button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                    Previous
                </Button>
                <Button
                    disabled={currentStep === 2}
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default Horizontal
