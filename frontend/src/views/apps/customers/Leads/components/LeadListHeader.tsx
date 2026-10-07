import LeadImportDialog from './LeadImportDialog'
import AddLeadDialog from './AddLeadDialog'

const LeadListHeader = () => {
    return (
        <div className="px-4 py-2">
            <div className="flex items-center justify-between gap-2">
                <h4>Leads</h4>
                <div className="flex items-center gap-2">
                    <LeadImportDialog />
                    <AddLeadDialog />
                </div>
            </div>
        </div>
    )
}

export default LeadListHeader
