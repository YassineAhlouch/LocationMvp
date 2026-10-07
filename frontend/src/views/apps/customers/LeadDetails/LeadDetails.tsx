import LeadProfile from './components/LeadProfile'
import LeadTabs from './components/LeadTabs'
import useLeadDetails from './hooks/useLeadDetails'

const LeadDetails = () => {
    const { data, isLoading, leadId, param } = useLeadDetails()

    return (
        <div className="max-w-[1200px] w-full mx-auto">
            <LeadProfile data={data} isLoading={isLoading} />
            <div className="mt-4">
                <LeadTabs
                    data={data}
                    isLoading={isLoading}
                    leadId={leadId as string}
                    path={param['*'] || ''}
                />
            </div>
        </div>
    )
}

export default LeadDetails
