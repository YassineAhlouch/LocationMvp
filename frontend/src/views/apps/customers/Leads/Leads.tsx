import LeadListHeader from './components/LeadListHeader'
import LeadsTypeTab from './components/LeadsTypeTab'
import LeadsListTableTools from './components/LeadsListTableTools'
import LeadListTable from './components/LeadListTable'
import LeadsSelected from './components/LeadsSelected'

const Leads = () => {
    return (
        <div>
            <LeadListHeader />
            <LeadsTypeTab />
            <LeadsListTableTools />
            <LeadListTable />
            <LeadsSelected />
        </div>
    )
}

export default Leads
