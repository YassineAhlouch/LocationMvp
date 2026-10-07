import Popover from '@/components/ui/Popover'

const Placement = () => {
    const content = (
        <div className="flex flex-col gap-y-4">
            <div>
                <h6 className="mb-2">Cumulative Growth Analysis</h6>
                <p>
                    This report tracks the overall, long-term expansion of
                    community engagement. A healthy community is expected to
                    exhibit a consistent upward trend.
                </p>
            </div>
        </div>
    )

    return (
        <div
            style={{ maxWidth: 700 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
            <div></div>
            <Popover title="Top start" placement="top-start">
                {content}
            </Popover>
            <Popover title="Top" placement="top">
                {content}
            </Popover>
            <Popover title="Top end" placement="top-end">
                {content}
            </Popover>
            <div></div>
            <Popover title="Left start" placement="left-start">
                {content}
            </Popover>
            <div></div>
            <div></div>
            <div></div>
            <Popover title="Right start" placement="right-start">
                {content}
            </Popover>
            <Popover title="Left" placement="left">
                {content}
            </Popover>
            <div></div>
            <div></div>
            <div></div>
            <Popover title="Right" placement="right">
                {content}
            </Popover>
            <Popover title="Left end" placement="left-end">
                {content}
            </Popover>
            <div></div>
            <div></div>
            <div></div>
            <Popover title="Right end" placement="right-end">
                {content}
            </Popover>
            <div></div>
            <Popover title="Bottom start" placement="bottom-start">
                {content}
            </Popover>
            <Popover title="Bottom" placement="bottom">
                {content}
            </Popover>
            <Popover title="Bottom end" placement="bottom-end">
                {content}
            </Popover>
            <div></div>
        </div>
    )
}

export default Placement
