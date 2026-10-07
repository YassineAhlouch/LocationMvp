import Avatar from '@/components/ui/Avatar'
import { TbUser } from 'react-icons/tb'

const Color = () => {
    return (
        <div className="flex items-center">
            <Avatar className="mr-4 bg-blue-100 dark:bg-blue-500/20 border-blue-100 dark:border-blue-500/20 text-blue-600  dark:text-indigo-100">
                A
            </Avatar>
            <Avatar
                className="mr-4 bg-purple-500 border-purple-500 text-white"
                icon={<TbUser />}
            />
        </div>
    )
}

export default Color
