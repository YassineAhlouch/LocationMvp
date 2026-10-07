import { useState } from 'react'
import Collapsible from '@/components/ui/Collapsible'
import Button from '@/components/ui/Button'

const Controlled = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-4">
                <Button variant="solid" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? 'Close' : 'Open'} Collapsible
                </Button>
            </div>
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
                <Collapsible.Trigger>
                    Controlled Collapsible
                </Collapsible.Trigger>
                <Collapsible.Content className="px-4 pb-4">
                    <p>
                        This collapsible is controlled externally. You can use
                        the button above or click the trigger to toggle it. The
                        state is managed by the parent component.
                    </p>
                </Collapsible.Content>
            </Collapsible>
        </div>
    )
}

export default Controlled
