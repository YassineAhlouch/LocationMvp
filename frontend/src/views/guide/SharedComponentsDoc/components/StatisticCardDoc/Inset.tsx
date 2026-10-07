import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import StatisticCard from '@/components/shared/StatisticCard'
import { LuEllipsisVertical } from 'react-icons/lu'
import { LiEye, LiEdit, LiCopy } from '@/icons'

const Inset = () => {
    return (
        <div className="w-full max-w-sm mx-auto">
            <StatisticCard inset>
                <div className="flex items-center justify-between">
                    <div className="font-medium heading-text">Total Client</div>
                    <Dropdown
                        placement="bottom-end"
                        renderTitle={
                            <Button
                                icon={<LuEllipsisVertical />}
                                className="w-6 h-6 text-sm"
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
                <div className="mt-4">
                    <h4>1,862</h4>
                    <div className="flex items-center gap-1">
                        <span>vs yesterday</span>
                        <span className="font-medium text-success">+12.5%</span>
                    </div>
                </div>
            </StatisticCard>
        </div>
    )
}

export default Inset
