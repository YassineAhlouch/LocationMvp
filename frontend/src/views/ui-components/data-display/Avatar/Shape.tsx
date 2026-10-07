import Avatar from '@/components/ui/Avatar'
import { TbUser } from 'react-icons/tb'

const Shape = () => {
    return (
        <div className="flex">
            <Avatar shape="square" className="mr-4" icon={<TbUser />} />
            <Avatar className="mr-4" icon={<TbUser />} />
            <Avatar shape="circle" className="mr-4" icon={<TbUser />} />
        </div>
    )
}

export default Shape
