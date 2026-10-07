import { useState } from 'react'
import Collapsible from '@/components/ui/Collapsible'

const Accordion = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const items = [
        {
            title: 'What is Collapsible?',
            content:
                'Collapsible is a component that allows you to show and hide content with smooth animations. It is useful for FAQs, accordions, and expandable sections.',
        },
        {
            title: 'How does it work?',
            content:
                'The component uses Framer Motion for smooth height animations. It supports both controlled and uncontrolled modes, and provides a flexible trigger system.',
        },
        {
            title: 'Can I customize the trigger?',
            content:
                'Yes! You can use the render props pattern to create fully custom triggers. The function receives isOpen and toggle props for complete control.',
        },
    ]

    const handleOpenChange = (index: number) => (open: boolean) => {
        setOpenIndex(open ? index : null)
    }

    return (
        <div className="max-w-md space-y-2 mx-auto">
            {items.map((item, index) => (
                <Collapsible
                    key={index}
                    open={openIndex === index}
                    onOpenChange={handleOpenChange(index)}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                    <Collapsible.Trigger>{item.title}</Collapsible.Trigger>
                    <Collapsible.Content className="px-4 pb-4">
                        <p>{item.content}</p>
                    </Collapsible.Content>
                </Collapsible>
            ))}
        </div>
    )
}

export default Accordion
