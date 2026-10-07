import AccessControlContext from './components/AccessControlContext'
import AccessControlHeader from './components/AccessControlHeader'
import AccessControlTabs from './components/AccessControlTabs'
import AccessControlContent from './components/AccessControlContent'

const AccessControl = () => {
    return (
        <AccessControlContext>
            <AccessControlHeader />
            <AccessControlTabs />
            <AccessControlContent />
        </AccessControlContext>
    )
}

export default AccessControl
