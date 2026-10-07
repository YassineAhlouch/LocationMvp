import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'

const Media = () => {
    const cardFooter = (
        <div className="flex items-center">
            <Avatar
                size={30}
                className="mr-2"
                shape="circle"
                src="/img/avatars/thumb-1.jpg"
            />
            <span>
                <h6 className="text-sm">Kristen Fisher</h6>
                <span className="text-xs">Sep 23, 2021</span>
            </span>
        </div>
    )

    const cardHeader = (
        <div className="rounded-tl-lg rounded-tr-lg overflow-hidden">
            <img src="/img/others/img-1.jpg" alt="card header" />
        </div>
    )

    return (
        <div className="max-w-xs">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                header={{
                    content: cardHeader,
                    bordered: false,
                    className: 'p-0',
                }}
                footer={{
                    content: cardFooter,
                    bordered: false,
                }}
            >
                <h4 className="font-bold mb-3">AI Powered Automation</h4>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry.
                </p>
            </Card>
        </div>
    )
}

export default Media
