import { useState } from 'react'
import Container from '@/components/shared/Container'
import PayrollTopSection from './components/PayrollTopSection'
import PayrollTable from './components/PayrollTable'
import CSVUploadDialog from './components/CSVUploadDialog'
import PaySlipDialog from './components/PaySlipDialog'
import type { PayrollRecord } from './types'

const Payroll = () => {
    const [csvUploadOpen, setCsvUploadOpen] = useState(false)
    const [paySlipOpen, setPaySlipOpen] = useState(false)
    const [selectedRecord] = useState<PayrollRecord | null>(null)

    const handleAddPayroll = () => {
        setCsvUploadOpen(true)
    }

    return (
        <Container>
            <PayrollTopSection />
            <PayrollTable onAddPayroll={handleAddPayroll} />
            <CSVUploadDialog
                isOpen={csvUploadOpen}
                onClose={() => setCsvUploadOpen(false)}
            />
            <PaySlipDialog
                isOpen={paySlipOpen}
                onClose={() => setPaySlipOpen(false)}
                record={selectedRecord}
            />
        </Container>
    )
}

export default Payroll
