import Popover from '@/components/ui/Popover'
import { TbCalendar, TbMap, TbBell, TbMenu } from 'react-icons/tb'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'

const Width = () => {
    return (
        <Popover title="Click me" width={400} placement="bottom-start">
            <div className="flex flex-col gap-y-4">
                <div>
                    <h5 className="mb-4">Daily standup call</h5>
                    <div className="flex itams-center gap-2 font-medium">
                        <TbCalendar className="text-lg heading-text" />
                        <span>Today - 10:00 AM ~ 10.15 AM </span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-3 flex-1">
                        <div>
                            <TbMap className="text-lg heading-text" />
                        </div>
                        <p>Meeting room 1</p>
                    </div>
                    <div className="flex gap-3 flex-1">
                        <div>
                            <TbBell className="text-lg heading-text" />
                        </div>
                        <p>20 more minutes left</p>
                    </div>
                    <div className="flex gap-3 flex-1">
                        <div>
                            <TbMenu className="text-lg heading-text" />
                        </div>
                        <p>
                            A Daily Standup is a short, time-boxed meeting
                            (typically 10-15 minutes) where team members
                            synchronize their work and share updates. It is
                            commonly used in Agile and Scrum methodologies to
                            promote transparency and collaboration.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <Avatar.Group
                        chained
                        omittedAvatarTooltip
                        maxCount={3}
                        omittedAvatarProps={{ shape: 'circle', size: 'sm' }}
                        onOmittedAvatarClick={() =>
                            console.log('Omitted Avatar Clicked')
                        }
                    >
                        <Avatar
                            shape="circle"
                            size="sm"
                            src="/img/avatars/thumb-1.jpg"
                        />
                        <Avatar
                            shape="circle"
                            size="sm"
                            src="/img/avatars/thumb-2.jpg"
                        />
                        <Avatar
                            shape="circle"
                            size="sm"
                            src="/img/avatars/thumb-3.jpg"
                        />
                        <Avatar
                            shape="circle"
                            size="sm"
                            src="/img/avatars/thumb-4.jpg"
                        />
                        <Avatar
                            shape="circle"
                            size="sm"
                            src="/img/avatars/thumb-5.jpg"
                        />
                    </Avatar.Group>
                    <Button>Join Meeting</Button>
                </div>
            </div>
        </Popover>
    )
}

export default Width
