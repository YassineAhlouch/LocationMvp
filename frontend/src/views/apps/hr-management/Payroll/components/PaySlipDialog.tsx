import { useState } from 'react'
import { Dialog, Button, Avatar } from '@/components/ui'
import { HiPrinter, HiDownload } from 'react-icons/hi'
import type { PayrollRecord } from '../types'

type PaySlipDialogProps = {
    isOpen: boolean
    onClose: () => void
    record: PayrollRecord | null
}

const PaySlipDialog = ({ isOpen, onClose, record }: PaySlipDialogProps) => {
    const [isPrinting, setIsPrinting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    if (!record) return null

    const handlePrint = async () => {
        setIsPrinting(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            // In a real app, this would trigger the print dialog
            window.print()
        } catch (error) {
            console.error('Print failed:', error)
        } finally {
            setIsPrinting(false)
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            // In a real app, this would download the PDF
        } catch (error) {
            console.error('Download failed:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const formatMonth = (monthString: string) => {
        const date = new Date(monthString + '-01')
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        })
    }

    const earnings = [
        { label: 'Basic Salary', amount: record.basicSalary },
        { label: 'Allowances', amount: record.allowances },
    ]

    const deductions = [
        {
            label: 'Tax Deductions',
            amount: Math.round(record.deductions * 0.6),
        },
        { label: 'Insurance', amount: Math.round(record.deductions * 0.3) },
        { label: 'Other', amount: Math.round(record.deductions * 0.1) },
    ]

    const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0)
    const totalDeductions = deductions.reduce(
        (sum, item) => sum + item.amount,
        0,
    )

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Pay Slip</h3>
                </div>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size="lg"
                            src={record.employee.avatar}
                            alt={record.employee.name}
                        >
                            {record.employee.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold heading-text">
                                {record.employee.name}
                            </h3>
                            <p className="text-sm">
                                {record.employee.department}
                            </p>
                            <p>Pay Period: {formatMonth(record.payPeriod)}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p>Employee ID</p>
                        <p className="font-medium">{record.employee.id}</p>
                        {record.processedAt && (
                            <>
                                <p className="text-sm text-gray-500 mt-2">
                                    Processed Date
                                </p>
                                <p className="font-medium">
                                    {formatDate(record.processedAt)}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Earnings and Deductions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Earnings */}
                    <div>
                        <h4 className="font-semibold mb-4 heading-text">
                            Earnings
                        </h4>
                        <div className="space-y-3">
                            {earnings.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between"
                                >
                                    <span className="text-sm">
                                        {item.label}
                                    </span>
                                    <span className="font-medium">
                                        ${item.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <div className="flex justify-between font-semibold">
                                <span>Total Earnings</span>
                                <span>${totalEarnings.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div>
                        <h4 className="font-semibold mb-4 heading-text">
                            Deductions
                        </h4>
                        <div className="space-y-3">
                            {deductions.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between"
                                >
                                    <span className="text-sm">
                                        {item.label}
                                    </span>
                                    <span className="font-medium">
                                        ${item.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <div className="flex justify-between font-semibold">
                                <span>Total Deductions</span>
                                <span>${totalDeductions.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Net Pay */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Net Pay</span>
                        <span className="text-2xl font-bold text-green-600">
                            ${record.netPay.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Button variant="subtle" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        variant="subtle"
                        icon={<HiPrinter />}
                        loading={isPrinting}
                        onClick={handlePrint}
                    >
                        Print
                    </Button>
                    <Button
                        variant="solid"
                        icon={<HiDownload />}
                        loading={isDownloading}
                        onClick={handleDownload}
                    >
                        Download PDF
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default PaySlipDialog
