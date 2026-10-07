import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import StatisticCard from '@/components/shared/StatisticCard'
import { LuEllipsisVertical } from 'react-icons/lu'
import { LiEye, LiEdit, LiCopy } from '@/icons'

const WithHeaderFooter = () => {
    return (
        <div className="w-full max-w-sm mx-auto">
            {/* <StatisticCard
                inset
                footer={
                    <div className="flex items-center justify-between px-2">
                        <span className="font-medium text-success">+12.5%</span>
                        <span>vs last period</span>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg text-xl border border-gray-200 dark:border-gray-700 heading-text">
                        <LiDollarCircle />
                    </div>
                    <div>
                        <h4>$1,862</h4>
                        <span>Total Revenue</span>
                    </div>
                </div>
            </StatisticCard> */}
            <div className="w-full max-w-sm mx-auto">
                <StatisticCard
                    inset
                    header={
                        <div className="flex items-center justify-between">
                            <span className="heading-text font-medium">
                                Sales
                            </span>
                            <Dropdown
                                placement="bottom-end"
                                renderTitle={
                                    <Button
                                        icon={<LuEllipsisVertical />}
                                        size="sm"
                                        variant="ghost"
                                    />
                                }
                            >
                                <Dropdown.Item eventKey="viewMore">
                                    <LiEye className="text-lg" />
                                    <span>View More</span>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="edit">
                                    <LiEdit className="text-lg" />
                                    <span>Edit</span>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="copy">
                                    <LiCopy className="text-lg" />
                                    <span>Copy</span>
                                </Dropdown.Item>
                            </Dropdown>
                        </div>
                    }
                >
                    <div>
                        <h4>$1,862</h4>
                        <div className="flex items-center gap-1">
                            <span>vs yesterday</span>
                            <span className="font-medium text-success">
                                +12.5%
                            </span>
                        </div>
                    </div>
                </StatisticCard>
            </div>
        </div>
    )
}

export default WithHeaderFooter
