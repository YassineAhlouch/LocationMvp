import DebouceInput from '@/components/shared/DebouceInput'
import { useLeadsListStore } from '../store/leadsListStore'
import { LuSearch } from 'react-icons/lu'
import LeadListFilter from './LeadListFilter'
import LeadListExport from './LeadListExport'
import cloneDeep from 'lodash/cloneDeep'

const LeadsListTableTools = () => {
    const pagingState = useLeadsListStore((state) => state.pagingState)
    const setPagingState = useLeadsListStore((state) => state.setPagingState)

    const handleInputChange = (val: string) => {
        const newTableState = cloneDeep(pagingState)
        newTableState.query = val
        newTableState.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setPagingState(newTableState)
        }

        if (typeof val === 'string' && val.length === 0) {
            setPagingState(newTableState)
        }
    }

    return (
        <div className="flex items-center justify-between gap-2 p-4">
            <div>
                <DebouceInput
                    placeholder="Search"
                    prefix={<LuSearch className="text-lg" />}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <LeadListExport />
                <LeadListFilter />
            </div>
        </div>
    )
}

export default LeadsListTableTools
