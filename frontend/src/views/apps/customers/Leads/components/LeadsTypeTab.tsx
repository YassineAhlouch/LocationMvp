import OverflowTabs from '@/components/shared/OverflowTabs'
import { useLeadsListStore } from '../store/leadsListStore'
import { LuUsers, LuBookUser, LuUserCheck, LuUserX } from 'react-icons/lu'
import type { LeadStatus } from '../types'

const tabList = [
    {
        label: (
            <span className="flex items-center gap-2">
                <LuUsers className="text-lg" />
                <span>All Leads</span>
            </span>
        ),
        value: '',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuBookUser className="text-lg" />
                <span>Contacted</span>
            </span>
        ),
        value: 'Contacted',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuUserCheck className="text-lg" />
                <span>Qualified</span>
            </span>
        ),
        value: 'Qualified',
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <LuUserX className="text-lg" />
                <span>Unqualified</span>
            </span>
        ),
        value: 'Unqualified',
    },
]

const LeadsTypeTab = () => {
    const filterData = useLeadsListStore((state) => state.filterData)
    const setFilterData = useLeadsListStore((state) => state.setFilterData)
    const setSelectAllRows = useLeadsListStore(
        (state) => state.setSelectAllRows,
    )

    const handleChange = (value: string) => {
        setFilterData({ leadStatus: value as LeadStatus })
        setSelectAllRows([])
    }

    return (
        <OverflowTabs
            tabList={tabList}
            value={filterData.leadStatus}
            onChange={handleChange}
            tabListClass="px-4 dark:border-gray-800"
        />
    )
}

export default LeadsTypeTab
