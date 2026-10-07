import Checkbox from '@/components/ui/Checkbox'
import Divider from '@/components/shared/Divider'
import useProjectDetailsData from '../hooks/useProjectDetailsData'
import classNames from '@/utils/classNames'
import { LiCalendar } from '@/icons'
import dayjs from 'dayjs'
import type { Milestone } from '../types'

type DeliveryProps = {
    data: Milestone[]
}

const Delivery = ({ data }: DeliveryProps) => {
    const { setData } = useProjectDetailsData()

    const handleSubTaskCheck = (id: string, checked: boolean) => {
        setData((prev) => ({
            ...prev,
            milestones: prev.milestones.map((milestone) => {
                if (milestone.id === id) {
                    return {
                        ...milestone,
                        checked,
                    }
                }

                return milestone
            }),
        }))
    }

    return (
        <div>
            {data.map((subtask, index) => (
                <div key={subtask.id}>
                    <div
                        className="py-2 px-2 flex items-center justify-between cursor-pointer"
                        tabIndex={0}
                        role="button"
                        onClick={() =>
                            handleSubTaskCheck(subtask.id, !subtask.checked)
                        }
                    >
                        <div className="flex gap-2">
                            <div className="mt-0.5">
                                <Checkbox checked={subtask.checked} />
                            </div>
                            <div>
                                <div
                                    className={classNames(
                                        'font-medium',
                                        subtask.checked
                                            ? 'line-through'
                                            : 'heading-text',
                                    )}
                                >
                                    {subtask.title}
                                </div>
                                <p
                                    className={classNames(
                                        subtask.checked
                                            ? 'line-through opacity-50'
                                            : '',
                                    )}
                                >
                                    {subtask.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 min-w-[60px] heading-text">
                            <LiCalendar className="text-lg" />
                            <span className="text-xs">
                                {dayjs(subtask.dueDate).format('MMM DD')}
                            </span>
                        </div>
                    </div>
                    {index !== data.length - 1 && <Divider />}
                </div>
            ))}
        </div>
    )
}

export default Delivery
