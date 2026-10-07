import Popover from '@/components/ui/Popover'

const Basic = () => {
    return (
        <div>
            <Popover title="Click me">
                <div className="flex flex-col gap-y-4">
                    <div>
                        <h6 className="mb-2">Cumulative Growth Analysis</h6>
                        <p>
                            This report tracks the overall, long-term expansion
                            of community engagement. A healthy community is
                            expected to exhibit a consistent upward trend.
                        </p>
                    </div>
                </div>
            </Popover>
        </div>
    )
}

export default Basic
