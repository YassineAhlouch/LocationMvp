import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { TbUser } from 'react-icons/tb'

const Basic = () => {
    return (
        <div className="flex items-center">
            <Badge className="mr-4" content={9}>
                <Avatar icon={<TbUser />} />
            </Badge>
            <Badge className="mr-4" content={'New'}>
                <Avatar icon={<TbUser />} />
            </Badge>
        </div>
    )
}

export default Basic
