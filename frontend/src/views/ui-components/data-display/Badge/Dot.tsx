import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { TbUser } from 'react-icons/tb'

const Dot = () => {
    return (
        <div className="flex">
            <Badge className="mr-4">
                <Avatar icon={<TbUser />} />
            </Badge>
        </div>
    )
}

export default Dot
