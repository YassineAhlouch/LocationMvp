import Collapsible from '@/components/ui/Collapsible'
import Button from '@/components/ui/Button'
import { HiChevronRight } from 'react-icons/hi'

const CustomTrigger = () => {
    return (
        <div className="max-w-md mx-auto">
            <Collapsible>
                <Collapsible.Trigger>
                    {({ isOpen, toggle }) => (
                        <Button
                            variant="subtle"
                            className="w-full justify-between"
                            onClick={toggle}
                            iconAlignment="end"
                            icon={
                                <HiChevronRight
                                    className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                                />
                            }
                        >
                            <span>Custom Trigger Button</span>
                        </Button>
                    )}
                </Collapsible.Trigger>
                <Collapsible.Content className="pt-4">
                    <p>
                        Using the render props pattern, you have full control
                        over the trigger appearance and behavior. The function
                        receives <code>isOpen</code> and <code>toggle</code>{' '}
                        props.
                    </p>
                </Collapsible.Content>
            </Collapsible>
        </div>
    )
}

export default CustomTrigger
