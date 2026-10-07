import Collapsible from '@/components/ui/Collapsible'

const Basic = () => {
    return (
        <div className="max-w-md mx-auto">
            <Collapsible className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <Collapsible.Trigger>Click to expand</Collapsible.Trigger>
                <Collapsible.Content className="px-4 pb-4">
                    <p>
                        This is the collapsible content. It can contain any
                        elements you want to show or hide. The animation is
                        smooth and the content height is automatically
                        calculated.
                    </p>
                </Collapsible.Content>
            </Collapsible>
        </div>
    )
}

export default Basic
