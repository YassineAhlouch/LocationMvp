import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { TbUser } from 'react-icons/tb'

const CountOverflow = () => {
    return (
        <div className="flex">
            <Badge className="mr-5" content={10} maxCount={9}>
                <Avatar icon={<TbUser />} />
            </Badge>
            <Badge className="mr-4" content={100}>
                <Avatar icon={<TbUser />} />
            </Badge>
        </div>
    )
}

export default CountOverflow
