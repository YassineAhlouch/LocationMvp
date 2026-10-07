import ReportsContext from './components/ReportsContext'
import ReportHeader from './components/ReportHeader'
import ReportActionTools from './components/ReportActionTools'
import ReportTables from './components/ReportTables'

const Reports = () => {
    return (
        <ReportsContext>
            <div className="pb-4">
                <ReportHeader />
                <ReportActionTools />
                <ReportTables />
            </div>
        </ReportsContext>
    )
}

export default Reports
