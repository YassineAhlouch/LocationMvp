import { useMemo } from 'react'
import Dropdown from '@/components/ui/Dropdown'
import Button from '@/components/ui/Button'
import { statusMap } from '../utils'
import { LuEllipsis } from 'react-icons/lu'
type ActionDropdownListProps = {
    status: string
    onChange: (status: string) => void
    onDelete: () => void
}

const ActionDropdownList = ({
    status,
    onChange,
    onDelete,
}: ActionDropdownListProps) => {
    const list = useMemo(() => {
        return Object.entries(statusMap)
            .filter(([key]) => key !== status)
            .map(([key, obj]) => ({ label: obj.label, value: key }))
    }, [status])

    return (
        <Dropdown
            placement="bottom-end"
            renderTitle={
                <Button
                    icon={<LuEllipsis className="text-base" />}
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6"
                />
            }
        >
            <Dropdown.Item variant="header">
                <div className="px-2 py-1.5 text-sm font-semibold heading-text">
                    Change status to
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {list.map(({ label, value }) => (
                <Dropdown.Item
                    key={value}
                    eventKey={value}
                    onClick={() => onChange(value)}
                >
                    <div className="text-sm">{label}</div>
                </Dropdown.Item>
            ))}
            <Dropdown.Item eventKey="delete" onClick={onDelete}>
                <div className="text-error">Delete</div>
            </Dropdown.Item>
        </Dropdown>
    )
}

export default ActionDropdownList
