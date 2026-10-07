import { useState } from 'react'
import Wizard from '@/components/shared/Wizard'
import Button from '@/components/ui/Button'

const Vertical = () => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <div className="w-full max-w-md">
            <Wizard current={currentStep} onChange={setCurrentStep} vertical>
                <Wizard.Step title="Personal Info">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="mb-4">Enter your personal information.</p>
                        <Button onClick={() => setCurrentStep(1)}>
                            Continue
                        </Button>
                    </div>
                </Wizard.Step>
                <Wizard.Step title="Address">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="mb-4">Enter your address details.</p>
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                onClick={() => setCurrentStep(0)}
                            >
                                Back
                            </Button>
                            <Button onClick={() => setCurrentStep(2)}>
                                Continue
                            </Button>
                        </div>
                    </div>
                </Wizard.Step>
                <Wizard.Step title="Confirmation">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="mb-4">Confirm your details.</p>
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                onClick={() => setCurrentStep(1)}
                            >
                                Back
                            </Button>
                            <Button variant="solid">Submit</Button>
                        </div>
                    </div>
                </Wizard.Step>
            </Wizard>
        </div>
    )
}

export default Vertical
