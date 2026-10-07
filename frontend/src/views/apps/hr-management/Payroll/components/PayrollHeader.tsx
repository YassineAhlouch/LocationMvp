import { useState } from 'react'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import Dialog from '@/components/ui/Dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import { usePayrollStore } from '../store/payrollStore'
import { generateMonthOptions, formatMonthLabel } from '../utils'
import sleep from '@/utils/sleep'
import formatCurrency from '@/utils/formatCurrency'
import { LiTick, LiMoneySend, LiChevronDown } from '@/icons'
import type { PayrollMetrics } from '../types'

interface PayrollHeaderProps {
    currentMetrics?: PayrollMetrics | null
    employeeCount?: number
}

const PayrollHeader = ({ currentMetrics }: PayrollHeaderProps) => {
    const { selectedMonth, setSelectedMonth } = usePayrollStore()
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [payrollResult, setPayrollResult] = useState<{
        processedCount: number
        totalAmount: number
        processId: string
    } | null>(null)

    const monthOptions = generateMonthOptions()

    const handleMonthChange = (monthValue: string) => {
        setSelectedMonth(monthValue)
    }

    const handleRunPayroll = () => {
        setShowConfirmDialog(true)
    }

    const confirmRunPayroll = async () => {
        setIsProcessing(true)
        await sleep(1000)
        setShowConfirmDialog(false)
        const result = {
            processedCount: 169,
            totalAmount: currentMetrics?.totalPaid || 0,
            processId: `PR-${dayjs().valueOf()}`,
        }

        setPayrollResult(result)
        setShowSuccessDialog(true)
        setIsProcessing(false)
    }

    const selectedOption = monthOptions.find(
        (option) => option.value === selectedMonth,
    )
    const defaultLabel =
        selectedOption?.label || monthOptions[0]?.label || 'Select month'

    return (
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h4>Payroll</h4>
                <p>Manage employee payroll and compensation</p>
            </div>
            <div className="flex items-center gap-2">
                <Dropdown
                    placement="bottom-end"
                    renderTitle={
                        <Button
                            icon={<LiChevronDown className="text-sm" />}
                            iconAlignment="end"
                            className="justify-between"
                        >
                            {defaultLabel}
                        </Button>
                    }
                >
                    <div className="max-h-[180px] overflow-y-auto">
                        {monthOptions.map((option) => (
                            <Dropdown.Item
                                key={option.value}
                                eventKey={option.value}
                                onClick={() => handleMonthChange(option.value)}
                                active={selectedMonth === option.value}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>{option.label}</span>
                                    {selectedMonth === option.value && (
                                        <LiTick className="text-lg" />
                                    )}
                                </div>
                            </Dropdown.Item>
                        ))}
                    </div>
                </Dropdown>
                <Button
                    variant="solid"
                    icon={<LiMoneySend />}
                    onClick={handleRunPayroll}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Run payroll'}
                </Button>
            </div>
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={confirmRunPayroll}
                onCancel={() => setShowConfirmDialog(false)}
                type="warning"
                title="Run Payroll Confirmation"
                confirmText="Run Payroll"
                cancelText="Cancel"
                confirmButtonProps={{ loading: isProcessing }}
            >
                <div className="space-y-3">
                    <p>
                        Are you sure you want to run payroll for{' '}
                        <span className="heading-text font-medium">
                            {formatMonthLabel(selectedMonth)}
                        </span>
                        ?
                    </p>
                    <ul className="text-sm space-y-1">
                        <li>• Employee salaries will be calculated</li>
                        <li>• Deductions and allowances will be applied</li>
                        <li>• Payment instructions will be sent to the bank</li>
                        <li>• Pay slips will be generated</li>
                    </ul>
                </div>
            </ConfirmDialog>
            <Dialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                width={420}
                closable={false}
            >
                <div>
                    <div className="mx-auto flex justify-center">
                        <EmptyState
                            variant="wave"
                            size={200}
                            illustration={
                                <div className="w-16 h-16 bg-success-subtle text-success rounded-full border-2 border-emerald-200 flex items-center justify-center mx-auto text-4xl">
                                    <LiTick />
                                </div>
                            }
                        ></EmptyState>
                    </div>
                    <div className="space-y-4 -mt-2">
                        <div className="text-center">
                            <h4 className="mb-1">Payroll has been processed</h4>
                        </div>

                        {payrollResult && (
                            <Card bodyClass="p-0">
                                <div className="border-b border-gray-200 dark:border-gray-700 py-4 px-2 flex items-center justify-between">
                                    <span className="font-medium ">
                                        Employees Processed:
                                    </span>
                                    <div className="font-medium heading-text">
                                        {payrollResult.processedCount}
                                    </div>
                                </div>
                                <div className="border-b border-gray-200 dark:border-gray-700 py-4 px-2 flex items-center justify-between">
                                    <span className="font-medium">
                                        Total Amount:
                                    </span>
                                    <div className="font-medium heading-text">
                                        {formatCurrency(
                                            payrollResult.totalAmount,
                                        )}
                                    </div>
                                </div>
                                <div className="py-4 px-2 flex items-center justify-between">
                                    <span className="font-medium">
                                        Process ID:
                                    </span>
                                    <div className="font-medium heading-text font-mono">
                                        {payrollResult.processId}
                                    </div>
                                </div>
                            </Card>
                        )}
                        <Button
                            variant="solid"
                            block
                            onClick={() => setShowSuccessDialog(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default PayrollHeader
