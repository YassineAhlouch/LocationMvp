import Button from '@/components/ui/Button'
import useLeadList from '../hooks/useLeadsList'
import useResponsive from '@/utils/hooks/useResponsive'
import { LuDownload } from 'react-icons/lu'
import { CSVLink } from 'react-csv'

const LeadListExport = () => {
    const { larger } = useResponsive()
    const { leadsList } = useLeadList()

    return (
        <CSVLink filename="leads.csv" data={leadsList}>
            <Button icon={<LuDownload />}>{larger.lg && 'Export data'}</Button>
        </CSVLink>
    )
}

export default LeadListExport
