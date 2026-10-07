import Avatar from '@/components/ui/Avatar'
import { TbUser } from 'react-icons/tb'

const Size = () => {
    return (
        <div className="flex items-center">
            <Avatar size="sm" className="mr-4" icon={<TbUser />} />
            <Avatar className="mr-4" icon={<TbUser />} />
            <Avatar size="lg" className="mr-4" icon={<TbUser />} />
            <Avatar size={60} className="mr-4" icon={<TbUser />} />
        </div>
    )
}

export default Size
