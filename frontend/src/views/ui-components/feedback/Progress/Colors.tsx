import Progress from '@/components/ui/Progress'

const Colors = () => {
    return (
        <div>
            <Progress strokeClass="bg-red-500" percent={20} className="mb-4" />
            <Progress
                strokeClass="bg-green-500"
                percent={30}
                className="mb-4"
            />
        </div>
    )
}

export default Colors
