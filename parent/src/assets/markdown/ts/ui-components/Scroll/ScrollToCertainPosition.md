```jsx
import { useRef } from 'react';
import Scroll from '@/components/ui/Scroll'
import Button from '@/components/ui/Button'

const ScrollToCertainPosition = () => {

    const viewportRef = useRef<HTMLDivElement>(null);

    const handleScrollBottom = () => {
        viewportRef.current!.scrollTo({ top: viewportRef.current!.scrollHeight, behavior: 'smooth' });
    }

    const handleScrollMiddle = () => {
        viewportRef.current!.scrollTo({ top: viewportRef.current!.scrollHeight / 2, behavior: 'smooth' });
    }


    const handleScrollTop = () => {
        viewportRef.current!.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <>
            <Scroll className="h-[280px]" viewportRef={viewportRef}>
                <div className="flex flex-col gap-4">
                    <h5>Getting Started with Your Workspace</h5>
                    <p>
                        Welcome to your new digital workspace — a place where organization meets efficiency. This environment is designed to streamline your daily tasks, improve collaboration, and keep everything you need right at your fingertips.
                    </p>
                    <p>
                        Start by exploring the main dashboard, where you'll find an overview of your recent activity, upcoming deadlines, and quick access to important tools. The intuitive layout ensures you spend less time searching and more time getting things done.
                    </p>
                    <p>
                        Create new tasks with just a few clicks. Add descriptions, due dates, and assign them to your team members. Tasks can be grouped into categories or projects, making it easy to manage both small and large workloads. Comments and file attachments are supported too, so context is never lost.
                    </p>
                    <p>
                        Need to focus? Use the built-in timer to track how long you spend on each task. Or switch to focus mode to minimize distractions and enter a clean workspace view. Every productivity tool here is built to help you stay in flow.
                    </p>
                    <p>
                        Notifications keep you updated on project changes, mentions, and upcoming deadlines. They're smart enough not to overwhelm you — just what you need, when you need it.
                    </p>
                    <p>
                        Customization is key. Choose from multiple layout views, toggle between dark and light themes, and rearrange components to match your workflow. Your workspace should feel like yours.
                    </p>
                    <p>
                        Need help? The support panel is just a click away, offering tips, guides, and answers to frequently asked questions.
                    </p>
                    <p>
                        Now that you're here, go ahead and start exploring. Whether you're planning your week, coordinating with teammates, or just organizing your thoughts — this workspace has you covered.
                    </p>
                    <p>
                        Welcome to your new digital workspace — a place where organization meets efficiency. This environment is designed to streamline your daily tasks, improve collaboration, and keep everything you need right at your fingertips.
                    </p>
                    <p>
                        Start by exploring the main dashboard, where you'll find an overview of your recent activity, upcoming deadlines, and quick access to important tools. The intuitive layout ensures you spend less time searching and more time getting things done.
                    </p>
                    <p>
                        Create new tasks with just a few clicks. Add descriptions, due dates, and assign them to your team members. Tasks can be grouped into categories or projects, making it easy to manage both small and large workloads. Comments and file attachments are supported too, so context is never lost.
                    </p>
                    <p>
                        Need to focus? Use the built-in timer to track how long you spend on each task. Or switch to focus mode to minimize distractions and enter a clean workspace view. Every productivity tool here is built to help you stay in flow.
                    </p>
                    <p>
                        Notifications keep you updated on project changes, mentions, and upcoming deadlines. They're smart enough not to overwhelm you — just what you need, when you need it.
                    </p>
                    <p>
                        Customization is key. Choose from multiple layout views, toggle between dark and light themes, and rearrange components to match your workflow. Your workspace should feel like yours.
                    </p>
                    <p>
                        Need help? The support panel is just a click away, offering tips, guides, and answers to frequently asked questions.
                    </p>
                    <p>
                        Now that you're here, go ahead and start exploring. Whether you're planning your week, coordinating with teammates, or just organizing your thoughts — this workspace has you covered.
                    </p>
                </div>
            </Scroll>
            <div className="inline-flex gap-2 mt-4">
                <Button onClick={handleScrollBottom}>Scroll to bottom</Button>
                <Button onClick={handleScrollMiddle}>Scroll to middle</Button>
                <Button onClick={handleScrollTop}>Scroll to top</Button>
            </div>
        </>
    )
}

export default ScrollToCertainPosition
```
