import DebouceInput from '@/components/shared/DebouceInput'
import { useHelpdeskStore } from '../store/helpdeskStore'
import { LuSearch } from 'react-icons/lu'

const TicketListQueryInput = () => {
    const setFilterData = useHelpdeskStore((state) => state.setFilterData)

    const handleSearch = (value: string) => {
        setFilterData({ query: value })
    }

    return (
        <DebouceInput
            size="sm"
            prefix={<LuSearch />}
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
        />
    )
}

export default TicketListQueryInput
