import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { TbUser } from 'react-icons/tb'

const Status = () => {
    return (
        <div className="flex items-center">
            <Badge
                className="mr-4 rounded-full"
                badgeStyle={{ top: '7px', right: '5px' }}
            >
                <Avatar icon={<TbUser />} />
            </Badge>
            <Badge className="mr-4">
                <Avatar shape="round" icon={<TbUser />} />
            </Badge>
            <Badge className="mr-4" innerClass="bg-emerald-500">
                <Avatar shape="round" icon={<TbUser />} />
            </Badge>
            <Badge className="mr-4" content={99}>
                <Avatar icon={<TbUser />} />
            </Badge>
        </div>
    )
}

export default Status
