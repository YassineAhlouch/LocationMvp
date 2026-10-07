import { useState } from 'react'
import Wizard from '@/components/shared/Wizard'
import { LuUser, LuCreditCard, LuCheck } from 'react-icons/lu'

const WithCustomIcons = () => {
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <div className="w-full">
            <Wizard current={currentStep} onChange={setCurrentStep}>
                <Wizard.Step
                    title="Account"
                    customIcon={<LuUser className="text-sm" />}
                >
                    <div className="p-4">
                        <p className="text-gray-500">Account step content</p>
                    </div>
                </Wizard.Step>
                <Wizard.Step
                    title="Payment"
                    customIcon={<LuCreditCard className="text-sm" />}
                >
                    <div className="p-4">
                        <p className="text-gray-500">Payment step content</p>
                    </div>
                </Wizard.Step>
                <Wizard.Step
                    title="Complete"
                    customIcon={<LuCheck className="text-sm" />}
                    disabled
                >
                    <div className="p-4">
                        <p className="text-gray-500">Complete step content</p>
                    </div>
                </Wizard.Step>
            </Wizard>
        </div>
    )
}

export default WithCustomIcons
